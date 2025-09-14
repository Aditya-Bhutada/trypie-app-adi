
import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";

const TermsPrivacy = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Navbar />
    <main className="flex-grow max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4 text-trypie-600">Terms & Privacy</h1>
      <h2 className="text-xl font-semibold mb-4">Terms of Service</h2>
      <p className="text-gray-700 mb-6">By using Trypie, you agree to follow Indian laws and our community guidelines. Don't post offensive or misleading content, and always travel responsibly.</p>
      <h2 className="text-xl font-semibold mb-4">Privacy Policy</h2>
      <p className="text-gray-700 mb-4">Your privacy is important. We store your data securely within India and never share your personal information with third parties except for providing services you request. For queries, write to privacy@trypie.in.</p>
    </main>
    <Footer />
  </div>
);

export default TermsPrivacy;
