
import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";

const OurStory = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Navbar />
    <main className="flex-grow max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4 text-trypie-600">Our Story</h1>
      <p className="text-gray-700 mb-6">🌏 Trypie was founded with a simple mission: empower Indian travelers to explore their country and the world in a smarter, safer, and more connected way. Built for Indians, by Indians, we use AI and community experience to curate authentic Indian journeys—across bustling cities, serene mountains, spiritual destinations, festivals, cuisine trails, and more.</p>
      <img src="/lovable-uploads/6ad17ec1-1be8-4692-a7d5-efa7e9678eb9.png" alt="Trypie India" className="rounded-md mb-8 shadow-lg"/>
      <p className="text-gray-700">Our platform grew from travelers sharing tips about Ladakh and Kerala on WhatsApp groups. Today, it serves lakhs of Indians who want personal recommendations, help splitting bills with friends, real reviews, local food finds, and a true sense of belonging. Join us—let’s make travel in India accessible, fun, and unforgettable!</p>
    </main>
    <Footer />
  </div>
);

export default OurStory;
