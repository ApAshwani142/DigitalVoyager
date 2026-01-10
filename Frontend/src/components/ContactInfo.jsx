import React, { useState } from "react";
import { Phone, Mail, MapPin, Clock, AlertTriangle, Send } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const ContactInfo = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill name, email, and message.");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post("http://localhost:5000/api/contact/send", formData);
      toast.success("Message sent! We will get back to you shortly.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to send message. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-[#0b1220] text-white p-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="text-gray-400 mb-6">
              Whether you need emergency incident response or want to discuss our
              forensic services, our team of experts is ready to assist you 24/7.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Phone className="text-sky-400 w-6 h-6" />
                <div>
                  <h4 className="font-semibold">Phone</h4>
                  <p>9871493454</p>
                  <span className="text-gray-400 text-sm">
                    24/7 Emergency Hotline
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="text-sky-400 w-6 h-6" />
                <div>
                  <h4 className="font-semibold">Email</h4>
                  <p>info@dgvoyager.com</p>
                  <span className="text-gray-400 text-sm">
                    We respond within 2 hours
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="text-sky-400 w-6 h-6" />
                <div>
                  <h4 className="font-semibold">Office</h4>
                  <p>
                    M13, 3rd Floor <br />
                    Punj House, M Block <br />
                    Connaught Place - 110001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="text-sky-400 w-6 h-6" />
                <div>
                  <h4 className="font-semibold">Business Hours</h4>
                  <p>Mon - Fri: 10:00 AM - 6:00 PM</p>
                  <span className="text-gray-400 text-sm">
                    Emergency Support: 24/7
                  </span>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            id="emergency"
            whileHover={{
              scale: 1.03,
              boxShadow: "0 0 40px rgba(14,165,233,0.45)",
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-[#1e293b] p-6 rounded-2xl text-center"
          >
            <h3 className="text-xl font-bold mb-2">Emergency Incident Response</h3>
            <p className="text-gray-400 mb-4">
              For urgent cybersecurity incidents requiring immediate attention,
              call our 24/7 hotline.
            </p>
            <div className="flex justify-center">
              <button className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg font-semibold text-white transition-transform transform hover:scale-105">
                <AlertTriangle className="w-5 h-5" />
                Call Emergency Hotline
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div
          whileHover={{
            scale: 1.03,
            boxShadow: "0 0 40px rgba(14,165,233,0.45)",
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="bg-[#1e293b] p-6 rounded-2xl"
        >
          <h2 className="text-2xl font-bold mb-4">Send us a Message</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-2 rounded-lg bg-[#0f172a] border border-gray-700 text-white focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
            <div>
              <label className="block mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="w-full px-4 py-2 rounded-lg bg-[#0f172a] border border-gray-700 text-white focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
            <div>
              <label className="block mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Optional phone number"
                className="w-full px-4 py-2 rounded-lg bg-[#0f172a] border border-gray-700 text-white focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
            <div>
              <label className="block mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Optional subject"
                className="w-full px-4 py-2 rounded-lg bg-[#0f172a] border border-gray-700 text-white focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
            <div>
              <label className="block mb-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe your forensic investigation needs..."
                rows="4"
                className="w-full px-4 py-2 rounded-lg bg-[#0f172a] border border-gray-700 text-white focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-semibold hover:opacity-90 transition-transform transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactInfo;
