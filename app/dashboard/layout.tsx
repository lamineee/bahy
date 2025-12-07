"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  MessageSquare,
  QrCode,
  Settings,
  LogOut,
  Sparkles,
  Building2,
  User,
  Bell,
  Puzzle,
  CreditCard,
  HelpCircle,
  ChevronDown,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

// Settings sub-items
const settingsSubItems = [
  { icon: Building2, label: "Etablissement", href: "/dashboard/settings/etablissement" },
  { icon: User, label: "Compte", href: "/dashboard/settings/compte" },
  { icon: Bell, label: "Notifications", href: "/dashboard/settings/notifications" },
  { icon: Puzzle, label: "Integrations", href: "/dashboard/settings/integrations" },
  { icon: CreditCard, label: "Facturation", href: "/dashboard/settings/facturation" },
]

// Mock user data (replace with real auth data)
const currentUser = {
  name: "Jean Dupont",
  email: "jean.dupont@restaurant.fr",
  initials: "JD",
  avatar: null as string | null,
}

// Mock notification counts
const notificationCounts = {
  "/dashboard/ai-responses": 3,
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Auto-open settings menu if on a settings page
  useEffect(() => {
    if (pathname.startsWith("/dashboard/settings")) {
      setSettingsOpen(true)
    }
  }, [pathname])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: MessageSquare, label: "Reponses IA", href: "/dashboard/ai-responses", badge: notificationCounts["/dashboard/ai-responses"] },
    { icon: QrCode, label: "QR Code", href: "/dashboard/qr-code" },
  ]

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  const isSettingsActive = pathname.startsWith("/dashboard/settings")

  return (
    <div className="h-screen w-screen bg-[#0a0a0b] flex overflow-hidden relative">
      {/* Mesh gradient background */}
      <div className="mesh-gradient" />
      <div className="noise-overlay" />

      {/* Sidebar */}
      <aside className="w-[260px] flex flex-col bg-[#08080a]/80 backdrop-blur-sm border-r border-white/[0.06] relative z-20">
        {/* Custom scrollbar styles */}
        <style jsx>{`
          aside::-webkit-scrollbar {
            width: 6px;
          }
          aside::-webkit-scrollbar-track {
            background: transparent;
          }
          aside::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
          }
          aside::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.15);
          }
        `}</style>

        {/* Header with Logo */}
        <div className="px-5 pt-6 pb-5">
          <div className="flex items-center gap-3">
            {/* Logo with glow effect */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-br from-[#00C9A7]/30 to-[#00E4BC]/20 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#00C9A7] to-[#00E4BC] flex items-center justify-center shadow-lg shadow-[#00C9A7]/25">
                <Sparkles size={18} className="text-white" strokeWidth={2} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[16px] font-semibold text-white tracking-tight">Bahy</span>
              <span className="text-[8px] font-medium text-white/20 bg-white/[0.03] px-1 py-0.5 rounded tracking-wider uppercase">
                pro
              </span>
            </div>
          </div>
          {/* Separator */}
          <div className="mt-5 h-px bg-gradient-to-r from-white/[0.06] via-white/[0.04] to-transparent" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative block group"
              >
                <div
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                    active
                      ? "text-white bg-[#00C9A7]/[0.08]"
                      : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                  }`}
                >
                  {/* Active indicator bar */}
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-gradient-to-b from-[#00C9A7] to-[#00E4BC] rounded-full"
                      transition={{ type: "spring", duration: 0.3, bounce: 0.15 }}
                    />
                  )}

                  <item.icon
                    size={20}
                    strokeWidth={1.8}
                    className={`transition-colors duration-150 ${
                      active ? "text-[#00C9A7]" : "text-white/40 group-hover:text-white/60"
                    }`}
                  />
                  <span>{item.label}</span>

                  {/* Notification badge */}
                  {item.badge && item.badge > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto"
                    >
                      <span className="relative flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-semibold bg-[#00C9A7] text-black">
                        {item.badge}
                        <span className="absolute inset-0 rounded-full bg-[#00C9A7] animate-ping opacity-20" />
                      </span>
                    </motion.div>
                  )}
                </div>
              </Link>
            )
          })}

          {/* Spacer */}
          <div className="h-2" />

          {/* Settings with accordion */}
          <div className="relative">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="relative w-full group"
            >
              <div
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                  isSettingsActive
                    ? "text-white bg-[#00C9A7]/[0.12]"
                    : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                }`}
              >
                {/* Active indicator bar */}
                {isSettingsActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-gradient-to-b from-[#00C9A7] to-[#00E4BC] rounded-full"
                    transition={{ type: "spring", duration: 0.3, bounce: 0.15 }}
                  />
                )}

                <Settings
                  size={20}
                  strokeWidth={1.8}
                  className={`transition-colors duration-150 ${
                    isSettingsActive ? "text-[#00C9A7]" : "text-white/40 group-hover:text-white/60"
                  }`}
                />
                <span>Parametres</span>
                <motion.div
                  animate={{ rotate: settingsOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-auto"
                >
                  <ChevronDown
                    size={14}
                    className={`transition-colors duration-150 ${
                      settingsOpen ? "text-white/60" : "text-white/25"
                    }`}
                  />
                </motion.div>
              </div>
            </button>

            {/* Accordion Sub-menu */}
            <AnimatePresence initial={false}>
              {settingsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-1 pb-1">
                    {settingsSubItems.map((subItem, index) => {
                      const subActive = pathname === subItem.href
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                        >
                          <motion.div
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03, duration: 0.15 }}
                            className={`flex items-center gap-3 pl-10 pr-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                              subActive
                                ? "text-white bg-[#00C9A7]/[0.10]"
                                : "text-white/50 hover:text-white/70 hover:bg-white/[0.04]"
                            }`}
                          >
                            <subItem.icon
                              size={16}
                              strokeWidth={1.8}
                              className={`transition-colors duration-150 ${
                                subActive ? "text-[#00C9A7]" : "text-white/35"
                              }`}
                            />
                            {subItem.label}
                          </motion.div>
                        </Link>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* User Section */}
        <div className="px-3 pb-4 pt-2">
          {/* Separator */}
          <div className="mb-3 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

          {/* User Card */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 ${
                userMenuOpen
                  ? "bg-white/[0.06]"
                  : "hover:bg-white/[0.04]"
              }`}
            >
              {/* Avatar */}
              <div className="relative">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00C9A7]/20 to-[#00E4BC]/10 border border-white/[0.08] flex items-center justify-center">
                    <span className="text-xs font-semibold text-[#00C9A7]">
                      {currentUser.initials}
                    </span>
                  </div>
                )}
                {/* Online indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00C9A7] border-2 border-[#08080a]" />
              </div>

              {/* User info */}
              <div className="flex-1 text-left min-w-0">
                <p className="text-[13px] font-medium text-white truncate">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-white/40 truncate">
                  {currentUser.email}
                </p>
              </div>

              {/* Chevron */}
              <motion.div
                animate={{ rotate: userMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={14} className="text-white/30" />
              </motion.div>
            </button>

            {/* User Dropdown */}
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute bottom-full left-0 right-0 mb-2 py-1.5 rounded-xl bg-[#101012] border border-white/[0.08] shadow-2xl shadow-black/50 overflow-hidden"
                >
                  <Link
                    href="/dashboard/settings/compte"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
                  >
                    <User size={16} strokeWidth={1.8} className="text-white/40" />
                    Mon compte
                  </Link>
                  <a
                    href="mailto:support@bahy.fr"
                    className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
                  >
                    <HelpCircle size={16} strokeWidth={1.8} className="text-white/40" />
                    Aide & Support
                  </a>

                  <div className="my-1.5 mx-3 h-px bg-white/[0.06]" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
                  >
                    <LogOut size={16} strokeWidth={1.8} />
                    Deconnexion
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto relative z-10">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
