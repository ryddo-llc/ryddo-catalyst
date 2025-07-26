import { BsFillGrid1X2Fill } from "react-icons/bs";

export default function SpecialsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <BsFillGrid1X2Fill className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Special Offers</h3>
          <p className="text-gray-500">Special offers coming soon...</p>
        </div>
      </div>
      
      <div className="space-y-8">
        <div className="h-16"/>
        <div className="h-16"/>
      </div>
    </div>
  );
} 