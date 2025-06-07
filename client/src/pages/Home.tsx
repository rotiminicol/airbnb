import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import FiltersBar from "@/components/FiltersBar";
import PropertyCard from "@/components/PropertyCard";
import PropertyModal from "@/components/PropertyModal";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Property } from "@shared/schema";
import { SearchFilters } from "@/lib/types";

export default function Home() {
  const [, setLocation] = useLocation();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (selectedCategory) queryParams.append("category", selectedCategory);
  if (searchQuery) queryParams.append("search", searchQuery);

  const { data: properties = [], isLoading, error } = useQuery<Property[]>({
    queryKey: ["/api/properties", queryParams.toString()],
    queryFn: async () => {
      const url = `/api/properties${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      return response.json();
    },
  });

  const handleSearch = (filters: SearchFilters) => {
    setSearchQuery(filters.location);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setShowModal(true);
  };

  const handleShowMap = () => {
    setShowMap(!showMap);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSearch={handleSearch} />
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-airbnb-dark mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We're having trouble loading properties. Please try again.
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      <CategoryFilter 
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      <FiltersBar 
        onShowMap={handleShowMap}
        showMap={showMap}
      />
      
      <main className="max-w-screen-2xl mx-auto px-2 sm:px-4 md:px-6 lg:px-10 py-4 md:py-6">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 20 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="w-full h-64 rounded-xl" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <h2 className="text-2xl font-bold text-airbnb-dark mb-4">
              No properties found
            </h2>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters to find more places to stay.
            </p>
            <Button 
              onClick={() => {
                setSelectedCategory("");
                setSearchQuery("");
              }}
              variant="outline"
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onClick={() => handlePropertyClick(property)}
                />
              ))}
            </div>
            
            <div className="text-center mt-8 md:mt-12">
              <Button 
                className="bg-airbnb-dark text-white px-8 py-3 rounded-lg hover:bg-black transition-colors duration-200 font-medium"
                onClick={() => {
                  // In a real app, this would load more properties
                  alert("In a real app, this would load more properties");
                }}
              >
                Continue exploring
              </Button>
            </div>
          </>
        )}
      </main>

      <PropertyModal
        property={selectedProperty}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedProperty(null);
        }}
      />

      <Footer />
    </div>
  );
}
