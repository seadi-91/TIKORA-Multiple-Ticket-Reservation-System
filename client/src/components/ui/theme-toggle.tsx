"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sun, Moon, Laptop, ChevronDown, Check } from "lucide-react";
import { useTheme, Theme } from "@/providers/theme-provider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!mounted) {
    return (
      <div className={`h-8 w-24 rounded-xl bg-slate-100/70 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 ${className}`} />
    );
  }

  const themeOptions: {
    value: Theme;
    label: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: "light",
      label: "Light",
      description: "Bright & crisp",
      icon: <Sun className="w-3.5 h-3.5 text-amber-500" />,
    },
    {
      value: "dark",
      label: "Dark",
      description: "Deep & gentle",
      icon: <Moon className="w-3.5 h-3.5 text-indigo-400" />,
    },
    {
      value: "system",
      label: "System",
      description: "Follows device",
      icon: <Laptop className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />,
    },
  ];

  const currentOption =
    themeOptions.find((opt) => opt.value === theme) || themeOptions[2];

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white text-xs font-semibold backdrop-blur-md shadow-2xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400/20"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-1.5">
          {currentOption.icon}
          <span className="text-[11px] font-medium">{currentOption.label}</span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu List */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 mt-1.5 w-44 rounded-2xl p-1.5 bg-white/95 dark:bg-[#161922]/95 border border-slate-200/90 dark:border-white/10 shadow-xl shadow-slate-900/10 dark:shadow-[0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-2 py-1 mb-1 border-b border-slate-100 dark:border-white/5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Appearance
            </span>
          </div>

          <div className="space-y-0.5">
            {themeOptions.map((opt) => {
              const isSelected = theme === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setTheme(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left transition-all cursor-pointer text-xs ${
                    isSelected
                      ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-white"
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-white/5">
                      {opt.icon}
                    </div>
                    <div>
                      <span className="block leading-none">{opt.label}</span>
                      <span className="block text-[9px] text-slate-400 font-normal mt-0.5">
                        {opt.description}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-slate-900 dark:text-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
