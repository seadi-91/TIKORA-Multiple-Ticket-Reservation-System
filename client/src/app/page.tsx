import Link from "next/link";
import {
  Ticket,
  Bus,
  Film,
  Calendar,
  Trophy,
  LogIn,
  UserPlus,
  Building2,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <Ticket className="w-5 h-5 transform -rotate-12" />
            </div>
            <div>
              <span className="text-xl font-black tracking-wider text-white">
                TIKORA
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-widest text-indigo-400 font-bold">
                Unified Ticketing Engine
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all"
            >
              <LogIn className="w-4 h-4 text-indigo-400" />
              <span>Sign In</span>
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-14 space-y-16">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-5 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modern Multi-Ticket Reservation System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            One Platform. Every Ticket. <br />
            Infinite Destinations.
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Reserve intercity bus seats, cinema premieres, live music festivals, and stadium sports passes with instant digital QR tickets.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/login"
              className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 text-white font-bold text-sm hover:from-indigo-500 hover:to-blue-500 shadow-xl shadow-indigo-600/30 transition-all group"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Tikora</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-900 text-slate-200 font-bold text-sm hover:border-slate-700 transition-colors"
            >
              <UserPlus className="w-4 h-4 text-indigo-400" />
              <span>Register Account</span>
            </Link>
          </div>
        </div>

        {/* 4 Industry Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Bus className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">Intercity Buses</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Real-time route scheduling, interactive seat maps, and mobile boarding passes.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/40 hover:bg-slate-900 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Film className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">Cinema & Movies</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Halls, showtimes, VIP and standard seat reservation maps.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">Live Events</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Music festivals, conferences, tiered ticket passes (Early Bird, VIP).
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-900 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">Stadium Sports</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Matchday entry, tribune seats, season club passes, and fast gate access.
            </p>
          </div>
        </div>

        {/* Quick Navigation UI Cards */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800/90 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">
                Designed Auth & Portal UI Screens
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Direct access to all designed user interfaces:
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300"
            >
              <span>Open Single Login Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/login"
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-950 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                <LogIn className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors">
                1. Single Unified Login
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                One universal sign-in page for Customers, Providers, Inspectors, and Admins with one-click demo presets.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 mt-3">
                View Screen <ArrowRight className="w-3 h-3" />
              </span>
            </Link>

            <Link
              href="/register"
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-950 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                <UserPlus className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors">
                2. Register Hub (All Roles)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Account role picker between Individual Customer vs. Organization/Provider.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 mt-3">
                View Screen <ArrowRight className="w-3 h-3" />
              </span>
            </Link>

            <Link
              href="/register/customer"
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-950 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                <Ticket className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white group-hover:text-cyan-400 transition-colors">
                3. Customer Registration
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Customer account setup with live interactive password criteria checklist.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 mt-3">
                View Screen <ArrowRight className="w-3 h-3" />
              </span>
            </Link>

            <Link
              href="/register/organization"
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-purple-500/50 hover:bg-slate-950 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white group-hover:text-purple-400 transition-colors">
                4. Organization Registration
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Business details, license number, venue/fleet category, and partner terms.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-400 mt-3">
                View Screen <ArrowRight className="w-3 h-3" />
              </span>
            </Link>

            <Link
              href="/forgot-password"
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/50 hover:bg-slate-950 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                5. Forgot Password
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Password recovery with registered email and resend confirmation state.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 mt-3">
                View Screen <ArrowRight className="w-3 h-3" />
              </span>
            </Link>

            <Link
              href="/pending-approval"
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-950 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                6. Pending Approval Status
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Step-by-step compliance status for newly registered provider accounts.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 mt-3">
                View Screen <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} TIKORA Multi-Ticket Reservation System. Designed with Next.js & Tailwind CSS.</p>
      </footer>
    </div>
  );
}
