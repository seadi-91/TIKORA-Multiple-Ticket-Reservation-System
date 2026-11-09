"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { Language, SUPPORTED_LANGUAGES } from "@/lib/translations";
import { toast } from "sonner";

interface LanguageSelectorProps {
  variant?: "navbar" | "mobile" | "footer";
  className?: string;
}

export function LanguageSelector({ variant = "navbar", className = "" }: LanguageSelectorProps) {
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeLang = supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectLanguage = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
    const selected = supportedLanguages.find((l) => l.code === code);
    if (selected) {
      toast.success(
        code === "am"
          ? "ቋንቋ ወደ አማርኛ ተቀይሯል"
          : code === "om"
          ? "Afaan gara Oromootti jijjiirameera"
          : code === "ti"
          ? "ቋንቋ ናብ ትግርኛ ተቐይሩ"
          : "Language switched to English"
      );
    }
  };

  // Mobile layout: clean horizontal row of buttons
  if (variant === "mobile") {
    return (
      <div className={`space-y-1.5 ${className}`}>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
          <Globe className="w-3.5 h-3.5" />
          <span>Language / ቋንቋ</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {supportedLanguages.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelectLanguage(lang.code)}
                className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                  isSelected
                    ? "bg-[#B45309] text-white border-[#B45309] font-semibold shadow-xs"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400"
                }`}
              >
                <span className="flex items-center gap-1.5 truncate">
                  <span>{lang.flag}</span>
                  <span className="truncate">{lang.nativeName}</span>
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Footer layout: compact button with subtle border
  if (variant === "footer") {
    return (
      <div className={`relative inline-block ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          aria-expanded={isOpen}
          aria-label="Select website language"
        >
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span>{activeLang.flag}</span>
          <span className="font-semibold">{activeLang.nativeName}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {isOpen && (
          <div className="absolute bottom-full mb-2 left-0 w-44 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161922] p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
            {supportedLanguages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelectLanguage(lang.code)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  lang.code === language
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                  <span className="text-[10px] text-slate-400">({lang.name})</span>
                </span>
                {lang.code === language && <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Navbar layout (Default)
  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-white/70 dark:bg-[#161922] text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-amber-500/50 hover:text-amber-600 dark:hover:text-amber-400 transition-all cursor-pointer shadow-2xs"
        aria-label="Language selection"
        title="Change Language / ቋንቋ ቀይር"
      >
        <Globe className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 shrink-0" />
        <span className="hidden sm:inline-block font-semibold text-[11px] sm:text-xs">
          {activeLang.nativeName}
        </span>
        <span className="sm:hidden text-xs font-bold uppercase">{activeLang.code}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-48 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#161922]/95 backdrop-blur-md p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800/80 mb-1">
            Choose Language / ቋንቋ ይምረጡ
          </div>
          {supportedLanguages.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelectLanguage(lang.code)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{lang.flag}</span>
                  <div className="text-left">
                    <div className="font-semibold leading-tight">{lang.nativeName}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{lang.name}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
