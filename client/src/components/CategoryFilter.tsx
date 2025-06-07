import { useState } from "react";
import { CATEGORIES } from "@/lib/types";

interface CategoryFilterProps {
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState(selectedCategory);

  const handleCategoryClick = (categoryId: string) => {
    const newCategory = activeCategory === categoryId ? "" : categoryId;
    setActiveCategory(newCategory);
    onCategoryChange?.(newCategory);
  };

  return (
    <div className="border-b border-airbnb-light-border bg-gradient-to-r from-white via-gray-50 to-white sticky top-16 md:top-20 z-40 shadow-md">
      <div className="max-w-screen-2xl mx-auto px-0 sm:px-6 lg:px-10 relative">
        {/* Mobile fade effect for overflow */}
        <div className="absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 block sm:hidden" />
        <div className="absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 block sm:hidden" />
        <div className="flex items-center space-x-2 sm:space-x-8 py-2 sm:py-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`flex flex-col items-center min-w-[64px] sm:min-w-0 cursor-pointer px-1 sm:px-4 py-1 sm:py-2 rounded-lg transition-all duration-200 snap-start focus:outline-none group relative overflow-hidden ${
                activeCategory === category.id 
                  ? 'bg-airbnb-light-gray border-b-2 border-airbnb-dark shadow-lg' 
                  : 'hover:bg-airbnb-light-gray'
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              {/* Ripple effect */}
              <span className="absolute inset-0 rounded-full pointer-events-none group-active:animate-ping bg-[#FF5A5F]/10" />
              <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-1 transition-all duration-300 text-lg shadow-sm ${
                activeCategory === category.id
                  ? 'bg-[#FF5A5F] text-white scale-110 shadow-xl'
                  : 'bg-gray-100 text-airbnb-dark group-hover:bg-[#FF5A5F] group-hover:text-white'
              }`}>
                <i className={`${category.icon}`}></i>
              </div>
              <span className={`mt-0.5 transition-all duration-200 whitespace-nowrap ${
                activeCategory === category.id
                  ? 'text-[11px] sm:text-sm text-airbnb-dark font-bold'
                  : 'text-[10px] sm:text-xs text-airbnb-dark font-medium'
              }`}>
                {category.label}
              </span>
            </button>
          ))}
        </div>
        {/* Subtle shadow under the bar for separation */}
        <div className="absolute left-0 right-0 bottom-0 h-2 bg-gradient-to-b from-gray-300/40 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
