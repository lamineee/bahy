"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  CreditCard,
  ExternalLink,
  FileText,
  Download,
  Zap,
} from "lucide-react"

// ============================================
// TYPES
// ============================================
interface Invoice {
  id: string
  date: string
  amount: string
  status: "paid" | "pending"
  pdfUrl: string
}

// ============================================
// ANIMATIONS
// ============================================
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
}

// ============================================
// MAIN PAGE
// ============================================
export default function FacturationPage() {
  const [invoices] = useState<Invoice[]>([
    { id: "INV-001", date: "1 decembre 2024", amount: "49EUR", status: "paid", pdfUrl: "#" },
    { id: "INV-002", date: "1 novembre 2024", amount: "49EUR", status: "paid", pdfUrl: "#" },
    { id: "INV-003", date: "1 octobre 2024", amount: "49EUR", status: "paid", pdfUrl: "#" },
  ])

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-white/[0.04]">
            <CreditCard size={20} className="text-[#00C9A7]" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Facturation</h1>
        </div>
        <p className="text-sm text-white/40">Gerez votre abonnement et consultez vos factures</p>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-2xl"
      >
        <motion.div variants={item} className="space-y-6">
          {/* Current Plan */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#00C9A7]/10 to-transparent border border-[#00C9A7]/20">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={18} className="text-[#00C9A7]" />
                  <span className="text-xs font-medium text-[#00C9A7] uppercase tracking-wider">Plan actuel</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">Pro</h3>
                <p className="text-white/40 text-sm">49EUR/mois</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/40 mb-1">Prochaine facture</p>
                <p className="text-sm font-medium text-white">15 janvier 2025</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 w-full py-3 rounded-xl text-sm font-medium bg-white/[0.06] text-white
                border border-white/[0.08] hover:bg-white/[0.1] transition-all flex items-center justify-center gap-2"
            >
              <ExternalLink size={16} />
              Gerer l'abonnement
            </motion.button>
          </div>

          {/* Invoices */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h4 className="text-sm font-medium text-white">Historique des factures</h4>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center">
                      <FileText size={18} className="text-white/40" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{invoice.date}</p>
                      <p className="text-xs text-white/40">{invoice.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-white">{invoice.amount}</span>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                      invoice.status === "paid"
                        ? "bg-[#00C9A7]/20 text-[#00C9A7]"
                        : "bg-amber-500/20 text-amber-400"
                    }`}>
                      {invoice.status === "paid" ? "Payee" : "En attente"}
                    </span>
                    <button className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all">
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-white/[0.06]">
              <button className="text-sm text-[#00C9A7] hover:text-[#00E4BC] transition-colors">
                Voir tout l'historique
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
