"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { MoreVertical } from "lucide-react";

export interface ActionDropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "danger" | "success" | "warning";
  disabled?: boolean;
}

export interface ActionDropdownProps {
  items: ActionDropdownItem[];
  align?: "left" | "right";
  className?: string;
  buttonClassName?: string;
  buttonTitle?: string;
}

export function ActionDropdown({
  items,
  align = "right",
  className = "",
  buttonClassName = "",
  buttonTitle = "Row actions",
}: ActionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; right: number; bottom: number }>({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setCoords({
      top: rect.top,
      left: rect.left,
      right: window.innerWidth - rect.right,
      bottom: rect.bottom,
    });
  };

  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen(!isOpen);
  };

  // Close on outside click, window resize, or scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  const menuContent = isOpen && mounted && typeof document !== "undefined" && (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: coords.bottom + 6,
        ...(align === "right"
          ? { right: Math.max(12, coords.right) }
          : { left: Math.max(12, coords.left) }),
        zIndex: 9999,
      }}
      className="w-48 sm:w-52 py-1.5 rounded-2xl bg-card border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-black/10 backdrop-blur-md animate-in fade-in zoom-in-95 duration-100 text-xs"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col">
        {items.map((item, idx) => {
          const variantClasses =
            item.variant === "danger"
              ? "text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 focus:bg-rose-500/10"
              : item.variant === "success"
              ? "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 focus:bg-emerald-500/10"
              : item.variant === "warning"
              ? "text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 focus:bg-amber-500/10"
              : "text-foreground hover:bg-slate-100 dark:hover:bg-slate-800/80 focus:bg-slate-100";

          const content = (
            <>
              {item.icon && <span className="w-4 h-4 shrink-0 flex items-center justify-center">{item.icon}</span>}
              <span className="truncate font-medium">{item.label}</span>
            </>
          );

          if (item.href) {
            return (
              <Link
                key={idx}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2.5 px-3.5 py-2 text-xs transition-colors ${variantClasses} ${
                  item.disabled ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={item.disabled}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                item.onClick?.();
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-left transition-colors ${variantClasses} ${
                item.disabled ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleOpen}
        title={buttonTitle}
        aria-label={buttonTitle}
        className={`w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200/60 dark:hover:border-slate-700/60 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${buttonClassName}`}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {menuContent && createPortal(menuContent, document.body)}
    </div>
  );
}

