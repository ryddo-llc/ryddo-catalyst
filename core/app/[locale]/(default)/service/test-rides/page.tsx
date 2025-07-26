import { FaCircleDot } from "react-icons/fa6";

export default function TestRidesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <FaCircleDot className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Test Rides</h3>
          <p className="text-gray-500">Test ride information coming soon...</p>
        </div>
      </div>
      
      <div className="space-y-8">
        <div className="h-16"/>
        <div className="h-16"/>
      </div>
    </div>
  );
} 