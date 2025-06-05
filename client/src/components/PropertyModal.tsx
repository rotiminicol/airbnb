import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Home, DoorOpen, Calendar, Wifi, Car, Utensils } from "lucide-react";
import { Property } from "@shared/schema";
import { useWishlist } from "@/hooks/useWishlist";
import { useState } from "react";

interface PropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PropertyModal({ property, isOpen, onClose }: PropertyModalProps) {
  const { isInWishlist, toggleWishlist, isUpdating } = useWishlist();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!property) return null;

  const inWishlist = isInWishlist(property.id);

  const handleWishlistClick = () => {
    toggleWishlist(property.id);
  };

  const handleBooking = () => {
    // In a real app, this would open a booking flow
    alert("Booking functionality would be implemented here");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 bg-white border-b border-airbnb-light-border p-4 flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-xl font-semibold text-airbnb-dark">
            {property.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              <img 
                src={property.images[currentImageIndex]} 
                alt={`${property.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-80 object-cover rounded-xl"
              />
              <div className="grid grid-cols-4 gap-2">
                {property.images.slice(0, 4).map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`${property.title} - Thumbnail ${index + 1}`}
                    className={`w-full h-16 object-cover rounded cursor-pointer transition-opacity duration-200 ${
                      currentImageIndex === index ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
            
            {/* Property Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {property.rating && (
                      <>
                        <Star className="h-4 w-4 fill-black text-black" />
                        <span className="font-medium text-airbnb-dark">
                          {parseFloat(property.rating).toFixed(2)}
                        </span>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-500 underline cursor-pointer">
                          {property.reviewCount} review{property.reviewCount !== 1 ? 's' : ''}
                        </span>
                      </>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    onClick={handleWishlistClick}
                    disabled={isUpdating}
                    className="flex items-center space-x-2 text-airbnb-dark hover:text-airbnb-red transition-colors duration-200"
                  >
                    <Heart className={`h-4 w-4 ${inWishlist ? 'fill-airbnb-red text-airbnb-red' : ''}`} />
                    <span className="text-sm underline">
                      {inWishlist ? 'Saved' : 'Save'}
                    </span>
                  </Button>
                </div>
                <p className="text-gray-600">{property.location}</p>
              </div>
              
              <div className="border-t border-airbnb-light-border pt-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-airbnb-dark rounded-full flex items-center justify-center">
                    {property.hostAvatar ? (
                      <img 
                        src={property.hostAvatar} 
                        alt={property.hostName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm font-medium">
                        {property.hostName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-airbnb-dark">
                      Hosted by {property.hostName}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {property.hostIsSuperhost ? 'Superhost · ' : ''}4 years hosting
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Home className="text-airbnb-dark mt-1 h-5 w-5" />
                    <div>
                      <h5 className="font-medium text-airbnb-dark">
                        Entire {property.propertyType.toLowerCase()}
                      </h5>
                      <p className="text-sm text-gray-500">
                        You'll have the entire place to yourself
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <DoorOpen className="text-airbnb-dark mt-1 h-5 w-5" />
                    <div>
                      <h5 className="font-medium text-airbnb-dark">Self check-in</h5>
                      <p className="text-sm text-gray-500">
                        Check yourself in with the keypad
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calendar className="text-airbnb-dark mt-1 h-5 w-5" />
                    <div>
                      <h5 className="font-medium text-airbnb-dark">
                        {property.cancellationPolicy === 'flexible' ? 'Free cancellation' : 'Cancellation policy'}
                      </h5>
                      <p className="text-sm text-gray-500">
                        {property.cancellationPolicy === 'flexible' 
                          ? 'Cancel before check-in for a partial refund'
                          : `${property.cancellationPolicy} cancellation policy`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-airbnb-light-border pt-6">
                <h4 className="font-medium text-airbnb-dark mb-3">What this place offers</h4>
                <div className="grid grid-cols-2 gap-3">
                  {property.amenities.slice(0, 8).map((amenity, index) => {
                    const getAmenityIcon = (amenity: string) => {
                      const lower = amenity.toLowerCase();
                      if (lower.includes('wifi')) return <Wifi className="h-4 w-4" />;
                      if (lower.includes('parking') || lower.includes('car')) return <Car className="h-4 w-4" />;
                      if (lower.includes('kitchen') || lower.includes('food')) return <Utensils className="h-4 w-4" />;
                      return <Home className="h-4 w-4" />;
                    };

                    return (
                      <div key={index} className="flex items-center space-x-3">
                        <span className="text-airbnb-dark">
                          {getAmenityIcon(amenity)}
                        </span>
                        <span className="text-sm text-airbnb-dark">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-airbnb-light-border pt-6">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {property.description}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Booking Card */}
        <div className="sticky bottom-0 bg-white border-t border-airbnb-light-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-semibold text-airbnb-dark">
                  ${parseFloat(property.pricePerNight).toLocaleString()}
                </span>
                <span className="text-gray-500">night</span>
              </div>
              {property.rating && (
                <div className="flex items-center space-x-1 text-sm">
                  <Star className="h-3 w-3 fill-black text-black" />
                  <span className="text-airbnb-dark">
                    {parseFloat(property.rating).toFixed(2)}
                  </span>
                  <span className="text-gray-500">·</span>
                  <span className="text-gray-500 underline">
                    {property.reviewCount} review{property.reviewCount !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
            <Button 
              onClick={handleBooking}
              className="bg-airbnb-red text-white px-8 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors duration-200"
            >
              Reserve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
