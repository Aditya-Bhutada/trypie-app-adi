
import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";

const Destinations = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Navbar />
    <main className="flex-grow max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4 text-trypie-600">Top Indian Destinations</h1>
      <ul className="mb-8 space-y-4">
        <li className="text-gray-700"><span className="font-semibold">Leh-Ladakh:</span> Lakes, monasteries, roadtrips—best in summer, budget ₹35,000+.</li>
        <li className="text-gray-700"><span className="font-semibold">Jaipur, Rajasthan:</span> Palaces and forts, local food like dal baati churma (budget ₹8,000).</li>
        <li className="text-gray-700"><span className="font-semibold">Goa:</span> Beaches, festivals, shacks (₹12,000 can cover a solid trip for 4 days).</li>
        <li className="text-gray-700"><span className="font-semibold">Varanasi:</span> Ghats, spirituality, and street food.</li>
        <li className="text-gray-700"><span className="font-semibold">Sikkim:</span> Green valleys, Buddhist monasteries, peace (ideal for nature lovers!)</li>
        <li className="text-gray-700"><span className="font-semibold">Kerala:</span> Backwaters, Ayurveda, houseboats—monsoon discounts available!</li>
      </ul>
      <p className="text-gray-700">Browse more unique Indian places in Explore for stories, local tips, and best seasons to visit.</p>
    </main>
    <Footer />
  </div>
);

export default Destinations;
