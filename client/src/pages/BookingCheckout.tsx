import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Star, Shield, Wifi, Car } from "lucide-react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Property } from "@shared/schema";

// Load Stripe - will check for environment variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

interface BookingData {
  propertyId: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  nights: number;
}

const CheckoutForm = ({ bookingData, property }: { bookingData: BookingData; property: Property }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create booking in database first
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const bookingResponse = await apiRequest("POST", "/api/bookings", {
        property_id: bookingData.propertyId,
        user_id: user.id,
        check_in_date: bookingData.checkIn,
        check_out_date: bookingData.checkOut,
        total_price: bookingData.totalPrice,
      });

      if (!bookingResponse.ok) {
        throw new Error("Failed to create booking");
      }

      // Confirm payment with Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking-confirmation`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Booking Confirmed!",
          description: "Your reservation has been confirmed and payment processed.",
        });
        setLocation("/booking-confirmation");
      }
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-4">Payment Information</h3>
        <PaymentElement />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-[#E61E4D] hover:bg-[#D70466] text-white py-3"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? "Processing..." : `Confirm and pay $${bookingData.totalPrice}`}
      </Button>
    </form>
  );
};

export default function BookingCheckout() {
  const [location] = useLocation();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  // Parse booking data from URL params or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get("propertyId");
    const checkIn = urlParams.get("checkIn");
    const checkOut = urlParams.get("checkOut");
    const guests = urlParams.get("guests");

    if (propertyId && checkIn && checkOut && guests) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      
      setBookingData({
        propertyId: parseInt(propertyId),
        checkIn,
        checkOut,
        guests: parseInt(guests),
        totalPrice: 0, // Will be calculated based on property price
        nights,
      });
    }
  }, [location]);

  // Fetch property data
  const { data: property, isLoading: propertyLoading } = useQuery({
    queryKey: ["/api/properties", bookingData?.propertyId],
    queryFn: () => apiRequest("GET", `/api/properties/${bookingData?.propertyId}`).then(res => res.json()),
    enabled: !!bookingData?.propertyId,
  });

  // Create payment intent when property data is loaded
  useEffect(() => {
    if (property && bookingData) {
      const totalPrice = parseInt(property.pricePerNight) * bookingData.nights;
      const updatedBookingData = { ...bookingData, totalPrice };
      setBookingData(updatedBookingData);

      // Create payment intent
      apiRequest("POST", "/api/create-payment-intent", { 
        amount: totalPrice,
        currency: "usd",
      })
        .then(res => res.json())
        .then(data => {
          setClientSecret(data.clientSecret);
        })
        .catch(error => {
          toast({
            title: "Payment Setup Error",
            description: "Failed to initialize payment. Please try again.",
            variant: "destructive",
          });
        });
    }
  }, [property, bookingData?.nights]);

  if (propertyLoading || !bookingData || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const serviceFee = Math.round(bookingData.totalPrice * 0.14);
  const cleaningFee = 50;
  const taxes = Math.round((bookingData.totalPrice + serviceFee + cleaningFee) * 0.08);
  const grandTotal = bookingData.totalPrice + serviceFee + cleaningFee + taxes;

  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Booking Form */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Confirm and pay</h1>
            <p className="text-gray-600">Your trip is protected by Airbnb Cover</p>
          </div>

          {/* Trip Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Your trip
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Dates</p>
                  <p className="text-gray-600">
                    {new Date(bookingData.checkIn).toLocaleDateString()} - {new Date(bookingData.checkOut).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Guests</p>
                  <p className="text-gray-600">{bookingData.guests} guest{bookingData.guests > 1 ? 's' : ''}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          {clientSecret && import.meta.env.VITE_STRIPE_PUBLIC_KEY ? (
            <Elements stripe={stripePromise} options={stripeOptions}>
              <CheckoutForm bookingData={bookingData} property={property} />
            </Elements>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-semibold mb-2">Payment Setup Required</h3>
                  <p className="text-gray-600 mb-4">
                    To process payments, Stripe integration needs to be configured with valid API keys.
                  </p>
                  <Button 
                    onClick={() => {
                      toast({
                        title: "Contact Admin",
                        description: "Please contact the administrator to set up payment processing.",
                      });
                    }}
                    variant="outline"
                  >
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Property Summary */}
        <div className="space-y-6">
          {/* Property Card */}
          <Card>
            <CardContent className="p-0">
              <div className="flex gap-4 p-6">
                <img
                  src={property.images?.[0] || "/placeholder.jpg"}
                  alt={property.title}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{property.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{property.propertyType} • {property.location}</p>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{property.rating}</span>
                    <span className="text-gray-600">({property.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Price details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>${property.pricePerNight} x {bookingData.nights} nights</span>
                <span>${bookingData.totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Cleaning fee</span>
                <span>${cleaningFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Service fee</span>
                <span>${serviceFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>${taxes}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total (USD)</span>
                <span>${grandTotal}</span>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>What this place offers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {property.amenities?.slice(0, 6).map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Wifi className="w-5 h-5 text-gray-600" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}