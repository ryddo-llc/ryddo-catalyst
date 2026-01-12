import type { SpecItemProps } from '../types';

export const SpecItem = ({ spec }: SpecItemProps) => {
  return (
    <div className="font-body">
      <h3 className="text-xl font-bold text-black">{spec.name}</h3>
      <p className="text-base leading-relaxed text-black md:text-lg">{spec.value}</p>
    </div>
  );
};
