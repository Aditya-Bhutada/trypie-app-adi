
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addMessage = (content: string, isUser: boolean): ChatMessage => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage = addMessage(content, true);
    
    setIsLoading(true);
    
    try {
      // Send to Edge Function with chat history
      const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
        body: {
          message: content,
          chatHistory: messages.map(msg => ({
            content: msg.content,
            isUser: msg.isUser
          }))
        }
      });

      if (error) {
        console.error("Error from chat function:", error);
        throw new Error(error.message || "Failed to get response from assistant");
      }

      if (!data || !data.success) {
        throw new Error(data?.error || "Failed to process your message");
      }

      // Add assistant's response
      addMessage(data.response, false);
    } catch (err: any) {
      console.error("Error in chat:", err);
      toast({
        title: "Error",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      
      // Add error message
      addMessage("I'm sorry, I'm having trouble connecting right now. Please try again later.", false);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages
  };
};
