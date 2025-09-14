
import { Calendar, CalendarCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardFooter
} from "@/components/ui/card";

const FeatureLongWeekends = () => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[16/9] w-full overflow-hidden relative group">
        <img 
          src="https://images.unsplash.com/photo-1599257532151-19f1d34dcd31?auto=format&fit=crop&q=80&w=500" 
          alt="India Calendar and Planning"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
          <div className="p-4 text-white">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              2025 Long Weekends & Holiday Calendar
            </h3>
            <p className="text-sm text-white/90">Plan your leaves strategically around public holidays</p>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            <span>12 Public Holidays</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
            <span>8+ Potential Long Weekends</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
            <span>Strategic Leave Planning</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 pb-4 pt-0">
        <Button asChild variant="outline" className="w-full">
          <Link to="/long-weekends" className="flex items-center justify-center">
            <CalendarCheck className="mr-2 h-4 w-4" />
            View Holiday Calendar
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeatureLongWeekends;
