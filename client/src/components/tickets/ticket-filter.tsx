"use client";

import React from "react";
import { Search, MapPin, SlidersHorizontal, LayoutGrid, List, RotateCcw } from "lucide-react";
import { TicketCategory, TicketFilterState } from "@/types/ticket.types";
import { ETHIOPIAN_CITIES } from "@/lib/constants";

interface TicketFilterProps {
  filters: TicketFilterState;
  onFilterChange: (filters: Partial<TicketFilterState>) => void;
  onResetFilters: () => void;
}

export function TicketFilter({ filters, onFilterChange, onResetFilters }: TicketFilterProps) {
  const categories: { id: TicketCategory | "ALL"; label: string }[] = [
    { id: "ALL", label: "All Sectors" },
    { id: "BUS", label: "Buses" },
    { id: "CINEMA", label: "Cinema" },
    { id: "EVENT", label: "Events" },
    { id: "SPORTS", label: "Sports" },
  ];

  return (
    <div className="space-y-2.5 rounded-xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-3 sm:p-3.5 shadow-2xs">
      {/* Category Pills - Compact */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = filters.category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onFilterChange({ category: cat.id })}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-[#F59E0B] text-white shadow-2xs"
                  : "bg-slate-100 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200 dark:bg-[#0C0E14] dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Search & Location Bar - Compact */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 pt-1">
        {/* Keyword Search */}
        <div className="md:col-span-5 relative">
          <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tickets, operators, movies, derbies..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-white placeholder-[#64748B] text-xs focus:outline-none focus:border-[#F59E0B] transition-colors"
          />
        </div>

        {/* City Filter */}
        <div className="md:col-span-3 relative">
          <MapPin className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filters.city}
            onChange={(e) => onFilterChange({ city: e.target.value })}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#F59E0B] transition-colors appearance-none cursor-pointer"
          >
            <option value="">All Destinations</option>
            {ETHIOPIAN_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="md:col-span-2 relative">
          <SlidersHorizontal className="w-3 h-3 text-[#64748B] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filters.sortBy || "POPULAR"}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
            className="w-full pl-7 pr-2.5 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#F59E0B] transition-colors appearance-none cursor-pointer"
          >
            <option value="POPULAR">Popular</option>
            <option value="LATEST">Latest</option>
            <option value="PRICE_ASC">Price: Low</option>
            <option value="PRICE_DESC">Price: High</option>
          </select>
        </div>

        {/* View Mode & Reset - Compact */}
        <div className="md:col-span-2 flex items-center justify-end gap-1">
          <div className="flex items-center rounded-lg border border-[#E2E8F0] dark:border-slate-800 p-0.5 bg-[#F8FAFC] dark:bg-[#0C0E14]">
            <button
              onClick={() => onFilterChange({ viewMode: "grid" })}
              aria-label="Grid view"
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                filters.viewMode !== "list"
                  ? "bg-white dark:bg-slate-800 text-[#F59E0B] dark:text-amber-400 shadow-2xs"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <LayoutGrid className="w-3 h-3" />
            </button>
            <button
              onClick={() => onFilterChange({ viewMode: "list" })}
              aria-label="List view"
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                filters.viewMode === "list"
                  ? "bg-white dark:bg-slate-800 text-[#F59E0B] dark:text-amber-400 shadow-2xs"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <List className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={onResetFilters}
            title="Reset Filters"
            className="p-1.5 rounded-lg border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TicketFilter;
