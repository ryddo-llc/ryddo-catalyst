import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { type Product } from '@/vibes/soul/primitives/product-card';
import { Image } from '~/components/image';
import { Link } from '~/components/link';

interface AddonProps {
  addons: Streamable<Product[]>;
  name?: string;
}

export default function Addons({ addons, name = 'Super73-RX' }: AddonProps) {
  // Background text based on product type
  const backgroundText = name;

  return (
    <section className="w-full bg-white bg-gradient-to-br px-4 py-16">
      <div className="mx-auto max-w-6xl text-center">
        {/* Title */}
        <h2 className="mb-12 text-3xl font-black text-gray-900 md:text-4xl lg:text-5xl">
          Add-Ons for your
          <br />
          <span className="text-[#F92F7B]">new {name}.</span>
        </h2>

        {/* Grid of Add-Ons with Background Text */}
        <div className="relative">
          {/* Background Text */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
            <span className="select-none whitespace-nowrap text-4xl font-black uppercase leading-loose tracking-widest text-gray-300 opacity-60 sm:text-6xl md:text-8xl lg:text-[10rem]">
              {backgroundText}
            </span>
          </div>

          {/* Add-Ons Grid */}
          <div className="relative z-0 grid grid-cols-2 gap-10 md:grid-cols-3 md:gap-16 lg:grid-cols-6">
            <Stream
              fallback={
                <div className="contents">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div className="group cursor-pointer" key={index}>
                      <div className="animate-pulse rounded-2xl bg-gray-200 p-6 md:p-8" />
                    </div>
                  ))}
                </div>
              }
              value={addons}
            >
              {(accessories) => {
                const displayAccessories = accessories;

                return displayAccessories.map((accessory) => (
                  <Link href={accessory.href} key={accessory.id}>
                    <div className="group cursor-pointer">
                      <Image
                        alt={accessory.title}
                        className="aspect-square transform rounded-2xl object-contain p-6 transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-lg md:p-8"
                        height={500}
                        src={accessory.image?.src || '/images/placeholder.png'}
                        width={500}
                      />
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
