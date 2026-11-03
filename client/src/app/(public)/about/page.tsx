"use client";

import React from "react";
import Link from "next/link";
import {
  Ticket,
  ShieldCheck,
  Zap,
  Users,
  Award,
  MapPin,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-[#F8FAFC]">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12 w-full">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-[#F59E0B] dark:text-amber-400 uppercase tracking-wider">
            About TicketHub Ethiopia
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] dark:text-white tracking-tight">
            Connecting Ethiopia with Seamless Digital Passes
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Founded with the mission to eliminate ticket queues and black-market pricing, TicketHub is Ethiopia&apos;s unified multi-category reservation platform for bus travel, movie theaters, live concerts, and stadium sports.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] dark:bg-amber-950/60 text-[#F59E0B] dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">100% Certified Partners</h3>
            <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
              Every transport company, cinema house, and festival organizer undergoes commercial licensing and TIN verification.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] dark:bg-amber-950/60 text-[#F59E0B] dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Instant QR Turnstile Entry</h3>
            <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
              Tickets are issued instantly with secure cryptographic QR codes validated in milliseconds at station gates.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] dark:bg-amber-950/60 text-[#F59E0B] dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">50,000+ Happy Customers</h3>
            <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
              Trusted by Ethiopian travelers and event attendees across Addis Ababa, Hawassa, Bahir Dar, and Dire Dawa.
            </p>
          </div>
        </div>

        {/* Partner with us CTA */}
        <div className="p-8 rounded-3xl bg-gradient-to-tr from-[#D97706] to-[#F59E0B] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold">Are you an Operator or Venue?</h3>
            <p className="text-xs text-indigo-100/80 max-w-lg">
              Start selling tickets on TicketHub today. Get free ticket scanner hardware and Telebirr automatic settlements.
            </p>
          </div>

          <Link
            href="/register/organization"
            className="px-6 py-3 rounded-xl bg-white text-[#D97706] hover:bg-amber-50 text-xs font-bold transition-all shadow-md active:scale-95 shrink-0"
          >
            Register Organization
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
