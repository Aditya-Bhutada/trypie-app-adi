
import React, { useState } from "react";
import { Calendar, IndianRupee, MapPin, Plane, CalendarCheck, Save, SaveOff } from "lucide-react";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { toast } from "sonner";
import { format, isSameDay, parse } from "date-fns";

// Define types for our data
type Holiday = {
  date: string;
  day: string;
  name: string;
  type: "public" | "optional";
};

type Destination = {
  name: string;
  location: string;
  description: string;
  priceRange: string;
  imageUrl: string;
};

type LongWeekend = {
  startDate: string;
  endDate: string;
  totalDays: number;
  holidays: Holiday[];
  optionalLeaveDays: string[];
  destinations: Destination[];
};

type MonthData = {
  month: string;
  holidays: Holiday[];
  longWeekends: LongWeekend[];
};

// Helper to parse display-only date strings ("January 1", "February 26", etc) into actual Date objects for 2025
function parseToDate(dateStr: string): Date {
  return parse(dateStr + " 2025", "MMMM d yyyy", new Date(2025, 0, 1));
}

import SavedCalendar from "@/components/SavedCalendar";

const LongWeekends = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [reminderSet, setReminderSet] = useState<Record<string, boolean>>({});

  // Holiday and Long Weekend data for 2025 (Indian context)
  const calendarData: MonthData[] = [
    {
      month: "January",
      holidays: [
        { date: "January 1", day: "Wednesday", name: "New Year's Day", type: "public" },
        { date: "January 26", day: "Sunday", name: "Republic Day", type: "public" },
      ],
      longWeekends: [
        {
          startDate: "January 1",
          endDate: "January 5",
          totalDays: 5,
          holidays: [{ date: "January 1", day: "Wednesday", name: "New Year's Day", type: "public" }],
          optionalLeaveDays: ["January 2", "January 3"],
          destinations: [
            {
              name: "Rann of Kutch",
              location: "Gujarat",
              description: "Experience the Rann Utsav festival with perfect winter weather at this stunning white salt desert.",
              priceRange: "₹15,000 - ₹25,000",
              imageUrl: "https://images.unsplash.com/photo-1593405844957-7e56ce7bdbbd?auto=format&fit=crop&q=80&w=500"
            },
            {
              name: "Auli",
              location: "Uttarakhand",
              description: "Perfect for skiing and winter sports with stunning Himalayan views.",
              priceRange: "₹18,000 - ₹30,000",
              imageUrl: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&q=80&w=500"
            },
            {
              name: "Gokarna",
              location: "Karnataka",
              description: "Beat the winter blues with beaches less crowded than Goa.",
              priceRange: "₹12,000 - ₹20,000",
              imageUrl: "https://images.unsplash.com/photo-1582560475093-ba66accbc095?auto=format&fit=crop&q=80&w=500"
            }
          ]
        }
      ]
    },
    {
      month: "February",
      holidays: [
        { date: "February 26", day: "Wednesday", name: "Maha Shivratri", type: "public" },
      ],
      longWeekends: [
        {
          startDate: "February 26",
          endDate: "March 2",
          totalDays: 5,
          holidays: [{ date: "February 26", day: "Wednesday", name: "Maha Shivratri", type: "public" }],
          optionalLeaveDays: ["February 27", "February 28"],
          destinations: [
            {
              name: "Varanasi",
              location: "Uttar Pradesh",
              description: "Experience Maha Shivratri celebrations at one of the oldest living cities in the world.",
              priceRange: "₹10,000 - ₹18,000",
              imageUrl: "https://images.unsplash.com/photo-1561361058-c25c9ae48d6c?auto=format&fit=crop&q=80&w=500"
            },
            {
              name: "Rishikesh",
              location: "Uttarakhand",
              description: "Spiritual retreat with riverside yoga and meditation experiences.",
              priceRange: "₹12,000 - ₹20,000",
              imageUrl: "https://images.unsplash.com/photo-1544783069-9a2bf788314e?auto=format&fit=crop&q=80&w=500"
            }
          ]
        }
      ]
    },
    {
      month: "March",
      holidays: [
        { date: "March 14", day: "Friday", name: "Holi", type: "public" },
        { date: "March 31", day: "Monday", name: "Ramzan Id/Eid-ul-Fitar", type: "public" },
      ],
      longWeekends: [
        {
          startDate: "March 14",
          endDate: "March 16",
          totalDays: 3,
          holidays: [{ date: "March 14", day: "Friday", name: "Holi", type: "public" }],
          optionalLeaveDays: [],
          destinations: [
            {
              name: "Mathura & Vrindavan",
              location: "Uttar Pradesh",
              description: "Experience the most authentic and vibrant Holi celebrations in India.",
              priceRange: "₹8,000 - ₹15,000",
              imageUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=500"
            },
            {
              name: "Jaipur",
              location: "Rajasthan",
              description: "Celebrate Holi with traditional Rajasthani folk performances and royal heritage.",
              priceRange: "₹12,000 - ₹22,000",
              imageUrl: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&q=80&w=500"
            }
          ]
        },
        {
          startDate: "March 29",
          endDate: "March 31",
          totalDays: 3,
          holidays: [{ date: "March 31", day: "Monday", name: "Ramzan Id/Eid-ul-Fitar", type: "public" }],
          optionalLeaveDays: [],
          destinations: [
            {
              name: "Hyderabad",
              location: "Telangana",
              description: "Explore the city's rich Islamic heritage and enjoy Eid festivities and cuisine.",
              priceRange: "₹9,000 - ₹16,000",
              imageUrl: "https://images.unsplash.com/photo-1588416499018-d8c621effdb7?auto=format&fit=crop&q=80&w=500"
            },
            {
              name: "Lucknow",
              location: "Uttar Pradesh",
              description: "Experience the city of Nawabs with its renowned Eid celebrations and culinary delights.",
              priceRange: "₹8,000 - ₹15,000",
              imageUrl: "https://images.unsplash.com/photo-1586183189334-1fc6b5ed7cc7?auto=format&fit=crop&q=80&w=500"
            }
          ]
        }
      ]
    },
    {
      month: "April",
      holidays: [
        { date: "April 6", day: "Sunday", name: "Rama Navami", type: "public" },
        { date: "April 10", day: "Thursday", name: "Mahavir Jayanti", type: "public" },
        { date: "April 18", day: "Friday", name: "Good Friday", type: "public" },
      ],
      longWeekends: [
        {
          startDate: "April 10",
          endDate: "April 13",
          totalDays: 4,
          holidays: [{ date: "April 10", day: "Thursday", name: "Mahavir Jayanti", type: "public" }],
          optionalLeaveDays: ["April 11"],
          destinations: [
            {
              name: "Palitana",
              location: "Gujarat",
              description: "Visit the sacred Jain temples during Mahavir Jayanti.",
              priceRange: "₹10,000 - ₹18,000",
              imageUrl: "https://images.unsplash.com/photo-1596020493791-8e4f8febd7cc?auto=format&fit=crop&q=80&w=500"
            },
            {
              name: "Mount Abu",
              location: "Rajasthan",
              description: "Visit the beautiful Dilwara Temples and enjoy the cool hill station weather.",
              priceRange: "₹12,000 - ₹20,000",
              imageUrl: "https://images.unsplash.com/photo-1586183189334-1fc6b5ed7cc7?auto=format&fit=crop&q=80&w=500"
            }
          ]
        },
        {
          startDate: "April 18",
          endDate: "April 20",
          totalDays: 3,
          holidays: [{ date: "April 18", day: "Friday", name: "Good Friday", type: "public" }],
          optionalLeaveDays: [],
          destinations: [
            {
              name: "Goa",
              location: "Goa",
              description: "Experience Easter celebrations at the beautiful churches and beaches of Goa.",
              priceRange: "₹15,000 - ₹25,000",
              imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=500"
            },
            {
              name: "Pondicherry",
              location: "Tamil Nadu",
              description: "Enjoy the French colonial architecture and spiritual ambiance during Easter.",
              priceRange: "₹12,000 - ₹20,000",
              imageUrl: "https://images.unsplash.com/photo-1609866507216-78211968ed9c?auto=format&fit=crop&q=80&w=500"
            }
          ]
        }
      ]
    },
    {
      month: "May",
      holidays: [
        { date: "May 12", day: "Monday", name: "Buddha Purnima/Vesak", type: "public" },
      ],
      longWeekends: [
        {
          startDate: "May 10",
          endDate: "May 12",
          totalDays: 3,
          holidays: [{ date: "May 12", day: "Monday", name: "Buddha Purnima/Vesak", type: "public" }],
          optionalLeaveDays: [],
          destinations: [
            {
              name: "Bodh Gaya",
              location: "Bihar",
              description: "Visit the place of Buddha's enlightenment during Buddha Purnima.",
              priceRange: "₹8,000 - ₹15,000",
              imageUrl: "https://images.unsplash.com/photo-1557234419-f27092ecee34?auto=format&fit=crop&q=80&w=500"
            },
            {
              name: "Darjeeling",
              location: "West Bengal",
              description: "Enjoy the cool mountain air and Buddhist monasteries.",
              priceRange: "₹14,000 - ₹22,000",
              imageUrl: "https://images.unsplash.com/photo-1622308644420-b20142dc993c?auto=format&fit=crop&q=80&w=500"
            }
          ]
        }
      ]
    },
    {
      month: "August",
      holidays: [
        { date: "August 15", day: "Friday", name: "Independence Day", type: "public" },
        { date: "August 16", day: "Saturday", name: "Janmashtami", type: "public" },
      ],
      longWeekends: [
        {
          startDate: "August 15",
          endDate: "August 17",
          totalDays: 3,
          holidays: [
            { date: "August 15", day: "Friday", name: "Independence Day", type: "public" },
            { date: "August 16", day: "Saturday", name: "Janmashtami", type: "public" }
          ],
          optionalLeaveDays: [],
          destinations: [
            {
              name: "Amritsar",
              location: "Punjab",
              description: "Experience patriotic fervor at the Wagah Border and visit the Golden Temple.",
              priceRange: "₹10,000 - ₹18,000",
              imageUrl: "https://images.unsplash.com/photo-1603091525243-62e6f616aa98?auto=format&fit=crop&q=80&w=500"
            },
            {
              name: "Mathura",
              location: "Uttar Pradesh",
              description: "Celebrate Janmashtami at Lord Krishna's birthplace with special rituals.",
              priceRange: "₹8,000 - ₹15,000",
              imageUrl: "https://images.unsplash.com/photo-1586687264432-a0059f50ca1f?auto=format&fit=crop&q=80&w=500"
            }
          ]
        }
      ]
    },
    {
      month: "October",
      holidays: [
        { date: "October 2", day: "Thursday", name: "Mahatma Gandhi Jayanti & Dussehra", type: "public" },
        { date: "October 20", day: "Monday", name: "Diwali/Deepavali", type: "public" },
      ],
      longWeekends: [
        {
          startDate: "October 2",
          endDate: "October 5",
          totalDays: 4,
          holidays: [{ date: "October 2", day: "Thursday", name: "Mahatma Gandhi Jayanti & Dussehra", type: "public" }],
          optionalLeaveDays: ["October 3"],
          destinations: [
            {
              name: "Mysore",
              location: "Karnataka",
              description: "Witness the magnificent Mysore Dussehra celebrations and illuminated palace.",
              priceRange: "₹12,000 - ₹20,000",
              imageUrl: "https://images.unsplash.com/photo-1600611232236-07fee4761886?auto=format&fit=crop&q=80&w=500"
            },
            {
              name: "Ahmedabad",
              location: "Gujarat",
              description: "Visit Gandhi Ashram and experience Navratri festivities.",
              priceRange: "₹9,000 - ₹16,000",
              imageUrl: "https://images.unsplash.com/photo-1570871303513-43a5bbf77044?auto=format&fit=crop&q=80&w=500"
            }
          ]
        },
        {
          startDate: "October 18",
          endDate: "October 20",
          totalDays: 3,
          holidays: [{ date: "October 20", day: "Monday", name: "Diwali/Deepavali", type: "public" }],
          optionalLeaveDays: [],
          destinations: [
            {
              name: "Jaipur",
              location: "Rajasthan",
              description: "Experience the Pink City beautifully illuminated during Diwali.",
              priceRange: "₹14,000 - ₹22,000",
              imageUrl: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=500"
            },
            {
              name: "Varanasi",
              location: "Uttar Pradesh",
              description: "Witness the spectacular Dev Deepawali celebrations along the ghats.",
              priceRange: "₹10,000 - ₹18,000",
              imageUrl: "https://images.unsplash.com/photo-1561361058-c25c9ae48d6c?auto=format&fit=crop&q=80&w=500"
            }
          ]
        }
      ]
    },
    {
      month: "November",
      holidays: [
        { date: "November 5", day: "Wednesday", name: "Guru Nanak Jayanti", type: "public" },
      ],
      longWeekends: [
        {
          startDate: "November 5",
          endDate: "November 9",
          totalDays: 5,
          holidays: [{ date: "November 5", day: "Wednesday", name: "Guru Nanak Jayanti", type: "public" }],
          optionalLeaveDays: ["November 6", "November 7"],
          destinations: [
            {
              name: "Amritsar",
              location: "Punjab",
              description: "Visit the Golden Temple during Guru Nanak Jayanti celebrations.",
              priceRange: "₹12,000 - ₹20,000",
              imageUrl: "https://images.unsplash.com/photo-1603091525243-62e6f616aa98?auto=format&fit=crop&q=80&w=500"
            },
            {
              name: "McLeodganj",
              location: "Himachal Pradesh",
              description: "Experience the Himalayan beauty with pleasant November weather.",
              priceRange: "₹15,000 - ₹25,000",
              imageUrl: "https://images.unsplash.com/photo-1558452919-ca83aaba11b0?auto=format&fit=crop&q=80&w=500"
            }
          ]
        }
      ]
    },
    {
      month: "December",
      holidays: [
        { date: "December 25", day: "Thursday", name: "Christmas Day", type: "public" },
      ],
      longWeekends: [
        {
          startDate: "December 25",
          endDate: "December 28",
          totalDays: 4,
          holidays: [{ date: "December 25", day: "Thursday", name: "Christmas Day", type: "public" }],
          optionalLeaveDays: ["December 26"],
          destinations: [
            {
              name: "Goa",
              location: "Goa",
              description: "Experience the festive Christmas and New Year celebrations on the beach.",
              priceRange: "₹20,000 - ₹35,000",
              imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=500"
            },
            {
              name: "Shimla",
              location: "Himachal Pradesh",
              description: "Enjoy a white Christmas in this beautiful Himalayan town.",
              priceRange: "₹18,000 - ₹30,000",
              imageUrl: "https://images.unsplash.com/photo-1551993188-06ec2fa3ac0d?auto=format&fit=crop&q=80&w=500"
            },
            {
              name: "Andaman Islands",
              location: "Andaman & Nicobar",
              description: "Perfect time to visit with pleasant weather for beach activities.",
              priceRange: "₹25,000 - ₹40,000",
              imageUrl: "https://images.unsplash.com/photo-1589179447585-2e1c4a8016bd?auto=format&fit=crop&q=80&w=500"
            }
          ]
        }
      ]
    }
  ];

  // Function to handle setting reminders
  const handleSetReminder = (longWeekend: LongWeekend) => {
    const key = `${longWeekend.startDate}-${longWeekend.endDate}`;
    setReminderSet(prev => ({...prev, [key]: true}));
    
    toast.success("Reminder set!", {
      description: `We'll notify you 30 days before ${longWeekend.startDate} to plan your trip.`,
      duration: 3000,
      position: "bottom-center",
    });
  };

  // Function to filter months based on active tab
  const getFilteredMonths = () => {
    if (activeTab === "all") {
      return calendarData;
    }
    
    // Filter months with long weekends
    if (activeTab === "long-weekends") {
      return calendarData.filter(month => month.longWeekends.length > 0);
    }
    
    // Filter by quarter
    const quarterMap: Record<string, string[]> = {
      "q1": ["January", "February", "March"],
      "q2": ["April", "May", "June"],
      "q3": ["July", "August", "September"],
      "q4": ["October", "November", "December"]
    };
    
    return calendarData.filter(month => quarterMap[activeTab]?.includes(month.month));
  };

  const filteredMonths = getFilteredMonths();

  // All important date objects to highlight in the small calendar
  const allHighlightDates: Date[] = React.useMemo(() => {
    const dates: Date[] = [];
    calendarData.forEach(month => {
      month.holidays.forEach(h => {
        // parse holiday date as Date for 2025
        const dateObj = parseToDate(h.date);
        if (!isNaN(dateObj.getTime())) dates.push(dateObj);
      });
      month.longWeekends.forEach(lw => {
        // long weekend public holidays and suggestion leave days
        lw.holidays.forEach(h => {
          const d = parseToDate(h.date);
          if (!isNaN(d.getTime())) dates.push(d);
        });
        lw.optionalLeaveDays.forEach(l => {
          const d = parseToDate(l);
          if (!isNaN(d.getTime())) dates.push(d);
        });
      });
    });
    return dates;
  }, [calendarData]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          {/* Hero Banner */}
          <div className="relative rounded-lg overflow-hidden mb-8 bg-gradient-to-r from-trypie-600 to-trypie-700 text-white">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="relative z-10 p-6 md:p-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">2025 Long Weekends & Holiday Calendar</h1>
              <p className="text-lg md:text-xl text-white/90 mb-4 max-w-2xl">
                Plan ahead and make the most of your time off! Discover all potential long weekends and the best destinations to visit.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-green-500 hover:bg-green-600">Public Holidays</Badge>
                <Badge className="bg-red-500 hover:bg-red-600">Long Weekends</Badge>
                <Badge className="bg-yellow-500 hover:bg-yellow-600 text-gray-800">Suggested Leave Days</Badge>
              </div>
              <div className="mt-6">
                <Button variant="secondary" size="lg" asChild>
                  <Link to="/plan-trip">
                    <Plane className="mr-2" size={18} />
                    Start Planning Your Trip
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Holiday Calendar</h2>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="long-weekends">Long Weekends</TabsTrigger>
                <TabsTrigger value="q1">Jan-Mar</TabsTrigger>
                <TabsTrigger value="q2">Apr-Jun</TabsTrigger>
                <TabsTrigger value="q3">Jul-Sep</TabsTrigger>
                <TabsTrigger value="q4">Oct-Dec</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
          
          {/* Calendar Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Calendar breakdown (spans 2 columns on desktop) */}
            <div className="md:col-span-2 space-y-6">
              {filteredMonths.map((month) => (
                <Card key={month.month} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-trypie-50 to-white pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-trypie-600" />
                      {month.month}
                    </CardTitle>
                    <CardDescription>
                      {month.holidays.length} {month.holidays.length === 1 ? 'holiday' : 'holidays'}, {month.longWeekends.length} {month.longWeekends.length === 1 ? 'long weekend' : 'long weekends'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {/* Holidays List */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">HOLIDAYS</h4>
                      <ul className="space-y-2">
                        {month.holidays.map((holiday) => (
                          <li key={holiday.date} className="flex items-start gap-2">
                            <Badge variant="outline" className={holiday.type === 'public' ? 'border-green-500 text-green-600' : 'border-yellow-500 text-yellow-600'}>
                              {holiday.date}
                            </Badge>
                            <span>{holiday.name}</span>
                            {/* Add quick-save button for each holiday */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-2 px-2"
                              title="Save to Calendar"
                              onClick={() => {
                                // Quick-add this holiday to preferences in SavedCalendar
                                const dateObj = parseToDate(holiday.date);
                                if (!isNaN(dateObj.getTime())) {
                                  const prev = JSON.parse(localStorage.getItem("trypie_saved_calendar_days") || "[]");
                                  if (!prev.includes(dateObj.toISOString())) {
                                    localStorage.setItem("trypie_saved_calendar_days", JSON.stringify([...prev, dateObj.toISOString()]));
                                    toast("Saved preference", { description: holiday.date + " (" + holiday.name + ")", icon: <Save className="text-green-600" /> });
                                    window.dispatchEvent(new Event("storage")); // update SavedCalendar
                                  } else {
                                    toast("Already in preferences");
                                  }
                                }
                              }}
                            >
                              <Save className="h-4 w-4 text-green-600" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {month.longWeekends.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">LONG WEEKENDS</h4>
                        {month.longWeekends.map((weekend, idx) => (
                          <div key={`${month.month}-weekend-${idx}`} className="border rounded-md p-3 mb-4 bg-gray-50">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <Badge className="bg-red-500 mb-2">
                                  {weekend.startDate} - {weekend.endDate} ({weekend.totalDays} days)
                                </Badge>
                                <div className="text-sm">
                                  <strong>Holidays:</strong> {weekend.holidays.map(h => h.name).join(', ')}
                                </div>
                                {weekend.optionalLeaveDays.length > 0 && (
                                  <div className="text-sm flex gap-2 items-center">
                                    <strong>Take leave on:</strong>
                                    {weekend.optionalLeaveDays.map((date) => (
                                      <React.Fragment key={date}>
                                        <span className="text-yellow-600">{date}</span>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="px-1"
                                          title="Save suggested leave to Calendar"
                                          onClick={() => {
                                            // Quick-add this optional leave day to preferences
                                            const dateObj = parseToDate(date);
                                            if (!isNaN(dateObj.getTime())) {
                                              const prev = JSON.parse(localStorage.getItem("trypie_saved_calendar_days") || "[]");
                                              if (!prev.includes(dateObj.toISOString())) {
                                                localStorage.setItem("trypie_saved_calendar_days", JSON.stringify([...prev, dateObj.toISOString()]));
                                                toast("Saved suggestion", { description: date, icon: <Save className="text-green-600" /> });
                                                window.dispatchEvent(new Event("storage"));
                                              } else {
                                                toast("Already in preferences");
                                              }
                                            }
                                          }}
                                        >
                                          <Save className="h-4 w-4 text-yellow-500" />
                                        </Button>
                                      </React.Fragment>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-xs"
                                onClick={() => handleSetReminder(weekend)}
                                disabled={reminderSet[`${weekend.startDate}-${weekend.endDate}`]}
                              >
                                {reminderSet[`${weekend.startDate}-${weekend.endDate}`] ? 'Reminder Set' : 'Set Reminder'}
                              </Button>
                            </div>
                            
                            {/* Destination Recommendations */}
                            <div className="mt-4">
                              <h5 className="text-sm font-medium text-gray-500 mb-2">RECOMMENDED DESTINATIONS</h5>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {weekend.destinations.map((dest, i) => (
                                  <div key={`${dest.name}-${i}`} className="flex gap-3 bg-white p-2 rounded border">
                                    <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                      <img src={dest.imageUrl} alt={dest.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                      <h6 className="font-medium text-sm">{dest.name}</h6>
                                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                        <MapPin size={12} />
                                        {dest.location}
                                      </div>
                                      <p className="text-xs line-clamp-2">{dest.description}</p>
                                      <div className="flex items-center gap-1 text-xs mt-1 text-trypie-600">
                                        <IndianRupee size={12} />
                                        {dest.priceRange}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Calendar Widget (right sidebar) */}
            <div>
              <SavedCalendar highlightDates={allHighlightDates} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LongWeekends;
