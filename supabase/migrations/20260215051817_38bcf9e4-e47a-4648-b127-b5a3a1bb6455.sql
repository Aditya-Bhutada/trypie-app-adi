
-- =====================
-- 1. PROFILES
-- =====================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  interests TEXT[],
  website_url TEXT,
  instagram_handle TEXT,
  twitter_handle TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================
-- 2. REVIEWS
-- =====================
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  visit_date TEXT NOT NULL,
  location TEXT,
  pros TEXT,
  cons TEXT,
  media_urls TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Users can create their own reviews"
  ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- =====================
-- 3. TRAVEL GROUPS
-- =====================
CREATE TABLE public.travel_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  capacity INTEGER NOT NULL DEFAULT 10,
  is_influencer_trip BOOLEAN NOT NULL DEFAULT false,
  is_public BOOLEAN NOT NULL DEFAULT true,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.travel_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public groups are viewable by everyone"
  ON public.travel_groups FOR SELECT USING (
    is_public = true OR creator_id = auth.uid()
  );

CREATE POLICY "Authenticated users can create groups"
  ON public.travel_groups FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their groups"
  ON public.travel_groups FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their groups"
  ON public.travel_groups FOR DELETE USING (auth.uid() = creator_id);

-- =====================
-- 4. GROUP MEMBERS
-- =====================
CREATE TABLE public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.travel_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Helper function to check group membership
CREATE OR REPLACE FUNCTION public.is_group_member(_user_id UUID, _group_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE user_id = _user_id AND group_id = _group_id
  )
$$;

CREATE POLICY "Group members are viewable by group members"
  ON public.group_members FOR SELECT USING (
    public.is_group_member(auth.uid(), group_id)
  );

CREATE POLICY "Authenticated users can join groups"
  ON public.group_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups"
  ON public.group_members FOR DELETE USING (auth.uid() = user_id);

-- =====================
-- 5. GROUP MESSAGES
-- =====================
CREATE TABLE public.group_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.travel_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  media_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group members can view messages"
  ON public.group_messages FOR SELECT USING (
    public.is_group_member(auth.uid(), group_id)
  );

CREATE POLICY "Group members can send messages"
  ON public.group_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND public.is_group_member(auth.uid(), group_id)
  );

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_messages;

-- =====================
-- 6. GROUP EXPENSES
-- =====================
CREATE TABLE public.group_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.travel_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  paid_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  currency TEXT NOT NULL DEFAULT 'INR',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.group_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group members can view expenses"
  ON public.group_expenses FOR SELECT USING (
    public.is_group_member(auth.uid(), group_id)
  );

CREATE POLICY "Group members can create expenses"
  ON public.group_expenses FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = paid_by AND public.is_group_member(auth.uid(), group_id)
  );

CREATE POLICY "Expense creator can update"
  ON public.group_expenses FOR UPDATE USING (auth.uid() = paid_by);

CREATE POLICY "Expense creator can delete"
  ON public.group_expenses FOR DELETE USING (auth.uid() = paid_by);

-- =====================
-- 7. EXPENSE SHARES
-- =====================
CREATE TABLE public.expense_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL REFERENCES public.group_expenses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  is_paid BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE public.expense_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their expense shares"
  ON public.expense_shares FOR SELECT USING (
    auth.uid() = user_id OR EXISTS (
      SELECT 1 FROM public.group_expenses e
      WHERE e.id = expense_id AND e.paid_by = auth.uid()
    )
  );

CREATE POLICY "Expense payer can create shares"
  ON public.expense_shares FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.group_expenses e
      WHERE e.id = expense_id AND e.paid_by = auth.uid()
    )
  );

CREATE POLICY "Expense payer can update shares"
  ON public.expense_shares FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.group_expenses e
      WHERE e.id = expense_id AND e.paid_by = auth.uid()
    )
  );

-- =====================
-- 8. GROUP ITINERARIES
-- =====================
CREATE TABLE public.group_itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.travel_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  day_number INTEGER,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.group_itineraries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group members can view itineraries"
  ON public.group_itineraries FOR SELECT USING (
    public.is_group_member(auth.uid(), group_id)
  );

CREATE POLICY "Group members can create itineraries"
  ON public.group_itineraries FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = created_by AND public.is_group_member(auth.uid(), group_id)
  );

CREATE POLICY "Creator can update itinerary"
  ON public.group_itineraries FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Creator can delete itinerary"
  ON public.group_itineraries FOR DELETE USING (auth.uid() = created_by);

-- =====================
-- 9. GROUP INVITATIONS
-- =====================
CREATE TABLE public.group_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.travel_groups(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.group_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inviter and invitee can view invitations"
  ON public.group_invitations FOR SELECT USING (
    auth.uid() = invited_by OR public.is_group_member(auth.uid(), group_id)
  );

CREATE POLICY "Group members can create invitations"
  ON public.group_invitations FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = invited_by AND public.is_group_member(auth.uid(), group_id)
  );

CREATE POLICY "Inviter can update invitations"
  ON public.group_invitations FOR UPDATE USING (auth.uid() = invited_by);

-- =====================
-- 10. REWARDS SYSTEM
-- =====================
CREATE TABLE public.reward_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  icon TEXT NOT NULL DEFAULT '🏆',
  is_secret BOOLEAN NOT NULL DEFAULT false,
  visibility_rule TEXT,
  trigger_type TEXT NOT NULL DEFAULT 'action',
  trigger_condition JSONB,
  visibility TEXT NOT NULL DEFAULT 'visible',
  category TEXT NOT NULL DEFAULT 'explorer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.reward_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reward types are viewable by everyone"
  ON public.reward_types FOR SELECT USING (true);

CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🎖️',
  points INTEGER NOT NULL DEFAULT 0,
  is_secret BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Badges are viewable by everyone"
  ON public.badges FOR SELECT USING (true);

CREATE TABLE public.user_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_type_id UUID REFERENCES public.reward_types(id),
  badge_id UUID REFERENCES public.badges(id),
  points INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own rewards"
  ON public.user_rewards FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert rewards"
  ON public.user_rewards FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id),
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own badges"
  ON public.user_badges FOR SELECT USING (auth.uid() = user_id);

CREATE TABLE public.user_reward_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  current_points INTEGER NOT NULL DEFAULT 0,
  level TEXT NOT NULL DEFAULT 'Wanderer',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_reward_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reward settings"
  ON public.user_reward_settings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own reward settings"
  ON public.user_reward_settings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reward settings"
  ON public.user_reward_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- =====================
-- 11. STORAGE BUCKET FOR REVIEW MEDIA
-- =====================
INSERT INTO storage.buckets (id, name, public) VALUES ('review_media', 'review_media', true);

CREATE POLICY "Anyone can view review media"
  ON storage.objects FOR SELECT USING (bucket_id = 'review_media');

CREATE POLICY "Authenticated users can upload review media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'review_media');
