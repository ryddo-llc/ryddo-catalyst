export function ServiceMapPins() {
  return (
    <div className="hidden lg:block absolute top-[33%] right-12">
      {/* Map Pin 1 with Label */}
      <div className="relative group mb-48">
        {/* Outer concentric circle (most transparent) */}
        <div className="w-10 h-10 bg-pink-500/30 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-200"/>
        {/* Middle concentric circle (medium transparency) */}
        <div className="absolute inset-1.5 w-7 h-7 bg-pink-500/60 rounded-full animate-pulse"/>
        {/* Innermost circle (least transparent) */}
        <div className="absolute inset-3 w-4 h-4 bg-pink-500 rounded-full"/>
        {/* Label always visible above the pin */}
        <div className="absolute -top-20 left-5 transform -translate-x-1/2 bg-gray-600 text-white text-xs px-4 py-2 rounded-2xl shadow-lg text-center w-48">
          <div className="text-xl">Smith Bikes</div>
          <div className="text-md">Santa Monica, CA.</div>
        </div>
      </div>
      
      {/* Map Pin 2 - offset to the right */}
      <div className="relative group ml-12">
        {/* Outer concentric circle (most transparent) */}
        <div className="w-10 h-10 bg-pink-500/30 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-200"/>
        {/* Middle concentric circle (medium transparency) */}
        <div className="absolute inset-1.5 w-7 h-7 bg-pink-500/60 rounded-full animate-pulse"/>
        {/* Innermost circle (least transparent) */}
        <div className="absolute inset-3 w-4 h-4 bg-pink-500 rounded-full"/>
      </div>
    </div>
  );
} 