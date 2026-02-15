
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

    // Look up invitation by token in group_invitations table
    const { data: invitation, error: inviteError } = await supabase
      .from('group_invitations')
      .select('*')
      .eq('id', token)
      .eq('status', 'pending')
      .maybeSingle();

    if (inviteError || !invitation) {
      console.error("Error fetching invitation:", inviteError);
      return {
        success: false,
        message: "Invalid or expired invitation"
      };
    }

    // Join the group
    await joinGroup(invitation.group_id);

    // Update invitation status
    await supabase
      .from('group_invitations')
      .update({ status: 'accepted' })
      .eq('id', token);

    // Get group details
    const group = await fetchGroupById(invitation.group_id);

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
    const { data: invitation, error: inviteError } = await supabase
      .from('group_invitations')
      .select('*')
      .eq('id', token)
      .eq('status', 'pending')
      .maybeSingle();

    if (inviteError || !invitation) {
      return { isValid: false, message: "Invalid or expired invitation" };
    }

    // Get group details
    const { data: groupData } = await supabase
      .from('travel_groups')
      .select('title, id')
      .eq('id', invitation.group_id)
      .single();

    // Get inviter details
    const { data: inviterData } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', invitation.invited_by)
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
