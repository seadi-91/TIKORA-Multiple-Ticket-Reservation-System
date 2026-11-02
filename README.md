# 🎟️ TIKORA - Unified Multi-Ticket Reservation Platform

**TIKORA** is a multi-industry digital ticket reservation system designed for four major ticketing sectors:
1. 🚌 **Intercity Bus Fleets** (Real-time routes, origin-destination stops, seat allocation matrices)
2. 🎬 **Cinema & Movie Theaters** (Hall layouts, screening schedules, VIP/Standard seat maps)
3. 🎪 **Concerts & Live Festivals** (Multi-tier passes: Early Bird, VIP, Regular, General Admission)
4. ⚽ **Stadium Sports & Games** (Matchday tribune entry, tournament fixtures, fast gate scanning)

---

## 🎨 Distinct Theme Engine & Dynamic Scroll Header

### 1. Distinct Color Themes (Light, Dark, System)
- ☀️ **Light Theme**:
  - Crisp daylight surfaces with warm slate (`#f8fafc` and `#ffffff`).
  - Elevated pure white cards with soft drop shadows and refined indigo borders.
  - High contrast typography in Slate-900.
- 🌙 **Dark Theme**:
  - Deep midnight obsidian (`#020617` and `#090D16`).
  - Frosted glass cards (`backdrop-blur-xl bg-slate-900/90 border border-slate-800`).
  - Vibrant ambient indigo and violet glows with neon domain badges.
- 💻 **System Theme**:
  - Dynamically synchronizes with the user's operating system setting (`prefers-color-scheme`).
  - Dropdown indicator displays live status: `System (Dark)` or `System (Light)`.
  - Driven by [`client/src/providers/theme-provider.tsx`](file:///c:/Users/Peter%20Computer/Desktop/folder%20file/TIKORA/client/src/providers/theme-provider.tsx) and Tailwind CSS v4's custom variant (`@custom-variant dark (&:where(.dark, .dark *))`).

### 2. Dynamic Scroll Header Architecture
- **Location**: [`client/src/components/navigation/public-navbar.tsx`](file:///c:/Users/Peter%20Computer/Desktop/folder%20file/TIKORA/client/src/components/navigation/public-navbar.tsx)
- **Before Scroll (`scrollY <= 12`)**:
  - **Background**: Fully transparent (`bg-transparent`), letting the home page hero's ambient gradient shine seamlessly through the header.
  - **Border**: Absolutely no border visible (`border-b border-transparent shadow-none`).
- **After Scroll (`scrollY > 12`)**:
  - **Background**: Frosted glass with backdrop blur (`backdrop-blur-xl bg-white/85 dark:bg-slate-950/85`).
  - **Border**: Sleek bottom border appears (`border-b border-slate-200/90 dark:border-slate-800/90 shadow-xs dark:shadow-md`).
  - **Transition**: Smooth 300ms ease transition for a world-class user experience.

---

## 🌟 Modern Compact Guest & Home Page (`client/src/app/page.tsx`)

The landing experience is built specifically for visiting guests and buyers:

1. **Modern Header with Theme Dropdown (`client/src/components/navigation/public-navbar.tsx` & `client/src/components/layout/header.tsx`)**:
   - Dynamic transparent-to-frosted glass scroll effect.
   - Quick category pills for instant filtering (Buses, Cinema, Events, Sports).
   - **Dark / Light / System Dropdown Menu** with live icon, active check indicator, and descriptions.
   - Sign In and Register CTAs.
   - Responsive mobile navigation drawer with embedded theme switch buttons.

2. **Compact Hero Section with Multi-Field Search Engine**:
   - One-stop search across bus routes, movie screenings, concerts, and stadium matches.
   - City destination dropdown (Addis Ababa, Hawassa, Bahir Dar, Adama, Dire Dawa).
   - Metric tickers highlighting instant digital QR passes, verified partners, and Telebirr/Chapa integrations.

3. **Live Curated Ticket Inventory & Filtering**:
   - Live interactive category switchers (`All`, `Buses`, `Cinema`, `Events`, `Sports`).
   - Powered by the modular [`TicketCard`](file:///c:/Users/Peter%20Computer/Desktop/folder%20file/TIKORA/client/src/components/tickets/ticket-card.tsx) component with complete light/dark theme styling.
   - Shows live pricing in Ethiopian Birr (`formatCurrency`), seat availability progress bars, departure/showtime dates (`formatDate`), and organizer verification badges.

4. **Quick Reservation Modal**:
   - Clicking "Book Seat" opens an instant preview summarizing the ticket, route, time, and pricing with a direct prompt to proceed.

5. **Why Choose Tikora Section**:
   - 4-card compact value proposition (Instant QR Passes, Interactive Seat Maps, Verified Organizers, Telebirr & Local Pay).

6. **Modern Compact Footer (`client/src/components/layout/footer.tsx`)**:
   - Dual-theme styling for light and dark modes.
   - Partner banner invitation for transport fleet operators, cinema owners, and festival organizers to register.
   - Complete directory links for categories, legal notices, accepted local payment methods (Telebirr, CBE Birr, Chapa, Cards), and contact details.

---

## 🔐 Single Unified Login Architecture

As specified, **a single, unified login portal** serves all user types across the entire ecosystem:

- **Location**: [`client/src/app/(auth)/login/page.tsx`](file:///c:/Users/Peter%20Computer/Desktop/folder%20file/TIKORA/client/src/app/(auth)/login/page.tsx)
- **Universal Sign-In**: Customers, Venue Providers, Ticket Inspectors, and System Admins sign in through the **exact same login form**.
- **Automated Role Resolution**: Upon credential verification, the system detects the user's role and redirects them directly to their dedicated dashboard:
  - 👤 **Customer** $\rightarrow$ `/customer`
  - 🏢 **Organization / Provider** $\rightarrow$ `/provider/dashboard`
  - 🔍 **Ticket Inspector** $\rightarrow$ `/inspector/scanner`
  - 🛡️ **Super Admin** $\rightarrow$ `/admin/dashboard`
- **One-Click Instant Demo Chips**: Convenient test chips allow reviewers to populate demo credentials for any role in one click:
  - `customer@tikora.com`
  - `cinema.partner@tikora.com`
  - `inspector@tikora.com`
  - `admin@tikora.com`

---

## 🗂️ File Mapping & Implementation Directory

No additional folders or external files were created. All implementations are organized inside the pre-existing structure:

```
client/src/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx                   # Dark obsidian split-screen branding layout
│   │   ├── login/
│   │   │   └── page.tsx                 # Single unified login page with role presets
│   │   ├── register/
│   │   │   ├── page.tsx                 # Account type selector (Customer vs. Provider)
│   │   │   ├── customer/
│   │   │   │   └── page.tsx             # Customer signup with live password checklist
│   │   │   └── organization/
│   │   │       └── page.tsx             # Organization registration with license verification
│   │   ├── forgot-password/
│   │   │   └── page.tsx                 # Email-based password recovery
│   │   ├── reset-password/
│   │   │   └── page.tsx                 # Secure new password creation
│   │   ├── verify-otp/
│   │   │   └── page.tsx                 # 6-digit OTP verification code entry
│   │   └── pending-approval/
│   │       └── page.tsx                 # Organization onboarding status screen
│   │
│   ├── page.tsx                         # Modern Compact Guest & Home Page with Live Search
│   ├── layout.tsx                       # Global root layout with ThemeProvider integration
│   └── globals.css                      # Tailwind CSS v4 variables & custom dark variant
│
├── components/
│   ├── layout/
│   │   ├── header.tsx                   # Modern compact header export
│   │   └── footer.tsx                   # Dual-theme compact footer with payment badges
│   ├── navigation/
│   │   └── public-navbar.tsx            # Dynamic scroll header with Theme Dropdown & Mobile Menu
│   ├── tickets/
│   │   └── ticket-card.tsx              # Interactive ticket card with dual-theme styling
│   └── forms/
│       ├── form-input.tsx               # Modern input with icon support & password toggle
│       ├── form-select.tsx              # Select dropdown with chevron & focus state
│       └── form-error.tsx               # Form error alert banner
│
├── lib/
│   ├── constants.ts                     # System constants, routes & domain types
│   ├── utils.ts                         # Class merging helper (`cn`)
│   ├── format-currency.ts               # Currency formatting utility (ETB / Birr)
│   ├── format-date.ts                   # Date & time formatting utility
│   └── validations/
│       └── auth.schema.ts               # Zod validation schemas
│
├── providers/
│   └── theme-provider.tsx               # React Theme Context with localStorage & system sync
│
├── services/
│   └── auth.service.ts                  # REST API client integration for auth endpoints
│
├── stores/
│   ├── auth.store.ts                    # Zustand authentication & session store
│   └── ui.store.ts                      # Zustand UI state store
│
└── types/
    ├── ticket.types.ts                  # Ticket item, status, and filter definitions
    ├── auth.types.ts                    # TypeScript interfaces for auth credentials
    └── user.types.ts                    # User, Customer, and Organization profile types
```

---

## 🎨 Tailwind CSS v4 Engine Configuration & Troubleshooting

### Why Was the Page Previously Unstyled?
In Next.js 16 on Windows environments with Node.js 24, Turbopack's default subprocess IPC (`childProcesses`) fails when executing external loaders like `@tailwindcss/turbopack`, leading to an unhandled exit code `0` and preventing CSS compilation.

### Applied Permanent Fix (Zero File Creation):
1. **Installed Official PostCSS Pipeline**: Added `@tailwindcss/postcss` and `postcss` to `client/package.json`.
2. **PostCSS Configuration in `package.json`**: Configured the `"postcss"` property directly inside [`client/package.json`](file:///c:/Users/Peter%20Computer/Desktop/folder%20file/TIKORA/client/package.json) to eliminate the need for creating a new `postcss.config.mjs` file:
   ```json
   "postcss": {
     "plugins": {
       "@tailwindcss/postcss": {}
     }
   }
   ```
3. **Worker Thread Execution Strategy**: Configured `experimental.turbopackPluginRuntimeStrategy: "forceWorkerThreads"` in [`client/next.config.ts`](file:///c:/Users/Peter%20Computer/Desktop/folder%20file/TIKORA/client/next.config.ts), executing PostCSS inside Node worker threads without spawning broken external processes.
4. **Valid Component Signatures for Scaffolded Pages**: Populated empty 0-byte placeholder pages with minimal default exports (`export default function Page() { return null; }`) so Next.js TypeScript validation and compilation pass cleanly.
5. **Verified CSS Compilation**: PostCSS and Tailwind v4 successfully compile [`client/src/app/globals.css`](file:///c:/Users/Peter%20Computer/Desktop/folder%20file/TIKORA/client/src/app/globals.css) into full utility CSS (110+ KB) with complete theme variables, dark mode variants, and responsive layout classes.

---

## 🚀 How to Run & Verify

```bash
cd client
npm run dev
```

### Direct Page URLs

| Page Name | Direct URL |
| :--- | :--- |
| **Guest Home Page & Dynamic Scroll Header** | [http://localhost:3000](http://localhost:3000) |
| **Single Unified Login** | [http://localhost:3000/login](http://localhost:3000/login) |
| **Account Type Selection** | [http://localhost:3000/register](http://localhost:3000/register) |
| **Customer Registration** | [http://localhost:3000/register/customer](http://localhost:3000/register/customer) |
| **Organization Registration** | [http://localhost:3000/register/organization](http://localhost:3000/register/organization) |
| **Forgot Password** | [http://localhost:3000/forgot-password](http://localhost:3000/forgot-password) |
| **OTP Verification** | [http://localhost:3000/verify-otp](http://localhost:3000/verify-otp) |
| **Pending Approval Status** | [http://localhost:3000/pending-approval](http://localhost:3000/pending-approval) |
