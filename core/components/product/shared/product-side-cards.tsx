import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Button } from '@/vibes/soul/primitives/button';
import { PriceLabel } from '@/vibes/soul/primitives/price-label';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';

interface ColorOption {
  entityId: number;
  label: string;
  hexColors?: string[];
  imageUrl?: string;
  isSelected?: boolean;
  isDefault?: boolean;
}

interface ProductPrice {
  type?: 'sale' | 'range';
  currentValue?: string;
  previousValue?: string;
}

interface ProductWithSideCardData {
  price?: Streamable<ProductPrice | string | null>;
  colors?: ColorOption[];
}

// Offers Card Component
export function OffersCard() {
  return (
    <aside
      aria-labelledby="offers-heading"
      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h3 className="mb-4 text-lg font-semibold text-gray-900" id="offers-heading">
        Special Offers
      </h3>
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
            <span className="text-sm font-bold text-red-600">%</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Adventure Full Suspension</p>
            <p className="text-xs text-gray-500">Premium riding experience</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
            <span className="text-sm font-bold text-blue-600">📱</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Super73 App</p>
            <p className="text-xs text-gray-500">Control your bike digitally</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

// Authorized Dealer Card Component
export function AuthorizedDealerCard({ product }: { product: ProductWithSideCardData }) {
  return (
    <aside
      aria-labelledby="dealer-heading"
      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h3 className="mb-4 text-lg font-semibold text-gray-900" id="dealer-heading">
        Authorized Dealer
      </h3>
      <div className="text-center">
        <Stream fallback={<Skeleton.Box className="mx-auto mb-4 h-8 w-24" />} value={product.price}>
          {(price) => (
            <div className="mb-4">
              <PriceLabel className="text-3xl font-bold" price={price ?? '$3,695'} />
            </div>
          )}
        </Stream>
        <Button className="mb-3 w-full" size="large" variant="primary">
          Buy Now
        </Button>

        {/* Dynamic Color Swatches from BigCommerce */}
        {product.colors && product.colors.length > 0 ? (
          <>
            <div
              aria-label="Available colors"
              className="mb-4 flex justify-center space-x-2"
              role="group"
            >
              {product.colors.slice(0, 4).map((color) => (
                <button
                  aria-label={`Select ${color.label} color`}
                  className={`h-4 w-4 rounded-full border-2 transition-colors ${
                    color.isSelected || color.isDefault ? 'border-gray-900' : 'border-gray-300'
                  } hover:border-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}
                  key={color.entityId}
                  style={{
                    backgroundColor: color.hexColors?.[0] || '#ccc',
                    backgroundImage: color.imageUrl ? `url(${color.imageUrl})` : undefined,
                    backgroundSize: 'cover',
                  }}
                  title={color.label}
                  type="button"
                />
              ))}
            </div>
            <p aria-live="polite" className="text-sm text-gray-600">
              {product.colors.length} color{product.colors.length > 1 ? 's' : ''} available
            </p>
          </>
        ) : (
          // Fallback static colors
          <>
            <div
              aria-label="Available colors"
              className="mb-4 flex justify-center space-x-2"
              role="group"
            >
              <button
                aria-label="Select black color"
                className="h-4 w-4 rounded-full border-2 border-gray-300 bg-gray-800 transition-colors hover:border-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                title="Black"
                type="button"
              />
              <button
                aria-label="Select white color"
                className="h-4 w-4 rounded-full border-2 border-gray-300 bg-white transition-colors hover:border-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                title="White"
                type="button"
              />
              <button
                aria-label="Select red color"
                className="h-4 w-4 rounded-full border-2 border-gray-300 bg-red-500 transition-colors hover:border-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                title="Red"
                type="button"
              />
              <button
                aria-label="Select blue color"
                className="h-4 w-4 rounded-full border-2 border-gray-300 bg-blue-500 transition-colors hover:border-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                title="Blue"
                type="button"
              />
            </div>
            <p aria-live="polite" className="text-sm text-gray-600">
              4 colors available
            </p>
          </>
        )}
      </div>
    </aside>
  );
}