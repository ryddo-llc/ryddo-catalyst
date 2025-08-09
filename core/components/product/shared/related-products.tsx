import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { type Product } from '@/vibes/soul/primitives/product-card';
import { Image } from '~/components/image';
import { Link } from '~/components/link';

interface RelatedProductsProps {
  products: Streamable<Product[]>;
  name?: string;
}

export default function RelatedProducts({ products, name = 'this product' }: RelatedProductsProps) {
  return (
    <section className="w-full bg-white bg-gradient-to-br px-4 py-16">
      <div className="mx-auto max-w-6xl">
        {/* Title - aligned with first product */}
        <h2 className="mb-12 text-left text-3xl font-black text-gray-900 md:text-4xl lg:text-5xl">
          <span className="text-[#F92F7B]">Related</span> Products.
        </h2>
        
        {/* Related Products Grid - 4 products only */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-16">
            <Stream
              fallback={
                <div className="contents">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div className="group cursor-pointer" key={index}>
                      <div className="animate-pulse rounded-2xl bg-gray-200 p-6 md:p-8" />
                    </div>
                  ))}
                </div>
              }
              value={products}
            >
              {(relatedProducts) => {
                // Take only first 4 products to ensure consistency
                const displayProducts = relatedProducts.slice(0, 4);

                return displayProducts.map((product) => (
                  <Link href={product.href} key={product.id}>
                    <div className="group relative cursor-pointer overflow-hidden rounded-2xl">
                      {/* Optimized ripple effect */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {/* Center pulse */}
                        <div className="absolute h-16 w-16 rounded-full bg-[#F92F7B] opacity-0 transition-all duration-200 ease-out group-hover:scale-125 group-hover:opacity-100" />

                        {/* Inner pulse circle */}
                        <div className="absolute h-20 w-20 rounded-full bg-[#F92F7B] opacity-0 transition-all delay-100 duration-300 ease-out group-hover:scale-110 group-hover:opacity-80" />

                        {/* First wave of ripples */}
                        <div className="absolute h-32 w-32 scale-75 rounded-full bg-[#F92F7B] opacity-0 transition-all delay-150 duration-500 ease-out group-hover:scale-150 group-hover:opacity-0" />
                        <div className="group-hover:scale-200 absolute h-24 w-24 scale-75 rounded-full bg-[#F92F7B] opacity-0 transition-all delay-200 duration-700 ease-out group-hover:opacity-0" />
                        <div className="group-hover:scale-200 absolute h-28 w-28 scale-75 rounded-full bg-[#F92F7B] opacity-0 transition-all delay-300 duration-700 ease-out group-hover:opacity-0" />

                        {/* Second wave of ripples */}
                        <div className="group-hover:scale-200 absolute h-32 w-32 scale-50 rounded-full bg-[#F92F7B] opacity-0 transition-all delay-300 duration-1000 ease-out group-hover:opacity-0" />
                        <div className="group-hover:scale-200 absolute h-36 w-36 scale-50 rounded-full bg-[#F92F7B] opacity-0 transition-all delay-500 duration-1000 ease-out group-hover:opacity-0" />
                        <div className="group-hover:scale-200 absolute h-40 w-40 scale-50 rounded-full bg-[#F92F7B] opacity-0 transition-all delay-700 duration-1000 ease-out group-hover:opacity-0" />
                      </div>
                      <Image
                        alt={product.title}
                        className="relative z-10 aspect-square rounded-2xl object-contain p-6 md:p-8"
                        height={500}
                        src={product.image?.src || '/images/placeholder.png'}
                        width={500}
                      />
                      {/* Product Title and Price */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <p className="text-sm font-semibold">{product.title}</p>
                        {product.price ? (
                          <p className="text-xs">
                            {typeof product.price === 'string' ? (
                              product.price
                            ) : (
                              <>
                                {product.price.sale ? (
                                  <>
                                    <span className="line-through">{product.price.base}</span>{' '}
                                    <span className="text-[#F92F7B]">{product.price.sale}</span>
                                  </>
                                ) : (
                                  product.price.base
                                )}
                              </>
                            )}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                ));
              }}
            </Stream>
          </div>
        </div>
      </div>
    </section>
  );
}
