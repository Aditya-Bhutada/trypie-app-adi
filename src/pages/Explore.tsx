import React, { useEffect, useState } from "react";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Calendar, Globe, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocationAutocomplete } from "@/components/location-autocomplete";
import { Input } from "@/components/ui/input";

interface DestinationInfo {
  name: string;
  description: string;
  highlights: Array<{ name: string; description: string }> | string[];
  bestTimeToVisit?: string;
  localCuisine?: Array<{ dish: string; description: string }>;
  travelTips?: string[];
  images?: string[];
}

const Explore = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchDestination, setSearchDestination] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [destinationInfo, setDestinationInfo] = useState<DestinationInfo | null>(null);

  // Extract search parameter from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const destination = searchParams.get("destination");
    
    if (destination) {
      setSearchDestination(destination);
      fetchDestinationInfo(destination);
    }
  }, [location.search]);

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

  const fetchDestinationInfo = async (destination: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-destination-info', {
        body: JSON.stringify({ destination })
      });
      
      if (error) throw error;
      
      console.log("API Response:", data);
      setDestinationInfo(data);
    } catch (error) {
      console.error("Error fetching destination information:", error);
      toast({
        title: "Error fetching destination information",
        description: "We couldn't load information for this destination. Please try again later.",
        variant: "destructive"
      });
      
      // Set some placeholder data
      setDestinationInfo({
        name: destination,
        description: `Explore the wonders of ${destination}. Information about this destination will be available soon.`,
        highlights: ["Local attractions", "Cultural experiences", "Food and cuisine"]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderHighlights = () => {
    if (!destinationInfo?.highlights) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Highlights</h3>
        <ul className="list-disc pl-5 space-y-2">
          {Array.isArray(destinationInfo.highlights) && 
            destinationInfo.highlights.map((highlight, index) => (
              <li key={index} className="text-gray-600">
                {typeof highlight === 'string' ? 
                  highlight : 
                  <div>
                    <span className="font-medium">{highlight.name}</span>: {highlight.description}
                  </div>
                }
              </li>
            ))
          }
        </ul>
      </div>
    );
  };

  const renderCuisine = () => {
    if (!destinationInfo?.localCuisine) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Local Cuisine</h3>
        <ul className="list-disc pl-5 space-y-2">
          {destinationInfo.localCuisine.map((item, index) => (
            <li key={index} className="text-gray-600">
              <span className="font-medium">{item.dish}</span>: {item.description}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderTravelTips = () => {
    if (!destinationInfo?.travelTips) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Travel Tips</h3>
        <ul className="list-disc pl-5 space-y-1">
          {destinationInfo.travelTips.map((tip, index) => (
            <li key={index} className="text-gray-600">{tip}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderBestTimeToVisit = () => {
    if (!destinationInfo?.bestTimeToVisit) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Best Time to Visit</h3>
        <p className="text-gray-600">{destinationInfo.bestTimeToVisit}</p>
      </div>
    );
  };

  const renderImages = () => {
    if (!destinationInfo?.images || destinationInfo.images.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Images</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {destinationInfo.images.slice(0, 3).map((image, index) => (
            <div key={index} className="aspect-video rounded-md overflow-hidden">
              <img 
                src={image} 
                alt={`${destinationInfo.name || searchDestination} - Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          {searchDestination ? (
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  Explore {searchDestination}
                </h1>

                <form onSubmit={handleSearch} className="flex w-full md:w-auto">
                  <div className="relative flex-grow md:w-64">
                    <LocationAutocomplete
                      value={searchDestination}
                      onChange={setSearchDestination}
                      placeholder="Search another destination"
                      className="w-full"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="ml-2 bg-trypie-600 hover:bg-trypie-700"
                  >
                    <Search size={18} />
                  </Button>
                </form>
              </div>
              
              {isLoading ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
                    <div className="h-32 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ) : destinationInfo ? (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    About {destinationInfo.name || searchDestination}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {destinationInfo.description || `Discover the wonders of ${searchDestination}.`}
                  </p>
                  
                  {renderImages()}
                  {renderHighlights()}
                  {renderBestTimeToVisit()}
                  {renderCuisine()}
                  {renderTravelTips()}
                  
                  <div className="flex justify-center mt-8">
                    <Button 
                      className="bg-trypie-500 hover:bg-trypie-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      asChild
                    >
                      <a href="/plan-trip">
                        Plan a trip to {destinationInfo.name || searchDestination}
                      </a>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <p>No information available for {searchDestination}.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Explore Amazing Destinations
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Search for a destination to get started.
              </p>
              
              <div className="max-w-md mx-auto mb-8">
                <form onSubmit={handleSearch} className="flex">
                  <LocationAutocomplete
                    value={searchDestination}
                    onChange={setSearchDestination}
                    placeholder="Where would you like to explore?"
                    className="w-full"
                  />
                  <Button
                    type="submit"
                    className="ml-2 bg-trypie-600 hover:bg-trypie-700"
                  >
                    <Search size={18} />
                  </Button>
                </form>
              </div>
              
              <Button 
                className="bg-trypie-500 hover:bg-trypie-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                asChild
              >
                <a href="/">
                  Back to Home
                </a>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Explore;
