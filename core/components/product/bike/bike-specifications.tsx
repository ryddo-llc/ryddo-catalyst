interface BikeSpecifications {
  motorPower?: string;
  batteryCapacity?: string;
  maxSpeed?: string;
  range?: string;
  frameSize?: string;
  wheelSize?: string;
  brakeSystem?: string;
  transmissionType?: string;
}

export interface BikeSpecsIconsProps {
  specs: BikeSpecifications;
}

export function BikeSpecsIcons({ specs }: BikeSpecsIconsProps) {
  return (
    <div aria-label="Bike specifications" className="flex justify-center space-x-8" role="region">
      {specs.motorPower ? (
        <div
          aria-label={`Motor Power: ${specs.motorPower}`}
          className="flex flex-col items-center"
          role="img"
        >
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100">
            <span aria-hidden="true" className="text-xl text-pink-600">
              ⚡
            </span>
          </div>
          <span className="text-sm text-gray-600">Motor Power</span>
          <span className="sr-only">{specs.motorPower}</span>
        </div>
      ) : null}
      {specs.batteryCapacity ? (
        <div
          aria-label={`Battery Capacity: ${specs.batteryCapacity}`}
          className="flex flex-col items-center"
          role="img"
        >
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
            <span aria-hidden="true" className="text-xl text-green-600">
              🔋
            </span>
          </div>
          <span className="text-sm text-gray-600">Battery</span>
          <span className="sr-only">{specs.batteryCapacity}</span>
        </div>
      ) : null}
      {specs.maxSpeed ? (
        <div
          aria-label={`Max Speed: ${specs.maxSpeed}`}
          className="flex flex-col items-center"
          role="img"
        >
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
            <span aria-hidden="true" className="text-xl text-blue-600">
              🏃
            </span>
          </div>
          <span className="text-sm text-gray-600">Max Speed</span>
          <span className="sr-only">{specs.maxSpeed}</span>
        </div>
      ) : null}
      {specs.range ? (
        <div
          aria-label={`Range: ${specs.range}`}
          className="flex flex-col items-center"
          role="img"
        >
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <span aria-hidden="true" className="text-xl text-purple-600">
              📍
            </span>
          </div>
          <span className="text-sm text-gray-600">Range</span>
          <span className="sr-only">{specs.range}</span>
        </div>
      ) : null}
      <div aria-label="High precision engineering" className="flex flex-col items-center" role="img">
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
          <span aria-hidden="true" className="text-xl text-orange-600">
            🎯
          </span>
        </div>
        <span className="text-sm text-gray-600">Precision</span>
      </div>
      <div aria-label="Easy maintenance" className="flex flex-col items-center" role="img">
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
          <span aria-hidden="true" className="text-xl text-red-600">
            🔧
          </span>
        </div>
        <span className="text-sm text-gray-600">Maintenance</span>
      </div>
    </div>
  );
}