"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Ticket,
  Bus,
  Film,
  Calendar,
  Trophy,
  Search,
  MapPin,
  ShieldCheck,
  QrCode,
  Zap,
  ArrowRight,
  Sparkles,
  X,
} from "lucide-react";
import { PublicNavbar } from "@/components/navigation/public-navbar";
import { Footer } from "@/components/layout/footer";
import { TicketCard } from "@/components/tickets/ticket-card";
import { TicketItem, TicketCategory } from "@/types/ticket.types";
import { AUTH_ROUTES } from "@/lib/constants";
import { formatCurrency } from "@/lib/format-currency";

// Curated live multi-industry ticket inventory
const SAMPLE_TICKETS: TicketItem[] = [
  {
    id: "bus-01",
    title: "Addis Ababa → Hawassa (Luxury Coach)",
    category: "BUS",
    organizer: "Selam Bus Line",
    organizerVerified: true,
    location: "Autobis Tera Terminal, Addis Ababa",
    city: "Addis Ababa",
    date: "Nov 05, 2026",
    time: "06:00 AM",
    price: 850,
    availableSeats: 8,
    totalSeats: 48,
    status: "SELLING_FAST",
    rating: 4.9,
    categoryDetails: {
      busCompany: "Selam Bus",
      origin: "Addis Ababa",
      destination: "Hawassa",
      busType: "VIP 2x1 Recliner",
    },
  },
  {
    id: "cinema-01",
    title: "Gladiator II (4K Laser Projection)",
    category: "CINEMA",
    organizer: "Century Cinema Megaplex",
    organizerVerified: true,
    location: "Century Mall, 4th Floor, Bole",
    city: "Addis Ababa",
    date: "Tonight",
    time: "08:30 PM",
    price: 350,
    availableSeats: 34,
    totalSeats: 180,
    status: "AVAILABLE",
    rating: 4.8,
    categoryDetails: {
      movieHall: "Hall 1 - Dolby Atmos",
      screenFormat: "4K Laser Surround",
    },
  },
  {
    id: "event-01",
    title: "Addis Afro-Jazz & Cultural Festival 2026",
    category: "EVENT",
    organizer: "Great Ethiopian Events",
    organizerVerified: true,
    location: "Millennium Hall, Bole Medhanealem",
    city: "Addis Ababa",
    date: "Nov 14, 2026",
    time: "04:00 PM",
    price: 600,
    availableSeats: 120,
    totalSeats: 1500,
    status: "AVAILABLE",
    rating: 5.0,
    categoryDetails: {
      eventVenue: "Main Exhibition Arena",
    },
  },
  {
    id: "sports-01",
    title: "St. George SC vs. Ethiopian Coffee SC (Derby)",
    category: "SPORTS",
    organizer: "Ethiopian Premier League",
    organizerVerified: true,
    location: "Abebe Bikila Stadium, Addis Ababa",
    city: "Addis Ababa",
    date: "This Sunday",
    time: "03:00 PM",
    price: 200,
    availableSeats: 45,
    totalSeats: 8000,
    status: "SELLING_FAST",
    rating: 4.9,
    categoryDetails: {
      stadiumStand: "Tribune A & VIP West",
    },
  },
  {
    id: "bus-02",
    title: "Addis Ababa → Bahir Dar (Express Overnight)",
    category: "BUS",
    organizer: "Golden Bus Transport",
    organizerVerified: true,
    location: "Lamberet Bus Terminal, Addis Ababa",
    city: "Addis Ababa",
    date: "Nov 06, 2026",
    time: "08:00 PM",
    price: 1100,
    availableSeats: 14,
    totalSeats: 52,
    status: "AVAILABLE",
    rating: 4.7,
    categoryDetails: {
      origin: "Addis Ababa",
      destination: "Bahir Dar",
      busType: "Executive AC",
    },
  },
  {
    id: "cinema-02",
    title: "Dune: Part Two (IMAX Digital Experience)",
    category: "CINEMA",
    organizer: "Cinema Ethiopia",
    organizerVerified: true,
    location: "Piazza Historical Cinema Hall",
    city: "Addis Ababa",
    date: "Tomorrow",
    time: "06:15 PM",
    price: 300,
    availableSeats: 18,
    totalSeats: 220,
    status: "AVAILABLE",
    rating: 4.8,
    categoryDetails: {
      movieHall: "Grand Ballroom Screen",
    },
  },
];

export default function GuestHomePage() {
  const [activeCategory, setActiveCategory] = useState<TicketCategory | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("ALL");
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);

  // Live filter logic
  const filteredTickets = useMemo(() => {
    return SAMPLE_TICKETS.filter((ticket) => {
      const matchesCategory =
        activeCategory === "ALL" || ticket.category === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity =
        selectedCity === "ALL" || ticket.city === selectedCity;

      return matchesCategory && matchesSearch && matchesCity;
    });
  }, [activeCategory, searchQuery, selectedCity]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* 1. Header with dynamic scroll state and theme dropdown */}
      <PublicNavbar />

      <main className="flex-1 space-y-12 pb-16 -mt-18 pt-18">
        {/* 2. Compact Modern Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-12 px-4 sm:px-6 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-indigo-100/60 via-slate-50 to-slate-50 dark:from-indigo-950/40 dark:via-slate-950 dark:to-slate-950 transition-colors duration-200">
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[130px] pointer-events-none" />

          <div className="max-w-6xl mx-auto space-y-6 relative z-10 text-center">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 dark:bg-indigo-500/10 border border-slate-200 dark:border-indigo-500/25 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-xs backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Multi-Ticket Reservation Engine • Ethiopia</span>
            </div>

            {/* Headline */}
            <div className="space-y-3 max-w-3xl mx-auto">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white">
                Book Buses, Cinemas, <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 dark:from-indigo-400 dark:via-indigo-300 dark:to-blue-400 bg-clip-text text-transparent">
                  Live Events & Sports.
                </span>
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                One seamless platform for instant digital tickets. Pick your seats, pay via Telebirr or Chapa, and enter with your phone QR.
              </p>
            </div>

            {/* Compact Live Search Bar */}
            <div className="max-w-4xl mx-auto bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-3 sm:p-4 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-indigo-950/50 transition-all duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                {/* Search Text Input */}
                <div className="sm:col-span-5 relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search route, movie, concert, or derby..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>

                {/* City Picker */}
                <div className="sm:col-span-4 relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white appearance-none focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  >
                    <option value="ALL">All Destinations & Cities</option>
                    <option value="Addis Ababa">Addis Ababa</option>
                    <option value="Hawassa">Hawassa</option>
                    <option value="Bahir Dar">Bahir Dar</option>
                    <option value="Adama">Adama (Nazret)</option>
                    <option value="Dire Dawa">Dire Dawa</option>
                  </select>
                </div>

                {/* Search Action CTA */}
                <div className="sm:col-span-3">
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 hover:from-indigo-500 hover:to-blue-500 active:scale-95 transition-all"
                  >
                    <Search className="w-4 h-4" />
                    <span>Find Tickets</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Instant QR Boarding Passes</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>100% Verified Providers</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>Real-Time Seat Booking</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Category Filter Tabs */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between flex-wrap gap-4 pb-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>Featured Tickets & Schedules</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                  {filteredTickets.length} available
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Reserve your seat in advance across buses, cinema screenings, festivals, and stadiums.
              </p>
            </div>

            {/* Category Pills Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xs">
              <button
                type="button"
                onClick={() => setActiveCategory("ALL")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === "ALL"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
                }`}
              >
                All
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory("BUS")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === "BUS"
                    ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                    : "text-slate-600 hover:text-cyan-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-cyan-300 dark:hover:bg-slate-800"
                }`}
              >
                <Bus className="w-3.5 h-3.5" />
                <span>Buses</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory("CINEMA")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === "CINEMA"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "text-slate-600 hover:text-purple-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-purple-300 dark:hover:bg-slate-800"
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Cinema</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory("EVENT")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === "EVENT"
                    ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                    : "text-slate-600 hover:text-amber-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-amber-300 dark:hover:bg-slate-800"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Events</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory("SPORTS")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === "SPORTS"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                    : "text-slate-600 hover:text-emerald-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-emerald-300 dark:hover:bg-slate-800"
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Sports</span>
              </button>
            </div>
          </div>

          {/* 4. Live Curated Ticket Grid */}
          <div className="mt-6">
            {filteredTickets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onBookClick={(t) => setSelectedTicket(t)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                <Ticket className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">No tickets found</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  No ticket match for your active filter. Try resetting your search or picking another category.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory("ALL");
                    setSearchQuery("");
                    setSelectedCity("ALL");
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:text-white transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 5. Compact Why Tikora Features Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-950 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 space-y-8 shadow-sm">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Why Millions Trust Tikora
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                The most reliable ticketing platform in the Horn of Africa, engineered for speed and convenience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 flex items-center justify-center">
                  <QrCode className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Instant QR Passes</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Never print physical paper tickets again. Scan straight from your smartphone at bus terminals, gates, or cinema halls.
                </p>
              </div>

              <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80">
                <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400 flex items-center justify-center">
                  <Bus className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Interactive Seat Maps</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Choose your exact preferred seat: window vs. aisle on buses, VIP center on cinema screens, or grandstand stadium tribunes.
                </p>
              </div>

              <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Verified Organizers</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Every bus operator, movie theater, and event planner on Tikora goes through strict commercial compliance verification.
                </p>
              </div>

              <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Telebirr & Local Pay</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Checkout in seconds using Telebirr, Chapa, CBE Birr, or debit cards with zero hidden booking charges.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Compact Quick Auth Callout */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-700 dark:from-indigo-900/60 dark:via-slate-900 dark:to-slate-950 border border-indigo-500/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-white shadow-xl shadow-indigo-600/20">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 dark:bg-indigo-500/20 text-white dark:text-indigo-300 text-[11px] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ready to start?</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black">
                Create a Free Account or Access Your Tickets
              </h3>
              <p className="text-xs text-indigo-100 dark:text-slate-400">
                Log in to view active QR passes, manage bookings, and access rapid check-in.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href={AUTH_ROUTES.LOGIN}
                className="px-5 py-2.5 rounded-xl border border-white/30 dark:border-slate-700 bg-white/10 dark:bg-slate-800 text-xs font-bold text-white hover:bg-white/20 dark:hover:bg-slate-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href={AUTH_ROUTES.REGISTER}
                className="px-5 py-2.5 rounded-xl bg-white text-indigo-700 dark:bg-gradient-to-r dark:from-indigo-600 dark:via-indigo-500 dark:to-blue-600 dark:text-white text-xs font-bold shadow-lg shadow-black/20 hover:bg-indigo-50 transition-all"
              >
                Create Account
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 7. Quick Reservation Preview Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in-50 duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-900/20 dark:shadow-indigo-950/60 p-6 space-y-5 relative">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400">
                Reservation Preview
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                {selectedTicket.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {selectedTicket.organizer} • {selectedTicket.location}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Date & Time:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedTicket.date} at {selectedTicket.time}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Seats Available:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedTicket.availableSeats} of {selectedTicket.totalSeats} seats
                </span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800 text-sm">
                <span className="font-bold text-slate-900 dark:text-white">Ticket Price:</span>
                <span className="font-black text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(selectedTicket.price)}
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <Link
                href={`${AUTH_ROUTES.LOGIN}?redirect=/tickets/${selectedTicket.id}`}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 text-white font-bold text-xs shadow-md shadow-indigo-600/30 hover:from-indigo-500 hover:to-blue-500 transition-all"
              >
                <span>Continue to Seat Selection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-center text-[11px] text-slate-500">
                Sign in or register to secure your seat lock with instant QR code.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 8. Modern Compact Footer */}
      <Footer />
    </div>
  );
}
