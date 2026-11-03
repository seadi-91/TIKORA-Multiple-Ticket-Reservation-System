"use client";

import React, { useState } from "react";
import { RotateCcw, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { useBookingStore } from "@/stores/booking.store";
import { formatCurrency } from "@/lib/format-currency";

export default function CustomerRefundsPage() {
  const { bookings } = useBookingStore();
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const refundableBookings = bookings.filter((b) => b.bookingStatus === "CONFIRMED");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedBookingId("");
      setReason("");
    }, 4000);
  };

  return (
    <PageContainer
      title="Refund Claims & Cancellations"
      subtitle="Track your ticket cancellation refund claims and review official policy timelines."
      breadcrumbs={[{ label: "Customer Dashboard", href: "/customer" }, { label: "Refunds" }]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 cols: Request Form */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-[#E2E8F0] dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Request a Ticket Refund</h3>
            <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
              Select an active reservation to initiate automatic credit processing.
            </p>
          </div>

          {submitted && (
            <div className="p-4 rounded-2xl bg-[#FFFBEB] dark:bg-amber-950/60 border border-emerald-300 dark:border-slate-700 text-[#F59E0B] dark:text-amber-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Refund claim submitted! Expected resolution: 24-48 hours.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300 mb-1">
                Select Active Booking
              </label>
              <select
                required
                value={selectedBookingId}
                onChange={(e) => setSelectedBookingId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#F59E0B]"
              >
                <option value="">Choose an active pass...</option>
                {refundableBookings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.bookingReference} - {b.ticket.title} ({formatCurrency(b.pricing.total)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300 mb-1">
                Reason for Cancellation
              </label>
              <textarea
                rows={3}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Schedule change, medical emergency, accidental duplicate booking..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#F59E0B] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={refundableBookings.length === 0}
              className="py-2.5 px-6 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Submit Refund Claim
            </button>
          </form>
        </div>

        {/* Right 5 cols: Policy Breakdown */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-amber-400/60">
            TIKORA Guarantee
          </h4>

          <div className="space-y-3 text-xs text-[#64748B] dark:text-slate-400">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-amber-950/30 text-emerald-900 dark:text-slate-300">
              <strong className="block font-bold">24+ Hours Before Event:</strong>
              <span>90% refund issued directly to your Telebirr, CBE Birr, or card wallet.</span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200">
              <strong className="block font-bold">Less Than 24 Hours:</strong>
              <span>50% credit voucher towards any future bus trip or cinema screening.</span>
            </div>

            <div className="p-3 rounded-2xl bg-gray-50 dark:bg-[#0C0E14] text-gray-700 dark:text-amber-300">
              <strong className="block font-bold">Event or Trip Cancelled by Operator:</strong>
              <span>100% full refund with zero platform deductions.</span>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
