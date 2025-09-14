import { TravelGroup } from "@/types/travel-group-types";

// Replace existing samples with India-focus for influencer and explore groups:
export const sampleInfluencerTrips: TravelGroup[] = [
  {
    id: "sample-influencer-4",
    title: "Golden Temple Pilgrimage & Food Walk",
    destination: "Amritsar, Punjab, India",
    description: "Join food influencer @FlavoursOfPunjab on a spiritual and culinary journey through Amritsar. Visit the Golden Temple, sample legendary street food, and meet local chefs. Cultural walks, langar kitchen tours, and all experiences in INR.",
    start_date: "2025-08-20",
    end_date: "2025-08-26",
    capacity: 14,
    memberCount: 6,
    is_influencer_trip: true,
    is_public: true,
    creator_id: "sample-creator-punjab",
    created_at: new Date().toISOString(),
    image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
    organizer: {
      id: "sample-creator-punjab",
      fullName: "Simranjeet Kaur",
      avatarUrl: "https://randomuser.me/api/portraits/women/55.jpg",
      email: "simranjeet@punjabfoodwalks.com",
      createdAt: new Date().toISOString()
    }
  },
  {
    id: "sample-influencer-5",
    title: "Himalayan Yoga Trek",
    destination: "Rishikesh & Uttarkashi, India",
    description: "Practice yoga on the banks of the Ganges and trek to hidden Himalayan villages with wellness guru @YogaYatra. Includes river rafting, meditation, and local ashram stays. Indian rupee pricing throughout.",
    start_date: "2025-12-01",
    end_date: "2025-12-10",
    capacity: 10,
    memberCount: 5,
    is_influencer_trip: true,
    is_public: true,
    creator_id: "sample-creator-uttarakhand",
    created_at: new Date().toISOString(),
    image_url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&q=80",
    organizer: {
      id: "sample-creator-uttarakhand",
      fullName: "Ravi Joshi",
      avatarUrl: "https://randomuser.me/api/portraits/men/35.jpg",
      email: "ravi@yogayatra.in",
      createdAt: new Date().toISOString()
    }
  },
  {
    id: "sample-influencer-6",
    title: "Sundarbans Wildlife Odyssey",
    destination: "Sundarbans, West Bengal, India",
    description: "Wildlife filmmaker @IntoTheMangroves leads a photo safari in the Sundarbans forest. Spot Bengal tigers, river dolphins, and enjoy eco-friendly boat stays—all expenses transparent in INR.",
    start_date: "2025-02-05",
    end_date: "2025-02-14",
    capacity: 12,
    memberCount: 7,
    is_influencer_trip: true,
    is_public: true,
    creator_id: "sample-creator-bengal",
    created_at: new Date().toISOString(),
    image_url: "https://images.unsplash.com/photo-1465101178521-c1a9136a4fe8?auto=format&fit=crop&q=80",
    organizer: {
      id: "sample-creator-bengal",
      fullName: "Priya Biswas",
      avatarUrl: "https://randomuser.me/api/portraits/women/77.jpg",
      email: "priya@sundarbanswild.com",
      createdAt: new Date().toISOString()
    }
  }
];

// Sample explore groups centered on Indian cities, food and festivals:
export const sampleExploreGroups: TravelGroup[] = [
  {
    id: "sample-explore-4",
    title: "Durga Puja Kolkata Group",
    destination: "Kolkata, West Bengal, India",
    description: "Join us to explore the magical Durga Puja pandals in Kolkata and try incredible Bengali sweets. Perfect for festival fans and culture seekers.",
    start_date: "2025-10-18",
    end_date: "2025-10-27",
    capacity: 10,
    memberCount: 4,
    is_influencer_trip: false,
    is_public: true,
    creator_id: "sample-creator-kolkata",
    created_at: new Date().toISOString(),
    image_url: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=900&q=80",
    organizer: {
      id: "sample-creator-kolkata",
      fullName: "Arindam Chatterjee",
      avatarUrl: "https://randomuser.me/api/portraits/men/23.jpg",
      email: "arindam@bongconnect.com",
      createdAt: new Date().toISOString()
    }
  },
  {
    id: "sample-explore-5",
    title: "South Indian Temple Circuit",
    destination: "Madurai, Rameswaram & Kanchipuram, India",
    description: "History and spirituality await! Visit ancient temples, try Chettinad food, and enjoy group photo sessions. For culture and heritage buffs.",
    start_date: "2025-11-12",
    end_date: "2025-11-20",
    capacity: 8,
    memberCount: 3,
    is_influencer_trip: false,
    is_public: true,
    creator_id: "sample-creator-south",
    created_at: new Date().toISOString(),
    image_url: "https://images.unsplash.com/photo-1524492449090-305e4fa61b8e?auto=format&fit=crop&w=800&q=80",
    organizer: {
      id: "sample-creator-south",
      fullName: "Meena Pillai",
      avatarUrl: "https://randomuser.me/api/portraits/women/41.jpg",
      email: "meena@southadventures.in",
      createdAt: new Date().toISOString()
    }
  },
  {
    id: "sample-explore-6",
    title: "Goan Heritage and Seafood Trail",
    destination: "North & South Goa, India",
    description: "Sun, sand, seafood! Join this group to discover Goan churches, beaches, spice farms & authentic Goan thalis. All expenses in INR.",
    start_date: "2025-12-15",
    end_date: "2025-12-22",
    capacity: 9,
    memberCount: 6,
    is_influencer_trip: false,
    is_public: true,
    creator_id: "sample-creator-goa",
    created_at: new Date().toISOString(),
    image_url: "https://images.unsplash.com/photo-1508697014387-c88266bc2447?auto=format&fit=crop&w=800&q=80",
    organizer: {
      id: "sample-creator-goa",
      fullName: "Savio Fernandes",
      avatarUrl: "https://randomuser.me/api/portraits/men/19.jpg",
      email: "savio@exploregoa.in",
      createdAt: new Date().toISOString()
    }
  }
];
