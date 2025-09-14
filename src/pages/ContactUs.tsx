
import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";

const ContactUs = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Navbar />
    <main className="flex-grow max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4 text-trypie-600">Contact Us</h1>
      <p className="text-gray-700 mb-4">🇮🇳 We’d love to hear from you! For support, collaborations, or feedback, you can reach us at:</p>
      <ul className="mb-6">
        <li className="mb-2"><span className="font-semibold">Email:</span> <a href="mailto:support@trypie.in" className="text-trypie-600 underline">support@trypie.in</a></li>
        <li><span className="font-semibold">Phone:</span> +91 9876543210 (Mon-Fri, 10am-6pm IST)</li>
      </ul>
      <p className="text-gray-700">Or connect on our socials (Instagram, X, LinkedIn): <a href="#" className="text-trypie-600 underline">@trypieindia</a></p>
    </main>
    <Footer />
  </div>
);

export default ContactUs;
