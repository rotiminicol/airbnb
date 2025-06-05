import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import PropertyDetail from "@/pages/PropertyDetail";
import BookingCheckout from "@/pages/BookingCheckout";
import Experiences from "@/pages/Experiences";
import Services from "@/pages/Services";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/experiences" component={Experiences} />
      <Route path="/services" component={Services} />
      <Route path="/property/:id" component={PropertyDetail} />
      <Route path="/booking-checkout" component={BookingCheckout} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
