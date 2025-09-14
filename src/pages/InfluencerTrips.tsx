
import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";

const InfluencerTrips = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Navbar />
    <main className="flex-grow max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4 text-trypie-600">Influencer Trips</h1>
      <p className="text-gray-700 mb-4">Follow top Indian travel influencers as they explore destinations like Meghalaya, Rajasthan, Himachal, Goa, and the North East! Discover real itineraries, Instagram stories, YouTube vlogs, and honest budget tips curated for Indian travelers.</p>
      <ul className="list-disc pl-6 text-gray-700 mb-6">
        <li><span className="font-semibold">Trip with Komal Singh:</span> Bangalore to Hampi adventure (₹4,500 per person)</li>
        <li><span className="font-semibold">Vlog with Ravi Sharma:</span> Backpacking Sikkim (₹7,200 all inclusive)</li>
        <li><span className="font-semibold">Roadtrip by Team Xplore:</span> Rajasthan forts and food trail (₹6,000 pp, local snacks included!)</li>
      </ul>
      <p className="text-gray-700">Follow #TrypieTripsIndia for more journeys and join your favorite influencer’s next trip!</p>
    </main>
    <Footer />
  </div>
);

export default InfluencerTrips;
