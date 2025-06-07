import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Star, Heart, Share, Home, Users, Bed, Bath } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Property } from "@shared/schema";
import { useWishlist } from "@/hooks/useWishlist";
import { useState } from "react";

export default function PropertyDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { isInWishlist, toggleWishlist, isUpdating } = useWishlist();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: ["/api/properties", id],
    queryFn: async () => {
      const response = await fetch(`/api/properties/${id}`);
      if (!response.ok) {
        throw new Error('Property not found');
      }
      return response.json();
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
              <div className="h-80 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-airbnb-dark mb-4">
              Property not found
            </h2>
            <p className="text-gray-600 mb-6">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => setLocation("/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(property.id);

  const handleWishlistClick = () => {
    toggleWishlist(property.id);
  };

  const handleBooking = () => {
    alert("Booking functionality would be implemented here");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-screen-2xl mx-auto px-2 sm:px-6 lg:px-10 py-4 sm:py-8">
        {/* Back button and actions */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to results</span>
          </Button>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="flex items-center space-x-2">
              <Share className="h-4 w-4" />
              <span className="underline">Share</span>
            </Button>
            <Button
              variant="ghost"
              onClick={handleWishlistClick}
              disabled={isUpdating}
              className="flex items-center space-x-2"
            >
              <Heart className={`h-4 w-4 ${inWishlist ? 'fill-airbnb-red text-airbnb-red' : ''}`} />
              <span className="underline">{inWishlist ? 'Saved' : 'Save'}</span>
            </Button>
          </div>
        </div>

        {/* Property title */}
        <h1 className="text-3xl font-bold text-airbnb-dark mb-4">{property.title}</h1>
        
        {/* Property rating and location */}
        <div className="flex items-center space-x-4 mb-6">
          {property.rating && (
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-black text-black" />
              <span className="font-medium">{parseFloat(property.rating).toFixed(2)}</span>
              <span className="text-gray-500">·</span>
              <span className="underline">{property.reviewCount} reviews</span>
            </div>
          )}
          <span className="text-gray-500">·</span>
          <span className="underline text-airbnb-dark">{property.location}</span>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 rounded-xl overflow-hidden">
            <div className="lg:row-span-2">
              <img 
                src={property.images[currentImageIndex]} 
                alt={property.title}
                className="w-full h-96 lg:h-full object-cover cursor-pointer"
                onClick={() => setCurrentImageIndex(0)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {property.images.slice(1, 5).map((image, index) => (
                <img 
                  key={index + 1}
                  src={image} 
                  alt={`${property.title} - ${index + 2}`}
                  className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setCurrentImageIndex(index + 1)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Property details and booking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12">
          {/* Left column - Property details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Host info */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-airbnb-dark mb-2">
                  Entire {property.propertyType.toLowerCase()} hosted by {property.hostName}
                </h2>
                <div className="flex items-center space-x-2 text-gray-600">
                  <span>{property.maxGuests} guests</span>
                  <span>·</span>
                  <span>{property.bedrooms} bedroom{property.bedrooms !== 1 ? 's' : ''}</span>
                  <span>·</span>
                  <span>{property.bathrooms} bathroom{property.bathrooms !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-full overflow-hidden">
                {property.hostAvatar ? (
                  <img 
                    src={property.hostAvatar} 
                    alt={property.hostName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-airbnb-dark flex items-center justify-center">
                    <span className="text-white font-medium">
                      {property.hostName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Property highlights */}
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <Home className="h-6 w-6 text-airbnb-dark mt-1" />
                <div>
                  <h3 className="font-medium text-airbnb-dark">Entire home</h3>
                  <p className="text-gray-600">You'll have the {property.propertyType.toLowerCase()} to yourself.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Users className="h-6 w-6 text-airbnb-dark mt-1" />
                <div>
                  <h3 className="font-medium text-airbnb-dark">Enhanced Clean</h3>
                  <p className="text-gray-600">This host committed to Airbnb's 5-step enhanced cleaning process.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Bed className="h-6 w-6 text-airbnb-dark mt-1" />
                <div>
                  <h3 className="font-medium text-airbnb-dark">Self check-in</h3>
                  <p className="text-gray-600">Check yourself in with the lockbox.</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            <Separator />

            {/* Amenities */}
            <div>
              <h3 className="text-xl font-semibold text-airbnb-dark mb-4">What this place offers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3 py-2">
                    <div className="w-6 h-6 flex items-center justify-center">
                      {amenity.toLowerCase().includes('wifi') && <i className="fas fa-wifi text-airbnb-dark"></i>}
                      {amenity.toLowerCase().includes('pool') && <i className="fas fa-swimming-pool text-airbnb-dark"></i>}
                      {amenity.toLowerCase().includes('parking') && <i className="fas fa-car text-airbnb-dark"></i>}
                      {amenity.toLowerCase().includes('kitchen') && <i className="fas fa-utensils text-airbnb-dark"></i>}
                      {!['wifi', 'pool', 'parking', 'kitchen'].some(keyword => amenity.toLowerCase().includes(keyword)) && 
                       <i className="fas fa-check text-airbnb-dark"></i>}
                    </div>
                    <span className="text-airbnb-dark">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Booking card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-airbnb-border rounded-xl p-6 card-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-semibold text-airbnb-dark">
                    ${parseFloat(property.pricePerNight).toLocaleString()}
                  </span>
                  <span className="text-gray-500">night</span>
                </div>
                {property.rating && (
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-black text-black" />
                    <span className="font-medium">{parseFloat(property.rating).toFixed(2)}</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-500 underline">{property.reviewCount} reviews</span>
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 border border-airbnb-border rounded-lg overflow-hidden">
                  <div className="p-3 border-r border-airbnb-border">
                    <div className="text-xs font-medium text-black">CHECK-IN</div>
                    <div className="text-sm text-gray-500">Add date</div>
                  </div>
                  <div className="p-3">
                    <div className="text-xs font-medium text-black">CHECKOUT</div>
                    <div className="text-sm text-gray-500">Add date</div>
                  </div>
                </div>

                <div className="border border-airbnb-border rounded-lg p-3">
                  <div className="text-xs font-medium text-black">GUESTS</div>
                  <div className="text-sm text-gray-500">1 guest</div>
                </div>
              </div>

              <Button 
                onClick={handleBooking}
                className="w-full bg-airbnb-red text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors duration-200 mb-4"
              >
                Reserve
              </Button>

              <p className="text-center text-sm text-gray-500">You won't be charged yet</p>

              <div className="space-y-3 mt-6 pt-6 border-t border-airbnb-light-border">
                <div className="flex justify-between">
                  <span className="underline">${parseFloat(property.pricePerNight).toLocaleString()} x 5 nights</span>
                  <span>${(parseFloat(property.pricePerNight) * 5).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Cleaning fee</span>
                  <span>$75</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Service fee</span>
                  <span>$125</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total before taxes</span>
                  <span>${(parseFloat(property.pricePerNight) * 5 + 75 + 125).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
