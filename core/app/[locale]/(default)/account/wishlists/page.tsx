import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { SearchParams } from 'nuqs';
import { createSearchParamsCache, parseAsInteger, parseAsString } from 'nuqs/server';

import { Streamable } from '@/vibes/soul/lib/streamable';
import { CursorPaginationInfo } from '@/vibes/soul/primitives/cursor-pagination';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { Wishlist } from '@/vibes/soul/sections/wishlist-details';
import { WishlistsSection } from '@/vibes/soul/sections/wishlists-section';
import { ExistingResultType } from '~/client/util';
import { defaultPageInfo, pageInfoTransformer } from '~/data-transformers/page-info-transformer';
import { wishlistsTransformer } from '~/data-transformers/wishlists-transformer';
import { isMobileUser } from '~/lib/user-agent';

import { NewWishlistButton } from './_components/new-wishlist-button';
import { WishlistActionsMenu } from './_components/wishlist-actions-menu';
import {
  getChangeWishlistVisibilityModal,
  getDeleteWishlistModal,
  getNewWishlistModal,
  getRenameWishlistModal,
} from './modals';
import { getCustomerWishlists } from './page-data';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}

const defaultWishlistsLimit = 10;
const searchParamsCache = createSearchParamsCache({
  tag: parseAsString,
  before: parseAsString,
  after: parseAsString,
  limit: parseAsInteger.withDefault(defaultWishlistsLimit),
});

async function listWishlists(
  searchParamsPromise: Promise<SearchParams>,
  t: ExistingResultType<typeof getTranslations<'Wishlist'>>,
): Promise<Wishlist[]> {
  const searchParamsParsed = searchParamsCache.parse(await searchParamsPromise);
  const formatter = await getFormatter();
  const wishlists = await getCustomerWishlists(searchParamsParsed);

  if (!wishlists) {
    return [];
  }

  return wishlistsTransformer(wishlists, t, formatter);
}

async function getPaginationInfo(
  searchParamsPromise: Promise<SearchParams>,
): Promise<CursorPaginationInfo> {
  const searchParamsParsed = searchParamsCache.parse(await searchParamsPromise);
  const wishlists = await getCustomerWishlists(searchParamsParsed);

  return pageInfoTransformer(wishlists?.pageInfo ?? defaultPageInfo);
}

export default async function Wishlists({ params, searchParams }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('Wishlist');
  const isMobile = await isMobileUser();
  const newWishlistModal = getNewWishlistModal(t);

  return (
    <WishlistsSection
      actions={<NewWishlistButton label={t('new')} modal={newWishlistModal} variant="tertiary" />}
      emptyStateCallToAction={
        <NewWishlistButton label={t('noWishlistsCallToAction')} modal={newWishlistModal} />
      }
      emptyStateTitle={t('noWishlists')}
      emptyWishlistStateText={t('emptyWishlist')}
      itemActions={{
        component: (wishlist) => {
          if (!wishlist) {
            return <Skeleton.Box className="h-10 w-10 rounded-full" />;
          }

          return (
            <WishlistActionsMenu
              actionsTitle={t('actionsTitle')}
              items={[
                {
                  label: t('rename'),
                  modal: getRenameWishlistModal(wishlist, t),
                },
                {
                  label: wishlist.visibility.isPublic ? t('makePrivate') : t('makePublic'),
                  modal: getChangeWishlistVisibilityModal(wishlist, t),
                },
                {
                  label: t('delete'),
                  variant: 'danger',
                  modal: getDeleteWishlistModal(wishlist, t),
                },
              ]}
              share={
                wishlist.publicUrl
                  ? {
                      wishlistName: wishlist.name,
                      modalTitle: t('Modal.shareTitle', { name: wishlist.name }),
                      publicUrl: wishlist.publicUrl,
                      closeLabel: t('Modal.close'),
                      copyLabel: t('Modal.copy'),
                      copiedMessage: t('shareCopied'),
                      disabledTooltip: t('shareDisabled'),
                      label: t('share'),
                      successMessage: t('shareSuccess'),
                      isPublic: wishlist.visibility.isPublic,
                      isMobileUser: isMobile,
                    }
                  : undefined
              }
            />
          );
        },
      }}
      paginationInfo={Streamable.from(() => getPaginationInfo(searchParams))}
      title={t('title')}
      viewWishlistLabel={t('viewWishlist')}
      wishlists={Streamable.from(() => listWishlists(searchParams, t))}
    />
  );
}
