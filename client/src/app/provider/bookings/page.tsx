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
  Ticket,
  Boxes,
} from "lucide-react";
import { formatCurrency } from "@/lib/format-currency";
import { TicketCategory } from "@/types/ticket.types";
import { toast } from "sonner";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { useProviderStore } from "@/stores/provider.store";
import { TicketService } from "@/services/ticket.service";
import { useLanguage } from "@/providers/language-provider";

export interface ProviderBookingRecord {
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

export const INITIAL_BOOKINGS: ProviderBookingRecord[] = [];

export default function ProviderBookingsPage() {
  const { organization, bookings: storeBookings } = useProviderStore();
  const { t } = useLanguage();
  const [localBookings, setLocalBookings] = useState<ProviderBookingRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [liveAvailableSeats, setLiveAvailableSeats] = useState<number>(46);

  useEffect(() => {
    const updateSeats = () => {
      const tickets = TicketService.getAllTickets(true);
      const sectorTickets = tickets.filter(
        (t) =>
          !organization.category ||
          t.category?.toUpperCase() === organization.category?.toUpperCase() ||
          t.organizer?.toLowerCase() === organization.name?.toLowerCase()
      );
      const target = sectorTickets.length > 0 ? sectorTickets : tickets;
      const sum = target.reduce(
        (acc, t) => acc + Number(t.availableSeats !== undefined ? t.availableSeats : t.totalSeats || 50),
        0
      );
      const sectorDefault =
        organization.category === "CINEMA"
          ? 48
          : organization.category === "SPORTS"
          ? 420
          : organization.category === "EVENT"
          ? 185
          : 46;
      setLiveAvailableSeats(
        sum > 0 ? sum : organization.stats.availableSeats > 0 ? organization.stats.availableSeats : sectorDefault
      );
    };

    updateSeats();
    TicketService.fetchTickets(true).then(() => updateSeats()).catch(() => {});
  }, [organization.category, organization.name, organization.stats.availableSeats]);

  useEffect(() => {
    let list: ProviderBookingRecord[] = [];
    if (storeBookings && storeBookings.length > 0) {
      list = storeBookings;
    } else if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("tikora_provider_bookings");
        if (raw) {
          list = JSON.parse(raw);
        }
      } catch {}
    }

    const cleanList = list.filter(
      (b) =>
        !String(b.id || "").startsWith("bkg-") &&
        !String(b.reference || "").startsWith("TIKORA-BKG-10")
    );

    if (cleanList.length > 0) {
      const filtered = organization.category
        ? cleanList.filter((b) => b.category === organization.category)
        : cleanList;
      setLocalBookings(filtered);
    } else {
      fetch("/api/bookings")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.bookings && data.bookings.length > 0) {
            const cleanData = data.bookings.filter(
              (b: any) =>
                !String(b.id || "").startsWith("bkg-") &&
                !String(b.reference || "").startsWith("TIKORA-BKG-10") &&
                (!organization.category || b.category === organization.category)
            );
            const mapped: ProviderBookingRecord[] = cleanData.map((b: any) => {
              const cPaid = Number(b.customerPaid ?? b.pricing?.total ?? b.totalAmount ?? 500);
              const vRate = Number(b.vatRate ?? b.pricing?.vatRate ?? 5.0);
              const vAmount = Number(b.vatAmount ?? b.pricing?.vatAmount ?? Math.round(((cPaid * vRate) / (100 + vRate)) * 100) / 100);
              const baseFare = Number(b.pricing?.subtotal ?? b.subtotal ?? Math.max(0, Math.round((cPaid - vAmount) * 100) / 100));
              const commRate = Number(b.commissionRate ?? b.pricing?.commissionRate ?? (organization?.commissionRate || 5.0));
              const pFee = Number(b.platformFee ?? b.pricing?.platformFee ?? Math.round(baseFare * (commRate / 100) * 100) / 100);
              const pNet = Number(b.providerNet ?? b.pricing?.providerNet ?? Math.max(0, Math.round((baseFare - pFee) * 100) / 100));

              return {
                id: b.id,
                reference: b.bookingReference || b.id,
                customerName: b.customerName,
                customerPhone: b.customerPhone || "+251 91 100 0000",
                customerEmail: b.customerEmail || "customer@tikora.et",
                serviceTitle: b.ticket?.title || b.serviceTitle || "TIKORA Experience Pass",
                category: b.category || organization.category || "BUS",
                travelDate: b.ticket?.date || new Date().toISOString().split("T")[0],
                departureTime: b.ticket?.time || "Flexible",
                seats: b.selectedSeats || [b.selectedTier || "Pass"],
                totalAmount: baseFare,
                customerPaid: cPaid,
                vatRate: vRate,
                vatAmount: vAmount,
                commissionRate: commRate,
                platformFee: pFee,
                providerNet: pNet,
                paymentMethod: b.paymentMethod || "CHAPA",
                paymentStatus: b.paymentStatus || "PAID",
                bookingStatus: b.bookingStatus || "CONFIRMED",
                createdAt: b.createdAt || new Date().toISOString(),
              };
            });
            setLocalBookings(mapped);
          }
        })
        .catch(() => {});
    }
  }, [storeBookings, organization.category]);

  const totalBookedSeats = localBookings.reduce(
    (sum, b) => sum + (b.seats && b.seats.length > 0 ? b.seats.length : 1),
    0
  );

  const filteredBookings = localBookings.filter((b) => {
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

  const totalGrossRevenue = localBookings
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
    setLocalBookings((prev) =>
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
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 border-b border-border/50 pb-3">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              {t("Live Customer Orders")}
            </span>
            <span className="text-[11px] text-muted-foreground">{organization.name}</span>
          </div>
          <h1 className="text-sm sm:text-base font-bold tracking-tight text-foreground">
            {t("Customer Bookings & Orders")}
          </h1>
          <p className="text-[11px] text-muted-foreground">
            {t("Confirmed reservations, seat allocations, and boarding status. Ticket base revenue shown with statutory VAT excluded.")}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium rounded-lg border border-border/70 bg-card hover:bg-muted text-foreground transition-colors cursor-pointer"
          >
            <Download className="w-3 h-3" />
            <span>{t("Export CSV")}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards - 5 Metrics including Seats Left */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
        <div className="bg-card border border-border/60 rounded-xl p-3 shadow-2xs">
          <span className="text-muted-foreground text-[10px] uppercase font-semibold block mb-0.5">{t("Total Orders")}</span>
          <div className="text-xs sm:text-sm font-bold text-foreground font-mono">{localBookings.length}</div>
          <span className="text-[9px] text-muted-foreground">{t("Verified passes", "Confirmed bookings")}</span>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-3 shadow-2xs">
          <span className="text-muted-foreground text-[10px] uppercase font-semibold block mb-0.5">{t("Seats Booked")}</span>
          <div className="text-xs sm:text-sm font-bold text-blue-600 font-mono">
            {totalBookedSeats} {t("Seats", "seats")}
          </div>
          <span className="text-[9px] text-muted-foreground">{t("Verified passes", "Reserved passes")}</span>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-3 shadow-2xs">
          <span className="text-muted-foreground text-[10px] uppercase font-semibold block mb-0.5">{t("Seats Left (Stock)")}</span>
          <div className="text-xs sm:text-sm font-bold text-emerald-600 font-mono">
            {liveAvailableSeats} {t("left")}
          </div>
          <span className="text-[9px] text-muted-foreground">{t("Available to book")}</span>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-3 shadow-2xs">
          <span className="text-muted-foreground text-[10px] uppercase font-semibold block mb-0.5">{t("Boarded Gate")}</span>
          <div className="text-xs sm:text-sm font-bold text-emerald-600 font-mono">
            {localBookings.filter((b) => b.bookingStatus === "CHECKED_IN").length}
          </div>
          <span className="text-[9px] text-muted-foreground">{t("Scanned turnstiles")}</span>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-3 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-muted-foreground text-[10px] uppercase font-semibold block mb-0.5">{t("Ticket Sales (No VAT)")}</span>
          <div className="text-xs sm:text-sm font-bold text-amber-600 font-mono">
            {formatCurrency(totalGrossRevenue)}
          </div>
          <span className="text-[9px] text-muted-foreground">{t("Base fare revenue", "Base fare • VAT excluded")}</span>
        </div>
      </div>

      {/* Filter and Search Bar (NO SECTOR) */}
      <div className="bg-card border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-600 text-white shadow-sm inline-flex items-center gap-1.5">
              <span>{t("Customer Bookings")}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">
                {filteredBookings.length}
              </span>
            </span>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {t("Manage passenger reservations and seat allocations")}
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("hero.searchPlaceholder", "Search ref, customer, phone...")}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>
        </div>

        {/* Status Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200/40 dark:border-slate-800/40">
          <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
            <Filter className="w-3 h-3" /> {t("common.filter", "Filters")}:
          </span>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          >
            <option value="ALL">{t("All Payment Statuses")}</option>
            <option value="PAID">{t("status.paid", "Paid")}</option>
            <option value="PENDING">{t("status.pending", "Pending")}</option>
            <option value="REFUNDED">{t("status.refunded", "Refunded")}</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          >
            <option value="ALL">{t("All Boarding Statuses")}</option>
            <option value="CONFIRMED">{t("status.confirmed", "Confirmed")}</option>
            <option value="CHECKED_IN">{t("status.checkedIn", "Checked-in (Boarded)")}</option>
            <option value="CANCELLED">{t("status.cancelled", "Cancelled")}</option>
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
              {t("Reset Filters")}
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
                      Seats: {b.seats.join(", ")} ({b.seats.length} booked)
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        b.bookingStatus === "CHECKED_IN"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : b.bookingStatus === "CANCELLED"
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
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
          <table className="w-full text-left border-collapse min-w-[1450px] text-xs sm:text-[13px]">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="py-4.5 px-6 min-w-[200px]">{t("Reference")}</th>
                <th className="py-4.5 px-6 min-w-[260px]">{t("Customer & Contact")}</th>
                <th className="py-4.5 px-6 min-w-[300px]">{t("Service & Route")}</th>
                <th className="py-4.5 px-6 min-w-[160px]">{t("Schedule Date")}</th>
                <th className="py-4.5 px-6 text-center min-w-[160px]">{t("Seats")}</th>
                <th className="py-4.5 px-6 text-right min-w-[150px]">{t("Amount (ETB)")}</th>
                <th className="py-4.5 px-6 text-center min-w-[140px]">{t("Payment")}</th>
                <th className="py-4.5 px-6 text-center min-w-[150px]">{t("Boarding")}</th>
                <th className="py-4.5 px-6 text-right min-w-[120px]">{t("Actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-muted-foreground">
                    {t("No bookings found matching your search criteria.")}
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors">
                    <td className="py-4.5 px-6 font-mono font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                      <Link
                        href={`/provider/bookings/${b.id}`}
                        className="hover:underline"
                      >
                        {b.reference}
                      </Link>
                    </td>

                    <td className="py-4.5 px-6">
                      <span className="font-semibold text-foreground block">
                        {b.customerName}
                      </span>
                      <span className="text-[11px] text-muted-foreground block font-mono mt-0.5">
                        {b.customerPhone}
                      </span>
                    </td>

                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-1.5 font-medium text-foreground">
                        {getCategoryIcon(b.category)}
                        <span className="line-clamp-1">{b.serviceTitle}</span>
                      </div>
                    </td>

                    <td className="py-4.5 px-6 text-muted-foreground whitespace-nowrap">
                      <span className="font-medium text-foreground block">{b.travelDate}</span>
                      <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400">{b.departureTime}</span>
                    </td>

                    <td className="py-4.5 px-6 text-center font-mono whitespace-nowrap">
                      <div className="inline-flex flex-col items-center gap-0.5">
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-foreground text-xs font-bold font-mono">
                          {b.seats.join(", ")}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-semibold">
                          {b.seats.length} seat{b.seats.length > 1 ? "s" : ""} booked
                        </span>
                      </div>
                    </td>

                    <td className="py-4.5 px-6 text-right font-mono font-bold text-foreground whitespace-nowrap">
                      {formatCurrency(b.totalAmount)}
                    </td>

                    <td className="py-4.5 px-6 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold ${
                          b.paymentStatus === "PAID"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : b.paymentStatus === "REFUNDED"
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>

                    <td className="py-4.5 px-6 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                          b.bookingStatus === "CHECKED_IN"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : b.bookingStatus === "CANCELLED"
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
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

                    <td className="py-4.5 px-6 text-right">
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
