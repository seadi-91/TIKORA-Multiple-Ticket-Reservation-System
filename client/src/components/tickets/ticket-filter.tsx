"use client";

import React from "react";
import { Search, MapPin, SlidersHorizontal, LayoutGrid, List, RotateCcw } from "lucide-react";
import { TicketCategory, TicketFilterState } from "@/types/ticket.types";
import { ETHIOPIAN_CITIES } from "@/lib/constants";
import { TicketService } from "@/services/ticket.service";
import { useLanguage } from "@/providers/language-provider";

interface TicketFilterProps {
  filters: TicketFilterState;
  onFilterChange: (filters: Partial<TicketFilterState>) => void;
  onResetFilters: () => void;
}

export function TicketFilter({ filters, onFilterChange, onResetFilters }: TicketFilterProps) {
  const { t, getCategoryName } = useLanguage();
  const categories: { id: TicketCategory | "ALL"; label: string }[] = [
    { id: "ALL", label: t("home.allPasses", "All Passes") },
    { id: "BUS", label: getCategoryName("BUS") },
    { id: "CINEMA", label: getCategoryName("CINEMA") },
    { id: "EVENT", label: getCategoryName("EVENT") },
    { id: "SPORTS", label: getCategoryName("SPORTS") },
  ];

  return (
    <div className="space-y-3 rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 p-3.5 sm:p-4 shadow-xs">
      {/* Category Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = filters.category === cat.id;
          const isSectorActive = cat.id === "ALL" || TicketService.isCategoryActive(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onFilterChange({ category: cat.id })}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-amber-600 text-white shadow-xs font-black"
                  : !isSectorActive
                  ? "bg-rose-500/10 text-rose-500/80 hover:bg-rose-500/20"
                  : "bg-slate-100 dark:bg-slate-800 text-muted-foreground hover:text-foreground hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <span>{cat.label}</span>
              {!isSectorActive && <span className="ml-1 text-[8px] opacity-75">({t("home.temporarilyOff", "Off")})</span>}
            </button>
          );
        })}
      </div>

      {/* Search & Location Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 pt-1">
        {/* Keyword Search */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={t("hero.searchPlaceholder", "Search passes, bus fleets, movies, derbies...")}
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-foreground placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all"
          />
        </div>

        {/* City Filter */}
        <div className="md:col-span-3 relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filters.city}
            onChange={(e) => onFilterChange({ city: e.target.value })}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all appearance-none cursor-pointer"
          >
            <option value="">{t("hero.allCategories", "All Regions")}</option>
            {ETHIOPIAN_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="md:col-span-2 relative">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filters.sortBy || "POPULAR"}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all appearance-none cursor-pointer"
          >
            <option value="POPULAR">{t("common.popular", "Most Popular")}</option>
            <option value="LATEST">{t("common.latest", "Latest Added")}</option>
            <option value="PRICE_ASC">{t("common.priceAsc", "Price: Low to High")}</option>
            <option value="PRICE_DESC">{t("common.priceDesc", "Price: High to Low")}</option>
          </select>
        </div>

        {/* View Mode & Reset Button */}
        <div className="md:col-span-2 flex items-center justify-end gap-1.5">
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 p-1 bg-slate-50 dark:bg-slate-900/50">
            <button
              type="button"
              onClick={() => onFilterChange({ viewMode: "grid" })}
              aria-label="Grid view"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                filters.viewMode !== "list"
                  ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onFilterChange({ viewMode: "list" })}
              aria-label="List view"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                filters.viewMode === "list"
                  ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={onResetFilters}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TicketFilter;
