"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  MessageSquare,
  Star,
  QrCode,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Star, label: "Avis", href: "/dashboard/reviews" },
    { icon: MessageSquare, label: "Réponses IA", href: "/dashboard/ai-responses" },
    { icon: QrCode, label: "QR Code", href: "/dashboard/qr-code" },
    { icon: Settings, label: "Paramètres", href: "/dashboard/settings" },
  ]

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  return (
    <div className="h-screen w-screen bg-[#0a0a0b] flex overflow-hidden relative">
      {/* Mesh gradient background */}
      <div className="mesh-gradient" />
      <div className="noise-overlay" />

      {/* Sidebar */}
      <aside className="w-60 flex flex-col py-6 px-4 border-r border-white/[0.04] relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 mb-10">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00C9A7] to-[#00E4BC] flex items-center justify-center shadow-lg shadow-[#00C9A7]/20">
              <Sparkles size={16} className="text-white" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-[#00C9A7] to-[#00E4BC] rounded-lg blur opacity-20" />
          </div>
          <span className="text-[15px] font-semibold text-white tracking-tight">Bahy</span>
          <span className="text-[10px] font-medium text-white/30 bg-white/5 px-1.5 py-0.5 rounded-full ml-auto">
            PRO
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative block"
              >
                {active && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-white/[0.06] rounded-lg"
                    transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
                  />
                )}
                <div
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition-colors duration-150 ${
                    active
                      ? "text-white font-medium"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  <item.icon
                    size={18}
                    strokeWidth={1.8}
                    className={active ? "text-white/90" : "text-white/30"}
                  />
                  {item.label}
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-gradient-to-b from-[#00C9A7] to-[#00E4BC] rounded-full" />
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="space-y-1 pt-4 border-t border-white/[0.04]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-white/30 hover:text-white/50 hover:bg-white/[0.02] transition-all duration-150"
          >
            <LogOut size={18} strokeWidth={1.8} />
            Déconnexion
          </button>
        </div>

        {/* Sidebar fade effect at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0a0a0b] to-transparent pointer-events-none" />
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
