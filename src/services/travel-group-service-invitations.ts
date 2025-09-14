
import { supabase } from "@/integrations/supabase/client";
import { TravelGroup } from "@/types/travel-group-types";
import { fetchGroupById, joinGroup } from "./travel-group-service-groups";

// Accept a group invitation using a token
export async function acceptGroupInvitation(token: string): Promise<{
  success: boolean;
  message?: string;
  group?: TravelGroup;
}> {
  if (!token) {
    return {
      success: false,
      message: "Invalid invitation token"
    };
  }

  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user?.id) {
      return {
        success: false,
        message: "You must be logged in to accept an invitation"
      };
    }

    // Get invitation by token
    const { data: invitation, error: inviteError } = await supabase.rpc(
      'get_group_invitation_by_token',
      { p_token: token }
    );

    if (inviteError || !invitation || invitation.length === 0) {
      console.error("Error fetching invitation:", inviteError);
      return {
        success: false,
        message: "Invalid or expired invitation"
      };
    }

    const inviteData = invitation[0];

    // Only check if invitation has expired, but allow it to be reused
    // Remove the check for status === 'pending'
    if (inviteData.expires_at && new Date(inviteData.expires_at) < new Date()) {
      return {
        success: false,
        message: "This invitation has expired"
      };
    }

    // Join the group
    await joinGroup(inviteData.group_id);

    // Get group details
    const group = await fetchGroupById(inviteData.group_id);

    return {
      success: true,
      message: `You've successfully joined ${group.title}!`,
      group
    };
  } catch (error: any) {
    console.error("Error accepting invitation:", error);
    return {
      success: false,
      message: error.message || "Failed to accept invitation"
    };
  }
}

// Validate an invitation token
export async function validateInvitationToken(token: string): Promise<{
  isValid: boolean;
  groupName?: string;
  inviterName?: string;
  groupId?: string;
  message?: string;
}> {
  if (!token) {
    return { isValid: false, message: "Invalid invitation token" };
  }

  try {
    // Get invitation by token
    const { data: invitation, error: inviteError } = await supabase.rpc(
      'get_group_invitation_by_token',
      { p_token: token }
    );

    if (inviteError || !invitation || invitation.length === 0) {
      return { isValid: false, message: "Invalid or expired invitation" };
    }

    const inviteData = invitation[0];
    
    // Only check if the invitation has expired, not if it has been used before
    if (inviteData.expires_at && new Date(inviteData.expires_at) < new Date()) {
      return { 
        isValid: false, 
        message: "This invitation has expired"
      };
    }

    // Get group details
    const { data: groupData } = await supabase
      .from('travel_groups')
      .select('title, id')
      .eq('id', inviteData.group_id)
      .single();

    // Get inviter details
    const { data: inviterData } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', inviteData.invited_by)
      .single();

    return {
      isValid: true,
      groupName: groupData?.title,
      groupId: groupData?.id,
      inviterName: inviterData?.full_name || "A Trypie user"
    };
  } catch (error: any) {
    console.error("Error validating invitation token:", error);
    return { isValid: false, message: "Failed to validate invitation" };
  }
}
