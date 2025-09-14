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

-- Phase 2: Add proper foreign key constraints for data integrity (only if they don't exist)

-- Drop existing constraints first to avoid conflicts
ALTER TABLE public.user_groups DROP CONSTRAINT IF EXISTS user_groups_user_id_fkey;
ALTER TABLE public.user_groups DROP CONSTRAINT IF EXISTS user_groups_group_id_fkey;
ALTER TABLE public.group_chat_messages DROP CONSTRAINT IF EXISTS group_chat_messages_user_id_fkey;
ALTER TABLE public.group_chat_messages DROP CONSTRAINT IF EXISTS group_chat_messages_group_id_fkey;
ALTER TABLE public.group_expenses DROP CONSTRAINT IF EXISTS group_expenses_group_id_fkey;
ALTER TABLE public.group_expenses DROP CONSTRAINT IF EXISTS group_expenses_paid_by_fkey;
ALTER TABLE public.expense_shares DROP CONSTRAINT IF EXISTS expense_shares_expense_id_fkey;
ALTER TABLE public.expense_shares DROP CONSTRAINT IF EXISTS expense_shares_user_id_fkey;
ALTER TABLE public.group_itineraries DROP CONSTRAINT IF EXISTS group_itineraries_group_id_fkey;
ALTER TABLE public.group_itineraries DROP CONSTRAINT IF EXISTS group_itineraries_created_by_fkey;
ALTER TABLE public.group_invitations DROP CONSTRAINT IF EXISTS group_invitations_group_id_fkey;
ALTER TABLE public.group_invitations DROP CONSTRAINT IF EXISTS group_invitations_invited_by_fkey;

-- Now add the constraints
ALTER TABLE public.user_groups
ADD CONSTRAINT user_groups_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.user_groups
ADD CONSTRAINT user_groups_group_id_fkey
FOREIGN KEY (group_id) REFERENCES public.travel_groups(id) ON DELETE CASCADE;

ALTER TABLE public.group_chat_messages
ADD CONSTRAINT group_chat_messages_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.group_chat_messages
ADD CONSTRAINT group_chat_messages_group_id_fkey
FOREIGN KEY (group_id) REFERENCES public.travel_groups(id) ON DELETE CASCADE;

ALTER TABLE public.group_expenses
ADD CONSTRAINT group_expenses_group_id_fkey
FOREIGN KEY (group_id) REFERENCES public.travel_groups(id) ON DELETE CASCADE;

ALTER TABLE public.group_expenses
ADD CONSTRAINT group_expenses_paid_by_fkey
FOREIGN KEY (paid_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.expense_shares
ADD CONSTRAINT expense_shares_expense_id_fkey
FOREIGN KEY (expense_id) REFERENCES public.group_expenses(id) ON DELETE CASCADE;

ALTER TABLE public.expense_shares
ADD CONSTRAINT expense_shares_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.group_itineraries
ADD CONSTRAINT group_itineraries_group_id_fkey
FOREIGN KEY (group_id) REFERENCES public.travel_groups(id) ON DELETE CASCADE;

ALTER TABLE public.group_itineraries
ADD CONSTRAINT group_itineraries_created_by_fkey
FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.group_invitations
ADD CONSTRAINT group_invitations_group_id_fkey
FOREIGN KEY (group_id) REFERENCES public.travel_groups(id) ON DELETE CASCADE;

ALTER TABLE public.group_invitations
ADD CONSTRAINT group_invitations_invited_by_fkey
FOREIGN KEY (invited_by) REFERENCES public.profiles(id) ON DELETE CASCADE;