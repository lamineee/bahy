"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Check,
  Loader2,
  Bell,
} from "lucide-react"

// ============================================
// TYPES
// ============================================
interface NotificationSetting {
  id: string
  label: string
  description: string
  enabled: boolean
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
// COMPONENTS
// ============================================
function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (value: boolean) => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        enabled ? "bg-[#00C9A7]" : "bg-white/10"
      }`}
    >
      <motion.div
        animate={{ x: enabled ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
      />
    </motion.button>
  )
}

function SaveButton({ onClick, isSaving, saved }: { onClick: () => void; isSaving: boolean; saved: boolean }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={isSaving}
      className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold
        bg-[#00C9A7] text-black hover:bg-[#00E4BC] disabled:opacity-70 transition-all
        shadow-lg shadow-[#00C9A7]/20"
    >
      {isSaving ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Sauvegarde...
        </>
      ) : saved ? (
        <>
          <Check size={16} />
          Sauvegarde !
        </>
      ) : (
        "Sauvegarder"
      )}
    </motion.button>
  )
}

// ============================================
// MAIN PAGE
// ============================================
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: "new-feedback",
      label: "Nouveau feedback recu",
      description: "Recevoir un email a chaque nouvel avis",
      enabled: true
    },
    {
      id: "negative-only",
      label: "Feedbacks negatifs uniquement",
      description: "Alertes seulement pour les avis 1-3 etoiles",
      enabled: false
    },
    {
      id: "weekly-report",
      label: "Rapport hebdomadaire",
      description: "Resume de vos performances chaque lundi",
      enabled: true
    },
    {
      id: "goals-alerts",
      label: "Alertes objectifs",
      description: "Notification quand vous atteignez un objectif",
      enabled: true
    }
  ])
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const toggleNotification = (id: string) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, enabled: !n.enabled } : n
    ))
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 1000)
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
            <Bell size={20} className="text-[#00C9A7]" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Notifications</h1>
        </div>
        <p className="text-sm text-white/40">Choisissez comment et quand recevoir des alertes</p>
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
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]
                  hover:bg-white/[0.04] transition-all"
              >
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white">{notification.label}</h4>
                  <p className="text-xs text-white/40 mt-0.5">{notification.description}</p>
                </div>
                <Toggle
                  enabled={notification.enabled}
                  onChange={() => toggleNotification(notification.id)}
                />
              </motion.div>
            ))}

            {/* Save */}
            <div className="pt-4">
              <SaveButton onClick={handleSave} isSaving={isSaving} saved={saved} />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
