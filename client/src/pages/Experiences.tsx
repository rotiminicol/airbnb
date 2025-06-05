import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { apiRequest } from "@/lib/queryClient";

interface Experience {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  hostName: string;
  isOriginal?: boolean;
}

const mockExperiences: Experience[] = [
  {
    id: 1,
    title: "Hike in the Alps with Olympian Omar Visintin",
    description: "Join Olympic snowboarder Omar Visintin for an unforgettable alpine adventure through breathtaking mountain trails.",
    price: 50,
    duration: "3 hours",
    location: "Merano, Italy",
    rating: 4.95,
    reviewCount: 127,
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Sports",
    hostName: "Omar",
    isOriginal: true
  },
  {
    id: 2,
    title: "Design your own Tour de France-inspired jersey",
    description: "Create a personalized cycling jersey with expert guidance from professional designers in the heart of Paris.",
    price: 125,
    duration: "2 hours",
    location: "Paris, France",
    rating: 4.89,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Design",
    hostName: "Marie",
    isOriginal: true
  },
  {
    id: 3,
    title: "Hit the ice with Paralympian Andrea Macri",
    description: "Experience the thrill of ice hockey with Paralympic champion Andrea Macri in a private training session.",
    price: 30,
    duration: "2 hours",
    location: "Turin, Italy",
    rating: 4.92,
    reviewCount: 76,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Sports",
    hostName: "Andrea",
    isOriginal: true
  },
  {
    id: 4,
    title: "Break down the Tour de France with Thomas Voeckler",
    description: "Get insider insights into professional cycling from former Tour de France stage winner Thomas Voeckler.",
    price: 142,
    duration: "1.5 hours",
    location: "Vine-Normandie, France",
    rating: 4.88,
    reviewCount: 154,
    image: "https://images.unsplash.com/photo-1544191696-15693072c395?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Sports",
    hostName: "Thomas",
    isOriginal: true
  },
  {
    id: 5,
    title: "Fuel up with a Tour de France nutritionist",
    description: "Learn the secrets of professional cycling nutrition from an expert who works with Tour de France teams.",
    price: 79,
    duration: "2 hours",
    location: "Mont-Dore, France",
    rating: 4.91,
    reviewCount: 203,
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Food & Drink",
    hostName: "Claire",
    isOriginal: true
  },
  {
    id: 6,
    title: "Watch a Tour stage with Vincent Lavenu",
    description: "Experience the Tour de France like never before with team manager Vincent Lavenu's expert commentary.",
    price: 125,
    duration: "4 hours",
    location: "Mont-Dore, France",
    rating: 4.87,
    reviewCount: 98,
    image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Sports",
    hostName: "Vincent",
    isOriginal: true
  }
];

export default function Experiences() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    "all",
    "Sports",
    "Design",
    "Food & Drink",
    "Arts & Culture",
    "Nature & Outdoors"
  ];

  const filteredExperiences = mockExperiences.filter(experience => {
    const matchesSearch = experience.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         experience.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || experience.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section with Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow max-w-2xl w-full">
            <div className="flex-1 px-6 py-3">
              <div className="text-xs font-medium text-black mb-1">Where</div>
              <Input
                placeholder="Search destinations"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 p-0 focus-visible:ring-0 placeholder:text-gray-400"
              />
            </div>
            <div className="border-l border-gray-300 flex-1 px-6 py-3">
              <div className="text-xs font-medium text-black mb-1">Date</div>
              <div className="text-sm text-gray-400">Add dates</div>
            </div>
            <div className="border-l border-gray-300 flex-1 px-6 py-3">
              <div className="text-xs font-medium text-black mb-1">Who</div>
              <div className="text-sm text-gray-400">Add guests</div>
            </div>
            <Button className="bg-[#E61E4D] hover:bg-[#D70466] text-white rounded-full w-12 h-12 mr-2" size="icon">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Airbnb Originals Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Airbnb Originals</h2>
            <Button variant="ghost" className="flex items-center gap-2 text-sm font-medium">
              Show all <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {filteredExperiences.filter(exp => exp.isOriginal).map((experience) => (
              <Card key={experience.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={experience.image}
                      alt={experience.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-3 left-3 bg-white text-black font-medium">
                      Original
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-sm mb-2 line-clamp-2">{experience.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{experience.location}</p>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 fill-current text-black" />
                      <span className="text-sm font-medium">{experience.rating}</span>
                      <span className="text-sm text-gray-600">({experience.reviewCount})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">From ${experience.price} / guest</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-6">
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
              {category === "all" ? "All categories" : category}
            </Button>
          ))}
        </div>

        {/* All Experiences Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredExperiences.map((experience) => (
            <Card key={experience.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={experience.image}
                    alt={experience.title}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  {experience.isOriginal && (
                    <Badge className="absolute top-3 left-3 bg-white text-black font-medium">
                      Original
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
                    <span className="text-sm font-medium">{experience.rating}</span>
                    <span className="text-sm text-gray-600">({experience.reviewCount})</span>
                  </div>
                  <h3 className="font-medium mb-2 line-clamp-2">{experience.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{experience.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">From ${experience.price} / guest</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredExperiences.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No experiences found matching your search.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}