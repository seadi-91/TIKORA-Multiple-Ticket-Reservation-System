# 🎟️ TicketHub — Customer Multi-Ticket Reservation Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.4.3-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.3.0-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Brand Color](https://img.shields.io/badge/Brand_Color-%23B45309-amber?style=for-the-badge)

**A modern, production-quality multi-sector ticket discovery, seat reservation, and digital QR boarding pass platform.**

[Live Routes](#-complete-page-directory) • [Design System](#-brand-identity--color-tokens) • [Interactive Seat Maps](#-interactive-ticketing-features) • [Getting Started](#-getting-started)

</div>

---

## 📌 Project Overview

**TicketHub** is designed as a commercial customer-facing ticket reservation ecosystem covering four distinct leisure and travel sectors across Ethiopia:

* 🚌 **Intercity Bus Fleets**: Real-time route discovery, bus operator filters (Selam Bus, Golden Bus, Sky Bus), and **interactive 2×2 luxury coach seat matrix**.
* 🎬 **Cinema & Movie Theaters**: Now Showing & Coming Soon premieres (Century Mall, Gast Cinema, Edna Mall) with **curved 4K IMAX theater seat selection** (Standard, VIP, Couple loungers).
* 🎪 **Live Concerts & Festivals**: Addis Jazz, cultural holidays, tech conventions with **tiered passes** (Regular, VIP, VVIP) and real-time pass capacity counters.
* ⚽ **Stadium Sports & Derbies**: Ethiopian Premier League fixtures (Sheger Derby: St. George vs Coffee SC) with **tribune and gate entry selection**.

> [!NOTE]
> **Flight tickets are explicitly excluded** by system design. TicketHub focuses purely on Buses, Cinemas, Concerts/Events, and Stadium Sports.

---

## 🎨 Brand Identity & Color Tokens

TicketHub features a refined, subdued **Warm Amber & Bronze** brand color identity (`#B45309`) with disciplined accent placement and dual-theme (Light & Dark) support:

| Token Name | Hex Code | Visual Swatch | Role / Application |
| :--- | :--- | :---: | :--- |
| **Primary (Subdued Bronze Amber)** | `#B45309` | 🟫 | Primary CTAs, brand accents, active state indicators |
| **Primary Hover** | `#92400E` | 🟫 | Hover feedback and pressed button states |
| **Light Accent Background**| `#FAF5ED` | 🟨 | Soft warm linen tint and highlighted active containers |
| **Dark Mode Base Canvas** | `#0F1117` | ⬛ | Neutral obsidian charcoal background |
| **Dark Card Background** | `#161922` | ⬛ | Elevated dark cards, sidebar containers, headers |
| **Dark Card Border** | `#232733` | ◼️ | Subtle dark mode structural boundaries |
| **Light Page Background** | `#F8FAFC` | ⬜ | Daylight slate canvas |
| **Light Card Border** | `#E2E8F0` | ◻️ | Card borders and divider rules |
| **Main Typography** | `#0F172A` | ◼️ | High-contrast body copy in light mode |
| **Muted Typography** | `#64748B` | ◻️ | Subheadings, dates, helper descriptions |

---

## 🎟️ Interactive Ticketing Features

### 1. Boarding Stub Ticket Cards (`ticket-card.tsx`)
* **Perforated Ticket Notch**: Realistic digital ticket stub aesthetic with semicircular notch cutouts and dashed tear-off perforation dividers.
* **Metadata Hierarchy**: Sector badge, verified organizer badge, rating stars, location, departure time, and starting price in Ethiopian Birr (`ETB`).
* **Micro QR Pass Hint**: Instant visual boarding pass indicator for travelers.
* **Dual View Modes**: Seamless toggle between responsive Grid view and dense List view.

### 2. Interactive Seat Selection
* **Bus 2×2 Luxury Coach Layout**: Driver cabin orientation, aisle walkway, window/aisle seat indicators, occupied seat locks, and live passenger counter.
* **Cinema Curved 4K IMAX Matrix**: Screen curved orientation, Standard seats, VIP center recliner rows, and Couple love seats with dynamic pricing.

### 3. Multi-Step Checkout & Local Payments
* **Transparent Pricing Formula**: Base Fare + **5% Service Fee** + **15% VAT**.
* **Integrated Ethiopian Payment Gateways**:
  * 📱 **Telebirr**: In-app mobile number prompt with simulated USSD authorization.
  * 🏦 **CBE Birr**: Commercial Bank of Ethiopia reference verification.
  * ⚡ **Chapa**: Local fintech debit/credit checkout flow.
  * 💳 **Visa & Mastercard**: International/local card checkout.
* **Instant Digital QR Boarding Pass**: Cryptographically unique pass saved directly to the customer's wallet.

---

## 📐 Balanced & Beautiful Dashboard Architecture

The customer dashboard features spacious, comfortable margins and healthy breathing room:
* **Generous Sidebar Width** (`w-64` to `w-72`): Ample space for menu items, active glow, and notification count badges without horizontal cramping.
* **Relaxed Grid Spacing** (`gap-8` on desktop): Ample separation between the sidebar and the main content area.
* **4-Card Metric Highlights**: Quick glance at active bookings, scannable QR passes, wishlist count, and cumulative payment ledger.

---

## 🗺️ Complete Page Directory

| Route | Page Title | Experience Highlights |
| :--- | :--- | :--- |
| `/` | **Home Landing Page** | Hero search engine, 4 sector cards, curated tickets, 3-step checkout guide, promo banner, customer reviews. |
| `/search` | **Ticket Discovery** | Full catalog search with keyword, sector, city, date, sorting (Price, Popularity), and grid/list view switcher. |
| `/bus` | **Bus Travel Hub** | Popular Ethiopian highway routes (Addis to Hawassa, Bahir Dar, Gondar, Dire Dawa). |
| `/bus/search` | **Bus Route Search** | Real-time coach results with departure stations and operator filters. |
| `/bus/[busId]` | **Bus Journey Booking** | Journey details with **interactive 2×2 coach seat selection**, passenger contact form, and checkout. |
| `/cinema` | **Cinema Screening Hub**| Now Showing and Coming Soon schedules for local cinemas (Century Mall, Gast Cinema, Edna Mall). |
| `/cinema/[movieId]` | **Movie Screening Booking**| Theater selection, showtimes, and **interactive curved 4K IMAX seat selection** (Standard, VIP, Couple). |
| `/events` | **Concerts & Events** | Music festivals, cultural holidays, tech conferences, and comedy shows. |
| `/events/[eventId]`| **Event Pass Selection** | Tiered passes (Regular, VIP, VVIP) with capacity meters and venue information. |
| `/sports` | **Stadium Sports Hub** | Ethiopian Premier League derbies and athletics championships. |
| `/sports/[sportId]`| **Matchday Booking** | Stadium tribune selection (Bleachers, Covered Tribune, VIP Lounge) and gate directions. |
| `/customer` | **Customer Overview** | Stat widgets, upcoming journey hero card, quick shortcuts, recent bookings list. |
| `/customer/bookings`| **My Bookings** | Filterable history (All, Upcoming, Completed, Cancelled) with cancellation modal and receipt viewer. |
| `/customer/tickets` | **Digital QR Wallet** | Apple/Google Wallet styled digital ticket passes with scannable QR codes. |
| `/customer/favorites`| **Saved Wishlist** | Saved events and routes with 1-click booking. |
| `/customer/notifications`| **Notifications** | Real-time booking confirmations, gate updates, and receipt alerts. |
| `/customer/payments`| **Payment History** | Transaction ledger with ETB amounts and downloadable PDF receipt simulation. |
| `/customer/profile`| **Customer Profile** | Personal information, 85% completion meter, and loyalty points. |
| `/customer/profile/settings`| **Account Settings** | Password update with live criteria checklist, notification toggles, theme, and language. |
| `/login` | **Unified Sign In** | Single sign-in portal with 1-click test credentials for Customer, Provider, Inspector, and Admin. |
| `/register` | **Account Selection** | Role onboarding router distinguishing Customer vs Organization registrations. |
| `/contact` | **Help & Support** | Searchable FAQ accordion, support ticket form, and office contact information. |

---

## 📁 Clean Codebase Structure

<details>
<summary><b>Click to expand file tree</b></summary>

```
client/src/
├── app/
│   ├── (auth)/              # Unified login, customer register, forgot-password, OTP, reset
│   ├── (public)/            # Sector landing pages (bus, cinema, events, sports, search, about, contact)
│   ├── customer/            # Authenticated customer dashboard, bookings, tickets wallet, settings
│   ├── globals.css          # Tailwind CSS v4 variables with Golden Amber tokens & dark mode
│   ├── layout.tsx           # Global root layout with theme provider
│   └── page.tsx             # Modern customer landing page with hero search & sector cards
│
├── components/
│   ├── booking/             # Booking cards, price breakdown summaries, QR confirmations
│   ├── feedback/            # Empty states, error alerts, success banners
│   ├── forms/               # Inputs, selects, and form error helpers
│   ├── layout/              # Header, dynamic scroll navbar, dashboard layout, footer
│   ├── navigation/          # Public navbar, customer sidebar with route highlighting
│   ├── payment/             # Telebirr, CBE Birr, Chapa, Card selectors & summaries
│   └── tickets/             # Boarding-stub ticket cards, search filter bars, category lists
│
├── lib/
│   ├── constants.ts         # Golden Amber colors (#F59E0B), Ethiopian cities, payment methods
│   ├── format-currency.ts   # Ethiopian Birr (ETB) currency formatting
│   ├── format-date.ts       # Human-readable date and time formatting
│   └── utils.ts             # Tailwind class merging utility
│
├── providers/
│   └── theme-provider.tsx   # React Theme Context (Light, Dark, System)
│
├── services/                # Interactive mock data services for buses, cinema, events, sports
├── stores/                  # Zustand persistent customer booking & session stores
└── types/                   # TypeScript interfaces for tickets, bookings, payments, and users
```

</details>

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.17+ or v20+
* **npm** or **pnpm**

### Installation & Run

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

4. To verify TypeScript types and production build:
   ```bash
   npx tsc --noEmit
   npm run build
   ```
