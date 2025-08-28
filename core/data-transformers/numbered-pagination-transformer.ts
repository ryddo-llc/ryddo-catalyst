import { ResultOf } from 'gql.tada';

import { NumberedPaginationInfo } from '@/vibes/soul/primitives/numbered-pagination';
import { PaginationFragment } from '~/client/fragments/pagination';

export interface NumberedPaginationOptions {
  startCursorParamName?: string;
  endCursorParamName?: string;
  totalItems: number;
  itemsPerPage: number;
  currentPage?: number;
  pageParamName?: string;
}

export function numberedPaginationTransformer(
  pageInfo: ResultOf<typeof PaginationFragment>,
  options: NumberedPaginationOptions,
): NumberedPaginationInfo {
  const {
    startCursorParamName = 'before',
    endCursorParamName = 'after',
    totalItems,
    itemsPerPage,
    currentPage = 1,
    pageParamName = 'page',
  } = options;

  const safeItemsPerPage = Math.max(1, itemsPerPage || 0);
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / safeItemsPerPage);

  return {
    startCursorParamName,
    startCursor: pageInfo.hasPreviousPage ? pageInfo.startCursor : null,
    endCursorParamName,
    endCursor: pageInfo.hasNextPage ? pageInfo.endCursor : null,
    totalItems,
    itemsPerPage,
    currentPage,
    totalPages,
    pageParamName,
  };
}
