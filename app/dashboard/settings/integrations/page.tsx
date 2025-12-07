"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Puzzle,
  CheckCircle2,
} from "lucide-react"

// ============================================
// TYPES
// ============================================
interface Integration {
  id: string
  name: string
  icon: string
  connected: boolean
  lastSync?: string
  comingSoon?: boolean
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
export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "google",
      name: "Google Business Profile",
      icon: "G",
      connected: true,
      lastSync: "il y a 2 heures"
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: "f",
      connected: false,
      comingSoon: true
    },
    {
      id: "tripadvisor",
      name: "TripAdvisor",
      icon: "T",
      connected: false,
      comingSoon: true
    },
    {
      id: "zapier",
      name: "Zapier",
      icon: "Z",
      connected: false,
      comingSoon: true
    }
  ])

  const toggleConnection = (id: string) => {
    setIntegrations(prev => prev.map(i =>
      i.id === id && !i.comingSoon ? { ...i, connected: !i.connected } : i
    ))
  }

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
            <Puzzle size={20} className="text-[#00C9A7]" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Integrations</h1>
        </div>
        <p className="text-sm text-white/40">Connectez vos plateformes d'avis pour centraliser la gestion</p>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-2xl"
      >
        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <motion.div variants={item} className="space-y-4">
            {integrations.map((integration) => (
              <motion.div
                key={integration.id}
                className={`flex items-center justify-between p-5 rounded-xl border transition-all ${
                  integration.comingSoon
                    ? "bg-white/[0.01] border-white/[0.04] opacity-60"
                    : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center text-xl font-bold text-white/60">
                    {integration.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-white">{integration.name}</h4>
                      {integration.comingSoon && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/[0.06] text-white/40">
                          Coming soon
                        </span>
                      )}
                      {integration.connected && !integration.comingSoon && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#00C9A7]/20 text-[#00C9A7] flex items-center gap-1">
                          <CheckCircle2 size={10} />
                          Connecte
                        </span>
                      )}
                    </div>
                    {integration.lastSync && integration.connected && (
                      <p className="text-xs text-white/40 mt-0.5">Derniere sync : {integration.lastSync}</p>
                    )}
                  </div>
                </div>

                {!integration.comingSoon && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleConnection(integration.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      integration.connected
                        ? "bg-white/[0.04] text-white/70 hover:bg-red-500/10 hover:text-red-400 border border-white/[0.08]"
                        : "bg-[#00C9A7] text-black hover:bg-[#00E4BC]"
                    }`}
                  >
                    {integration.connected ? "Deconnecter" : "Connecter"}
                  </motion.button>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
