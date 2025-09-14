
import { supabase } from "@/integrations/supabase/client";

// Helper function to clean up auth state to prevent conflicts
const cleanupAuthState = () => {
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const authService = {
  login: async (email: string, password: string) => {
    try {
      // Clean up existing state before logging in
      cleanupAuthState();
      
      // Attempt global sign out first to clear any existing sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log("Global sign out before login failed:", err);
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Login service error:", error);
      throw error;
    }
  },

  signup: async (fullName: string, email: string, password: string) => {
    try {
      // Clean up existing state before signing up
      cleanupAuthState();
      
      // Attempt global sign out first to clear any existing sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log("Global sign out before signup failed:", err);
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.error("Signup error:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Signup service error:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error("Logout error:", error);
        throw error;
      }
    } catch (error) {
      console.error("Logout service error:", error);
      throw error;
    }
  },

  getSession: async () => {
    return await supabase.auth.getSession();
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};
