"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { submitContactRequest } from "@/actions/contact";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await submitContactRequest(formData);

      if (response.success) {
        setSubmitStatus({
          type: "success",
          message: "Thank you! Your message has been sent successfully. We will get back to you soon.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: response.error || "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#243839] mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            Have a question about our advertising spaces or need help planning your next campaign? Our team is here to help.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col lg:flex-row border border-gray-100">
          <div className="lg:w-1/3 bg-[#0A4D28] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-20%] w-80 h-80 bg-[#C58B24]/10 rounded-full pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-8 text-white">Contact Information</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#C58B24] transition-colors">
                    <MapPin className="w-5 h-5 text-[#C58B24] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Our Office</h3>
                    <p className="text-gray-300 leading-relaxed text-sm">
                      123 Media Avenue, Tech Park<br />
                      Bangalore, Karnataka 560001
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#C58B24] transition-colors">
                    <Phone className="w-5 h-5 text-[#C58B24] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Call Us</h3>
                    <p className="text-gray-300 text-sm">+91 98765 43210</p>
                    <p className="text-gray-300 text-sm">Mon - Fri, 9am - 6pm</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#C58B24] transition-colors">
                    <Mail className="w-5 h-5 text-[#C58B24] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                    <p className="text-gray-300 text-sm">hello@bookmyadspace.com</p>
                    <p className="text-gray-300 text-sm">support@bookmyadspace.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-2/3 p-8 md:p-12">
            <h2 className="text-2xl font-bold text-[#243839] mb-8">Send us a Message</h2>
            
            {submitStatus.type && (
              <div className={`p-4 rounded-lg mb-6 flex items-start gap-3 ${
                submitStatus.type === "success" 
                  ? "bg-[#0A4D28]/10 border border-[#0A4D28]/20 text-[#0A4D28]" 
                  : "bg-red-50 border border-red-100 text-red-600"
              }`}>
                {submitStatus.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                )}
                <p className="text-sm font-medium">{submitStatus.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[#243839] mb-2">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 focus:border-[#0A4D28] transition-all"
                    placeholder="John Doe"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[#243839] mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 focus:border-[#0A4D28] transition-all"
                    placeholder="john@example.com"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-[#243839] mb-2">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 focus:border-[#0A4D28] transition-all"
                    placeholder="+91 98765 43210"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-[#243839] mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 focus:border-[#0A4D28] transition-all"
                    placeholder="How can we help?"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-[#243839] mb-2">Message</label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 focus:border-[#0A4D28] transition-all resize-none"
                  placeholder="Write your message here..."
                  required
                  disabled={isSubmitting}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#C58B24] hover:bg-[#0A4D28] transition-colors text-white font-bold py-3.5 px-8 rounded-lg flex items-center gap-2 tracking-wide w-full sm:w-auto justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>Sending... <Loader2 className="w-4 h-4 animate-spin" /></>
                ) : (
                  <>Send Message <Send className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}