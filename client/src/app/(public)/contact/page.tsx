"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  ChevronDown,
  CheckCircle2,
  Send,
  Headphones,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function ContactSupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [ticketRef, setTicketRef] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const faqs = [
    {
      q: "How do I present my ticket at the bus station or cinema hall?",
      a: "Once booked, your ticket is instantly available in your TIKORA Customer Wallet ('My Digital Tickets'). Open the page on your mobile phone to show the high-contrast QR code to the inspector at the turnstile or boarding gate. You can also download or print the PDF receipt.",
    },
    {
      q: "Which payment methods are supported in Ethiopia?",
      a: "TIKORA supports Telebirr, Commercial Bank of Ethiopia (CBE Birr), Chapa payment gateway, and local Visa/Mastercard debit cards. Transactions are processed in Ethiopian Birr (ETB) with zero hidden foreign exchange charges.",
    },
    {
      q: "What is TIKORA's refund and cancellation policy?",
      a: "Cancellations made more than 24 hours before the scheduled departure, movie screening, or event kickoff qualify for a 90% instant credit refund. Cancellations within 24 hours depend on the individual operator's commercial terms.",
    },
    {
      q: "What should I do if my payment was deducted but the ticket shows pending?",
      a: "Network delays between mobile money providers (Telebirr/CBE) can occasionally take 1-2 minutes. If your booking does not immediately confirm, check 'Payment History' or submit a support ticket below with your transaction reference.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `SUP-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketRef(ref);
    setFormSubmitted(true);
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-[#F8FAFC]">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12 w-full">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFBEB] dark:bg-amber-950/60 text-[#F59E0B] dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-slate-700/60">
            <Headphones className="w-4 h-4" />
            <span>24/7 Customer Care</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] dark:text-white tracking-tight">
            How Can We Help You Today?
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 max-w-xl mx-auto">
            Find quick answers to common reservation questions or submit a priority inquiry to our Addis Ababa support team.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] dark:bg-amber-950 text-[#F59E0B] flex items-center justify-center mx-auto mb-2">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold uppercase text-[#64748B] dark:text-amber-400/70">Phone Hotlines</h4>
            <p className="text-sm font-bold text-[#0F172A] dark:text-white">+251 11 667 8900</p>
            <p className="text-xs text-[#64748B] dark:text-slate-400">+251 91 100 2233 (Telebirr Help)</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] dark:bg-amber-950 text-[#F59E0B] flex items-center justify-center mx-auto mb-2">
              <Mail className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold uppercase text-[#64748B] dark:text-amber-400/70">Email Support</h4>
            <p className="text-sm font-bold text-[#0F172A] dark:text-white">support@tikora.et</p>
            <p className="text-xs text-[#64748B] dark:text-slate-400">Average response time: 25 mins</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] dark:bg-amber-950 text-[#F59E0B] flex items-center justify-center mx-auto mb-2">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold uppercase text-[#64748B] dark:text-amber-400/70">Headquarters</h4>
            <p className="text-sm font-bold text-[#0F172A] dark:text-white">Bole Medhanialem</p>
            <p className="text-xs text-[#64748B] dark:text-slate-400">Edna Mall Tower 6th Floor, Addis Ababa</p>
          </div>
        </div>

        {/* FAQs & Support Form 2-Col Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* FAQs (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xl font-bold text-[#0F172A] dark:text-white">
              Frequently Asked Questions
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 overflow-hidden transition-all shadow-xs"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#0F172A] dark:text-white cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#F59E0B] shrink-0 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-[#64748B] dark:text-slate-300 leading-relaxed border-t border-gray-50 dark:border-slate-800/20">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Support Ticket Submission Form (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
                Submit a Support Ticket
              </h3>
              <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1">
                Have a question or refund request? Fill out this form for immediate assistance.
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-5 rounded-2xl bg-[#FFFBEB] dark:bg-amber-950/60 text-[#F59E0B] dark:text-amber-300 text-center space-y-2 border border-amber-200 dark:border-slate-700">
                <CheckCircle2 className="w-8 h-8 mx-auto" />
                <h4 className="text-sm font-bold">Ticket Submitted!</h4>
                <p className="text-xs leading-relaxed">
                  Your inquiry has been assigned reference{" "}
                  <strong className="font-mono text-[#D97706] dark:text-slate-300">{ticketRef}</strong>. A support
                  agent will contact you via email shortly.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="text-xs font-bold underline mt-2 cursor-pointer"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Abebe Bekele"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="abebe@example.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300 mb-1">
                    Subject / Booking Ref (Optional)
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Question regarding Bus 12A seat"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your issue or question in detail..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#F59E0B] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Support Ticket</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
