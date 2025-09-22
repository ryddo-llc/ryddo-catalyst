import type { SpecItemProps } from '../types';

export const SpecItem = ({ spec }: SpecItemProps) => {
  return (
    <div>
      <h3 className="text-xl font-bold text-black">{spec.name}</h3>
      <p className="font-small text-base leading-relaxed text-[#7D7D7D] md:text-lg">{spec.value}</p>
    </div>
  );
};
