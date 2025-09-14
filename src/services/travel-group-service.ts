
import {
  createGroup,
  fetchMyGroups,
  fetchExploreGroups,
  fetchInfluencerTrips,
  fetchGroupById,
  joinGroup,
  leaveGroup,
  updateGroup
} from './travel-group-service-groups';

import {
  fetchGroupMembers,
  inviteMember,
  removeMember,
  fetchMemberDetails
} from './travel-group-service-members';

import {
  fetchMessages,
  sendMessage,
  subscribeToGroupMessages,
  subscribeToGroupChanges
} from './travel-group-service-messages';

import {
  fetchGroupExpenses,
  createExpense,
  updateExpenseShare,
  updateExpense,
  deleteExpense,
  fetchExpenseShares,
  createExpenseShare,
  deleteExpenseShare
} from './travel-group-service-expenses';

import {
  fetchGroupItineraries,
  createItinerary,
  updateItinerary,
  deleteItinerary
} from './travel-group-service-itinerary';

import {
  acceptGroupInvitation
} from './travel-group-service-invitations';

// Helper function to get appropriate image based on location
export function getDestinationImage(destination: string): string {
  // Map common destinations to specific images
  const destinationKeywords: Record<string, string> = {
    'beach': 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80',
    'mountain': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80',
    'forest': 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80',
    'city': 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80',
    'island': 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&q=80',
    'desert': 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&q=80',
    'lake': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80',
    'river': 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80',
    'waterfall': 'https://images.unsplash.com/photo-1455577380025-4321f1e1dca7?auto=format&fit=crop&q=80',
  };

  // India-specific locations
  const indiaLocations: Record<string, string> = {
    'delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80',
    'mumbai': 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&q=80',
    'jaipur': 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&q=80',
    'goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80',
    'kerala': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80',
    'agra': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80',
    'varanasi': 'https://images.unsplash.com/photo-1561361058-c24e021e299f?auto=format&fit=crop&q=80',
    'darjeeling': 'https://images.unsplash.com/photo-1544634076-a75b7a808008?auto=format&fit=crop&q=80',
    'ladakh': 'https://images.unsplash.com/photo-1587922546925-ab57ef2aa006?auto=format&fit=crop&q=80',
    'himalayas': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80',
    'rajasthan': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80',
    'manali': 'https://images.unsplash.com/photo-1580977251946-3f45a0276f53?auto=format&fit=crop&q=80',
    'pondicherry': 'https://images.unsplash.com/photo-1582650349366-cf2e30d95298?auto=format&fit=crop&q=80',
    'kolkata': 'https://images.unsplash.com/photo-1586183189334-1393e5f2cef7?auto=format&fit=crop&q=80',
  };
  
  // Default images by region
  const defaultImagesByRegion: Record<string, string> = {
    'india': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80',
    'europe': 'https://images.unsplash.com/photo-1519677584237-752f8853252e?auto=format&fit=crop&q=80',
    'asia': 'https://images.unsplash.com/photo-1535139262971-c51845709a48?auto=format&fit=crop&q=80',
    'usa': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80',
    'africa': 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&q=80',
    'australia': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80',
    'south america': 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&q=80',
  };

  // Fallback images for variety
  const fallbackImages = [
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80', // river and waterfall
    'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&q=80', // mountains and river
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&q=80', // forest
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80', // mountains
    'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?auto=format&fit=crop&q=80', // rocky mountains
  ];

  // Normalize the destination string for comparison
  const normalizedDestination = destination.toLowerCase();

  // First check for exact India location matches
  for (const [keyword, imageUrl] of Object.entries(indiaLocations)) {
    if (normalizedDestination.includes(keyword)) {
      return imageUrl;
    }
  }
  
  // Then check for general destination type matches
  for (const [keyword, imageUrl] of Object.entries(destinationKeywords)) {
    if (normalizedDestination.includes(keyword)) {
      return imageUrl;
    }
  }

  // Then check for region matches
  for (const [region, imageUrl] of Object.entries(defaultImagesByRegion)) {
    if (normalizedDestination.includes(region)) {
      return imageUrl;
    }
  }

  // If no match found, use a deterministic approach based on the destination string
  // Create a simple hash from the destination string to pick a consistent image
  let hash = 0;
  for (let i = 0; i < destination.length; i++) {
    hash = ((hash << 5) - hash) + destination.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  // Use absolute value and modulo to get an index in the fallbackImages array
  const index = Math.abs(hash) % fallbackImages.length;
  return fallbackImages[index];
}

// Additional group settings function
export async function updateGroupSettings(
  groupId: string, 
  settings: { title?: string; description?: string; isPublic?: boolean; imageUrl?: string; destination?: string }
): Promise<TravelGroup> {
  return updateGroup(groupId, {
    title: settings.title,
    description: settings.description,
    is_public: settings.isPublic,
    image_url: settings.imageUrl,
    destination: settings.destination
  });
}

// Helper function for inviting users with better error handling
export async function inviteUserToGroup(
  groupId: string, 
  email: string
): Promise<{ success: boolean; message: string; inviteUrl?: string }> {
  if (!email || !email.includes('@')) {
    return { success: false, message: "Please enter a valid email address" };
  }
  
  try {
    // Get the current user and group details
    const { data: userData } = await supabase.auth.getUser();
    const { data: group } = await supabase
      .from('travel_groups')
      .select('title')
      .eq('id', groupId)
      .single();
    
    if (!userData.user || !group) {
      return { success: false, message: "Unable to send invitation" };
    }
    
    // Get the sender's name
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userData.user.id)
      .single();
    
    const inviterName = profile?.full_name || "A Trypie user";
    
    // Call the edge function to send the invitation
    const response = await fetch(`${window.location.origin}/api/send-invitation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
      },
      body: JSON.stringify({
        email,
        groupId,
        groupName: group.title,
        inviterName
      })
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || "Failed to send invitation");
    }
    
    return { 
      success: true, 
      message: `Invitation sent to ${email}`,
      inviteUrl: result.inviteUrl
    };
  } catch (error: any) {
    console.error("Error inviting user to group:", error);
    return { 
      success: false, 
      message: error.message || "Failed to send invitation" 
    };
  }
}

// Re-export all functions for convenience
export {
  createGroup,
  fetchMyGroups,
  fetchExploreGroups,
  fetchInfluencerTrips,
  fetchGroupById,
  joinGroup,
  leaveGroup,
  updateGroup,

  fetchGroupMembers,
  inviteMember,
  removeMember,
  fetchMemberDetails,

  fetchMessages,
  sendMessage,
  subscribeToGroupMessages,
  subscribeToGroupChanges,

  fetchGroupExpenses,
  createExpense,
  updateExpenseShare,
  updateExpense,
  deleteExpense,
  fetchExpenseShares,
  createExpenseShare,
  deleteExpenseShare,

  fetchGroupItineraries,
  createItinerary,
  updateItinerary,
  deleteItinerary,
  
  acceptGroupInvitation
};

// Import necessary types for the functions we defined directly in this file
import { TravelGroup } from "@/types/travel-group-types";
import { supabase } from "@/integrations/supabase/client";
