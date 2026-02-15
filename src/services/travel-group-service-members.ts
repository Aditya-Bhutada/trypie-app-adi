
import { supabase } from "@/integrations/supabase/client";
import { GroupMember } from "@/types/travel-group-types";
import { Profile } from "@/types/auth-types";
import { sampleInfluencerTrips, sampleExploreGroups } from "./travel-group-service-samples";

// Helper function to map Supabase profile data to our Profile type  
const mapProfile = (profile: any): Profile | undefined => {
  if (!profile) return undefined;
  return {
    id: profile.id,
    fullName: profile.full_name || null,
    avatarUrl: profile.avatar_url || null,
    email: profile.email || "",
    createdAt: profile.created_at || new Date().toISOString(),
    bio: profile.bio || null,
    interests: profile.interests || null,
    websiteUrl: profile.website_url || null,
    instagramHandle: profile.instagram_handle || null,
    twitterHandle: profile.twitter_handle || null
  };
};

export async function fetchGroupMembers(groupId: string): Promise<GroupMember[]> {
  if (groupId.startsWith('sample-influencer-')) {
    const sampleGroup = sampleInfluencerTrips.find(group => group.id === groupId);
    if (sampleGroup && sampleGroup.organizer) {
      return [{
        id: `sample-member-${sampleGroup.id}`,
        user_id: sampleGroup.organizer.id,
        group_id: sampleGroup.id,
        joined_at: sampleGroup.created_at,
        role: 'organizer',
        profile: sampleGroup.organizer
      } as GroupMember];
    }
  }
  
  if (groupId.startsWith('sample-explore-')) {
    const sampleGroup = sampleExploreGroups.find(group => group.id === groupId);
    if (sampleGroup && sampleGroup.organizer) {
      return [{
        id: `sample-member-${sampleGroup.id}`,
        user_id: sampleGroup.organizer.id,
        group_id: sampleGroup.id,
        joined_at: sampleGroup.created_at,
        role: 'organizer',
        profile: sampleGroup.organizer
      } as GroupMember];
    }
  }
  
  const { data, error } = await supabase
    .from('group_members')
    .select('*')
    .eq('group_id', groupId);

  if (error) {
    console.error("Error fetching group members:", error);
    throw error;
  }

  // Fetch profiles separately
  const membersWithProfiles = await Promise.all(data.map(async (member) => {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', member.user_id)
      .single();
    
    return {
      ...member,
      profile: profileData ? mapProfile(profileData) : undefined
    } as GroupMember;
  }));

  return membersWithProfiles;
}

export async function fetchMemberDetails(userId: string, groupId: string): Promise<GroupMember | null> {
  if (!userId || !groupId) {
    return null;
  }

  if (groupId.startsWith('sample-')) {
    return {
      id: `sample-member-${groupId}-${userId}`,
      user_id: userId,
      group_id: groupId,
      joined_at: new Date().toISOString(),
      role: userId.includes('creator') ? 'organizer' : 'member',
      profile: {
        id: userId,
        fullName: userId.includes('creator') ? 'Sample Organizer' : 'Sample Member',
        avatarUrl: `https://i.pravatar.cc/150?u=${userId}`,
        email: `${userId}@example.com`,
        createdAt: new Date().toISOString()
      }
    } as GroupMember;
  }

  const { data, error } = await supabase
    .from('group_members')
    .select('*')
    .eq('group_id', groupId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching member details:", error);
    throw error;
  }

  if (!data) {
    return null;
  }

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user_id)
    .single();
    
  return {
    ...data,
    profile: profileData ? mapProfile(profileData) : undefined
  } as GroupMember;
}

export async function inviteMember(groupId: string, email: string): Promise<{ success: boolean, message: string, inviteUrl?: string }> {
  if (groupId.startsWith('sample-')) {
    return { success: true, message: "Invitation sent (sample)" };
  }

  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user?.id) {
      throw new Error("User is not authenticated");
    }

    const { data: userRole } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', userData.user.id)
      .maybeSingle();

    if (!userRole || (userRole.role !== 'organizer' && userRole.role !== 'admin')) {
      return { 
        success: false, 
        message: "You don't have permission to invite members to this group" 
      };
    }

    const { data: groupData } = await supabase
      .from('travel_groups')
      .select('title')
      .eq('id', groupId)
      .single();

    if (!groupData) {
      return { success: false, message: "Group not found" };
    }

    const { data: inviterData } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userData.user.id)
      .single();

    const inviterName = inviterData?.full_name || "A Trypie user";
    const groupName = groupData.title;

    const { data, error } = await supabase.functions.invoke('send-invitation', {
      body: {
        email,
        groupId,
        groupName,
        inviterName
      }
    });

    if (error) {
      console.error("Error sending invitation:", error);
      return { success: false, message: error.message || "Failed to send invitation" };
    }

    const inviteUrl = data?.inviteUrl;
    const emailSent = data?.emailSent;
    const emailError = data?.emailError;

    let message = "Invitation ";
    if (emailSent) {
      message += "email sent successfully";
    } else {
      message += "link generated successfully";
      if (emailError) {
        message += ` (but email delivery failed: ${emailError})`;
      }
    }

    return { 
      success: true, 
      message, 
      inviteUrl 
    };
  } catch (error: any) {
    console.error("Error inviting member:", error);
    return { 
      success: false, 
      message: error.message || "Failed to send invitation" 
    };
  }
}

export async function removeMember(groupId: string, userId: string): Promise<{ success: boolean, message: string }> {
  if (groupId.startsWith('sample-')) {
    return { success: true, message: "Member removed (sample)" };
  }

  try {
    const { data: currentUserData } = await supabase.auth.getUser();
    
    if (!currentUserData.user?.id) {
      throw new Error("User is not authenticated");
    }

    const isSelf = currentUserData.user.id === userId;

    if (!isSelf) {
      const { data: userRole } = await supabase
        .from('group_members')
        .select('role')
        .eq('group_id', groupId)
        .eq('user_id', currentUserData.user.id)
        .maybeSingle();

      if (!userRole || (userRole.role !== 'organizer' && userRole.role !== 'admin')) {
        return { 
          success: false, 
          message: "You don't have permission to remove members from this group" 
        };
      }
    }

    const { data: group } = await supabase
      .from('travel_groups')
      .select('creator_id')
      .eq('id', groupId)
      .maybeSingle();

    if (group && group.creator_id === userId) {
      return { 
        success: false, 
        message: "The group creator cannot be removed" 
      };
    }

    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return { 
      success: true, 
      message: isSelf ? "You have left the group" : "Member has been removed" 
    };
  } catch (error: any) {
    console.error("Error removing member:", error);
    return { 
      success: false, 
      message: error.message || "Failed to remove member" 
    };
  }
}
