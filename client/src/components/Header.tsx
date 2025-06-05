import { useState } from "react";
import { useLocation } from "wouter";
import { Search, Globe, Menu, User, Star, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SearchFilters } from "@/lib/types";
import AuthModal from "./AuthModal";
import { Link } from "wouter";

interface HeaderProps {
  onSearch?: (filters: SearchFilters) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [location] = useLocation();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    location: "",
    checkIn: null,
    checkOut: null,
    guests: 1,
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  // Mock authentication state
  const isLoggedIn = false;
  const user = null;

  const updateFilter = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    const newFilters = { ...searchFilters, [key]: value };
    setSearchFilters(newFilters);
    onSearch?.(newFilters);
  };

  const openAuthModal = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    // Handle logout logic
  };

  const languages = [
    { code: "en", name: "English", region: "United States" },
    { code: "es", name: "Español", region: "España" },
    { code: "fr", name: "Français", region: "France" },
    { code: "de", name: "Deutsch", region: "Deutschland" },
    { code: "it", name: "Italiano", region: "Italia" },
    { code: "pt", name: "Português", region: "Brasil" },
    { code: "zh", name: "中文", region: "中国" },
    { code: "ja", name: "日本語", region: "日本" },
    { code: "ko", name: "한국어", region: "대한민국" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row - Logo, Navigation, User Menu */}
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <svg className="w-8 h-8 text-[#FF5A5F]" viewBox="0 0 32 32" fill="currentColor">
              <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 5.395 6.114 12.083 0 7.472-6.715 14.623-16.398 14.623S0 25.849 0 17.377c0-6.688 4.16-8.253 6.114-12.083l.533-1.025C8.537 1.963 9.992 1 16 1z" />
            </svg>
            <span className="ml-2 text-xl font-bold text-[#FF5A5F]">airbnb</span>
          </Link>

          {/* Center Navigation Tabs */}
          <div className="flex items-center justify-center flex-1">
            <div className="flex border border-gray-300 rounded-full bg-white shadow-sm">
              <Link href="/">
                <div className={`flex items-center px-4 md:px-6 py-2 md:py-3 rounded-full transition-colors relative ${
                  location === "/" ? "text-black" : "text-gray-600 hover:bg-gray-50"
                }`}>
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 32 32" fill="currentColor">
                    <path d="M24 12.7v-.9l-.4-.2-.7-.4V6c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v1.3l-2.6-1.5c-.8-.4-1.8-.4-2.6 0l-8 4.6c-.7.4-1.1 1.1-1.1 1.9v11.4c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-4c0-.6.4-1 1-1h2c.6 0 1 .4 1 1v4c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V12.7z"/>
                  </svg>
                  <span className="text-sm font-medium">Homes</span>
                  {location === "/" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full"></div>}
                </div>
              </Link>
              <Link href="/experiences">
                <div className={`flex items-center px-4 md:px-6 py-2 md:py-3 rounded-full transition-colors relative ${
                  location === "/experiences" ? "text-black" : "text-gray-600 hover:bg-gray-50"
                }`}>
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 32 32" fill="currentColor">
                    <path d="M13.5 3a11 11 0 0 0-11 11 11 11 0 0 0 11 11 11 11 0 0 0 11-11 11 11 0 0 0-11-11zm0 20a9 9 0 0 1-9-9 9 9 0 0 1 9-9 9 9 0 0 1 9 9 9 9 0 0 1-9 9z"/>
                  </svg>
                  <span className="text-sm font-medium">Experiences</span>
                  <span className="ml-1 bg-[#FF5A5F] text-white text-xs px-1.5 py-0.5 rounded">NEW</span>
                  {location === "/experiences" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full"></div>}
                </div>
              </Link>
              <Link href="/services">
                <div className={`flex items-center px-4 md:px-6 py-2 md:py-3 rounded-full transition-colors relative ${
                  location === "/services" ? "text-black" : "text-gray-600 hover:bg-gray-50"
                }`}>
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 32 32" fill="currentColor">
                    <path d="M16 1c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6zm0 14c5.5 0 10 4.5 10 10v5H6v-5c0-5.5 4.5-10 10-10z"/>
                  </svg>
                  <span className="text-sm font-medium">Services</span>
                  <span className="ml-1 bg-[#FF5A5F] text-white text-xs px-1.5 py-0.5 rounded">NEW</span>
                  {location === "/services" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full"></div>}
                </div>
              </Link>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button variant="ghost" className="hidden lg:block text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full px-4 py-2">
              Become a host
            </Button>
            
            {/* Language/Region Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100 rounded-full">
                  <Globe className="h-4 w-4 text-gray-700" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="p-3 border-b">
                  <h3 className="font-semibold">Choose a language and region</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {languages.map((lang) => (
                    <DropdownMenuItem key={lang.code} className="flex flex-col items-start p-3">
                      <span className="font-medium">{lang.name}</span>
                      <span className="text-sm text-gray-500">{lang.region}</span>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center border border-gray-300 rounded-full px-2 py-1 hover:shadow-md transition-shadow duration-200 cursor-pointer">
                  <Menu className="text-gray-600 h-4 w-4 mr-2" />
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                    <User className="text-white h-4 w-4" />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {isLoggedIn ? (
                  <>
                    <div className="p-3 border-b">
                      <p className="font-medium">{user?.name || user?.email}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <DropdownMenuItem>Messages</DropdownMenuItem>
                    <DropdownMenuItem>Notifications</DropdownMenuItem>
                    <DropdownMenuItem>Trips</DropdownMenuItem>
                    <DropdownMenuItem>Wishlists</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Manage listings</DropdownMenuItem>
                    <DropdownMenuItem>Host an experience</DropdownMenuItem>
                    <DropdownMenuItem>Account</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Help Center</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => openAuthModal("signup")}>
                      Sign up
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openAuthModal("login")}>
                      Log in
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Gift cards</DropdownMenuItem>
                    <DropdownMenuItem>Airbnb your home</DropdownMenuItem>
                    <DropdownMenuItem>Help Center</DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search Bar Row */}
        <div className="pb-6">
          <div className="flex justify-center">
            <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-lg transition-shadow duration-200 max-w-4xl w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex-1 px-6 py-3 border-r border-gray-300 cursor-pointer hover:bg-gray-50 rounded-l-full">
                    <div className="text-xs font-medium text-black">Where</div>
                    <Input
                      type="text"
                      placeholder="Search destinations"
                      value={searchFilters.location}
                      onChange={(e) => updateFilter("location", e.target.value)}
                      className="border-0 p-0 focus-visible:ring-0 placeholder:text-gray-400"
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Search by region</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" size="sm">I'm flexible</Button>
                      <Button variant="outline" size="sm">Europe</Button>
                      <Button variant="outline" size="sm">United States</Button>
                      <Button variant="outline" size="sm">Italy</Button>
                      <Button variant="outline" size="sm">Asia</Button>
                      <Button variant="outline" size="sm">France</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Check in */}
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex-1 px-6 py-3 border-r border-gray-300 cursor-pointer hover:bg-gray-50">
                    <div className="text-xs font-medium text-black">Check in</div>
                    <div className="text-sm text-gray-400">
                      {searchFilters.checkIn ? searchFilters.checkIn.toLocaleDateString() : "Add dates"}
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={searchFilters.checkIn}
                    onSelect={(date) => updateFilter("checkIn", date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Check out */}
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex-1 px-6 py-3 border-r border-gray-300 cursor-pointer hover:bg-gray-50">
                    <div className="text-xs font-medium text-black">Check out</div>
                    <div className="text-sm text-gray-400">
                      {searchFilters.checkOut ? searchFilters.checkOut.toLocaleDateString() : "Add dates"}
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={searchFilters.checkOut}
                    onSelect={(date) => updateFilter("checkOut", date)}
                    disabled={(date) => date < new Date() || (searchFilters.checkIn && date <= searchFilters.checkIn)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Who */}
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex items-center justify-between px-6 py-3 cursor-pointer hover:bg-gray-50 rounded-r-full">
                    <div>
                      <div className="text-xs font-medium text-black">Who</div>
                      <div className="text-sm text-gray-400">
                        {searchFilters.guests === 1 ? "1 guest" : `${searchFilters.guests} guests`}
                      </div>
                    </div>
                    <Button className="bg-[#E61E4D] hover:bg-[#D70466] text-white rounded-full w-12 h-12 ml-4" size="icon">
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Adults</div>
                        <div className="text-sm text-gray-500">Ages 13 or above</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateFilter("guests", Math.max(1, searchFilters.guests - 1))}
                          disabled={searchFilters.guests <= 1}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{searchFilters.guests}</span>
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
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
      />
    </header>
  );
}