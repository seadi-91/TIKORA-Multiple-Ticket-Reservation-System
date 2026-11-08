"use client";

import React, { useState } from "react";
import { Phone, Building2, CreditCard, Wallet, ShieldCheck, Check } from "lucide-react";
import { PAYMENT_METHODS } from "@/lib/constants";

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onSelectMethod: (methodId: string) => void;
  customerPhone?: string;
}

export function PaymentMethodSelector({
  selectedMethod,
  onSelectMethod,
  customerPhone = "+251 91 123 4567",
}: PaymentMethodSelectorProps) {
  const [phoneNumber, setPhoneNumber] = useState(customerPhone);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const getMethodIcon = (iconName: string) => {
    switch (iconName) {
      case "Phone":
        return <Phone className="w-5 h-5" />;
      case "Building2":
        return <Building2 className="w-5 h-5" />;
      case "CreditCard":
        return <CreditCard className="w-5 h-5" />;
      case "Wallet":
      default:
        return <Wallet className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-[#0F172A] dark:text-white">Choose Payment Method</h4>
        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Encrypted 256-bit</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PAYMENT_METHODS.map((method) => {
          const isSelected = selectedMethod === method.id;
          return (
            <div
              key={method.id}
              onClick={() => onSelectMethod(method.id)}
              className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "border-[#B45309] bg-[#FAF5ED] dark:bg-[#221B12] shadow-xs ring-1 ring-[#B45309]"
                  : "border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#161922] hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-white bg-gradient-to-tr ${method.color} shadow-xs`}
                  >
                    {getMethodIcon(method.icon)}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#0F172A] dark:text-white leading-tight">
                      {method.name}
                    </h5>
                    <span className="text-[10px] text-[#64748B] dark:text-slate-400 block">
                      {method.badge}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected
                      ? "border-[#B45309] bg-[#B45309] text-white"
                      : "border-gray-300 dark:border-slate-700"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              <p className="text-[11px] text-[#64748B] dark:text-slate-300/60 line-clamp-2 mt-1">
                {method.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Dynamic Payment Verification Inputs based on choice */}
      <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#0F1117] border border-[#E2E8F0] dark:border-slate-800 space-y-3">
        {selectedMethod === "TELEBIRR" && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300">
              Telebirr Registered Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+251 9..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#161922] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#B45309]"
              />
            </div>
            <p className="text-[10px] text-[#64748B] dark:text-slate-400">
              You will receive an instant USSD push or Telebirr SuperApp authorization notification.
            </p>
          </div>
        )}

        {selectedMethod === "CBE_BIRR" && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300">
              CBE Account or Phone Number
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="1000... or +251 9..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#161922] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#B45309]"
              />
            </div>
          </div>
        )}

        {selectedMethod === "CHAPA" && (
          <div className="text-xs text-[#64748B] dark:text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Official Chapa Ethiopian Payment Gateway</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              You will be redirected securely to the official Chapa payment page where you can pay via Telebirr, CBE Birr, Awash Birr, or debit cards. Upon payment completion, you will be redirected back with your instant digital QR pass.
            </p>
          </div>
        )}

        {selectedMethod === "BANK_CARD" && (
          <div className="space-y-2.5">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300 mb-1">
                Card Number
              </label>
              <input
                type="text"
                placeholder="4111 2222 3333 4444"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#161922] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#B45309]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300 mb-1">
                  Expiry
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#161922] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#B45309]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300 mb-1">
                  CVV / CVC
                </label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="•••"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#161922] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#B45309]"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentMethodSelector;

