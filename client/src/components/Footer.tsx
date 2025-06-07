import { Globe, Facebook, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const supportLinks = [
    "Help Center", "AirCover", "Anti-discrimination", 
    "Disability support", "Cancellation options", "Report neighborhood concern"
  ];

  const hostingLinks = [
    "Airbnb your home", "AirCover for Hosts", "Hosting resources",
    "Community forum", "Hosting responsibly"
  ];

  const airbnbLinks = [
    "Newsroom", "New features", "Careers", "Investors", "Gift cards"
  ];

  return (
    <footer className="bg-airbnb-light-gray border-t border-airbnb-light-border mt-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-medium text-airbnb-dark">Support</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="hover:underline transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-airbnb-dark">Hosting</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              {hostingLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="hover:underline transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-airbnb-dark">Airbnb</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              {airbnbLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="hover:underline transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="flex items-center space-x-2 text-sm font-medium text-airbnb-dark hover:underline p-0">
                <Globe className="h-4 w-4" />
                <span>English (US)</span>
              </Button>
              <Button variant="ghost" className="flex items-center space-x-2 text-sm font-medium text-airbnb-dark hover:underline p-0">
                <span>$ USD</span>
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-airbnb-dark hover:text-airbnb-red transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-airbnb-dark hover:text-airbnb-red transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-airbnb-dark hover:text-airbnb-red transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-airbnb-light-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 gap-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 mb-2 md:mb-0">
              <span>© 2024 Airbnb, Inc.</span>
              <a href="#" className="hover:underline">Privacy</a>
              <a href="#" className="hover:underline">Terms</a>
              <a href="#" className="hover:underline">Sitemap</a>
              <a href="#" className="hover:underline">Company details</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
