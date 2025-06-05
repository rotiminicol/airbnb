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
    <div className="border-b border-airbnb-light-border bg-white sticky top-20 z-40">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10">
        <div className="flex items-center space-x-8 py-4 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`flex flex-col items-center min-w-0 cursor-pointer filter-button px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeCategory === category.id 
                  ? 'bg-airbnb-light-gray border-b-2 border-airbnb-dark' 
                  : 'hover:bg-airbnb-light-gray'
              }`}
            >
              <i className={`${category.icon} text-airbnb-dark text-lg mb-1`}></i>
              <span className="text-xs text-airbnb-dark font-medium whitespace-nowrap">
                {category.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
