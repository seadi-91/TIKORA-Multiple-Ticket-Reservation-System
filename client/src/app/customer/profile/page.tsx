"use client";

import React, { useState } from "react";
import { User, Phone, Mail, MapPin, Calendar, ShieldCheck, CheckCircle2, Award } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { FormUpload } from "@/components/forms/form-upload";

export default function CustomerProfilePage() {
  const [fullName, setFullName] = useState("Abebe Bekele");
  const [email, setEmail] = useState("abebe.customer@tikora.et");
  const [phone, setPhone] = useState("+251 91 123 4567");
  const [city, setCity] = useState("Addis Ababa");
  const [gender, setGender] = useState("MALE");
  const [dob, setDob] = useState("1994-05-18");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <PageContainer
      title="Customer Profile Management"
      subtitle="Update your personal details, verified phone number for SMS tickets, and regional preferences."
      breadcrumbs={[{ label: "Customer Dashboard", href: "/customer" }, { label: "Profile" }]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Cols: Edit Form */}
        <div className="lg:col-span-8 rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Personal Information</h3>
              <p className="text-xs text-[#64748B] dark:text-slate-400">
                Keep your contact details up to date for travel insurance and digital QR validation.
              </p>
            </div>
            <span className="text-xs font-bold text-[#F59E0B] dark:text-amber-400 bg-[#FFFBEB] dark:bg-amber-950 px-2.5 py-1 rounded-md">
              ID Verified
            </span>
          </div>

          {savedSuccess && (
            <div className="p-4 rounded-xl bg-[#FFFBEB] dark:bg-amber-950/60 border border-emerald-300 dark:border-slate-700 text-[#F59E0B] dark:text-amber-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Your profile details have been saved successfully!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300 mb-1">
                  Mobile Phone (Telebirr Verified)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300 mb-1">
                  Primary Residence City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300 mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#F59E0B]"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Prefer Not to Say</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300 mb-1">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <FormUpload label="Change Profile Photo (Optional)" helperText="PNG, JPG up to 5MB" />
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] dark:border-slate-800 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Right 4 Cols: Profile Completion & Loyalty Widget */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-amber-400/60">
              Profile Completion
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Verification Status</span>
                <span className="text-[#F59E0B] dark:text-amber-400">85% Complete</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-amber-950 overflow-hidden">
                <div className="w-[85%] h-full bg-[#F59E0B] rounded-full" />
              </div>
            </div>
            <p className="text-[11px] text-[#64748B] dark:text-amber-300/70 leading-relaxed">
              Complete your secondary emergency contact in Settings to unlock 100% priority customer status.
            </p>
          </div>

          <div className="rounded-3xl bg-gradient-to-tr from-[#D97706] to-[#F59E0B] p-6 text-white shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-300" />
              <h4 className="text-sm font-bold">TIKORA Rewards</h4>
            </div>
            <div className="text-2xl font-black">480 Loyalty Points</div>
            <p className="text-xs text-indigo-100/80 leading-relaxed">
              Earn 10 points for every 100 ETB spent. Redeemable for cinema concessions, VIP concert upgrades, and holiday bus discounts.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
