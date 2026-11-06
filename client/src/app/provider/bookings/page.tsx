"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bus,
  CheckCircle2,
  Copy,
  Download,
  Eye,
  Film,
  Filter,
  Music,
  Search,
  Trophy,
  UserCheck,
} from "lucide-react";
import { formatCurrency } from "@/lib/format-currency";
import { TicketCategory } from "@/types/ticket.types";
import { toast } from "sonner";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { useProviderStore } from "@/stores/provider.store";

interface ProviderBookingRecord {
  id: string;
  reference: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceTitle: string;
  category: TicketCategory;
  travelDate: string;
  departureTime: string;
  seats: string[];
  totalAmount: number;
  paymentMethod: "TELEBIRR" | "CBE_BIRR" | "CHAPA";
  paymentStatus: "PAID" | "PENDING" | "REFUNDED";
  bookingStatus: "CONFIRMED" | "CHECKED_IN" | "CANCELLED";
  createdAt: string;
}

const INITIAL_BOOKINGS: ProviderBookingRecord[] = [
  {
    id: "BKG-8829",
    reference: "TH-BUS-8829",
    customerName: "Dawit Hailemariam",
    customerPhone: "+251 91 182 9182",
    customerEmail: "dawit.h@gmail.com",
    serviceTitle: "Addis Ababa to Hawassa Luxury Express",
    category: "BUS",
    travelDate: "2026-11-15",
    departureTime: "06:00 AM",
    seats: ["04A", "04B"],
    totalAmount: 1300,
    paymentMethod: "TELEBIRR",
    paymentStatus: "PAID",
    bookingStatus: "CHECKED_IN",
    createdAt: "2026-11-10 14:22",
  },
  {
    id: "BKG-8830",
    reference: "TH-BUS-8830",
    customerName: "Tigist Alemu",
    customerPhone: "+251 92 344 8811",
    customerEmail: "tigist.a@gmail.com",
    serviceTitle: "Addis Ababa to Hawassa Luxury Express",
    category: "BUS",
    travelDate: "2026-11-15",
    departureTime: "06:00 AM",
    seats: ["05A"],
    totalAmount: 650,
    paymentMethod: "CBE_BIRR",
    paymentStatus: "PAID",
    bookingStatus: "CHECKED_IN",
    createdAt: "2026-11-11 09:15",
  },
  {
    id: "BKG-8835",
    reference: "TH-BUS-8835",
    customerName: "Yared Tesfaye",
    customerPhone: "+251 93 512 0099",
    customerEmail: "yared.t@outlook.com",
    serviceTitle: "Addis Ababa to Hawassa Luxury Express",
    category: "BUS",
    travelDate: "2026-11-15",
    departureTime: "06:00 AM",
    seats: ["05B"],
    totalAmount: 650,
    paymentMethod: "TELEBIRR",
    paymentStatus: "PAID",
    bookingStatus: "CONFIRMED",
    createdAt: "2026-11-11 11:30",
  },
  {
    id: "BKG-8841",
    reference: "TH-BUS-8841",
    customerName: "Bethlehem Assefa",
    customerPhone: "+251 91 766 2211",
    customerEmail: "beth.assefa@gmail.com",
    serviceTitle: "Addis Ababa to Hawassa Luxury Express",
    category: "BUS",
    travelDate: "2026-11-15",
    departureTime: "06:00 AM",
    seats: ["06A", "06B", "07A"],
    totalAmount: 1950,
    paymentMethod: "CHAPA",
    paymentStatus: "PAID",
    bookingStatus: "CONFIRMED",
    createdAt: "2026-11-12 16:45",
  },
  {
    id: "BKG-8849",
    reference: "TH-BUS-8849",
    customerName: "Samuel Kebede",
    customerPhone: "+251 94 881 7733",
    customerEmail: "samuel.k@yahoo.com",
    serviceTitle: "Addis Ababa to Hawassa Luxury Express",
    category: "BUS",
    travelDate: "2026-11-15",
    departureTime: "06:00 AM",
    seats: ["07B"],
    totalAmount: 650,
    paymentMethod: "TELEBIRR",
    paymentStatus: "PAID",
    bookingStatus: "CHECKED_IN",
    createdAt: "2026-11-13 08:20",
  },
  {
    id: "BKG-8854",
    reference: "TH-EVT-9921",
    customerName: "Alazar Mengistu",
    customerPhone: "+251 91 329 1100",
    customerEmail: "alazar.m@gmail.com",
    serviceTitle: "Afro Beats & Jazz Night Live",
    category: "EVENT",
    travelDate: "2026-11-20",
    departureTime: "06:00 PM",
    seats: ["VIP-12", "VIP-13"],
    totalAmount: 1700,
    paymentMethod: "TELEBIRR",
    paymentStatus: "PAID",
    bookingStatus: "CONFIRMED",
    createdAt: "2026-11-13 18:05",
  },
  {
    id: "BKG-8860",
    reference: "TH-SPT-3312",
    customerName: "Henok Tadesse",
    customerPhone: "+251 92 119 5544",
    customerEmail: "henok.t@ethionet.et",
    serviceTitle: "Ethiopian Premier League Derby: St. George vs Coffee",
    category: "SPORTS",
    travelDate: "2026-11-22",
    departureTime: "03:00 PM",
    seats: ["TR-01", "TR-02"],
    totalAmount: 400,
    paymentMethod: "CBE_BIRR",
    paymentStatus: "PAID",
    bookingStatus: "CONFIRMED",
    createdAt: "2026-11-14 10:11",
  },
  {
    id: "BKG-8868",
    reference: "TH-CNM-4419",
    customerName: "Meron Worku",
    customerPhone: "+251 91 887 2345",
    customerEmail: "meron.w@gmail.com",
    serviceTitle: "Avatar: The Way of Water 3D Dolby",
    category: "CINEMA",
    travelDate: "2026-11-18",
    departureTime: "07:30 PM",
    seats: ["H1-E08", "H1-E09"],
    totalAmount: 500,
    paymentMethod: "TELEBIRR",
    paymentStatus: "PAID",
    bookingStatus: "CONFIRMED",
    createdAt: "2026-11-14 13:40",
  },
  {
    id: "BKG-8871",
    reference: "TH-BUS-8871",
    customerName: "Kassahun Desta",
    customerPhone: "+251 91 552 9900",
    customerEmail: "kassahun.d@gmail.com",
    serviceTitle: "Addis Ababa to Bahir Dar Lake Cruiser",
    category: "BUS",
    travelDate: "2026-11-16",
    departureTime: "05:30 AM",
    seats: ["02A"],
    totalAmount: 950,
    paymentMethod: "TELEBIRR",
    paymentStatus: "REFUNDED",
    bookingStatus: "CANCELLED",
    createdAt: "2026-11-09 11:20",
  },
  // Additional Cinema Bookings
  {
    id: "BKG-8880",
    reference: "TH-CNM-4425",
    customerName: "Ephrem Negash",
    customerPhone: "+251 92 443 1188",
    customerEmail: "ephrem.n@gmail.com",
    serviceTitle: "Gladiator II: Ethiopian Premiere",
    category: "CINEMA",
    travelDate: "2026-11-15",
    departureTime: "02:30 PM",
    seats: ["H1-D04", "H1-D05"],
    totalAmount: 560,
    paymentMethod: "CBE_BIRR",
    paymentStatus: "PAID",
    bookingStatus: "CHECKED_IN",
    createdAt: "2026-11-13 14:10",
  },
  {
    id: "BKG-8881",
    reference: "TH-CNM-4430",
    customerName: "Selamawit Bekele",
    customerPhone: "+251 93 112 4455",
    customerEmail: "selam.b@outlook.com",
    serviceTitle: "Mufasa: The Lion King",
    category: "CINEMA",
    travelDate: "2026-11-15",
    departureTime: "04:00 PM",
    seats: ["H2-C10", "H2-C11", "H2-C12"],
    totalAmount: 780,
    paymentMethod: "TELEBIRR",
    paymentStatus: "PAID",
    bookingStatus: "CONFIRMED",
    createdAt: "2026-11-14 11:00",
  },
  {
    id: "BKG-8882",
    reference: "TH-CNM-4435",
    customerName: "Kalkidan Girma",
    customerPhone: "+251 94 887 6622",
    customerEmail: "kalkidan.g@gmail.com",
    serviceTitle: "Gladiator II: Prime Evening Screening",
    category: "CINEMA",
    travelDate: "2026-11-15",
    departureTime: "05:30 PM",
    seats: ["H1-VIP-01", "H1-VIP-02"],
    totalAmount: 900,
    paymentMethod: "CHAPA",
    paymentStatus: "PAID",
    bookingStatus: "CHECKED_IN",
    createdAt: "2026-11-14 16:30",
  },
  // Additional Event Bookings
  {
    id: "BKG-8890",
    reference: "TH-EVT-9925",
    customerName: "Blen Assefa",
    customerPhone: "+251 91 223 9988",
    customerEmail: "blen.a@gmail.com",
    serviceTitle: "Teddy Afro New Year Concert Tour",
    category: "EVENT",
    travelDate: "2026-11-28",
    departureTime: "07:00 PM",
    seats: ["VIP-RedCarpet-04"],
    totalAmount: 1500,
    paymentMethod: "TELEBIRR",
    paymentStatus: "PAID",
    bookingStatus: "CONFIRMED",
    createdAt: "2026-11-13 19:45",
  },
  {
    id: "BKG-8891",
    reference: "TH-EVT-9930",
    customerName: "Yohannes Hailu",
    customerPhone: "+251 93 445 7766",
    customerEmail: "yohannes.h@gmail.com",
    serviceTitle: "Addis International Jazz & Afrobeat Festival",
    category: "EVENT",
    travelDate: "2026-12-05",
    departureTime: "04:00 PM",
    seats: ["GA-Pass-089", "GA-Pass-090"],
    totalAmount: 1700,
    paymentMethod: "CBE_BIRR",
    paymentStatus: "PAID",
    bookingStatus: "CONFIRMED",
    createdAt: "2026-11-14 09:20",
  },
  // Additional Sports Bookings
  {
    id: "BKG-8900",
    reference: "TH-SPT-3320",
    customerName: "Daniel Abebe",
    customerPhone: "+251 91 334 5566",
    customerEmail: "daniel.a@gmail.com",
    serviceTitle: "Ethiopian Premier League Derby: St. George vs Coffee",
    category: "SPORTS",
    travelDate: "2026-11-22",
    departureTime: "03:00 PM",
    seats: ["Grandstand-VIP-14", "Grandstand-VIP-15"],
    totalAmount: 800,
    paymentMethod: "TELEBIRR",
    paymentStatus: "PAID",
    bookingStatus: "CHECKED_IN",
    createdAt: "2026-11-14 12:15",
  },
  {
    id: "BKG-8901",
    reference: "TH-SPT-3325",
    customerName: "Mulugeta Tadesse",
    customerPhone: "+251 92 667 8899",
    customerEmail: "mulugeta.t@gmail.com",
    serviceTitle: "National Basketball League Finals: Game 5",
    category: "SPORTS",
    travelDate: "2026-11-25",
    departureTime: "05:00 PM",
    seats: ["Courtside-A04"],
    totalAmount: 450,
    paymentMethod: "CBE_BIRR",
    paymentStatus: "PAID",
    bookingStatus: "CONFIRMED",
    createdAt: "2026-11-14 15:40",
  },
];

export default function ProviderBookingsPage() {
  const { organization } = useProviderStore();
  const sectorBookings = INITIAL_BOOKINGS.filter((b) => b.category === organization.category);
  const [bookings, setBookings] = useState<ProviderBookingRecord[]>(sectorBookings);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    setBookings(INITIAL_BOOKINGS.filter((b) => b.category === organization.category));
  }, [organization.category]);

  const filteredBookings = bookings.filter((b) => {
    const matchesPayment = paymentFilter === "ALL" || b.paymentStatus === paymentFilter;
    const matchesStatus = statusFilter === "ALL" || b.bookingStatus === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === "" ||
      b.reference.toLowerCase().includes(q) ||
      b.customerName.toLowerCase().includes(q) ||
      b.customerPhone.toLowerCase().includes(q) ||
      b.serviceTitle.toLowerCase().includes(q);

    return matchesPayment && matchesStatus && matchesSearch;
  });

  const totalGrossRevenue = bookings
    .filter((b) => b.paymentStatus === "PAID")
    .reduce((acc, b) => acc + b.totalAmount, 0);

  const handleExportCSV = () => {
    const headers = "Reference,Customer,Phone,Service,Category,Seats,Amount,Payment,Status,Date\n";
    const rows = filteredBookings
      .map(
        (b) =>
          `"${b.reference}","${b.customerName}","${b.customerPhone}","${b.serviceTitle}","${b.category}","${b.seats.join(
            " "
          )}",${b.totalAmount},"${b.paymentStatus}","${b.bookingStatus}","${b.travelDate}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `provider-bookings-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Bookings CSV export completed.");
  };

  const handleQuickCheckIn = (id: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              bookingStatus: b.bookingStatus === "CHECKED_IN" ? "CONFIRMED" : "CHECKED_IN",
            }
          : b
      )
    );
    toast.success("Passenger boarding status updated.");
  };

  const getCategoryIcon = (cat: TicketCategory) => {
    switch (cat) {
      case "BUS":
        return <Bus className="w-3 h-3 text-amber-600" />;
      case "EVENT":
        return <Music className="w-3 h-3 text-purple-600" />;
      case "SPORTS":
        return <Trophy className="w-3 h-3 text-emerald-600" />;
      case "CINEMA":
        return <Film className="w-3 h-3 text-sky-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
              {organization.category} Orders
            </span>
            <span className="text-xs text-muted-foreground">{organization.name}</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            Customer Bookings & Orders
          </h1>
          <p className="text-xs text-muted-foreground">
            Monitor confirmed reservations, admissions, and ticket check-ins for {organization.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-border/70 bg-card hover:bg-muted text-foreground transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export Bookings CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
          <span className="text-muted-foreground text-xs block mb-1">Total Bookings</span>
          <div className="text-sm sm:text-base font-bold text-foreground">{bookings.length}</div>
          <span className="text-[11px] text-muted-foreground">Live order ledger</span>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
          <span className="text-muted-foreground text-xs block mb-1">Verified Boarded</span>
          <div className="text-sm sm:text-base font-bold text-emerald-600">
            {bookings.filter((b) => b.bookingStatus === "CHECKED_IN").length}
          </div>
          <span className="text-[11px] text-muted-foreground">Scanned at boarding gates</span>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
          <span className="text-muted-foreground text-xs block mb-1">Cancelled / Refunded</span>
          <div className="text-sm sm:text-base font-bold text-rose-600">
            {bookings.filter((b) => b.bookingStatus === "CANCELLED").length}
          </div>
          <span className="text-[11px] text-muted-foreground">Refund disputes processed</span>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
          <span className="text-muted-foreground text-xs block mb-1">Total Sales Captured</span>
          <div className="text-sm sm:text-base font-bold text-amber-600">
            {formatCurrency(totalGrossRevenue)}
          </div>
          <span className="text-[11px] text-muted-foreground">Telebirr, CBE & Chapa</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Sector Badge */}
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-600 text-white shadow-sm inline-flex items-center gap-1.5">
              <span>{organization.category} Bookings</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                {filteredBookings.length}
              </span>
            </span>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Orders for {organization.name}
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ref, customer, phone..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>
        </div>

        {/* Status Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200/40 dark:border-slate-800/40">
          <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filters:
          </span>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          >
            <option value="ALL">All Payment Statuses</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          >
            <option value="ALL">All Boarding Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CHECKED_IN">Checked-in (Boarded)</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {(paymentFilter !== "ALL" ||
            statusFilter !== "ALL" ||
            searchQuery !== "") && (
            <button
              type="button"
              onClick={() => {
                setPaymentFilter("ALL");
                setStatusFilter("ALL");
                setSearchQuery("");
              }}
              className="text-[11px] font-semibold text-amber-600 hover:underline px-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Bookings Data Table & Mobile Cards */}
      <div className="bg-card border border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-sm overflow-hidden">
        {/* Mobile View: Cards */}
        <div className="block sm:hidden divide-y divide-slate-100 dark:divide-slate-800/40">
          {filteredBookings.length === 0 ? (
            <div className="py-12 px-4 text-center text-muted-foreground text-xs">
              No bookings found matching your search criteria.
            </div>
          ) : (
            filteredBookings.map((b) => (
              <div key={b.id} className="p-4 space-y-3">
                {/* Header: Ref, Category, Actions */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                      {getCategoryIcon(b.category)}
                    </div>
                    <div>
                      <Link
                        href={`/provider/bookings/${b.id}`}
                        className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400 hover:underline block leading-tight"
                      >
                        {b.reference}
                      </Link>
                      <span className="text-[10px] text-muted-foreground block">
                        {b.travelDate} • {b.departureTime}
                      </span>
                    </div>
                  </div>

                  <ActionDropdown
                    items={[
                      {
                        label: "View Booking Details",
                        icon: <Eye className="w-3.5 h-3.5" />,
                        href: `/provider/bookings/${b.id}`,
                      },
                      {
                        label:
                          b.bookingStatus === "CHECKED_IN"
                            ? "Mark Unboarded"
                            : "Check-in Passenger",
                        icon: <UserCheck className="w-3.5 h-3.5" />,
                        variant:
                          b.bookingStatus === "CHECKED_IN" ? "warning" : "success",
                        onClick: () => handleQuickCheckIn(b.id),
                      },
                      {
                        label: "Copy Reference Code",
                        icon: <Copy className="w-3.5 h-3.5" />,
                        onClick: () => {
                          navigator.clipboard.writeText(b.reference);
                          toast.success("Booking reference copied");
                        },
                      },
                    ]}
                  />
                </div>

                {/* Service and Customer */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground line-clamp-1">
                    {b.serviceTitle}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{b.customerName}</span>
                    <span className="font-mono text-[11px]">{b.customerPhone}</span>
                  </div>
                </div>

                {/* Badges & Price */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-foreground font-mono">
                      Seats: {b.seats.join(", ")}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${
                        b.bookingStatus === "CHECKED_IN"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : b.bookingStatus === "CANCELLED"
                          ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                          : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                      }`}
                    >
                      {b.bookingStatus === "CHECKED_IN"
                        ? "Boarded"
                        : b.bookingStatus === "CANCELLED"
                        ? "Cancelled"
                        : "Confirmed"}
                    </span>
                  </div>

                  <span className="font-mono font-bold text-foreground text-sm">
                    {formatCurrency(b.totalAmount)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Full Table - Spacious Layout */}
        <div className="hidden sm:block overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[1100px] text-xs sm:text-[13px]">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="py-4 px-5 min-w-[160px]">Reference</th>
                <th className="py-4 px-5 min-w-[220px]">Customer & Contact</th>
                <th className="py-4 px-5 min-w-[260px]">Service & Route</th>
                <th className="py-4 px-4 min-w-[140px]">Schedule Date</th>
                <th className="py-4 px-4 text-center min-w-[120px]">Seats</th>
                <th className="py-4 px-4 text-right min-w-[130px]">Amount (ETB)</th>
                <th className="py-4 px-4 text-center min-w-[120px]">Payment</th>
                <th className="py-4 px-4 text-center min-w-[130px]">Boarding</th>
                <th className="py-4 px-5 text-right min-w-[90px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-muted-foreground">
                    No bookings found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors">
                    <td className="py-4 px-5 font-mono font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                      <Link
                        href={`/provider/bookings/${b.id}`}
                        className="hover:underline"
                      >
                        {b.reference}
                      </Link>
                    </td>

                    <td className="py-4 px-5">
                      <span className="font-semibold text-foreground block">
                        {b.customerName}
                      </span>
                      <span className="text-[11px] text-muted-foreground block font-mono mt-0.5">
                        {b.customerPhone}
                      </span>
                    </td>

                    <td className="py-4 px-5">
                      <div className="flex items-center gap-1.5 font-medium text-foreground">
                        {getCategoryIcon(b.category)}
                        <span className="line-clamp-1">{b.serviceTitle}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">
                      <span className="font-medium text-foreground block">{b.travelDate}</span>
                      <span className="text-[11px] font-mono">{b.departureTime}</span>
                    </td>

                    <td className="py-4 px-4 text-center font-mono whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-foreground text-xs font-semibold">
                        {b.seats.join(", ")}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right font-mono font-bold text-foreground whitespace-nowrap">
                      {formatCurrency(b.totalAmount)}
                    </td>

                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-semibold border ${
                          b.paymentStatus === "PAID"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : b.paymentStatus === "REFUNDED"
                            ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-semibold border ${
                          b.bookingStatus === "CHECKED_IN"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : b.bookingStatus === "CANCELLED"
                            ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                            : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            b.bookingStatus === "CHECKED_IN"
                              ? "bg-emerald-600"
                              : b.bookingStatus === "CANCELLED"
                              ? "bg-rose-600"
                              : "bg-blue-600"
                          }`}
                        />
                        {b.bookingStatus === "CHECKED_IN"
                          ? "Boarded"
                          : b.bookingStatus === "CANCELLED"
                          ? "Cancelled"
                          : "Confirmed"}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end">
                        <ActionDropdown
                          items={[
                            {
                              label: "View Booking Details",
                              icon: <Eye className="w-3.5 h-3.5" />,
                              href: `/provider/bookings/${b.id}`,
                            },
                            {
                              label:
                                b.bookingStatus === "CHECKED_IN"
                                  ? "Mark Unboarded"
                                  : "Check-in Passenger",
                              icon: <UserCheck className="w-3.5 h-3.5" />,
                              variant:
                                b.bookingStatus === "CHECKED_IN" ? "warning" : "success",
                              onClick: () => handleQuickCheckIn(b.id),
                            },
                            {
                              label: "Copy Reference Code",
                              icon: <Copy className="w-3.5 h-3.5" />,
                              onClick: () => {
                                navigator.clipboard.writeText(b.reference);
                                toast.success("Booking reference copied");
                              },
                            },
                          ]}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
