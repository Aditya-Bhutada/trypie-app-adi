
import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";

const AIRecommendations = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Navbar />
    <main className="flex-grow max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4 text-trypie-600">AI Recommendations</h1>
      <p className="text-gray-700 mb-4">Powered by AI, Trypie gives custom suggestions for:</p>
      <ul className="mb-6 list-disc pl-6 text-gray-700">
        <li>Cheapest trains & best IRCTC routes</li>
        <li>Local budget stays (₹500-₹2000/night)</li>
        <li>Hidden Indian food gems based on your state/city</li>
        <li>Best time (festivals, off-season, peak travel) for your trip</li>
        <li>Extra safety and travel tips for women and families in India</li>
      </ul>
      <p className="text-gray-700">Every suggestion is tailored for the Indian traveler, focusing on savings, authenticity, and rich cultural experiences—all budgets and tips in INR!</p>
    </main>
    <Footer />
  </div>
);

export default AIRecommendations;
