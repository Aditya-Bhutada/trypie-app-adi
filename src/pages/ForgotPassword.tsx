
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      // Use the current origin to ensure the redirect works correctly
      const redirectTo = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo,
      });
      
      if (error) {
        setError(error.message);
      } else {
        setMessage("Check your email for the password reset link!");
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12 bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {message && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send reset link"}
            </Button>
            
            <div className="text-center">
              <Link to="/login" className="text-sm text-trypie-600 hover:text-trypie-700">
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ForgotPassword;
