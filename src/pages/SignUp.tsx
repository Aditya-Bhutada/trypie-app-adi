
import { useState, useEffect } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { useAuth } from "@/contexts/AuthContext";
import { MailCheck, MapPin, Gift, Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

const EMAIL_VERIFY_PARAM = "verified";
const EMAIL_VERIFIED_VALUE = "success";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);

  const { signup, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const verified = params.get(EMAIL_VERIFY_PARAM);
    if (verified === EMAIL_VERIFIED_VALUE) {
      toast.success("Account verified! Please log in to your account.");
      navigate("/login", { replace: true });
    }
  }, [location, navigate]);

  const isPhoneValid = phone.length === 0 || /^[+]?[0-9]{8,15}$/.test(phone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName || !email || !password || !confirmPassword || !agreedToTerms) {
      setError("Please fill all required fields and agree to the terms.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!isPhoneValid) {
      setError("Invalid phone number format.");
      return;
    }

    setIsLoading(true);
    try {
      await signup(fullName, email, password);
      setVerificationEmail(email);
      setShowWelcomeDialog(true);
    } catch (err: any) {
      setError(err?.message || "Failed to create your account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f0f9ff]">
      <Navbar />
      <main className="container mx-auto py-6 px-4">
        <div className="max-w-6xl mx-auto rounded-xl overflow-hidden shadow-lg bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* LEFT SIDE */}
            <div className="bg-[#e0f2fe] p-10 md:p-14 flex flex-col justify-center gap-6">
              <h1 className="text-4xl font-extrabold text-trypie-700">Trypie</h1>
              
              <h2 className="text-3xl font-bold text-trypie-700">
                You're in for a great adventure!
              </h2>
              
              <ul className="space-y-5 text-gray-800 text-base">
                <li className="flex items-center gap-3">
                  <MapPin className="text-trypie-500" size={22} />
                  <span>Explore handpicked destinations</span>
                </li>
                <li className="flex items-center gap-3">
                  <Gift className="text-coral-500" size={22} />
                  <span>Unlock exclusive travel rewards</span>
                </li>
                <li className="flex items-center gap-3">
                  <Users className="text-sand-500" size={22} />
                  <span>Plan together, travel together!</span>
                </li>
              </ul>
              
              <p className="text-gray-700 max-w-xs leading-relaxed mt-3">
                Trypie is your AI-powered travel sidekick—personalize adventures, share stories, and connect with fellow travelers.
              </p>
            </div>

            {/* RIGHT SIDE */}
            <div className="p-10 md:p-14">
              <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">
                Create your Trypie account
              </h1>

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
                <div>
                  <Label htmlFor="full-name" className="text-base font-semibold">Full Name</Label>
                  <Input
                    id="full-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-base font-semibold">Phone Number (optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="e.g. +919876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`mt-1 ${phone && !isPhoneValid ? "border-red-500" : ""}`}
                  />
                  {phone && !isPhoneValid && (
                    <span className="text-xs text-red-500">Invalid phone number</span>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-base font-semibold">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-base font-semibold">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="mt-1"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Must be at least 8 characters with a number and special character.
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirm-password" className="text-base font-semibold">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="mt-1"
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <span className="text-xs text-red-500">Passwords do not match</span>
                  )}
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    required
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <Link to="/terms" className="text-trypie-600 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-trypie-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-trypie-500 hover:bg-trypie-600 py-3 text-white font-semibold text-lg mt-4 rounded"
                  disabled={
                    isLoading ||
                    !agreedToTerms ||
                    !!error ||
                    password.length < 8 ||
                    password !== confirmPassword ||
                    (phone && !isPhoneValid)
                  }
                  size="lg"
                >
                  {isLoading ? "Creating account..." : "Sign up"}
                </Button>
              </form>
              
              <p className="mt-8 text-center text-base text-gray-600 max-w-md mx-auto">
                Already have an account?{" "}
                <Link to="/login" className="text-trypie-600 hover:underline font-semibold">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Welcome Modal after successful registration */}
      <Dialog open={showWelcomeDialog} onOpenChange={setShowWelcomeDialog}>
        <DialogContent>
          <DialogHeader>
            <MailCheck className="mx-auto mb-3 text-trypie-600" size={48} />
            <DialogTitle className="text-center text-2xl font-bold">
              Welcome to Trypie! 🎉
            </DialogTitle>
            <DialogDescription className="text-center mt-2 text-lg">
              <div className="mb-3 font-medium">
                Thanks for registering.
              </div>
              <div>
                To confirm your email, please check your inbox<br />
                <span className="font-semibold underline underline-offset-2 cursor-text select-text">
                  {verificationEmail}
                </span>
                <br />and click the verification link.
              </div>
              <div className="mt-4 text-xs text-gray-500">
                Haven&apos;t received the email? Please check your spam or wait a few minutes.
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-8">
            <Button
              type="button"
              onClick={() => {
                setShowWelcomeDialog(false);
                navigate("/login");
              }}
              className="w-full"
              size="lg"
            >
              Go to Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignUp;

