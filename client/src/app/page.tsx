"use client";

import React, { useState, useEffect } from "react";
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
  Compass,
  Zap,
  CheckCircle2,
  Users,
  Phone,
  Flame,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TicketCard } from "@/components/tickets/ticket-card";
import { TicketService } from "@/services/ticket.service";
import { TicketItem } from "@/types/ticket.types";
import { ETHIOPIAN_CITIES, TicketCategory } from "@/lib/constants";

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<TicketCategory | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Hawassa");
  const [selectedDate, setSelectedDate] = useState("2026-11-15");
  const [tickets, setTickets] = useState<TicketItem[]>([]);

  useEffect(() => {
    setMounted(true);
    const cached = TicketService.getAllTickets();
    if (cached && cached.length > 0) {
      setTickets(cached);
    }
    TicketService.fetchTickets().then((data) => {
      if (data && data.length > 0) {
        setTickets(data);
      }
    });
  }, []);

  const isSelectedCategoryActive = activeCategory === "ALL" || TicketService.isCategoryActive(activeCategory);

  const filteredTickets =
    activeCategory === "ALL"
      ? tickets.filter((t) => TicketService.isCategoryActive(t.category))
      : !isSelectedCategoryActive
      ? []
      : tickets.filter((t) => t.category === activeCategory && TicketService.isCategoryActive(t.category));

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
      description: "Express luxury coaches to Hawassa, Bahir Dar, Gondar & Dire Dawa with real-time seat matrices.",
      icon: Bus,
      badge: "Popular Across Ethiopia",
      link: "/bus",
      actionText: "Search Bus Routes",
    },
    {
      id: "CINEMA",
      title: "Cinema & IMAX 3D",
      description: "Century Mall, Edna Mall & Gast Cinema with 4K laser projection and couple loungers.",
      icon: Film,
      badge: "Now Showing & Coming Soon",
      link: "/cinema",
      actionText: "View Showtimes",
    },
    {
      id: "EVENT",
      title: "Concerts & Festivals",
      description: "Addis Jazz festivals, Ethiopian cultural holidays, tech conventions & standup comedy.",
      icon: Calendar,
      badge: "VIP & Regular Passes",
      link: "/events",
      actionText: "Explore Events",
    },
    {
      id: "SPORTS",
      title: "Matchday Stadium Sports",
      description: "Ethiopian Premier League clashes, Sheger Derby (St. George vs Coffee SC) and national finals.",
      icon: Trophy,
      badge: "Matchday Tribune Passes",
      link: "/sports",
      actionText: "Browse Fixtures",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-[#F8FAFC]">
      <Header />

      {/* Hero Section with Ambient Glow Mesh */}
      <section className="relative overflow-hidden pt-6 pb-10 sm:pt-12 sm:pb-16 px-4 sm:px-6 border-b border-slate-200/80 dark:border-slate-800">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-72 bg-gradient-to-b from-amber-500/15 via-amber-500/5 to-transparent pointer-events-none rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/25 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Ethiopia&apos;s Modern Multi-Category Ticket Reservation Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight sm:leading-tight">
            Book Verified Tickets for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500">
              Buses, Cinema,
            </span>{" "}
            Events & Sports
          </h1>

          <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Verified Ethiopian operators, instant interactive seat selection, and digital QR passes powered by Telebirr, CBE Birr & Chapa.
          </p>

          {/* High-End Search Card */}
          <div className="rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 p-3.5 sm:p-5 shadow-lg text-left max-w-3xl mx-auto">
            {/* Category Switcher Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 border-b border-slate-200/80 dark:border-slate-800 mb-2.5">
              {[
                { id: "ALL", label: "All Passes" },
                { id: "BUS", label: "BUS" },
                { id: "CINEMA", label: "CINEMA" },
                { id: "EVENT", label: "EVENT" },
                { id: "SPORTS", label: "SPORTS" },
              ].map((cat) => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? "bg-amber-600 text-white shadow-xs font-black"
                        : "bg-slate-100 dark:bg-slate-800 text-muted-foreground hover:text-foreground hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Form Inputs */}
            <form onSubmit={handleHeroSearch} className="grid grid-cols-2 sm:grid-cols-12 gap-2.5 sm:gap-3">
              <div className="col-span-2 sm:col-span-5 relative">
                <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1">
                  Destination or Title
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Selam Bus, Gladiator II, Jazz Festival..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>

              <div className="col-span-1 sm:col-span-3 relative">
                <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1">
                  City / Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 appearance-none cursor-pointer"
                  >
                    <option value="">All Regions</option>
                    {ETHIOPIAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2 relative">
                <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1">
                  Travel Date
                </label>
                <div className="relative">
                  <CalendarIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full pl-9 pr-2 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>

              <div className="col-span-2 flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white text-xs font-bold shadow-md shadow-amber-600/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Tickets</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-1 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 font-medium">
              <QrCode className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Offline QR Passes</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Verified Partners</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <CreditCard className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Telebirr & CBE Birr Instant Checkout</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Category Showcase Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Browse Categories
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              Explore TIKORA Sectors
            </h2>
          </div>
          <Link
            href="/search"
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>Explore All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {categoryCards.map((card) => {
            const Icon = card.icon;
            const isCatActive = TicketService.isCategoryActive(card.id);
            return (
              <div
                key={card.id}
                className={`rounded-2xl p-3 sm:p-4 bg-white dark:bg-[#161922] border transition-all duration-300 flex flex-col justify-between ${
                  isCatActive
                    ? "border-slate-200/90 dark:border-slate-800 hover:border-amber-500/40 dark:hover:border-amber-500/30 hover:shadow-md"
                    : "border-slate-200/50 dark:border-slate-800/50 opacity-75"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </div>
                    {isCatActive ? (
                      <span className="text-[8px] sm:text-[9px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 truncate max-w-[120px]">
                        {card.badge}
                      </span>
                    ) : (
                      <span className="text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 truncate max-w-[120px]">
                        Temporarily Off
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {card.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug line-clamp-2">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 mt-3">
                  {isCatActive ? (
                    <Link
                      href={card.link}
                      className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 group"
                    >
                      <span>{card.actionText}</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-slate-400 cursor-not-allowed">
                      <span>Sector Deactivated</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured & Curated Tickets Section */}
      <section className="bg-white dark:bg-[#161922] border-y border-slate-200/80 dark:border-slate-800 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block mb-0.5">
                Trending Across Ethiopia
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-foreground tracking-tight">
                Popular Passes Ready to Book
              </h2>
            </div>

            {/* Category Filter Pills (No icons, reduced compact size) */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
              {(["ALL", "BUS", "CINEMA", "EVENT", "SPORTS"] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide transition-all shrink-0 cursor-pointer ${
                    activeCategory === cat
                      ? "bg-amber-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-muted-foreground hover:text-foreground hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat === "ALL" ? "All Passes" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Compact Ticket Grid */}
          {!mounted ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl aspect-[4/3] bg-slate-100 dark:bg-slate-800/60 animate-pulse border border-slate-200/50 dark:border-slate-800/50 min-h-[220px]"
                />
              ))}
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 p-8 space-y-3">
              <Ticket className="w-10 h-10 text-muted-foreground/40 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">
                  {!isSelectedCategoryActive
                    ? `${activeCategory} Sector Temporarily Deactivated`
                    : "No passes currently published"}
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  {!isSelectedCategoryActive
                    ? "This sector has been deactivated by platform administration. Passes in this category are temporarily hidden from public reservations."
                    : "Tickets for intercity buses, cinema premieres, live concerts, and soccer derbies will appear here once listed by verified Ethiopian partners."}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredTickets.slice(0, 8).map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          )}

          {mounted && tickets.length > 0 && (
            <div className="text-center pt-4">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-foreground text-xs font-bold transition-all shadow-xs"
              >
                <span>View All {tickets.length} Passes</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 3-Step Checkout Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Simple & Fast
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-foreground">
            How TIKORA Works
          </h2>
          <p className="text-xs text-muted-foreground">
            Reserve your bus coach seat, movie screening, concert pass, or stadium tribune in under a minute.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black text-base mx-auto border border-amber-500/20 shadow-xs">
              1
            </div>
            <h3 className="text-sm font-bold text-foreground">
              Choose Service & Time
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Explore daily bus schedules, cinema showtimes, music concerts, or stadium fixtures.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black text-base mx-auto border border-amber-500/20 shadow-xs">
              2
            </div>
            <h3 className="text-sm font-bold text-foreground">
              Pick Your Exact Seats
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Interactive 2x2 coach layouts, cinema hall loungers, or stadium tribune tiers.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black text-base mx-auto border border-amber-500/20 shadow-xs">
              3
            </div>
            <h3 className="text-sm font-bold text-foreground">
              Instant Offline QR Pass
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Pay with Telebirr, CBE Birr, or Chapa for instant digital entry without paper tickets.
            </p>
          </div>
        </div>
      </section>

      {/* Special Offer Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12 w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-5 shadow-xl">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 inline-block border border-amber-500/30">
              Exclusive Member Offer
            </span>
            <h3 className="text-lg sm:text-2xl font-black">
              Get 15% Off Your Next Bus or Concert Ticket
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Use promo code <strong className="text-amber-400 font-mono">TIKORA15</strong> with Telebirr or CBE Birr checkout.
            </p>
          </div>

          <Link
            href="/search"
            className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-md shadow-amber-600/30 active:scale-95 shrink-0"
          >
            Claim Offer
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
