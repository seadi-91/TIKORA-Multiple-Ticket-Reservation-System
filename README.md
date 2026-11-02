# 🎟️ TIKORA - Unified Multi-Ticket Reservation Platform

**TIKORA** is a multi-industry digital ticket reservation system designed for four major ticketing sectors:
1. 🚌 **Intercity Bus Fleets** (Real-time routes, origin-destination stops, seat allocation matrices)
2. 🎬 **Cinema & Movie Theaters** (Hall layouts, screening schedules, VIP/Standard seat maps)
3. 🎪 **Concerts & Live Festivals** (Multi-tier passes: Early Bird, VIP, Regular, General Admission)
4. ⚽ **Stadium Sports & Games** (Matchday tribune entry, tournament fixtures, fast gate scanning)

---

## 🎨 Modern Brand Identity & Design System

The visual design is crafted with a high-contrast palette:
- **Obsidian Dark Surfaces**: `#020617` and `#090D16` with frosted glass overlays (`backdrop-blur-xl bg-slate-900/90`).
- **Primary Brand Gradient**: Electric Indigo (`#4F46E5`) flowing through Royal Violet (`#6366F1`) to Vibrant Blue (`#2563EB`).
- **Domain Accent Colors**:
  - 🚌 **Cyan & Teal** (`#06B6D4`): Intercity bus routes and schedules.
  - 🎬 **Electric Purple** (`#A855F7`): Cinema movie halls and premiere showtimes.
  - 🎪 **Amber Gold** (`#F59E0B`): Live concerts, festivals, and VIP packages.
  - ⚽ **Emerald Mint** (`#10B981`): Stadium sports entry and verification.
- **Micro-Interactions**: Ambient radial light orbs, smooth border transitions, subtle inner shadows, and focus rings.

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
│   ├── page.tsx                         # Tikora Landing Portal & Auth Screen Hub
│   ├── layout.tsx                       # Global root layout with theme tags
│   └── globals.css                      # Tailwind CSS v4 variables & brand styling
│
├── components/
│   └── forms/
│       ├── form-input.tsx               # Modern input with icon support & password toggle
│       ├── form-select.tsx              # Select dropdown with chevron & focus state
│       └── form-error.tsx               # Form error alert banner
│
├── lib/
│   ├── constants.ts                     # System constants, routes & domain types
│   ├── utils.ts                         # Class merging helper (`cn`)
│   └── validations/
│       └── auth.schema.ts               # Zod validation schemas
│
├── services/
│   └── auth.service.ts                  # REST API client integration for auth endpoints
│
├── stores/
│   └── auth.store.ts                    # Zustand authentication & session store
│
└── types/
    ├── auth.types.ts                    # TypeScript interfaces for auth credentials
    └── user.types.ts                    # User, Customer, and Organization profile types
```

---

## 🚀 How to Run & Verify

### 1. Start the Client

Make sure to restart the dev server to apply the updated Tailwind config:

```bash
cd client
npm run dev
```

### 2. Live Page URLs

| Page Name | Direct URL |
| :--- | :--- |
| **Home Portal & Hub** | [http://localhost:3000](http://localhost:3000) |
| **Single Unified Login** | [http://localhost:3000/login](http://localhost:3000/login) |
| **Account Type Selection** | [http://localhost:3000/register](http://localhost:3000/register) |
| **Customer Registration** | [http://localhost:3000/register/customer](http://localhost:3000/register/customer) |
| **Organization Registration** | [http://localhost:3000/register/organization](http://localhost:3000/register/organization) |
| **Forgot Password** | [http://localhost:3000/forgot-password](http://localhost:3000/forgot-password) |
| **OTP Verification** | [http://localhost:3000/verify-otp](http://localhost:3000/verify-otp) |
| **Pending Approval Status** | [http://localhost:3000/pending-approval](http://localhost:3000/pending-approval) |
