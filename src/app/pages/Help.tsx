import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { MessageCircle, Mail, Phone, Book, Search } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;

const faqs = [
  {
    question: "How do I generate QR codes for my tables?",
    answer: "Navigate to the QR Codes section from the sidebar, then select the 'Table QR Codes' tab. You can generate individual QR codes for each table or batch generate for multiple tables at once.",
  },
  {
    question: "Can I customize my menu theme?",
    answer: "Yes! Go to the Theme Selection page where you can choose from 6 different pre-designed themes including Modern Minimal, Luxury Restaurant, Cafe Style, and more. Each theme has unique color schemes and layouts.",
  },
  {
    question: "How do I add a new menu item?",
    answer: "Go to Menu Items page, click 'Add Menu Item', fill in the details including name, description, price, category, and upload an image. You can also set spice levels and mark items as vegetarian or non-vegetarian.",
  },
  {
    question: "How do I manage orders?",
    answer: "The Orders page shows all current orders in real-time. You can update order status from Preparing to Ready to Served. Filter orders by status to focus on what needs attention.",
  },
  {
    question: "Can I offer my menu in multiple languages?",
    answer: "Absolutely! Visit the Language Settings page to enable translations for English, Hindi, Malayalam, and Arabic. You can manually translate each item or use our auto-translation feature.",
  },
  {
    question: "How do I upgrade my subscription?",
    answer: "Go to the Subscription page where you can view all available plans. Click 'Upgrade' on the plan you want, and follow the payment process. Your new features will be activated immediately.",
  },
];

export function Help() {

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);

  const token = localStorage.getItem("token");

  const fetchTickets = async () => {
    try {
      const res = await axios.get(
        `${API}/hotel-admin/my-tickets`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTickets(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

const createTicket = async () => {
  if (!subject || !message) {
    toast.error("Please fill subject and message");
    return;
  }

  try {
    setLoading(true);

    await axios.post(
      `${API}/hotel-admin/create`,
      { subject, message },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Ticket created successfully 🎉");

    setSubject("");
    setMessage("");

    fetchTickets();
  } catch (err) {
    console.log(err);

    toast.error("Failed to create ticket. Try again later.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-500 mt-1">Get answers to common questions or contact our support team</p>
      </div>

      {/* Search */}
      <Card className="bg-white shadow-sm border-gray-200">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search for help articles..."
              className="pl-10 h-12 text-base"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white shadow-sm border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-[#1E88E5]" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600 mb-4">Chat with our support team</p>
            <Button className="bg-[#1E88E5] hover:bg-[#1976D2] w-full">
              Start Chat
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-[#00C853]" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Email Support</h3>
            <p className="text-sm text-gray-600 mb-4">support@qrhotels.com</p>
            <Button variant="outline" className="w-full">
              Send Email
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Phone Support</h3>
            <p className="text-sm text-gray-600 mb-4">+91 1800 123 4567</p>
            <Button variant="outline" className="w-full">
              Call Now
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Contact Form */}
      <Card className="bg-white shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle>Send us a Message</CardTitle>
          <p className="text-sm text-gray-500">Can't find what you're looking for? Contact us directly</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="How can we help you?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Describe your issue or question in detail..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-2"
              rows={6}
            />
          </div>
          <Button
            className="bg-[#1E88E5] hover:bg-[#1976D2] w-full"
            onClick={createTicket}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            My Support Tickets
          </CardTitle>
          <p className="text-sm text-gray-500">
            Track and manage all your support requests in one place
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {tickets.length === 0 ? (
            <p className="text-sm text-gray-500">No tickets found</p>
          ) : (
            tickets.map((t) => (
              <div
                key={t.id}
                className="group border border-gray-200 rounded-xl p-4 bg-gradient-to-b from-white to-gray-50 hover:shadow-lg transition"
              >
                {/* TOP SECTION */}
                <div className="flex justify-between items-start">
                  
                  {/* LEFT */}
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-[#1E88E5] transition">
                      {t.subject}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      Ticket ID:{" "}
                      <span className="font-medium text-gray-700">
                        {t.ticketNumber}
                      </span>
                    </p>
                  </div>

                  {/* BADGES */}
                  <div className="flex gap-2 flex-wrap">
                    
                    {/* STATUS */}
                    <span
                      className={`text-[11px] px-3 py-1 rounded-full font-medium ${
                        t.status === "open"
                          ? "bg-gray-100 text-gray-700"
                          : t.status === "in_progress"
                          ? "bg-blue-100 text-blue-700"
                          : t.status === "resolved"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700" // closed
                      }`}
                    >
                      {t.status.replace("_", " ").toUpperCase()}
                    </span>

                    {/* PRIORITY */}
                    <span
                      className={`text-[11px] px-3 py-1 rounded-full font-medium ${
                        t.priority === "urgent"
                          ? "bg-red-100 text-red-700"
                          : t.priority === "high"
                          ? "bg-orange-100 text-orange-700"
                          : t.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700" // low
                      }`}
                    >
                      {t.priority.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* MESSAGE */}
                <div className="mt-3 bg-white border rounded-lg p-3">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {t.message}
                  </p>
                </div>

                {/* FOOTER INFO */}
                <div className="mt-3 flex flex-col sm:flex-row sm:justify-between text-xs text-gray-500 gap-2">
                  <span>
                    Assigned To:{" "}
                    <span className="font-medium text-gray-700">
                      {t.assignedTo || "Not assigned"}
                    </span>
                  </span>

                  <span>
                    Created:{" "}
                    {new Date(t.createdAt).toLocaleString()}
                  </span>
                </div>

                {/* ADMIN REPLY SECTION */}
                {t.adminReply && (
                  <div className="mt-4 border-l-4 border-[#1E88E5] bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs font-semibold text-blue-700 mb-1">
                      Admin Response
                    </p>

                    <p className="text-sm text-gray-800">
                      {t.adminReply}
                    </p>

                    {t.repliedAt && (
                      <p className="text-[11px] text-gray-500 mt-2">
                        Replied on:{" "}
                        {new Date(t.repliedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* FAQs */}
      <Card className="bg-white shadow-sm border-gray-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Book className="w-5 h-5 text-[#1E88E5]" />
            <CardTitle>Frequently Asked Questions</CardTitle>
          </div>
          <p className="text-sm text-gray-500">Quick answers to common questions</p>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Documentation */}
      <Card className="bg-gradient-to-br from-[#1E88E5] to-[#1976D2] text-white shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Documentation</h3>
              <p className="text-sm opacity-90">
                Explore our comprehensive guides and tutorials
              </p>
            </div>
            <Button variant="secondary">
              View Docs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
