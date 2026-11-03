"use client";

import React, { useState } from "react";
import { Star, MessageSquare, CheckCircle2 } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { useBookingStore } from "@/stores/booking.store";

export default function CustomerReviewsPage() {
  const { bookings } = useBookingStore();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setComment("");
    }, 4000);
  };

  return (
    <PageContainer
      title="Verified Customer Reviews"
      subtitle="Rate your completed trips and screenings to help fellow Ethiopian travelers make informed decisions."
      breadcrumbs={[{ label: "Customer Dashboard", href: "/customer" }, { label: "Reviews" }]}
    >
      <div className="space-y-6 max-w-2xl">
        <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-[#E2E8F0] dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Write a Review</h3>
            <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
              Reviewing: <strong className="text-[#0F172A] dark:text-white">{bookings[0]?.ticket.title || "Your Experience"}</strong>
            </p>
          </div>

          {submitted && (
            <div className="p-4 rounded-2xl bg-[#FFFBEB] dark:bg-amber-950/60 border border-emerald-300 dark:border-slate-700 text-[#F59E0B] dark:text-amber-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Thank you! Your verified review has been published.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300 mb-2">
                Overall Experience Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${star <= rating ? "fill-amber-400" : "text-gray-300 dark:text-gray-600"}`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-[#0F172A] dark:text-white ml-2">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300 mb-1">
                Your Feedback & Comments
              </label>
              <textarea
                rows={4}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience regarding punctuality, cleanliness, seat comfort, and customer service..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#F59E0B] resize-none"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Post Verified Review
            </button>
          </form>
        </div>
      </div>
    </PageContainer>
  );
}
