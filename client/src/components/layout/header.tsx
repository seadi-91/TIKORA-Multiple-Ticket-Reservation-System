import React from "react";
import { PublicNavbar } from "@/components/navigation/public-navbar";

export interface HeaderProps {
  onSearchClick?: () => void;
}

export function Header({ onSearchClick }: HeaderProps) {
  return <PublicNavbar onSearchClick={onSearchClick} />;
}

export default Header;

