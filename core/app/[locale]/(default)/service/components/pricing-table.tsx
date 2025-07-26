interface PricingRow {
  label: string;
  value: string;
}

interface PricingTableProps {
  leftColumn: PricingRow[];
  rightColumn: PricingRow[];
  noteTitle: string;
  noteText: string;
}

export function PricingTable({ leftColumn, noteText, noteTitle, rightColumn }: PricingTableProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          {leftColumn.map((row, index) => (
            <div 
              className={`flex justify-between items-center py-2 ${
                index < leftColumn.length - 1 ? 'border-b border-gray-100' : ''
              }`}
              key={index}
            >
              <span className="text-sm font-medium text-gray-700">{row.label}</span>
              <span className="text-md font-semibold text-gray-900">{row.value}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {rightColumn.map((row, index) => (
            <div 
              className={`flex justify-between items-center py-2 ${
                index < rightColumn.length - 1 ? 'border-b border-gray-100' : ''
              }`}
              key={index}
            >
              <span className="text-sm font-medium text-gray-700">{row.label}</span>
              <span className="text-md font-semibold text-gray-900">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-pink-50 border border-pink-200 p-3 rounded-lg">
        <p className="text-sm font-semibold text-pink-800 mb-1">{noteTitle}:</p>
        <p className="text-sm text-pink-700">{noteText}</p>
      </div>
    </div>
  );
} 