
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Search } from "lucide-react";
import HeroCarousel from "./hero-carousel";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LocationAutocomplete } from "@/components/location-autocomplete";

const HeroSection = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchDestination, setSearchDestination] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchDestination.trim()) {
      toast({
        title: "Please enter a destination",
        description: "Enter a location to explore travel options.",
        variant: "destructive",
      });
      return;
    }
    navigate(`/explore?destination=${encodeURIComponent(searchDestination.trim())}`);
  };

  return (
    <div className="relative w-full">
      {/* Carousel Hero */}
      <HeroCarousel />
      {/* Overlay Content */}
      <div className="container mx-auto px-4 relative z-10 -mt-28 sm:-mt-32 md:-mt-40">
        <div className="max-w-3xl mx-auto">
          {/* Search Bar */}
          <form 
            onSubmit={handleSearch}
            className="bg-white/90 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center mb-4 sm:mb-6 shadow-lg animate-fade-in backdrop-blur-sm gap-2 sm:gap-3"
          >
            <div className="flex-1 px-1 sm:px-2 py-1 sm:py-2">
              <LocationAutocomplete
                value={searchDestination}
                onChange={setSearchDestination}
                placeholder="Where would you like to go?"
                className="w-full border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                filterTypes={['(cities)']}
              />
            </div>
            <Button 
              type="submit"
              className="bg-trypie-600 hover:bg-trypie-700 text-white rounded-xl shadow-md px-4 sm:px-5 py-2 min-h-[40px] sm:min-h-[48px] flex items-center justify-center w-full sm:w-auto"
            >
              <Search size={18} className="mr-2" /> Explore
            </Button>
          </form>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-trypie-500 hover:bg-trypie-600 text-white font-medium shadow-md hover:shadow-lg rounded-xl transition-all px-6 sm:px-8 py-2 w-full sm:w-auto"
              asChild
            >
              <Link to="/plan-trip">
                Plan Your Trip
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-trypie-600 border-white text-white hover:bg-trypie-700 hover:border-trypie-400 shadow-md rounded-xl px-6 sm:px-8 py-2 w-full sm:w-auto"
              asChild
            >
              <Link to="/explore">
                Discover Experiences
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
