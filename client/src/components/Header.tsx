import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Globe, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { SearchFilters } from "@/lib/types";

interface HeaderProps {
  onSearch?: (filters: SearchFilters) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [location, setLocation] = useLocation();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    location: "",
    checkIn: null,
    checkOut: null,
    guests: 1,
  });

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchFilters);
    }
  };

  const updateFilter = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    setSearchFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-airbnb-light-border">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="text-airbnb-red text-2xl font-bold cursor-pointer">
              <i className="fab fa-airbnb mr-2"></i>
              airbnb
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-white border border-airbnb-border rounded-full search-shadow hover:shadow-lg transition-shadow duration-200">
            <Popover>
              <PopoverTrigger asChild>
                <div className="px-6 py-3 border-r border-airbnb-light-border cursor-pointer hover:bg-gray-50 rounded-l-full">
                  <div className="text-xs font-medium text-black">Where</div>
                  <Input
                    type="text"
                    placeholder="Search destinations"
                    value={searchFilters.location}
                    onChange={(e) => updateFilter("location", e.target.value)}
                    className="text-sm text-airbnb-dark placeholder-gray-400 bg-transparent border-none outline-none w-32 p-0 h-auto focus-visible:ring-0"
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Search by location</Label>
                  <Input
                    id="location"
                    placeholder="Where are you going?"
                    value={searchFilters.location}
                    onChange={(e) => updateFilter("location", e.target.value)}
                  />
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <div className="px-6 py-3 border-r border-airbnb-light-border cursor-pointer hover:bg-gray-50">
                  <div className="text-xs font-medium text-black">Check in</div>
                  <div className="text-sm text-gray-400">
                    {searchFilters.checkIn ? searchFilters.checkIn.toLocaleDateString() : "Add dates"}
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={searchFilters.checkIn || undefined}
                  onSelect={(date) => updateFilter("checkIn", date || null)}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <div className="px-6 py-3 border-r border-airbnb-light-border cursor-pointer hover:bg-gray-50">
                  <div className="text-xs font-medium text-black">Check out</div>
                  <div className="text-sm text-gray-400">
                    {searchFilters.checkOut ? searchFilters.checkOut.toLocaleDateString() : "Add dates"}
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={searchFilters.checkOut || undefined}
                  onSelect={(date) => updateFilter("checkOut", date || null)}
                  disabled={(date) => date < new Date() || (searchFilters.checkIn && date <= searchFilters.checkIn)}
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <div className="px-6 py-3 cursor-pointer hover:bg-gray-50 rounded-r-full flex items-center">
                  <div>
                    <div className="text-xs font-medium text-black">Who</div>
                    <div className="text-sm text-gray-400">
                      {searchFilters.guests === 1 ? "1 guest" : `${searchFilters.guests} guests`}
                    </div>
                  </div>
                  <Button 
                    onClick={handleSearch}
                    className="ml-3 bg-airbnb-red text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200 h-8 w-8"
                    size="sm"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
                <div className="space-y-4">
                  <Label htmlFor="guests">Number of guests</Label>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateFilter("guests", Math.max(1, searchFilters.guests - 1))}
                      disabled={searchFilters.guests <= 1}
                    >
                      -
                    </Button>
                    <span className="font-medium">{searchFilters.guests}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateFilter("guests", Math.min(16, searchFilters.guests + 1))}
                      disabled={searchFilters.guests >= 16}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="hidden md:block text-sm font-medium text-airbnb-dark">
              Airbnb your home
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Globe className="h-4 w-4 text-airbnb-dark" />
            </Button>
            <div className="flex items-center border border-airbnb-border rounded-full px-2 py-1 hover:shadow-md transition-shadow duration-200 cursor-pointer">
              <Menu className="text-airbnb-dark h-4 w-4 mr-3" />
              <div className="w-8 h-8 bg-airbnb-dark rounded-full flex items-center justify-center">
                <User className="text-white h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
