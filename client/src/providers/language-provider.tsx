"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import {
  Language,
  SUPPORTED_LANGUAGES,
  TRANSLATIONS,
  COMMON_PHRASES,
  LOWERCASE_PHRASES,
  LanguageOption,
} from "@/lib/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultText?: string) => string;
  getCategoryName: (category: string) => string;
  getStatusLabel: (status: string) => string;
  formatCurrencyWithLang: (amount: number) => string;
  supportedLanguages: LanguageOption[];
  isAmharic: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "tikora_language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY) as Language;
      if (savedLang && ["en", "am", "om", "ti"].includes(savedLang)) {
        setLanguageState(savedLang);
        document.documentElement.lang = savedLang;
      }
    } catch {}
    setMounted(true);
  }, []);

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang;
      window.dispatchEvent(new CustomEvent("tikora_language_changed", { detail: newLang }));
    } catch {}
  }, []);

  // Listen to external language change events if fired from anywhere in the window
  useEffect(() => {
    const handleExternalChange = (e: any) => {
      if (e.detail && ["en", "am", "om", "ti"].includes(e.detail)) {
        setLanguageState(e.detail);
      }
    };
    window.addEventListener("tikora_language_changed", handleExternalChange);
    return () => window.removeEventListener("tikora_language_changed", handleExternalChange);
  }, []);

  const t = useCallback(
    (key: string, defaultText?: string): string => {
      const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
      if (dict && dict[key]) {
        return dict[key];
      }
      // If key is a literal phrase
      if (COMMON_PHRASES[key] && COMMON_PHRASES[key][language]) {
        return COMMON_PHRASES[key][language];
      }
      const lowerKey = key.toLowerCase();
      if (LOWERCASE_PHRASES[lowerKey] && LOWERCASE_PHRASES[lowerKey][language]) {
        return LOWERCASE_PHRASES[lowerKey][language];
      }
      // If defaultText is provided, check if defaultText has a translation
      if (defaultText) {
        if (dict && dict[defaultText]) {
          return dict[defaultText];
        }
        if (COMMON_PHRASES[defaultText] && COMMON_PHRASES[defaultText][language]) {
          return COMMON_PHRASES[defaultText][language];
        }
        const lowerDefault = defaultText.toLowerCase();
        if (LOWERCASE_PHRASES[lowerDefault] && LOWERCASE_PHRASES[lowerDefault][language]) {
          return LOWERCASE_PHRASES[lowerDefault][language];
        }
      }
      // Fallback to English
      const enDict = TRANSLATIONS.en;
      if (enDict && enDict[key]) {
        return enDict[key];
      }
      if (language === "en" && defaultText && /[\u1200-\u137F]/.test(defaultText)) {
        return key;
      }
      return defaultText !== undefined ? defaultText : key;
    },
    [language]
  );

  const getCategoryName = useCallback(
    (category: string): string => {
      const upper = String(category || "").toUpperCase();
      switch (upper) {
        case "BUS":
          return t("categories.bus", "Bus");
        case "CINEMA":
          return t("categories.cinema", "Cinema");
        case "EVENT":
          return t("categories.event", "Events");
        case "SPORTS":
          return t("categories.sports", "Sports");
        default:
          return category;
      }
    },
    [t]
  );

  const getStatusLabel = useCallback(
    (status: string): string => {
      const upper = String(status || "").toUpperCase();
      switch (upper) {
        case "CONFIRMED":
          return t("status.confirmed", "Confirmed");
        case "PENDING":
          return t("status.pending", "Pending");
        case "COMPLETED":
          return t("status.completed", "Completed");
        case "CANCELLED":
          return t("status.cancelled", "Cancelled");
        case "PAID":
          return t("status.paid", "Paid");
        case "REFUNDED":
          return t("status.refunded", "Refunded");
        case "CHECKED_IN":
          return t("status.checkedIn", "Checked In");
        case "ACTIVE":
          return t("status.active", "Active");
        case "INACTIVE":
          return t("status.inactive", "Inactive");
        case "SOLD_OUT":
          return t("status.soldOut", "Sold Out");
        case "LOW_STOCK":
          return t("status.lowStock", "Low Stock");
        default:
          return status;
      }
    },
    [t]
  );

  const formatCurrencyWithLang = useCallback(
    (amount: number): string => {
      const num = Number(amount || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      const currencySuffix = t("common.etb", "ETB");
      return `${num} ${currencySuffix}`;
    },
    [t]
  );

  // Automated DOM translation engine:
  // Walks rendered text nodes across all pages (including admin, provider, customer, public)
  // and translates any matching English phrases into the selected language instantly.
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    const originalTextMap: WeakMap<Node, string> =
      (window as any).__tikora_orig_text_map || new WeakMap<Node, string>();
    (window as any).__tikora_orig_text_map = originalTextMap;

    const translateNode = (node: Node) => {
      if (node.nodeType !== Node.TEXT_NODE) return;
      const parent = node.parentElement;
      if (!parent) return;

      const tag = parent.tagName.toUpperCase();
      if (["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA"].includes(tag)) {
        return;
      }
      if (parent.closest("[data-no-translate='true']") || parent.isContentEditable) {
        return;
      }

      const currentVal = node.nodeValue || "";
      let originalVal = originalTextMap.get(node);

      if (originalVal === undefined) {
        originalVal = currentVal;
        originalTextMap.set(node, originalVal);
      }

      const trimmedOriginal = originalVal.trim();
      if (!trimmedOriginal) return;

      if (language === "en") {
        if (node.nodeValue !== originalVal) {
          node.nodeValue = originalVal;
        }
        return;
      }

      let translated: string | undefined = undefined;
      const dict = TRANSLATIONS[language];
      if (dict && dict[trimmedOriginal]) {
        translated = dict[trimmedOriginal];
      } else if (COMMON_PHRASES[trimmedOriginal] && COMMON_PHRASES[trimmedOriginal][language]) {
        translated = COMMON_PHRASES[trimmedOriginal][language];
      } else {
        // Strip trailing punctuation like : or ... or ? or •
        const punctMatch = trimmedOriginal.match(/^(.+?)([:\?!…\.\s•\(\)]+)$/);
        if (punctMatch) {
          const core = punctMatch[1].trim();
          const punc = punctMatch[2];
          const coreTrans =
            dict?.[core] ||
            COMMON_PHRASES[core]?.[language] ||
            LOWERCASE_PHRASES[core.toLowerCase()]?.[language];
          if (coreTrans) {
            translated = coreTrans + punc;
          }
        }
        if (!translated) {
          const lower = trimmedOriginal.toLowerCase();
          if (LOWERCASE_PHRASES[lower] && LOWERCASE_PHRASES[lower][language]) {
            translated = LOWERCASE_PHRASES[lower][language];
          }
        }
      }

      if (translated && translated !== trimmedOriginal) {
        const leading = originalVal.match(/^\s*/)?.[0] || "";
        const trailing = originalVal.match(/\s*$/)?.[0] || "";
        const finalVal = leading + translated + trailing;
        if (node.nodeValue !== finalVal) {
          node.nodeValue = finalVal;
        }
      }
    };

    const walkAndTranslate = () => {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node) {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            const tag = parent.tagName.toUpperCase();
            if (["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA"].includes(tag)) {
              return NodeFilter.FILTER_REJECT;
            }
            if (parent.closest("[data-no-translate='true']") || parent.closest("input")) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          },
        }
      );

      let currentNode = walker.nextNode();
      while (currentNode) {
        translateNode(currentNode);
        currentNode = walker.nextNode();
      }
    };

    walkAndTranslate();

    let timeoutId: any = null;
    const observer = new MutationObserver(() => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        walkAndTranslate();
      }, 60);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [language, mounted]);

  const isAmharic = language === "am";

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      getCategoryName,
      getStatusLabel,
      formatCurrencyWithLang,
      supportedLanguages: SUPPORTED_LANGUAGES,
      isAmharic,
    }),
    [language, setLanguage, t, getCategoryName, getStatusLabel, formatCurrencyWithLang, isAmharic]
  );

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: "en" as Language,
      setLanguage: () => {},
      t: (key: string, defaultText?: string) => defaultText || key,
      getCategoryName: (cat: string) => cat,
      getStatusLabel: (st: string) => st,
      formatCurrencyWithLang: (amt: number) => `${amt} ETB`,
      supportedLanguages: SUPPORTED_LANGUAGES,
      isAmharic: false,
    };
  }
  return context;
}

export const useTranslation = useLanguage;
