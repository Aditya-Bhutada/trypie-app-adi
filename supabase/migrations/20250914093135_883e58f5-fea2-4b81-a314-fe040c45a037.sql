-- Enable RLS on all tables that have policies but may not have RLS enabled
-- This fixes the "Policy Exists RLS Disabled" security issue

-- Enable RLS on all relevant tables
ALTER TABLE public.user_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reward_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_invitations ENABLE ROW LEVEL SECURITY;

-- Fix function search path issues for security functions
ALTER FUNCTION public.is_group_creator(uuid) SET search_path = public;
ALTER FUNCTION public.is_group_member(uuid) SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;