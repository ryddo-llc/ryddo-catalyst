'use client';

import { useSearchParams } from 'next/navigation';

import { Modal } from '~/components/modal';
import { NewWishlistModal } from '~/components/wishlist/modals/new';
import { usePathname, useRouter } from '~/i18n/routing';

import { addToNewWishlist } from '../../_actions/wishlist-action';

interface Props {
  title: string;
  cancelLabel: string;
  createLabel: string;
  nameLabel: string;
  requiredError: string;
  modalVisible: boolean;
  productId: number;
  selectedSku: string;
}

export const AddToNewWishlistModal = ({
  title,
  cancelLabel,
  createLabel,
  nameLabel,
  requiredError,
  modalVisible,
  productId,
  selectedSku,
}: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete('action');

    router.push(params.size === 0 ? pathname : `${pathname}?${params.toString()}`);
  };

  // Enhanced validation check
  const hasValidProductId = productId > 0;
  const hasValidSku = selectedSku && selectedSku.trim() !== '';
  const isValidData = hasValidProductId && hasValidSku;
  

  // Determine the specific error message
  const getErrorMessage = () => {
    if (!hasValidProductId) {
      return 'Invalid product selected. Please refresh the page and try again.';
    }
    if (!hasValidSku) {
      return 'Product variant not selected. Please select all product options before adding to wishlist.';
    }
    return 'Invalid product data. Please refresh the page and try again.';
  };

  return (
    <Modal
      buttons={[
        {
          label: cancelLabel,
          type: 'cancel',
        },
        {
          label: createLabel,
          type: 'submit',
        },
      ]}
      className="min-w-64 @lg:min-w-96"
      form={{ action: addToNewWishlist, onSuccess: closeModal }}
      isOpen={modalVisible}
      setOpen={(open) => {
        if (!open) {
          closeModal();
        }
      }}
      title={title}
    >
      <input name="productId" type="hidden" value={productId} />
      <input name="selectedSku" type="hidden" value={selectedSku} />
      <input
        name="redirectTo"
        type="hidden"
        value={searchParams.size === 0 ? pathname : `${pathname}?${searchParams.toString()}`}
      />
      
      {!isValidData && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          <strong>Error:</strong> {getErrorMessage()}
          {!hasValidSku && (
            <div className="mt-2 text-xs text-red-500">
              Tip: Make sure you have selected all product options (size, color, etc.) before adding to wishlist.
            </div>
          )}
        </div>
      )}
      
      <NewWishlistModal nameLabel={nameLabel} requiredError={requiredError} />
    </Modal>
  );
};
