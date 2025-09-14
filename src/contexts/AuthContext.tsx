
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";
import { AuthContextType, Profile } from "@/types/auth-types";
import { fetchUserProfile } from "@/hooks/use-profile";
import { authService } from "@/services/auth-service";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("Auth provider initialized");
    
    // Set up auth state listener first
    const { data: { subscription } } = authService.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.id || "no user");
        
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          // Use setTimeout to prevent potential deadlocks with Supabase client
          setTimeout(() => {
            fetchUserProfile(newSession.user.id).then(profileData => {
              if (profileData) {
                console.log("Profile fetched:", profileData.fullName);
                setProfile(profileData);
              } else {
                console.log("No profile data returned");
              }
            }).catch(err => {
              console.error("Error fetching profile:", err);
            });
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Check for existing session
    authService.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession?.user?.id || "no session");
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id).then(profileData => {
          if (profileData) {
            console.log("Initial profile fetched:", profileData.fullName);
            setProfile(profileData);
          }
          setLoading(false);
        }).catch(err => {
          console.error("Error fetching initial profile:", err);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    }).catch(err => {
      console.error("Error getting initial session:", err);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("Login attempt:", email);
      await authService.login(email, password);

      toast({
        title: "Login successful",
        description: "Welcome back to Trypie!",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error in context:", error);
      toast({
        title: "Login failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signup = async (fullName: string, email: string, password: string) => {
    try {
      console.log("Signup attempt:", email);
      const { user: newUser } = await authService.signup(fullName, email, password);
      
      console.log("Signup response:", newUser ? "user created" : "no user returned");

      if (!newUser) {
        // If we don't have a user, likely email confirmation is required
        toast({
          title: "Verification required",
          description: "We've sent a verification link to your email. Please check your inbox and click the link to complete registration.",
        });
        navigate("/login");
        return;
      }

      toast({
        title: "Account created",
        description: "Welcome to Trypie! Your account has been created successfully.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Signup error in context:", error);
      let errorMessage = error.message;
      
      // Provide more user-friendly error messages
      if (errorMessage?.includes("already registered")) {
        errorMessage = "This email is already registered. Please try logging in instead.";
      } else if (errorMessage?.includes("invalid email")) {
        errorMessage = "Please enter a valid email address.";
      } else if (errorMessage?.includes("password")) {
        errorMessage = "Password should be at least 8 characters.";
      } else if (!errorMessage) {
        errorMessage = "An unexpected error occurred during signup.";
      }
      
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("Logout attempt");
      await authService.logout();
      
      setUser(null);
      setProfile(null);
      setSession(null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      // Force page reload for a clean state
      window.location.href = "/";
    } catch (error: any) {
      console.error("Logout error in context:", error);
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
