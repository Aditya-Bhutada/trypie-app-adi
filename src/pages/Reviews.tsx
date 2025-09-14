
import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";

const Reviews = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Navbar />
    <main className="flex-grow max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4 text-trypie-600">Traveller Reviews (India)</h1>
      <ul className="space-y-6 mb-8">
        <li>
          <p className="text-gray-700">“Had rasgullas at Kolkata, river cruise views are gorgeous. Train rides still best way to travel. Respect the heritage!” <span className="text-sm text-gray-500">– Priya from Chennai</span></p>
        </li>
        <li>
          <p className="text-gray-700">“Exploring Hampi’s ruins felt like traveling back in history. Budget friendly, loved the local guides.” <span className="text-sm text-gray-500">– Arjun, Bangalore</span></p>
        </li>
        <li>
          <p className="text-gray-700">“Shimla’s toy train is magical, Mall Road food and sunset points are a must. INR accepted everywhere, super safe!” <span className="text-sm text-gray-500">– Meera, Delhi</span></p>
        </li>
      </ul>
      <p className="text-gray-700">Share your experience in the Trypie community for a chance to get featured!</p>
    </main>
    <Footer />
  </div>
);

export default Reviews;
