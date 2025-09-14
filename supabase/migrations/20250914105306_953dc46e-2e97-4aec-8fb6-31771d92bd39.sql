-- Add media_url column to group_chat_messages table
ALTER TABLE public.group_chat_messages 
ADD COLUMN media_url text;