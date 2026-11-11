"use client";

import React from "react";
import { User, Phone, Mail, Calendar, IdCard, Users, Sparkles, Copy, Plus, Minus } from "lucide-react";
import { PassengerInfo } from "@/types/booking.types";
import { useLanguage } from "@/providers/language-provider";

export interface PassengerDetailsFormProps {
  passengers: PassengerInfo[];
  onChange: (passengers: PassengerInfo[]) => void;
  quantity: number;
  onQuantityChange?: (qty: number) => void;
  allowQuantityEdit?: boolean;
  maxQuantity?: number;
  seatLabels?: string[];
  attendeeLabel?: string;
  themeColor?: "amber" | "emerald" | "blue" | "purple";
}

export function PassengerDetailsForm({
  passengers,
  onChange,
  quantity,
  onQuantityChange,
  allowQuantityEdit = false,
  maxQuantity = 50,
  seatLabels = [],
  attendeeLabel = "Passenger",
  themeColor = "amber",
}: PassengerDetailsFormProps) {
  const { t, language } = useLanguage();

  // Helper to update a single passenger's field
  const updatePassenger = (index: number, field: keyof PassengerInfo, value: string) => {
    const updated = [...passengers];
    if (!updated[index]) {
      updated[index] = {
        fullName: "",
        phone: "",
        email: "",
        dateOfBirth: "",
        gender: "MALE",
        idNumber: "",
        seatNumber: seatLabels[index] || `Pass #${index + 1}`,
      };
    }
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange(updated);
  };

  // Helper to copy phone and email from passenger 1
  const copyContactFromLead = (targetIndex: number) => {
    const lead = passengers[0];
    if (!lead) return;
    const updated = [...passengers];
    if (!updated[targetIndex]) {
      updated[targetIndex] = {
        fullName: "",
        phone: lead.phone,
        email: lead.email,
        dateOfBirth: "",
        gender: "MALE",
        idNumber: "",
        seatNumber: seatLabels[targetIndex] || `Pass #${targetIndex + 1}`,
      };
    } else {
      updated[targetIndex] = {
        ...updated[targetIndex],
        phone: lead.phone || updated[targetIndex].phone,
        email: lead.email || updated[targetIndex].email,
      };
    }
    onChange(updated);
  };

  // Color mappings
  const accentClasses = {
    amber: {
      badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      borderFocus: "focus:border-amber-500 focus:ring-amber-500/20",
      buttonBg: "bg-amber-600 hover:bg-amber-700 text-white",
      ring: "ring-amber-500/30",
    },
    emerald: {
      badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      borderFocus: "focus:border-emerald-500 focus:ring-emerald-500/20",
      buttonBg: "bg-emerald-600 hover:bg-emerald-700 text-white",
      ring: "ring-emerald-500/30",
    },
    blue: {
      badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      borderFocus: "focus:border-blue-500 focus:ring-blue-500/20",
      buttonBg: "bg-blue-600 hover:bg-blue-700 text-white",
      ring: "ring-blue-500/30",
    },
    purple: {
      badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      borderFocus: "focus:border-purple-500 focus:ring-purple-500/20",
      buttonBg: "bg-purple-600 hover:bg-purple-700 text-white",
      ring: "ring-purple-500/30",
    },
  }[themeColor];

  return (
    <div className="space-y-5">
      {/* Optional Quantity Input / Counter */}
      {allowQuantityEdit && onQuantityChange && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-600" />
                {language === "am" ? "የትኬት ብዛት (የፈለጉትን ያህል ያስገቡ)፦" : t("Number of Tickets / Passes (Enter any quantity):")}
              </span>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {language === "am"
                  ? "የሚፈልጉትን የትኬት ቁጥር እዚህ ይጻፉ ወይም በ +/- ይምረጡ፤ ለእያንዳንዱ ትኬት ሙሉ መረጃ ይሞላሉ።"
                  : "Type any quantity or click +/-. Full registration details are required for every ticket holder."}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-card hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground flex items-center justify-center cursor-pointer disabled:opacity-40 transition-colors shadow-xs"
                title="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>

              <input
                type="number"
                min={1}
                max={maxQuantity}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val >= 1) {
                    onQuantityChange(Math.min(maxQuantity, val));
                  }
                }}
                className={`w-16 h-9 text-center font-mono font-bold text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-card text-foreground focus:outline-none ${accentClasses.borderFocus} shadow-xs`}
              />

              <button
                type="button"
                onClick={() => onQuantityChange(Math.min(maxQuantity, quantity + 1))}
                disabled={quantity >= maxQuantity}
                className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-card hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground flex items-center justify-center cursor-pointer disabled:opacity-40 transition-colors shadow-xs"
                title="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Quantity Chips */}
          <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {language === "am" ? "ፈጣን መምረጫ፦" : "Quick Select:"}
            </span>
            {[1, 2, 3, 4, 5, 8, 10].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => onQuantityChange(num)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  quantity === num
                    ? `${accentClasses.buttonBg} shadow-xs`
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-muted-foreground hover:text-foreground"
                }`}
              >
                {num} {num === 1 ? t("Ticket") : t("Tickets")}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Header Info Banner */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span>
              {language === "am"
                ? `የ${quantity}ቱ ${attendeeLabel}ዎች ሙሉ መረጃ`
                : `${t("Passenger & Attendee Details for")} ${quantity} ${attendeeLabel}${quantity > 1 ? "s" : ""}`}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${accentClasses.badge}`}>
              {quantity} {quantity > 1 ? t("Passes") : t("Pass")}
            </span>
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {language === "am"
              ? "የእያንዳንዱን ተጓዥ/ተመልካች ስም፣ ስልክ ቁጥር፣ ኢሜይል እና የትውልድ ቀን ያስገቡ።"
              : "Please provide the official full name, contact, and birth date for every ticket holder."}
          </p>
        </div>
      </div>

      {/* List of Passenger Cards */}
      <div className="space-y-4">
        {Array.from({ length: quantity }).map((_, idx) => {
          const pass = passengers[idx] || {
            fullName: "",
            phone: "",
            email: "",
            dateOfBirth: "",
            gender: "MALE",
            idNumber: "",
            seatNumber: seatLabels[idx] || `Ticket #${idx + 1}`,
          };
          const seatLabel = seatLabels[idx] || pass.seatNumber || `Seat / Pass #${idx + 1}`;
          const isLead = idx === 0;

          return (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-card border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5 transition-all hover:border-slate-300 dark:hover:border-slate-700"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    {isLead
                      ? (language === "am" ? "ዋና ተጓዥ / የትኬት ባለቤት (Lead Contact)" : `${attendeeLabel} #1 (Lead Contact)`)
                      : `${attendeeLabel} #${idx + 1}`}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-muted-foreground font-semibold">
                    {seatLabel}
                  </span>
                </div>

                {/* Copy from lead button */}
                {!isLead && passengers[0] && (passengers[0].phone || passengers[0].email) && (
                  <button
                    type="button"
                    onClick={() => copyContactFromLead(idx)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer self-start sm:self-auto"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{language === "am" ? "የመጀመሪያውን ስልክና ኢሜይል ገልብጥ" : "Copy phone & email from Lead"}</span>
                  </button>
                )}
              </div>

              {/* Form Input Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* 1. Full Name */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-foreground">
                    {language === "am" ? "ሙሉ ስም (Full Name) *" : "Full Name *"}
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder={isLead ? "e.g. Abebe Bikila" : `e.g. ${attendeeLabel} ${idx + 1} Name`}
                      value={pass.fullName || ""}
                      onChange={(e) => updatePassenger(idx, "fullName", e.target.value)}
                      className={`w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-foreground focus:outline-none ${accentClasses.borderFocus}`}
                    />
                  </div>
                </div>

                {/* 2. Mobile Phone */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-foreground">
                    {language === "am" ? "ስልክ ቁጥር (Phone Number) *" : "Phone Number *"}
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="0911223344"
                      value={pass.phone || ""}
                      onChange={(e) => updatePassenger(idx, "phone", e.target.value)}
                      className={`w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-foreground focus:outline-none ${accentClasses.borderFocus}`}
                    />
                  </div>
                </div>

                {/* 3. Email Address */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-foreground">
                    {language === "am" ? "ኢሜይል (Email Address) *" : "Email Address *"}
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="user@example.com"
                      value={pass.email || ""}
                      onChange={(e) => updatePassenger(idx, "email", e.target.value)}
                      className={`w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-foreground focus:outline-none ${accentClasses.borderFocus}`}
                    />
                  </div>
                </div>

                {/* 4. Date of Birth */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-foreground">
                    {language === "am" ? "የትውልድ ቀን (Date of Birth)" : "Date of Birth"}
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={pass.dateOfBirth || ""}
                      onChange={(e) => updatePassenger(idx, "dateOfBirth", e.target.value)}
                      className={`w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-foreground focus:outline-none ${accentClasses.borderFocus}`}
                    />
                  </div>
                </div>

                {/* 5. Gender */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-foreground">
                    {language === "am" ? "ፆታ (Gender)" : "Gender"}
                  </label>
                  <select
                    value={pass.gender || "MALE"}
                    onChange={(e) => updatePassenger(idx, "gender", e.target.value as any)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-foreground focus:outline-none ${accentClasses.borderFocus}`}
                  >
                    <option value="MALE">{language === "am" ? "ወንድ (Male)" : "Male"}</option>
                    <option value="FEMALE">{language === "am" ? "ሴት (Female)" : "Female"}</option>
                    <option value="OTHER">{language === "am" ? "ሌላ (Other)" : "Other"}</option>
                  </select>
                </div>

                {/* 6. ID Number / Passport (Optional) */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-foreground">
                    {language === "am" ? "መታወቂያ ቁጥር / Fayda ID" : "National ID / Fayda (Optional)"}
                  </label>
                  <div className="relative">
                    <IdCard className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. ET-ID-9921"
                      value={pass.idNumber || ""}
                      onChange={(e) => updatePassenger(idx, "idNumber", e.target.value)}
                      className={`w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-foreground focus:outline-none ${accentClasses.borderFocus}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PassengerDetailsForm;

