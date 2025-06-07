import { Filter, ChevronDown, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface FiltersBarProps {
  onFiltersChange?: (filters: any) => void;
  onShowMap?: () => void;
  showMap?: boolean;
}

export default function FiltersBar({ onFiltersChange, onShowMap, showMap }: FiltersBarProps) {
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [propertyType, setPropertyType] = useState("");

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    onFiltersChange?.({
      priceRange: value,
      propertyType,
    });
  };

  const handlePropertyTypeChange = (value: string) => {
    setPropertyType(value);
    onFiltersChange?.({
      priceRange,
      propertyType: value,
    });
  };

  return (
    <div className="bg-white border-b border-airbnb-light-border">
      <div className="max-w-screen-2xl mx-auto px-2 sm:px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between py-2 sm:py-4 gap-2 sm:gap-0">
          <div className="flex flex-row overflow-x-auto scrollbar-hide space-x-2 sm:space-x-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2 border-airbnb-border">
                  <Filter className="h-4 w-4 text-airbnb-dark" />
                  <span className="text-sm font-medium text-airbnb-dark">Filters</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-6">
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-semibold">Price range</Label>
                    <p className="text-sm text-gray-500 mb-4">Nightly prices before fees and taxes</p>
                    <Slider
                      value={priceRange}
                      onValueChange={handlePriceChange}
                      max={2000}
                      min={0}
                      step={50}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-500">${priceRange[0]}</span>
                      <span className="text-sm text-gray-500">${priceRange[1]}+</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Property type</Label>
                    <Select value={propertyType} onValueChange={handlePropertyTypeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any type</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="cabin">Cabin</SelectItem>
                        <SelectItem value="cottage">Cottage</SelectItem>
                        <SelectItem value="loft">Loft</SelectItem>
                        <SelectItem value="treehouse">Treehouse</SelectItem>
                        <SelectItem value="bungalow">Bungalow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2 border-airbnb-border">
                  <span className="text-sm font-medium text-airbnb-dark">Type of place</span>
                  <ChevronDown className="h-4 w-4 text-airbnb-dark" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4">
                <div className="space-y-3">
                  <div className="text-sm font-medium">Type of place</div>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" name="placeType" className="text-airbnb-red" defaultChecked />
                      <span className="text-sm">Any type</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" name="placeType" className="text-airbnb-red" />
                      <span className="text-sm">Entire place</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" name="placeType" className="text-airbnb-red" />
                      <span className="text-sm">Private room</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" name="placeType" className="text-airbnb-red" />
                      <span className="text-sm">Shared room</span>
                    </label>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2 border-airbnb-border">
                  <span className="text-sm font-medium text-airbnb-dark">Price</span>
                  <ChevronDown className="h-4 w-4 text-airbnb-dark" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4">
                <div className="space-y-3">
                  <div className="text-sm font-medium">Price</div>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" name="priceSort" className="text-airbnb-red" defaultChecked />
                      <span className="text-sm">Any price</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" name="priceSort" className="text-airbnb-red" />
                      <span className="text-sm">Price: Low to High</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" name="priceSort" className="text-airbnb-red" />
                      <span className="text-sm">Price: High to Low</span>
                    </label>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 mt-2 sm:mt-0">
            <Button 
              variant="ghost" 
              onClick={onShowMap}
              className="flex items-center space-x-2 text-sm font-medium text-airbnb-dark hover:bg-gray-50 transition-colors duration-200 px-3 py-2 rounded-lg"
            >
              <span>{showMap ? "Show list" : "Show map"}</span>
              <Map className="h-4 w-4 text-airbnb-dark" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
