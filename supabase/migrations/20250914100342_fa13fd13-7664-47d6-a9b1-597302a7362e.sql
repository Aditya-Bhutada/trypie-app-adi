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