-- Phase 1: Fix Critical RLS Recursion Issues

-- First, fix the security definer functions to prevent recursion
CREATE OR REPLACE FUNCTION public.is_group_member(group_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_groups 
    WHERE user_id = auth.uid() AND group_id = $1
  );
$$;

CREATE OR REPLACE FUNCTION public.is_group_creator(group_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.travel_groups 
    WHERE id = $1 AND creator_id = auth.uid()
  );
$$;

-- Remove the problematic duplicate policy that causes recursion
DROP POLICY IF EXISTS "Users can view public groups or groups they are members of" ON public.travel_groups;

-- Remove redundant duplicate policies on user_groups
DROP POLICY IF EXISTS "Users can view their group memberships and public groups" ON public.user_groups;

-- Phase 2: Add proper foreign key constraints for data integrity

-- Add foreign key from travel_groups.creator_id to profiles.id
ALTER TABLE public.travel_groups 
ADD CONSTRAINT travel_groups_creator_id_fkey 
FOREIGN KEY (creator_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add foreign key from user_groups.user_id to profiles.id  
ALTER TABLE public.user_groups
ADD CONSTRAINT user_groups_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add foreign key from user_groups.group_id to travel_groups.id
ALTER TABLE public.user_groups
ADD CONSTRAINT user_groups_group_id_fkey
FOREIGN KEY (group_id) REFERENCES public.travel_groups(id) ON DELETE CASCADE;

-- Add foreign key from group_chat_messages.user_id to profiles.id
ALTER TABLE public.group_chat_messages
ADD CONSTRAINT group_chat_messages_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add foreign key from group_chat_messages.group_id to travel_groups.id
ALTER TABLE public.group_chat_messages
ADD CONSTRAINT group_chat_messages_group_id_fkey
FOREIGN KEY (group_id) REFERENCES public.travel_groups(id) ON DELETE CASCADE;

-- Add foreign key from group_expenses.group_id to travel_groups.id
ALTER TABLE public.group_expenses
ADD CONSTRAINT group_expenses_group_id_fkey
FOREIGN KEY (group_id) REFERENCES public.travel_groups(id) ON DELETE CASCADE;

-- Add foreign key from group_expenses.paid_by to profiles.id
ALTER TABLE public.group_expenses
ADD CONSTRAINT group_expenses_paid_by_fkey
FOREIGN KEY (paid_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add foreign key from expense_shares.expense_id to group_expenses.id
ALTER TABLE public.expense_shares
ADD CONSTRAINT expense_shares_expense_id_fkey
FOREIGN KEY (expense_id) REFERENCES public.group_expenses(id) ON DELETE CASCADE;

-- Add foreign key from expense_shares.user_id to profiles.id
ALTER TABLE public.expense_shares
ADD CONSTRAINT expense_shares_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add foreign key from group_itineraries.group_id to travel_groups.id
ALTER TABLE public.group_itineraries
ADD CONSTRAINT group_itineraries_group_id_fkey
FOREIGN KEY (group_id) REFERENCES public.travel_groups(id) ON DELETE CASCADE;

-- Add foreign key from group_itineraries.created_by to profiles.id
ALTER TABLE public.group_itineraries
ADD CONSTRAINT group_itineraries_created_by_fkey
FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add foreign key from group_invitations.group_id to travel_groups.id
ALTER TABLE public.group_invitations
ADD CONSTRAINT group_invitations_group_id_fkey
FOREIGN KEY (group_id) REFERENCES public.travel_groups(id) ON DELETE CASCADE;

-- Add foreign key from group_invitations.invited_by to profiles.id
ALTER TABLE public.group_invitations
ADD CONSTRAINT group_invitations_invited_by_fkey
FOREIGN KEY (invited_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Phase 3: Improve RLS policies for better user experience

-- Allow users to view basic profile info of group members (for better UX)
CREATE POLICY "Users can view profiles of group members" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_groups ug1
    JOIN public.user_groups ug2 ON ug1.group_id = ug2.group_id
    WHERE ug1.user_id = auth.uid() AND ug2.user_id = profiles.id
  )
);

-- Allow users to view profiles of group creators for groups they're in
CREATE POLICY "Users can view profiles of group creators" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.travel_groups tg
    JOIN public.user_groups ug ON tg.id = ug.group_id
    WHERE ug.user_id = auth.uid() AND tg.creator_id = profiles.id
  )
);

-- Add missing policies for group_invitations
CREATE POLICY "Group creators can update invitations" 
ON public.group_invitations 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.travel_groups
    WHERE travel_groups.id = group_invitations.group_id 
    AND travel_groups.creator_id = auth.uid()
  )
);

CREATE POLICY "Group creators can delete invitations" 
ON public.group_invitations 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.travel_groups
    WHERE travel_groups.id = group_invitations.group_id 
    AND travel_groups.creator_id = auth.uid()
  )
);

-- Ensure the trigger for creating profiles on user signup exists
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$;

-- Recreate the trigger to ensure it's properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();