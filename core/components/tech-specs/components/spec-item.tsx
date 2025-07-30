import type { SpecItemProps } from '../types';

export const SpecItem = ({ spec }: SpecItemProps) => {
  return (
    <div className="space-y-3 md:space-y-4">
      <h3 className="text-sm font-bold text-black md:text-base">{spec.name}</h3>
      <p className="text-base leading-relaxed text-gray-600 md:text-lg">{spec.value}</p>
    </div>
  );
};