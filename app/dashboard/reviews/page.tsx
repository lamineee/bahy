"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  MessageSquareWarning,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Mail,
  Phone,
  Gift,
  Sparkles,
  Send,
  ChevronRight,
  Download,
  Check,
  Star,
  MessageSquare,
  Eye,
  PhoneCall,
  PartyPopper,
  Loader2,
  StickyNote,
  Plus,
  Command,
  TrendingUp,
  Inbox,
  CheckCheck,
  RefreshCw,
  Heart,
  Flame,
  Zap,
  Timer,
  AlertTriangle,
} from "lucide-react"

// ============================================
// TYPES
// ============================================
type FeedbackStatus = "pending" | "in_progress" | "resolved"
type Priority = "critical" | "high" | "medium" | "low"

interface TimelineEvent {
  id: number
  type: "received" | "viewed" | "contacted" | "resolved" | "note_added"
  date: string
  note?: string
}

interface Feedback {
  id: number
  clientName: string
  clientEmail: string
  clientPhone?: string
  rating: number
  message: string
  date: string
  dateRelative: string
  status: FeedbackStatus
  category?: string
  priority: Priority
  timeline: TimelineEvent[]
  internalNotes: string[]
  visitCount?: number
  totalSpent?: number
  tags?: string[]
}

// ============================================
// DATA
// ============================================
const feedbacksData: Feedback[] = [
  {
    id: 1,
    clientName: "Marie Lefebvre",
    clientEmail: "marie.lefebvre@gmail.com",
    clientPhone: "06 12 34 56 78",
    rating: 1,
    message: "Attente beaucoup trop longue, plus de 45 minutes avant d'être servi. Le personnel semblait complètement débordé et personne ne s'est excusé. Très déçue car on m'avait recommandé cet établissement. Je ne reviendrai pas.",
    date: "2024-01-15",
    dateRelative: "Il y a 2h",
    status: "pending",
    category: "Attente",
    priority: "critical",
    timeline: [{ id: 1, type: "received", date: "Il y a 2h" }],
    internalNotes: [],
    visitCount: 1,
    totalSpent: 45,
    tags: ["Attente", "Service"]
  },
  {
    id: 2,
    clientName: "Thomas Moreau",
    clientEmail: "t.moreau@outlook.fr",
    rating: 1,
    message: "Prix exorbitants pour une qualité plus que moyenne. 45€ pour un plat qui ne les vaut clairement pas. Rapport qualité-prix catastrophique.",
    date: "2024-01-15",
    dateRelative: "Il y a 5h",
    status: "pending",
    category: "Prix",
    priority: "high",
    timeline: [{ id: 1, type: "received", date: "Il y a 5h" }],
    internalNotes: [],
    visitCount: 2,
    totalSpent: 120,
    tags: ["Prix", "Qualité"]
  },
  {
    id: 3,
    clientName: "Sophie Bernard",
    clientEmail: "sophie.b@gmail.com",
    clientPhone: "07 98 76 54 32",
    rating: 2,
    message: "Service désagréable. Le serveur était condescendant et pressé. Ambiance gâchée pour notre anniversaire de mariage. Vraiment dommage.",
    date: "2024-01-14",
    dateRelative: "Hier",
    status: "in_progress",
    category: "Service",
    priority: "critical",
    timeline: [
      { id: 1, type: "received", date: "Hier" },
      { id: 2, type: "viewed", date: "Il y a 20h" },
      { id: 3, type: "contacted", date: "Il y a 18h", note: "Email d'excuses envoyé avec offre -30%" }
    ],
    internalNotes: ["Client fidèle - 3ème visite", "VIP - Proposer geste commercial premium"],
    visitCount: 3,
    totalSpent: 450,
    tags: ["Service", "Ambiance"]
  },
  {
    id: 4,
    clientName: "Lucas Petit",
    clientEmail: "lucas.petit@hotmail.com",
    rating: 3,
    message: "Correct mais sans plus. La propreté des toilettes laisse à désirer. Dommage car le reste était plutôt bien.",
    date: "2024-01-14",
    dateRelative: "Hier",
    status: "in_progress",
    category: "Propreté",
    priority: "medium",
    timeline: [
      { id: 1, type: "received", date: "Hier" },
      { id: 2, type: "viewed", date: "Il y a 22h" }
    ],
    internalNotes: ["Signalé à l'équipe d'entretien"],
    visitCount: 1,
    totalSpent: 35,
    tags: ["Propreté"]
  },
  {
    id: 5,
    clientName: "Emma Dubois",
    clientEmail: "emma.dubois@icloud.com",
    clientPhone: "06 45 67 89 01",
    rating: 2,
    message: "Réservation non prise en compte malgré confirmation. 30 min d'attente avec des enfants fatigués. Frustrant.",
    date: "2024-01-13",
    dateRelative: "Il y a 2j",
    status: "resolved",
    category: "Réservation",
    priority: "high",
    timeline: [
      { id: 1, type: "received", date: "Il y a 2j" },
      { id: 2, type: "viewed", date: "Il y a 2j" },
      { id: 3, type: "contacted", date: "Il y a 1j", note: "Appel téléphonique - cliente compréhensive" },
      { id: 4, type: "resolved", date: "Il y a 1j", note: "Invitation famille offerte - Cliente reconquise" }
    ],
    internalNotes: ["Bug système résa corrigé", "Reviendra le mois prochain"],
    visitCount: 5,
    totalSpent: 380,
    tags: ["Réservation", "Attente"]
  },
  {
    id: 6,
    clientName: "Antoine Martin",
    clientEmail: "a.martin@gmail.com",
    rating: 1,
    message: "Commande erronée. Manager désagréable et sur la défensive. Aucune excuse, aucun geste. Inadmissible.",
    date: "2024-01-12",
    dateRelative: "Il y a 3j",
    status: "resolved",
    category: "Service",
    priority: "critical",
    timeline: [
      { id: 1, type: "received", date: "Il y a 3j" },
      { id: 2, type: "viewed", date: "Il y a 3j" },
      { id: 3, type: "contacted", date: "Il y a 2j", note: "Email personnalisé du directeur" },
      { id: 4, type: "resolved", date: "Il y a 1j", note: "Bon 50€ + dîner offert" }
    ],
    internalNotes: ["Entretien avec manager effectué", "Formation service client planifiée"],
    visitCount: 8,
    totalSpent: 720,
    tags: ["Service", "Commande"]
  },
  {
    id: 7,
    clientName: "Julie Rousseau",
    clientEmail: "julie.r@yahoo.fr",
    rating: 3,
    message: "Musique beaucoup trop forte, impossible de s'entendre. Sinon la cuisine était correcte.",
    date: "2024-01-11",
    dateRelative: "Il y a 4j",
    status: "pending",
    category: "Ambiance",
    priority: "low",
    timeline: [{ id: 1, type: "received", date: "Il y a 4j" }],
    internalNotes: [],
    visitCount: 1,
    totalSpent: 55,
    tags: ["Ambiance"]
  },
  {
    id: 8,
    clientName: "Pierre Durand",
    clientEmail: "p.durand@gmail.com",
    clientPhone: "06 78 90 12 34",
    rating: 2,
    message: "Plat froid et serveur qui a mis 20 minutes à revenir. Pas au niveau de ce qu'on attend pour ce prix.",
    date: "2024-01-10",
    dateRelative: "Il y a 5j",
    status: "pending",
    category: "Qualité",
    priority: "high",
    timeline: [{ id: 1, type: "received", date: "Il y a 5j" }],
    internalNotes: [],
    visitCount: 4,
    totalSpent: 290,
    tags: ["Qualité", "Service"]
  }
]

// ============================================
// ANIMATIONS
// ============================================
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.08 }
  }
}

const item = {
  hidden: { opacity: 0, y: 6, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 400, damping: 30 }
  }
}

const slidePanel = {
  hidden: { x: "100%", opacity: 0.5 },
  show: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 400, damping: 35 }
  },
  exit: { x: "100%", opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }
}

const filterTransition = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2 }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
const getPriorityConfig = (priority: Priority) => {
  const configs = {
    critical: {
      color: "#F97316",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      label: "Urgent",
      icon: Flame
    },
    high: {
      color: "#EAB308",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      label: "Important",
      icon: AlertTriangle
    },
    medium: {
      color: "#6B7280",
      bg: "bg-gray-500/10",
      border: "border-gray-500/20",
      label: "Moyen",
      icon: Clock
    },
    low: {
      color: "#6B7280",
      bg: "bg-gray-500/10",
      border: "border-gray-500/20",
      label: "Faible",
      icon: CheckCircle2
    }
  }
  return configs[priority]
}

// ============================================
// SKELETON LOADER
// ============================================
function SkeletonLoader() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-4 py-4 rounded-xl bg-white/[0.02] border border-white/[0.04]"
        >
          <div className="w-5 h-5 rounded-md bg-white/[0.06]" />
          <div className="w-10 h-10 rounded-xl bg-white/[0.06]" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded bg-white/[0.06]" />
            <div className="h-3 w-64 rounded bg-white/[0.04]" />
          </div>
          <div className="h-3 w-12 rounded bg-white/[0.04]" />
          <div className="h-6 w-20 rounded-lg bg-white/[0.04]" />
        </div>
      ))}
    </div>
  )
}

// ============================================
// CONFETTI
// ============================================
function Confetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; color: string; size: number; delay: number }>>([])

  useEffect(() => {
    if (active) {
      const colors = ["#00C9A7", "#8B5CF6", "#F59E0B", "#EC4899", "#3B82F6", "#10B981"]
      setParticles([...Array(60)].map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 6,
        delay: Math.random() * 0.3
      })))
    }
  }, [active])

  if (!active) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ left: `${p.left}%`, width: p.size, height: p.size, backgroundColor: p.color }}
          initial={{ y: -20, opacity: 1, scale: 1, rotate: 0 }}
          animate={{
            y: typeof window !== 'undefined' ? window.innerHeight + 50 : 900,
            opacity: [1, 1, 0],
            scale: [1, 1.2, 0.8],
            rotate: Math.random() * 720 - 360
          }}
          transition={{ duration: 2.5 + Math.random(), delay: p.delay, ease: [0.23, 1, 0.32, 1] }}
        />
      ))}
    </div>
  )
}

// ============================================
// TOAST
// ============================================
function Toast({ message, visible, type = "success", onClose }: {
  message: string
  visible: boolean
  type?: "success" | "info" | "warning"
  onClose: () => void
}) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 4000)
      return () => clearTimeout(timer)
    }
  }, [visible, onClose])

  const configs = {
    success: {
      icon: <CheckCircle2 size={18} className="text-emerald-400" />,
      gradient: "from-emerald-500/20 via-emerald-500/10 to-transparent",
      border: "border-emerald-500/20",
      glow: "shadow-emerald-500/10"
    },
    info: {
      icon: <Sparkles size={18} className="text-blue-400" />,
      gradient: "from-blue-500/20 via-blue-500/10 to-transparent",
      border: "border-blue-500/20",
      glow: "shadow-blue-500/10"
    },
    warning: {
      icon: <AlertTriangle size={18} className="text-amber-400" />,
      gradient: "from-amber-500/20 via-amber-500/10 to-transparent",
      border: "border-amber-500/20",
      glow: "shadow-amber-500/10"
    }
  }

  const config = configs[type]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(4px)" }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r ${config.gradient} border ${config.border} backdrop-blur-xl shadow-2xl ${config.glow}`}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 400 }}
            className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center"
          >
            {config.icon}
          </motion.div>
          <span className="text-sm font-medium text-white/90">{message}</span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="ml-2 p-1 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-all"
          >
            <X size={14} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================
// PRIORITY BADGE
// ============================================
function PriorityBadge({ priority }: { priority: Priority }) {
  const config = getPriorityConfig(priority)
  const Icon = config.icon

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide ${config.bg} ${config.border} border`}
      style={{ color: config.color }}
    >
      <Icon size={10} />
      {config.label}
    </motion.div>
  )
}

// ============================================
// STAR RATING
// ============================================
function StarRating({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= rating
            ? "text-amber-400 fill-amber-400"
            : "text-white/10"
          }
        />
      ))}
    </div>
  )
}

// ============================================
// STATUS BADGE
// ============================================
function StatusBadge({ status, size = "default" }: { status: FeedbackStatus; size?: "small" | "default" }) {
  const config = {
    pending: { label: "À traiter", icon: AlertCircle, color: "#F97316", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    in_progress: { label: "En cours", icon: Clock, color: "#EAB308", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
    resolved: { label: "Résolu", icon: CheckCircle2, color: "#10B981", bg: "bg-emerald-500/10", border: "border-emerald-500/20" }
  }
  const { label, icon: Icon, color, bg, border } = config[status]
  const isSmall = size === "small"

  return (
    <motion.span
      whileHover={{ scale: 1.02 }}
      className={`inline-flex items-center gap-1.5 ${isSmall ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"} font-medium rounded-lg border ${bg} ${border} cursor-default transition-all hover:brightness-110`}
      style={{ color }}
    >
      <Icon size={isSmall ? 10 : 12} />
      {label}
    </motion.span>
  )
}

// ============================================
// COMPACT STAT ITEM
// ============================================
function CompactStatItem({ icon: Icon, label, value, suffix = "", color, isHighlighted = false }: {
  icon: React.ElementType
  label: string
  value: number
  suffix?: string
  color: string
  isHighlighted?: boolean
}) {
  return (
    <motion.div
      whileHover={{ y: -1 }}
      className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
        isHighlighted
          ? "bg-gradient-to-r from-[#00C9A7]/10 to-transparent border border-[#00C9A7]/30 shadow-lg shadow-[#00C9A7]/5"
          : "bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08]"
      }`}
    >
      {isHighlighted && (
        <motion.div
          className="absolute inset-0 rounded-xl opacity-50"
          animate={{
            boxShadow: ["0 0 0 0 rgba(0, 201, 167, 0)", "0 0 0 4px rgba(0, 201, 167, 0.1)", "0 0 0 0 rgba(0, 201, 167, 0)"]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${color}15` }}>
        <Icon size={14} style={{ color }} />
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-lg font-bold text-white">{value}{suffix}</span>
        <span className="text-[11px] text-white/40">{label}</span>
      </div>
    </motion.div>
  )
}

// ============================================
// RESPONSE TIME INDICATOR
// ============================================
function ResponseTimeIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500/10 via-purple-500/5 to-transparent border border-violet-500/20"
    >
      <div className="p-1.5 rounded-lg bg-violet-500/15">
        <Zap size={14} className="text-violet-400" />
      </div>
      <p className="text-xs text-white/60">
        <span className="text-violet-400 font-medium">Conseil :</span> Répondre dans les 24h augmente les chances de reconquête de <span className="text-violet-400 font-semibold">60%</span>
      </p>
    </motion.div>
  )
}

// ============================================
// CATEGORY TAG
// ============================================
function CategoryTag({ tag }: { tag: string }) {
  const tagColors: Record<string, { bg: string; text: string; border: string }> = {
    "Attente": { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
    "Service": { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
    "Prix": { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20" },
    "Propreté": { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
    "Qualité": { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
    "Ambiance": { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/20" },
    "Réservation": { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
    "Commande": { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  }

  const colors = tagColors[tag] || { bg: "bg-gray-500/10", text: "text-gray-400", border: "border-gray-500/20" }

  return (
    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-md border ${colors.bg} ${colors.text} ${colors.border}`}>
      {tag}
    </span>
  )
}

// ============================================
// FILTER PILL
// ============================================
function FilterPill({ active, children, onClick, count, color }: {
  active: boolean
  children: React.ReactNode
  onClick: () => void
  count?: number
  color?: string
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
        active ? "text-white" : "text-white/40 hover:text-white/70"
      }`}
    >
      {active && (
        <motion.div
          layoutId="activeFilter"
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/[0.08] to-white/[0.04] border border-white/[0.1]"
          style={{ boxShadow: color ? `0 0 20px ${color}20` : undefined }}
          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {count !== undefined && (
          <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
            active ? "bg-white/10 text-white/70" : "bg-white/5 text-white/30"
          }`}>
            {count}
          </span>
        )}
      </span>
    </motion.button>
  )
}

// ============================================
// FEEDBACK ROW
// ============================================
function FeedbackRow({ feedback, isChecked, onSelect, onCheck, showCheckbox }: {
  feedback: Feedback
  isChecked: boolean
  onSelect: () => void
  onCheck: (e: React.MouseEvent) => void
  showCheckbox: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const priorityConfig = getPriorityConfig(feedback.priority)

  return (
    <motion.div
      variants={item}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
      whileHover={{ x: 3 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`group relative flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-colors duration-200 ${
        isChecked
          ? "bg-[#00C9A7]/[0.08] border-[#00C9A7]/30"
          : "bg-white/[0.015] border-transparent hover:bg-white/[0.03]"
      } border`}
    >
      {/* Priority dot indicator */}
      <motion.div
        className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: priorityConfig.color }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
      />

      {/* Checkbox */}
      <motion.div
        className="w-5 ml-2"
        initial={false}
        animate={{ opacity: showCheckbox || hovered ? 1 : 0, scale: showCheckbox || hovered ? 1 : 0.8 }}
        transition={{ duration: 0.15 }}
        onClick={onCheck}
      >
        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
          isChecked ? "bg-[#00C9A7] border-[#00C9A7]" : "border-white/20 hover:border-white/40"
        }`}>
          <AnimatePresence>
            {isChecked && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Check size={12} className="text-black" strokeWidth={3} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Avatar */}
      <div className="relative">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
          feedback.rating === 1 ? "bg-gradient-to-br from-orange-500/20 to-red-500/10 text-orange-400" :
          feedback.rating === 2 ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/10 text-yellow-400" :
          "bg-gradient-to-br from-amber-500/20 to-yellow-500/10 text-amber-400"
        }`}>
          {feedback.clientName.split(" ").map(n => n[0]).join("")}
        </div>
        {feedback.visitCount && feedback.visitCount >= 3 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center">
            <Heart size={8} className="text-white fill-white" />
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-white">{feedback.clientName}</span>
          <PriorityBadge priority={feedback.priority} />
          {feedback.tags && feedback.tags.slice(0, 2).map((tag) => (
            <CategoryTag key={tag} tag={tag} />
          ))}
        </div>
        <p className="text-[13px] text-white/50 truncate leading-relaxed">{feedback.message}</p>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-5 shrink-0">
        <StarRating rating={feedback.rating} size={11} />

        <div className="text-right min-w-[60px]">
          <p className="text-xs text-white/30">{feedback.dateRelative}</p>
        </div>

        <StatusBadge status={feedback.status} size="small" />

        <motion.div
          animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0.3 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight size={16} className="text-white/40" />
        </motion.div>
      </div>
    </motion.div>
  )
}

// ============================================
// TIMELINE
// ============================================
function Timeline({ events }: { events: TimelineEvent[] }) {
  const iconMap = {
    received: { icon: Inbox, color: "#6B7280", label: "Reçu" },
    viewed: { icon: Eye, color: "#8B5CF6", label: "Consulté" },
    contacted: { icon: PhoneCall, color: "#3B82F6", label: "Contacté" },
    resolved: { icon: CheckCircle2, color: "#10B981", label: "Résolu" },
    note_added: { icon: StickyNote, color: "#F59E0B", label: "Note ajoutée" }
  }

  return (
    <div className="relative space-y-3">
      <div className="absolute left-3 top-3 bottom-3 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent" />

      {events.map((event, i) => {
        const config = iconMap[event.type]
        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="relative flex items-start gap-3 group"
          >
            <div
              className="relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ring-2 ring-[#0a0a0b]"
              style={{ backgroundColor: `${config.color}20` }}
            >
              <config.icon size={11} style={{ color: config.color }} />
            </div>
            <div className="flex-1 pt-0.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white/80">{config.label}</span>
                <span className="text-[11px] text-white/30">{event.date}</span>
              </div>
              {event.note && (
                <p className="text-xs text-white/40 mt-1 leading-relaxed">{event.note}</p>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// ============================================
// CLIENT INFO CARD
// ============================================
function ClientInfoCard({ feedback }: { feedback: Feedback }) {
  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Profil client</span>
        {feedback.visitCount && feedback.visitCount >= 3 && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-violet-500/15 text-violet-400">
            <Heart size={10} className="fill-current" />
            Client fidèle
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] text-white/30">Visites</p>
          <p className="text-lg font-bold text-white">{feedback.visitCount || 1}</p>
        </div>
        <div>
          <p className="text-[11px] text-white/30">Total dépensé</p>
          <p className="text-lg font-bold text-white">{feedback.totalSpent || 0}€</p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// DETAIL PANEL
// ============================================
function DetailPanel({ feedback, onClose, onStatusChange, onAddNote }: {
  feedback: Feedback
  onClose: () => void
  onStatusChange: (status: FeedbackStatus) => void
  onAddNote: (note: string) => void
}) {
  const [newNote, setNewNote] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedResponse, setGeneratedResponse] = useState("")
  const [showAIModal, setShowAIModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const priorityConfig = getPriorityConfig(feedback.priority)

  const handleGenerateAI = async () => {
    setIsGenerating(true)
    setShowAIModal(true)
    await new Promise(r => setTimeout(r, 1800))

    const templates: Record<string, string> = {
      "Attente": `Bonjour ${feedback.clientName.split(" ")[0]},

Je suis sincèrement désolé pour cette attente inacceptable de 45 minutes. Ce n'est absolument pas le niveau de service que nous visons.

J'ai personnellement revu notre organisation aux heures de pointe et renforcé l'équipe.

Pour me faire pardonner, je vous offre votre prochain repas. Contactez-moi directement au 06 XX XX XX XX pour réserver votre table VIP.

Bien à vous,
[Votre nom]`,
      "Prix": `Bonjour ${feedback.clientName.split(" ")[0]},

Je comprends votre déception concernant le rapport qualité-prix.

Nos tarifs reflètent des produits frais et locaux, mais votre ressenti est important.

Je vous propose de découvrir notre nouveau menu déjeuner à 25€, ou un bon de -40% sur votre prochaine visite.

Qu'en pensez-vous ?

Cordialement`,
      "Service": `Bonjour ${feedback.clientName.split(" ")[0]},

Je suis profondément navré pour votre anniversaire de mariage gâché. C'est inexcusable.

J'ai eu un entretien avec l'équipe concernée. Des mesures concrètes ont été prises.

Permettez-moi de vous offrir un dîner gastronomique complet pour deux, avec champagne, à la date de votre choix.

Très sincèrement`,
      "default": `Bonjour ${feedback.clientName.split(" ")[0]},

Merci d'avoir pris le temps de partager votre expérience. Votre retour est précieux.

Je suis désolé que votre visite n'ait pas été à la hauteur de vos attentes.

J'aimerais en discuter avec vous et trouver comment me rattraper. Seriez-vous disponible pour un appel ?

Cordialement`
    }

    setGeneratedResponse(templates[feedback.category || "default"] || templates.default)
    setIsGenerating(false)
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(feedback.clientEmail)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <motion.div
        variants={slidePanel}
        initial="hidden"
        animate="show"
        exit="exit"
        className="h-full flex flex-col bg-[#0a0a0b]"
      >
        {/* Header */}
        <div className="shrink-0 p-6 border-b border-white/[0.06]">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold ${
                feedback.rating === 1 ? "bg-gradient-to-br from-orange-500/20 to-red-500/10 text-orange-400" :
                feedback.rating === 2 ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/10 text-yellow-400" :
                "bg-gradient-to-br from-amber-500/20 to-yellow-500/10 text-amber-400"
              }`}>
                {feedback.clientName.split(" ").map(n => n[0]).join("")}
                <div
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: priorityConfig.color }}
                >
                  <priorityConfig.icon size={10} className="text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{feedback.clientName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={feedback.rating} size={14} />
                  <span className="text-white/20">•</span>
                  <StatusBadge status={feedback.status} />
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              <X size={20} />
            </motion.button>
          </div>

          {/* Contact buttons */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopyEmail}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition-all"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Mail size={14} className="text-white/50" />}
              <span className="text-xs text-white/60">{feedback.clientEmail}</span>
            </motion.button>
            {feedback.clientPhone && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition-all"
              >
                <Phone size={14} className="text-white/50" />
                <span className="text-xs text-white/60">{feedback.clientPhone}</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Response time tip */}
          {feedback.status === "pending" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-violet-500/10 to-transparent border border-violet-500/20"
            >
              <Timer size={16} className="text-violet-400 shrink-0" />
              <p className="text-xs text-white/60">
                Répondre rapidement augmente les chances de reconquête de <span className="text-violet-400 font-semibold">60%</span>
              </p>
            </motion.div>
          )}

          {/* Client Info */}
          <ClientInfoCard feedback={feedback} />

          {/* Tags */}
          {feedback.tags && feedback.tags.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Tags détectés</h4>
              <div className="flex flex-wrap gap-2">
                {feedback.tags.map((tag) => (
                  <CategoryTag key={tag} tag={tag} />
                ))}
              </div>
            </div>
          )}

          {/* Message */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare size={14} className="text-white/40" />
                <span className="text-xs font-medium text-white/40">Feedback</span>
              </div>
              <span className="text-[11px] text-white/30">{feedback.dateRelative}</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">{feedback.message}</p>
          </div>

          {/* Timeline */}
          <div>
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Historique</h4>
            <Timeline events={feedback.timeline} />
          </div>

          {/* Notes */}
          <div>
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Notes internes</h4>
            <div className="space-y-2">
              <AnimatePresence>
                {feedback.internalNotes.map((note, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10"
                  >
                    <StickyNote size={14} className="text-amber-400/60 shrink-0 mt-0.5" />
                    <p className="text-sm text-white/60">{note}</p>
                  </motion.div>
                ))}
              </AnimatePresence>

              {feedback.internalNotes.length === 0 && (
                <p className="text-sm text-white/20 italic">Aucune note</p>
              )}

              <div className="flex items-center gap-2 mt-3">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newNote.trim()) {
                      onAddNote(newNote)
                      setNewNote("")
                    }
                  }}
                  placeholder="Ajouter une note..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/[0.15] transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (newNote.trim()) {
                      onAddNote(newNote)
                      setNewNote("")
                    }
                  }}
                  disabled={!newNote.trim()}
                  className="p-2.5 rounded-xl bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white transition-all disabled:opacity-30"
                >
                  <Plus size={18} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="shrink-0 p-6 border-t border-white/[0.06] space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <motion.button
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleGenerateAI}
              className="relative group flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Sparkles size={16} className="relative z-10 text-white" />
              <span className="relative z-10 text-white">Réponse IA</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-medium bg-white/[0.04] text-white/70 border border-white/[0.08] hover:bg-white/[0.08] transition-all"
            >
              <Mail size={16} />
              Envoyer email
            </motion.button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <motion.button
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-white/[0.02] text-white/50 border border-white/[0.06] hover:bg-white/[0.04] transition-all"
            >
              <Gift size={15} />
              Offrir un geste
            </motion.button>
            {feedback.status !== "resolved" ? (
              <motion.button
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onStatusChange("resolved")}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
              >
                <CheckCircle2 size={15} />
                Résoudre
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onStatusChange("pending")}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-white/[0.02] text-white/50 border border-white/[0.06] hover:bg-white/[0.04] transition-all"
              >
                <RefreshCw size={15} />
                Réouvrir
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* AI Modal */}
      <AnimatePresence>
        {showAIModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => setShowAIModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl rounded-3xl bg-[#0f0f10] border border-white/[0.1] shadow-2xl overflow-hidden"
            >
              <div className="relative p-6 border-b border-white/[0.06] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-purple-600/5 to-transparent" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10">
                      <Sparkles size={20} className="text-violet-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Réponse générée par IA</h3>
                      <p className="text-xs text-white/40">Personnalisée pour {feedback.clientName}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAIModal(false)}
                    className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
                  >
                    <X size={18} />
                  </motion.button>
                </div>
              </div>

              <div className="p-6">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 size={32} className="text-violet-400" />
                    </motion.div>
                    <motion.p
                      className="text-sm text-white/50 mt-4"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Génération en cours...
                    </motion.p>
                  </div>
                ) : (
                  <textarea
                    value={generatedResponse}
                    onChange={(e) => setGeneratedResponse(e.target.value)}
                    className="w-full h-72 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-sm text-white/90 placeholder-white/20 resize-none focus:outline-none focus:border-violet-500/30 transition-all leading-relaxed"
                  />
                )}
              </div>

              <div className="flex items-center justify-between p-6 border-t border-white/[0.06]">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-all disabled:opacity-30"
                >
                  <RefreshCw size={14} />
                  Régénérer
                </motion.button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAIModal(false)}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white/70 transition-all"
                  >
                    Annuler
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-[#00C9A7] text-black hover:bg-[#00E4BC] transition-all disabled:opacity-50 shadow-lg shadow-[#00C9A7]/20"
                  >
                    <Send size={14} />
                    Envoyer
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ============================================
// EMPTY STATE
// ============================================
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24"
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1], rotate: [0, 3, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
        className="relative w-28 h-28 rounded-[2rem] bg-gradient-to-br from-emerald-500/20 via-[#00C9A7]/15 to-teal-500/10 flex items-center justify-center mb-8"
      >
        <PartyPopper size={48} className="text-[#00C9A7]" />
        <div className="absolute inset-0 rounded-[2rem] bg-[#00C9A7]/10 blur-2xl" />
      </motion.div>
      <h3 className="text-2xl font-bold text-white mb-2">Aucun feedback négatif</h3>
      <p className="text-sm text-white/40 text-center max-w-sm">
        Vos clients sont ravis ! Votre réputation est impeccable.
      </p>
    </motion.div>
  )
}

// ============================================
// MAIN PAGE
// ============================================
export default function ReviewsPage() {
  const [feedbacks, setFeedbacks] = useState(feedbacksData)
  const [filter, setFilter] = useState<"all" | FeedbackStatus>("all")
  const [search, setSearch] = useState("")
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [checkedIds, setCheckedIds] = useState<number[]>([])
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" as "success" | "info" | "warning" })
  const [showConfetti, setShowConfetti] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const filteredFeedbacks = useMemo(() => {
    let result = [...feedbacks]
    if (filter !== "all") result = result.filter(f => f.status === filter)
    if (search) {
      const s = search.toLowerCase()
      result = result.filter(f =>
        f.clientName.toLowerCase().includes(s) ||
        f.message.toLowerCase().includes(s) ||
        f.clientEmail.toLowerCase().includes(s) ||
        f.category?.toLowerCase().includes(s)
      )
    }
    return result.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }, [feedbacks, filter, search])

  const stats = useMemo(() => {
    const total = feedbacks.length
    const resolved = feedbacks.filter(f => f.status === "resolved").length
    const pending = feedbacks.filter(f => f.status === "pending").length
    const inProgress = feedbacks.filter(f => f.status === "in_progress").length
    const critical = feedbacks.filter(f => f.priority === "critical" && f.status !== "resolved").length
    const rate = total > 0 ? Math.round((resolved / total) * 100) : 0
    return { total, resolved, pending, inProgress, critical, rate }
  }, [feedbacks])

  const showToastMessage = useCallback((message: string, type: "success" | "info" | "warning" = "success") => {
    setToast({ visible: true, message, type })
  }, [])

  const handleStatusChange = useCallback((id: number, status: FeedbackStatus) => {
    setFeedbacks(prev => prev.map(f => {
      if (f.id === id) {
        const timeline = [...f.timeline]
        if (status === "resolved" && !timeline.find(e => e.type === "resolved")) {
          timeline.push({ id: timeline.length + 1, type: "resolved", date: "À l'instant", note: "Marqué résolu" })
        }
        return { ...f, status, timeline }
      }
      return f
    }))

    setSelectedFeedback(prev => {
      if (prev?.id === id) {
        const timeline = [...prev.timeline]
        if (status === "resolved" && !timeline.find(e => e.type === "resolved")) {
          timeline.push({ id: timeline.length + 1, type: "resolved", date: "À l'instant", note: "Marqué résolu" })
        }
        return { ...prev, status, timeline }
      }
      return prev
    })

    if (status === "resolved") {
      showToastMessage("Feedback résolu avec succès")
      const allResolved = feedbacks.every(f => f.id === id || f.status === "resolved")
      if (allResolved) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 4000)
      }
    }
  }, [feedbacks, showToastMessage])

  const handleAddNote = useCallback((id: number, note: string) => {
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, internalNotes: [...f.internalNotes, note] } : f))
    setSelectedFeedback(prev => prev?.id === id ? { ...prev, internalNotes: [...prev.internalNotes, note] } : prev)
    showToastMessage("Note ajoutée", "info")
  }, [showToastMessage])

  const handleCheck = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    setCheckedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleBulkResolve = () => {
    checkedIds.forEach(id => handleStatusChange(id, "resolved"))
    setCheckedIds([])
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        document.getElementById("search")?.focus()
      }
      if (e.key === "Escape") setSelectedFeedback(null)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-6 bg-[#0a0a0b]">
      <Confetti active={showConfetti} />
      <Toast {...toast} onClose={() => setToast(t => ({ ...t, visible: false }))} />

      <motion.div
        className="flex-1 flex flex-col overflow-hidden"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <header className="shrink-0 px-8 pt-6 pb-5">
          <motion.div variants={item} className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/10">
                  <MessageSquareWarning size={22} className="text-orange-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">Feedbacks privés</h1>
                  <p className="text-sm text-white/40">Avis interceptés avant Google — Reconquérez ces clients</p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="relative group">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white/50 transition-colors" />
              <input
                id="search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un client, feedback..."
                className="w-80 pl-11 pr-20 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/[0.15] focus:bg-white/[0.05] transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.06] text-[10px] font-medium text-white/30">
                <Command size={10} />K
              </div>
            </div>
          </motion.div>

          {/* Compact Stats Row */}
          <motion.div variants={item} className="flex items-center gap-3 mb-4">
            <CompactStatItem icon={Inbox} label="total" value={stats.total} color="#8B5CF6" />
            <CompactStatItem icon={Flame} label="urgents" value={stats.critical} color="#F97316" />
            <CompactStatItem icon={Clock} label="en attente" value={stats.pending} color="#EAB308" />
            <CompactStatItem icon={CheckCheck} label="résolus" value={stats.resolved} color="#10B981" />
            <CompactStatItem icon={TrendingUp} label="traités" value={stats.rate} suffix="%" color="#00C9A7" isHighlighted />
          </motion.div>

          {/* Response time indicator */}
          <motion.div variants={item} className="mb-4">
            <ResponseTimeIndicator />
          </motion.div>

          {/* Filters */}
          <motion.div variants={item} className="flex items-center justify-between">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <FilterPill active={filter === "all"} onClick={() => setFilter("all")} count={feedbacks.length}>
                Tous
              </FilterPill>
              <FilterPill active={filter === "pending"} onClick={() => setFilter("pending")} count={stats.pending} color="#F97316">
                À traiter
              </FilterPill>
              <FilterPill active={filter === "in_progress"} onClick={() => setFilter("in_progress")} count={stats.inProgress} color="#EAB308">
                En cours
              </FilterPill>
              <FilterPill active={filter === "resolved"} onClick={() => setFilter("resolved")} count={stats.resolved} color="#10B981">
                Résolus
              </FilterPill>
            </div>

            <AnimatePresence>
              {checkedIds.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-sm text-white/40">{checkedIds.length} sélectionné{checkedIds.length > 1 ? "s" : ""}</span>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBulkResolve}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                  >
                    <CheckCircle2 size={14} />
                    Résoudre tout
                  </motion.button>
                  <button
                    onClick={() => showToastMessage("Export en cours...", "info")}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-white/[0.04] text-white/50 hover:bg-white/[0.08] transition-all"
                  >
                    <Download size={14} />
                    Exporter
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </header>

        {/* List */}
        <div className="flex-1 overflow-auto px-8 pb-8">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SkeletonLoader />
              </motion.div>
            ) : filteredFeedbacks.length > 0 ? (
              <motion.div
                key="list"
                className="space-y-2"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {filteredFeedbacks.map((f) => (
                  <FeedbackRow
                    key={f.id}
                    feedback={f}
                    isChecked={checkedIds.includes(f.id)}
                    onSelect={() => setSelectedFeedback(f)}
                    onCheck={(e) => handleCheck(e, f.id)}
                    showCheckbox={checkedIds.length > 0}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <EmptyState />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Panel */}
      <AnimatePresence>
        {selectedFeedback && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 520, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="shrink-0 border-l border-white/[0.06] overflow-hidden"
          >
            <DetailPanel
              feedback={selectedFeedback}
              onClose={() => setSelectedFeedback(null)}
              onStatusChange={(s) => handleStatusChange(selectedFeedback.id, s)}
              onAddNote={(n) => handleAddNote(selectedFeedback.id, n)}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
