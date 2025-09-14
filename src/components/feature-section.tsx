
import { MapPin, Star, Search, Users, Calendar, Compass } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: <Star className="h-8 w-8 sm:h-10 sm:w-10 text-coral-500" />,
    title: "Authentic Reviews",
    description: "Access real-time reviews from fellow travelers who've just returned from your destination.",
    color: "bg-gradient-to-br from-coral-50 to-coral-100",
    borderColor: "border-coral-200"
  },
  {
    icon: <Search className="h-8 w-8 sm:h-10 sm:w-10 text-trypie-500" />,
    title: "AI Recommendations",
    description: "Get personalized travel suggestions tailored to your unique preferences and interests.",
    color: "bg-gradient-to-br from-trypie-50 to-trypie-100",
    borderColor: "border-trypie-200"
  },
  {
    icon: <Users className="h-8 w-8 sm:h-10 sm:w-10 text-coral-500" />,
    title: "Travel Together",
    description: "Connect with like-minded travelers and join group trips to amazing destinations.",
    color: "bg-gradient-to-br from-coral-50 to-coral-100",
    borderColor: "border-coral-200"
  },
  {
    icon: <Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-trypie-500" />,
    title: "Smart Itineraries",
    description: "Build the perfect trip with AI-powered itinerary planning and easy group collaboration.",
    color: "bg-gradient-to-br from-trypie-50 to-trypie-100",
    borderColor: "border-trypie-200"
  },
  {
    icon: <MapPin className="h-8 w-8 sm:h-10 sm:w-10 text-coral-500" />,
    title: "Local Discoveries",
    description: "Uncover hidden gems and authentic experiences vetted by our community of travelers.",
    color: "bg-gradient-to-br from-coral-50 to-coral-100",
    borderColor: "border-coral-200"
  },
  {
    icon: <Compass className="h-8 w-8 sm:h-10 sm:w-10 text-trypie-500" />,
    title: "Travel Assistance",
    description: "Access 24/7 support with real-time updates, local tips, and emergency guidance.",
    color: "bg-gradient-to-br from-trypie-50 to-trypie-100",
    borderColor: "border-trypie-200"
  },
];

const FeatureSection = () => {
  return (
    <section className="py-10 md:py-16 bg-gradient-to-b from-white to-gray-50 w-full">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-12">
          <div className="inline-block rounded-full px-3 py-1 sm:px-4 sm:py-1.5 bg-trypie-100 text-trypie-600 font-medium mb-3 sm:mb-4">TRAVEL SMARTER</div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-trypie-600 via-trypie-500 to-coral-500 text-transparent bg-clip-text">
            Why Explorers Choose Trypie
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 px-2">
            Unlock a world of possibilities with our unique blend of community insights, AI technology, and social connections.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`border-2 ${feature.borderColor} shadow-md hover:shadow-lg transition-all duration-300 rounded-xl sm:rounded-2xl overflow-hidden h-full transform hover:-translate-y-1`}
            >
              <CardContent className={`p-4 sm:p-6 md:p-8 ${feature.color} h-full flex flex-col`}>
                <div className="mb-3 sm:mb-4 bg-white p-3 sm:p-4 rounded-xl inline-flex shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 flex-grow text-xs sm:text-sm md:text-base">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
