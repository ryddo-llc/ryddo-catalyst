interface BikeSpecification {
  name: string;
  value: string;
}

export interface BikeSpecsIconsProps {
  specs: BikeSpecification[];
}

// Helper function to get icon and color based on field name
function getSpecIcon(fieldName: string): { icon: string; bgColor: string; textColor: string } {
  const name = fieldName.toLowerCase();

  if (name.includes('motor') || name.includes('power')) {
    return { icon: '⚡', bgColor: 'bg-pink-100', textColor: 'text-pink-600' };
  }

  if (name.includes('battery') || name.includes('capacity')) {
    return { icon: '🔋', bgColor: 'bg-green-100', textColor: 'text-green-600' };
  }

  if (name.includes('speed')) {
    return { icon: '🏃‍♂️', bgColor: 'bg-blue-100', textColor: 'text-blue-600' };
  }

  if (name.includes('range') || name.includes('distance')) {
    return { icon: '📏', bgColor: 'bg-purple-100', textColor: 'text-purple-600' };
  }

  if (name.includes('frame') || name.includes('size')) {
    return { icon: '📐', bgColor: 'bg-yellow-100', textColor: 'text-yellow-600' };
  }

  if (name.includes('wheel')) {
    return { icon: '🛞', bgColor: 'bg-indigo-100', textColor: 'text-indigo-600' };
  }

  if (name.includes('brake')) {
    return { icon: '🛑', bgColor: 'bg-red-100', textColor: 'text-red-600' };
  }

  if (name.includes('transmission') || name.includes('gear')) {
    return { icon: '⚙️', bgColor: 'bg-gray-100', textColor: 'text-gray-600' };
  }

  // Default icon for unknown fields
  return { icon: '📋', bgColor: 'bg-gray-100', textColor: 'text-gray-600' };
}

export function BikeSpecsIcons({ specs }: BikeSpecsIconsProps) {
  return (
    <div
      aria-label="Bike specifications"
      className="flex flex-wrap justify-center gap-4 space-x-8"
      role="region"
    >
      {specs.map((spec) => {
        const { icon, bgColor, textColor } = getSpecIcon(spec.name);

        return (
          <div
            aria-label={`${spec.name}: ${spec.value}`}
            className="flex flex-col items-center"
            key={spec.name}
            role="img"
          >
            <div
              className={`mb-2 flex h-12 w-12 items-center justify-center rounded-lg ${bgColor}`}
            >
              <span aria-hidden="true" className={`text-xl ${textColor}`}>
                {icon}
              </span>
            </div>
            <span className="text-sm text-gray-600">{spec.name}</span>
            <span className="text-xs font-medium text-gray-900">{spec.value}</span>
          </div>
        );
      })}
    </div>
  );
}
