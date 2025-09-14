
import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";

const Experiences = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Navbar />
    <main className="flex-grow max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4 text-trypie-600">Experiences</h1>
      <p className="text-gray-700 mb-6">Find Indian adventures: Kayak in Alleppey (Kerala), Trek Triund (Himachal), Desert safaris in Jaisalmer, monsoon bike rides in Goa, Durga Puja pandal hopping (Kolkata), Heli-yatras to Kedarnath. All trips budgeted in INR for Indians, with focus on local food, train journeys, and must-see festivals.</p>
    </main>
    <Footer />
  </div>
);

export default Experiences;
