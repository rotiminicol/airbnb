import { useState } from "react";
import { Star, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  provider: string;
  duration?: string;
  isPopular?: boolean;
}

const mockServices: Service[] = [
  {
    id: 1,
    title: "Stylish vintage car photo shoot Tour",
    description: "Professional photography session with vintage cars in iconic Rome locations.",
    price: 62,
    location: "Rome, Italy",
    rating: 4.95,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Photography",
    provider: "Marco",
    duration: "2 hours"
  },
  {
    id: 2,
    title: "Photo session at the Metropolitan Museum of Art",
    description: "Capture stunning portraits in one of the world's most prestigious museums.",
    price: 300,
    location: "New York, United States",
    rating: 5.0,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Photography",
    provider: "Sarah"
  },
  {
    id: 3,
    title: "Authentic, inclusive photography by Ashley",
    description: "Celebrate your authentic self with inclusive portrait photography sessions.",
    price: 50,
    location: "Hyde Park, United States",
    rating: 4.88,
    reviewCount: 234,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Photography",
    provider: "Ashley"
  },
  {
    id: 4,
    title: "Authentic urban portraits by J C",
    description: "Street-style photography sessions capturing the energy of Mexico City.",
    price: 67,
    location: "Mexico City, Mexico",
    rating: 4.92,
    reviewCount: 178,
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Photography",
    provider: "J C"
  },
  {
    id: 5,
    title: "Couples photography by Jeff",
    description: "Romantic couple sessions against London's most iconic backdrops.",
    price: 263,
    location: "Greater London, United Kingdom",
    rating: 4.89,
    reviewCount: 92,
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Photography",
    provider: "Jeff",
    isPopular: true
  },
  {
    id: 6,
    title: "Aerial and ground photography by Daniel",
    description: "Professional drone and ground photography services for stunning perspectives.",
    price: 50,
    location: "Fort Lauderdale, United States",
    rating: 4.94,
    reviewCount: 167,
    image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Photography",
    provider: "Daniel"
  },
  {
    id: 7,
    title: "Gourmet cooking class with Chef Maria",
    description: "Learn to cook authentic Italian dishes with a Michelin-starred chef.",
    price: 120,
    location: "Florence, Italy",
    rating: 4.97,
    reviewCount: 203,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Culinary",
    provider: "Maria",
    duration: "3 hours"
  },
  {
    id: 8,
    title: "Wine tasting and vineyard tour",
    description: "Private wine tasting experience in the heart of Tuscany's wine country.",
    price: 85,
    location: "Tuscany, Italy",
    rating: 4.91,
    reviewCount: 145,
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Culinary",
    provider: "Giuseppe",
    duration: "4 hours"
  }
];

const categories = [
  "All services",
  "Photography",
  "Culinary",
  "Wellness",
  "Entertainment",
  "Business"
];

export default function Services() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All services");

  const filteredServices = mockServices.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All services" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">

        {/* Popular Services */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Popular</h2>
            <Badge className="bg-[#E61E4D] text-white">Popular</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredServices.filter(service => service.isPopular || service.rating >= 4.9).slice(0, 4).map((service) => (
              <Card key={service.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {service.isPopular && (
                      <Badge className="absolute top-3 left-3 bg-[#E61E4D] text-white">
                        Popular
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 fill-current text-black" />
                      <span className="text-sm font-medium">{service.rating}</span>
                      <span className="text-sm text-gray-600">({service.reviewCount})</span>
                    </div>
                    <h3 className="font-medium mb-2 line-clamp-2">{service.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{service.location}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">From ${service.price} / guest</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`${
                selectedCategory === category 
                  ? "bg-black text-white" 
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Chefs Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Chefs</h2>
            <Button variant="ghost" className="flex items-center gap-2 text-sm font-medium">
              Show all <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
            {filteredServices.filter(service => service.category === "Culinary").map((service) => (
              <Card key={service.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 fill-current text-black" />
                      <span className="text-sm font-medium">{service.rating}</span>
                      <span className="text-sm text-gray-600">({service.reviewCount})</span>
                    </div>
                    <h3 className="font-medium text-sm mb-2 line-clamp-2">{service.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{service.location}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">From ${service.price} / guest</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  {service.isPopular && (
                    <Badge className="absolute top-3 left-3 bg-[#E61E4D] text-white">
                      Popular
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-current text-black" />
                    <span className="text-sm font-medium">{service.rating}</span>
                    <span className="text-sm text-gray-600">({service.reviewCount})</span>
                  </div>
                  <h3 className="font-medium mb-2 line-clamp-2">{service.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{service.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">From ${service.price} / guest</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-600">No services found matching your search.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}