import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { type Product } from '@/vibes/soul/primitives/product-card';
import { Image } from '~/components/image';
import { Link } from '~/components/link';

interface AddonProps {
  addons: Streamable<Product[]>;
  name?: string;
  productType?: 'bike' | 'scooter';
}

export default function Addons({ 
  addons,
  name = 'Super73-RX', 
  productType = 'bike' 
}: AddonProps) {
  // Background text based on product type
  const backgroundText = productType === 'scooter' ? 'Scooter' : 'Super73';

  return (
    <section className="py-16 px-4 bg-gradient-to-br bg-white">
      <div className="max-w-6xl mx-auto text-center">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-12">
          Add-Ons for your
          <br />
          <span className="text-[#F92F7B]">new {name}.</span>
        </h2>

        {/* Grid of Add-Ons with Background Text */}
        <div className="relative">
          {/* Background Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <span className="text-gray-300 uppercase leading-loose tracking-widest font-black text-6xl md:text-8xl lg:text-9xl xl:text-[12rem] whitespace-nowrap select-none opacity-30">
              {backgroundText}
            </span>
          </div>

          {/* Add-Ons Grid */}
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 md:gap-16">
            <Stream fallback={
              <div className="contents">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div className="group cursor-pointer" key={index}>
                    <div className="aspect-square animate-pulse rounded-2xl bg-gray-200 p-6 md:p-8" />
                  </div>
                ))}
              </div>
            } value={addons}>
              {(accessories) => 
                accessories.slice(0, 6).map((accessory) => (
                  <Link href={accessory.href} key={accessory.id}>
                    <div className="group cursor-pointer">
                      <Image
                        alt={accessory.title}
                        className="rounded-2xl p-6 md:p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 aspect-square object-contain bg-white border border-gray-100"
                        height={500}
                        src={accessory.image?.src || '/images/placeholder.png'}
                        width={500}
                      />
                      <div className="mt-4 text-center">
                        <p className="text-sm font-medium text-gray-900 truncate">{accessory.title}</p>
                        {accessory.price ? (
                          <p className="mt-1 text-xs text-gray-600">
                            {(() => {
                              if (typeof accessory.price === 'string') {
                                return accessory.price;
                              }
                              
                              if (accessory.price.type === 'sale' && 'currentValue' in accessory.price) {
                                return accessory.price.currentValue;
                              }
                              
                              if ('minValue' in accessory.price) {
                                return `${accessory.price.minValue} - ${accessory.price.maxValue}`;
                              }
                              
                              return 'Price available';
                            })()}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                ))
              }
            </Stream>
          </div>
        </div>
      </div>
    </section>
  );
}