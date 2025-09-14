
import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";

const BecomePartner = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Navbar />
    <main className="flex-grow max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4 text-trypie-600">Become a Partner</h1>
      <p className="text-gray-700 mb-4">Are you a travel agency, homestay, guide, influencer, or tourism board in India? Join Trypie as a partner to:</p>
      <ul className="mb-6 list-disc pl-6 text-gray-700">
        <li>Feature your offerings to a huge Indian traveler base</li>
        <li>Get genuine reviews and boost your visibility</li>
        <li>Collaborate on campaigns and exclusive group trips</li>
      </ul>
      <p className="text-gray-700">Submit a partnership interest at <a className="text-trypie-600 underline" href="mailto:partners@trypie.in">partners@trypie.in</a></p>
    </main>
    <Footer />
  </div>
);

export default BecomePartner;
