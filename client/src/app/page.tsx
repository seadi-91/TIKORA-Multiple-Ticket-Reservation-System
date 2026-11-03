"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Ticket,
  Bus,
  Film,
  Calendar,
  Trophy,
  Search,
  MapPin,
  Calendar as CalendarIcon,
  ShieldCheck,
  QrCode,
  ArrowRight,
  Star,
  CreditCard,
  ChevronRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TicketCard } from "@/components/tickets/ticket-card";
import { TicketService } from "@/services/ticket.service";
import { ETHIOPIAN_CITIES, TicketCategory } from "@/lib/constants";

export default function HomePage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<TicketCategory | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Hawassa");
  const [selectedDate, setSelectedDate] = useState("2026-11-15");

  const allTickets = TicketService.getAllTickets();

  const filteredTickets =
    activeCategory === "ALL"
      ? allTickets
      : allTickets.filter((t) => t.category === activeCategory);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (activeCategory !== "ALL") params.set("category", activeCategory);
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCity) params.set("city", selectedCity);
    if (selectedDate) params.set("date", selectedDate);
    router.push(`/search?${params.toString()}`);
  };

  const categoryCards = [
    {
      id: "BUS",
      title: "Intercity Bus Fleets",
      description: "Express coaches to Hawassa, Bahir Dar, Gondar & Dire Dawa with real-time seat matrices.",
      icon: Bus,
      badge: "Popular Across Ethiopia",
      color: "from-blue-600 to-indigo-700",
      bgLight: "bg-blue-50/60 dark:bg-blue-950/30 border-blue-200/80 dark:border-blue-900/40",
      link: "/bus",
      actionText: "Search Bus Routes",
    },
    {
      id: "CINEMA",
      title: "Cinema & IMAX",
      description: "Century Mall, Edna Mall & Gast Cinema with 4K laser projection and couple loungers.",
      icon: Film,
      badge: "Now Showing & Coming Soon",
      color: "from-purple-600 to-indigo-700",
      bgLight: "bg-purple-50/60 dark:bg-purple-950/30 border-purple-200/80 dark:border-purple-900/40",
      link: "/cinema",
      actionText: "View Showtimes",
    },
    {
      id: "EVENT",
      title: "Concerts & Festivals",
      description: "Addis Jazz festivals, Ethiopian cultural holidays, tech conventions & standup comedy.",
      icon: Calendar,
      badge: "VIP & Regular Passes",
      color: "from-amber-600 to-orange-700",
      bgLight: "bg-amber-50/60 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-900/40",
      link: "/events",
      actionText: "Explore Events",
    },
    {
      id: "SPORTS",
      title: "Stadium Sports",
      description: "Ethiopian Premier League clashes, Sheger Derby (St. George vs Coffee SC) and national finals.",
      icon: Trophy,
      badge: "Matchday Tribune Passes",
      color: "from-emerald-600 to-teal-700",
      bgLight: "bg-emerald-50/60 dark:bg-amber-950/30 border-amber-200/80 dark:border-slate-800/40",
      link: "/sports",
      actionText: "Browse Fixtures",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-[#F8FAFC]">
      <Header />

      {/* Hero Section - Compact & Modern */}
      <section className="relative overflow-hidden pt-4 pb-6 sm:pt-8 sm:pb-12 px-3 sm:px-6 border-b border-[#E2E8F0] dark:border-slate-800">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-48 bg-gradient-to-b from-slate-200/50 dark:from-slate-800/30 to-transparent pointer-events-none rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center space-y-2.5 sm:space-y-4">
          {/* Tagline Pill - Compact */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] sm:text-[11px] font-semibold shadow-2xs">
            <Sparkles className="w-3 h-3 text-[#B45309] dark:text-amber-400" />
            <span>Ethiopia&apos;s Smart Multi-Ticket Platform</span>
          </div>

          {/* Main Headline - Compact on Mobile */}
          <h1 className="text-xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] dark:text-white tracking-tight leading-tight">
            Book Tickets for{" "}
            <span className="text-[#B45309] dark:text-[#D97706]">Buses, Cinema,</span>{" "}
            Events & Sports
          </h1>

          <p className="text-[11px] sm:text-sm text-[#64748B] dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Verified operators, instant interactive seat selection, and digital QR passes powered by Telebirr, CBE Birr & Chapa.
          </p>

          {/* Search Box Card - Compact */}
          <div className="rounded-xl sm:rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-2.5 sm:p-4 shadow-sm text-left max-w-3xl mx-auto">
            {/* Category Switcher Tabs - Compact & Smooth Touch Scroll */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 border-b border-[#E2E8F0] dark:border-slate-800 mb-2.5">
              {[
                { id: "ALL", label: "All", icon: Ticket },
                { id: "BUS", label: "Buses", icon: Bus },
                { id: "CINEMA", label: "Cinema", icon: Film },
                { id: "EVENT", label: "Events", icon: Calendar },
                { id: "SPORTS", label: "Sports", icon: Trophy },
              ].map((cat) => {
                const Icon = cat.icon;
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold transition-all shrink-0 cursor-pointer min-h-[30px] touch-manipulation ${
                      isSelected
                        ? "bg-[#B45309] text-white shadow-xs font-bold"
                        : "bg-slate-100 text-[#64748B] hover:text-[#0F172A] dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Form Inputs - Compact 2-Col on Mobile */}
            <form onSubmit={handleHeroSearch} className="grid grid-cols-2 sm:grid-cols-12 gap-2 sm:gap-2.5">
              <div className="col-span-2 sm:col-span-5 relative">
                <label className="block text-[9px] uppercase font-bold text-[#64748B] dark:text-slate-400 mb-0.5">
                  Search Query
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Selam Bus, Avatar..."
                    className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#B45309] min-h-[36px] sm:min-h-0"
                  />
                </div>
              </div>

              <div className="col-span-1 sm:col-span-3 relative">
                <label className="block text-[9px] uppercase font-bold text-[#64748B] dark:text-slate-400 mb-0.5">
                  City
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#B45309] appearance-none cursor-pointer min-h-[36px] sm:min-h-0"
                  >
                    <option value="">All Cities</option>
                    {ETHIOPIAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2 relative">
                <label className="block text-[9px] uppercase font-bold text-[#64748B] dark:text-slate-400 mb-0.5">
                  Date
                </label>
                <div className="relative">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#64748B] absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full pl-7 pr-1 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#B45309] min-h-[36px] sm:min-h-0"
                  />
                </div>
              </div>

              <div className="col-span-2 flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 sm:py-1.5 px-3 rounded-lg bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer h-9 sm:h-[30px] touch-manipulation"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Metrics Bar - Compact */}
          <div className="pt-0.5 flex flex-wrap items-center justify-center gap-3 sm:gap-8 text-[10px] sm:text-[11px] text-[#64748B] dark:text-slate-400">
            <div className="flex items-center gap-1">
              <QrCode className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              <span>Instant QR Passes</span>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              <span>Verified Partners</span>
            </div>
            <div className="flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              <span>Telebirr & CBE Birr</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Category Cards - 2 Columns on Mobile as Requested */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 w-full space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#B45309] dark:text-amber-400 uppercase tracking-wider">
              Browse by Sector
            </span>
            <h2 className="text-lg sm:text-xl font-black text-[#0F172A] dark:text-white">
              Discover Available Tickets
            </h2>
          </div>
          <Link
            href="/search"
            className="text-xs font-semibold text-[#B45309] dark:text-amber-400 hover:underline flex items-center gap-0.5"
          >
            <span>Explore All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {categoryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className={`rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between ${card.bgLight}`}
              >
                <div className="space-y-1.5 sm:space-y-2.5">
                  <div className="flex items-center justify-between gap-1">
                    <div
                      className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center shadow-xs shrink-0`}
                    >
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <span className="text-[8px] sm:text-[9px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-white/90 dark:bg-black/50 text-[#0F172A] dark:text-slate-200 truncate">
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white truncate">
                      {card.title}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-[#64748B] dark:text-slate-400 mt-0.5 sm:mt-1 leading-snug line-clamp-2">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 sm:pt-3">
                  <Link
                    href={card.link}
                    className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#B45309] dark:text-amber-400 hover:text-[#92400E] group"
                  >
                    <span className="truncate">{card.actionText}</span>
                    <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-1 transition-transform shrink-0" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured & Curated Tickets Section - Compact */}
      <section className="bg-white dark:bg-[#161922] border-y border-[#E2E8F0] dark:border-slate-800 py-5 sm:py-8 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#B45309] dark:text-amber-400 uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Featured & Top Rated</span>
              </div>
              <h2 className="text-base sm:text-xl font-black text-[#0F172A] dark:text-white">
                Popular Tickets Ready to Book
              </h2>
            </div>

            {/* Quick Category Filter Pills - Compact */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(["ALL", "BUS", "CINEMA", "EVENT", "SPORTS"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    activeCategory === cat
                      ? "bg-[#B45309] text-white shadow-2xs font-bold"
                      : "bg-slate-100 text-[#64748B] hover:text-[#0F172A] dark:bg-slate-800/80 dark:text-slate-300"
                  }`}
                >
                  {cat === "ALL" ? "All" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* 2-Column Grid on Mobile as Requested */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
            {filteredTickets.slice(0, 8).map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        </div>
      </section>

      {/* How TIKORA Works - Compact 3-Column on Mobile */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-8 w-full space-y-3 sm:space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-[10px] font-bold text-[#B45309] dark:text-[#D97706] uppercase tracking-wider">
            Quick 3-Step Checkout
          </span>
          <h2 className="text-base sm:text-xl font-black text-[#0F172A] dark:text-white">
            How TIKORA Works
          </h2>
          <p className="text-[11px] sm:text-xs text-[#64748B] dark:text-slate-400">
            Reserve your bus coach seat, movie screening, concert pass, or stadium tribune in under a minute.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3.5">
          <div className="p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 text-center space-y-1 sm:space-y-2">
            <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-xs sm:text-sm mx-auto shadow-2xs">
              1
            </div>
            <h3 className="text-[11px] sm:text-sm font-bold text-[#0F172A] dark:text-white leading-tight">
              Choose Ticket & Time
            </h3>
            <p className="text-[9px] sm:text-xs text-[#64748B] dark:text-slate-400 leading-snug line-clamp-2 sm:line-clamp-none">
              Explore bus routes, cinema screenings, music concerts, or stadiums.
            </p>
          </div>

          <div className="p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 text-center space-y-1 sm:space-y-2">
            <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-xs sm:text-sm mx-auto shadow-2xs">
              2
            </div>
            <h3 className="text-[11px] sm:text-sm font-bold text-[#0F172A] dark:text-white leading-tight">
              Select Your Exact Seat
            </h3>
            <p className="text-[9px] sm:text-xs text-[#64748B] dark:text-slate-400 leading-snug line-clamp-2 sm:line-clamp-none">
              Interactive 2x2 bus grid, 4K theater rows, or festival tiers.
            </p>
          </div>

          <div className="p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 text-center space-y-1 sm:space-y-2">
            <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-xs sm:text-sm mx-auto shadow-2xs">
              3
            </div>
            <h3 className="text-[11px] sm:text-sm font-bold text-[#0F172A] dark:text-white leading-tight">
              Instant QR Pass
            </h3>
            <p className="text-[9px] sm:text-xs text-[#64748B] dark:text-slate-400 leading-snug line-clamp-2 sm:line-clamp-none">
              Pay with Telebirr, CBE Birr, or Chapa for instant digital entry.
            </p>
          </div>
        </div>
      </section>

      {/* Special Offer Banner - Modern Dark Executive Card */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 pb-4 sm:pb-6 w-full">
        <div className="rounded-xl sm:rounded-2xl bg-[#0F172A] dark:bg-[#161922] border border-slate-800 p-3.5 sm:p-6 text-white flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 shadow-sm">
          <div className="space-y-1 sm:space-y-1.5 max-w-lg text-center md:text-left">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/10 text-slate-200 inline-block border border-white/10">
              Seasonal Promotion
            </span>
            <h3 className="text-sm sm:text-xl font-black">
              Get 15% Off Your Next Bus or Concert Ticket
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
              Use promo code <strong className="text-white underline">SAVE15</strong> with Telebirr or CBE Birr at checkout.
            </p>
          </div>

          <Link
            href="/search"
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold transition-all shadow-xs active:scale-95 shrink-0"
          >
            Claim Offer
          </Link>
        </div>
      </section>

      {/* Testimonials - Compact */}
      <section className="bg-white dark:bg-[#161922] border-t border-[#E2E8F0] dark:border-slate-800 py-5 sm:py-8 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4">
          <div className="text-center max-w-xl mx-auto space-y-0.5 sm:space-y-1">
            <span className="text-[10px] font-bold text-[#B45309] dark:text-[#D97706] uppercase tracking-wider">
              Reviews & Feedback
            </span>
            <h2 className="text-base sm:text-xl font-black text-[#0F172A] dark:text-white">
              Trusted by Ticket Buyers Everywhere
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
            {[
              {
                name: "Dawit Yohannes",
                role: "Frequent Bus Commuter",
                quote: "TIKORA saved me hours at Autobus Tera. I picked my window seat on Selam Bus in seconds and boarded with my Telebirr QR pass.",
                rating: 5,
              },
              {
                name: "Tigist Haile",
                role: "Cinema & Movie Fan",
                quote: "Booking IMAX couple seats at Century Mall through TIKORA is smooth. No more counter lines and the seat view is accurate.",
                rating: 5,
              },
              {
                name: "Robel Kebede",
                role: "Football Fan",
                quote: "Got my Katanga tribune ticket for the Sheger Derby without hassles. The digital barcode worked immediately at the stadium turnstile.",
                rating: 5,
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className="p-3 sm:p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0C0E14] border border-[#E2E8F0] dark:border-slate-800 space-y-1.5"
              >
                <div className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
                <p className="text-[11px] sm:text-xs text-[#0F172A] dark:text-slate-300 leading-snug italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="pt-1.5 border-t border-[#E2E8F0] dark:border-slate-800">
                  <h4 className="text-[11px] sm:text-xs font-bold text-[#0F172A] dark:text-white">{t.name}</h4>
                  <span className="text-[9px] sm:text-[10px] text-[#64748B] dark:text-slate-400">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
