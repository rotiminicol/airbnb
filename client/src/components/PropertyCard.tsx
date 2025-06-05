import { Heart, Star } from "lucide-react";
import { Property } from "@shared/schema";
import { useWishlist } from "@/hooks/useWishlist";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
}

export default function PropertyCard({ property, onClick }: PropertyCardProps) {
  const { isInWishlist, toggleWishlist, isUpdating } = useWishlist();
  const inWishlist = isInWishlist(property.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(property.id);
  };

  return (
    <div className="property-card cursor-pointer group" onClick={onClick}>
      <div className="relative overflow-hidden rounded-xl mb-3">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="property-image w-full h-64 object-cover"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleWishlistClick}
          disabled={isUpdating}
          className="absolute top-3 right-3 w-7 h-7 bg-white bg-opacity-70 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200 p-0"
        >
          <Heart 
            className={`h-4 w-4 transition-colors duration-200 ${
              inWishlist 
                ? 'fill-airbnb-red text-airbnb-red' 
                : 'text-airbnb-dark hover:text-airbnb-red'
            }`}
          />
        </Button>
        
        {property.isGuestFavorite && (
          <Badge className="absolute bottom-3 left-3 bg-white text-black hover:bg-white">
            Guest favorite
          </Badge>
        )}
        
        {property.hostIsSuperhost && (
          <Badge className="absolute bottom-3 left-3 bg-white text-black hover:bg-white">
            Superhost
          </Badge>
        )}
        
        {property.hasUniqueStay && (
          <Badge className="absolute bottom-3 left-3 bg-white text-black hover:bg-white">
            Unique stay
          </Badge>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-airbnb-dark text-sm truncate">
            {property.location}
          </h3>
          {property.rating && (
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 fill-black text-black" />
              <span className="text-sm text-airbnb-dark">
                {parseFloat(property.rating).toFixed(2)}
              </span>
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-500 truncate">
          {property.propertyType} • {property.bedrooms} bedroom{property.bedrooms !== 1 ? 's' : ''}
        </p>
        
        <p className="text-sm text-gray-500">
          Available now
        </p>
        
        <div className="flex items-baseline space-x-1">
          <span className="font-medium text-airbnb-dark">
            ${parseFloat(property.pricePerNight).toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">night</span>
        </div>
      </div>
    </div>
  );
}
