"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
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
  MoreHorizontal,
  Archive,
  Download,
  Check,
  Star,
  ArrowLeft,
  User,
  Calendar,
  MessageSquare,
  Eye,
  PhoneCall,
  PartyPopper,
  Loader2,
  StickyNote,
  Plus,
  Command,
  Filter,
  TrendingUp,
  Inbox,
  CheckCheck,
  Timer,
} from "lucide-react"

// ============================================
// TYPES
// ============================================
type FeedbackStatus = "pending" | "in_progress" | "resolved"

interface TimelineEvent {
  id: number
  type: "received" | "viewed" | "contacted" | "resolved"
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
  timeline: TimelineEvent[]
  internalNotes: string[]
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
    rating: 2,
    message: "Attente beaucoup trop longue, plus de 45 minutes avant d'être servi. Le personnel semblait complètement débordé et personne ne s'est excusé. Très déçue car on m'avait recommandé cet établissement.",
    date: "2024-01-15",
    dateRelative: "Il y a 2 heures",
    status: "pending",
    category: "Attente",
    timeline: [
      { id: 1, type: "received", date: "Il y a 2 heures" }
    ],
    internalNotes: []
  },
  {
    id: 2,
    clientName: "Thomas Moreau",
    clientEmail: "t.moreau@outlook.fr",
    rating: 1,
    message: "Prix exorbitants pour une qualité plus que moyenne. 45€ pour un plat qui ne les vaut clairement pas. Je ne recommande absolument pas.",
    date: "2024-01-15",
    dateRelative: "Il y a 5 heures",
    status: "pending",
    category: "Prix",
    timeline: [
      { id: 1, type: "received", date: "Il y a 5 heures" }
    ],
    internalNotes: []
  },
  {
    id: 3,
    clientName: "Sophie Bernard",
    clientEmail: "sophie.b@gmail.com",
    clientPhone: "07 98 76 54 32",
    rating: 2,
    message: "Service désagréable. Le serveur était condescendant et pressé. Ambiance gâchée pour notre anniversaire de mariage.",
    date: "2024-01-14",
    dateRelative: "Hier",
    status: "in_progress",
    category: "Service",
    timeline: [
      { id: 1, type: "received", date: "Hier" },
      { id: 2, type: "viewed", date: "Il y a 20 heures" },
      { id: 3, type: "contacted", date: "Il y a 18 heures", note: "Email d'excuses envoyé" }
    ],
    internalNotes: ["Client fidèle - 3ème visite", "Proposer -30% prochaine visite"]
  },
  {
    id: 4,
    clientName: "Lucas Petit",
    clientEmail: "lucas.petit@hotmail.com",
    rating: 3,
    message: "Correct mais sans plus. La propreté des toilettes laisse à désirer. Dommage car le reste était bien.",
    date: "2024-01-14",
    dateRelative: "Hier",
    status: "in_progress",
    category: "Propreté",
    timeline: [
      { id: 1, type: "received", date: "Hier" },
      { id: 2, type: "viewed", date: "Il y a 22 heures" }
    ],
    internalNotes: ["Signalé à l'équipe d'entretien"]
  },
  {
    id: 5,
    clientName: "Emma Dubois",
    clientEmail: "emma.dubois@icloud.com",
    clientPhone: "06 45 67 89 01",
    rating: 2,
    message: "Réservation non prise en compte, nous avons dû attendre 30 minutes malgré notre confirmation. Très frustrant avec des enfants fatigués.",
    date: "2024-01-13",
    dateRelative: "Il y a 2 jours",
    status: "resolved",
    category: "Réservation",
    timeline: [
      { id: 1, type: "received", date: "Il y a 2 jours" },
      { id: 2, type: "viewed", date: "Il y a 2 jours" },
      { id: 3, type: "contacted", date: "Il y a 1 jour", note: "Appel téléphonique" },
      { id: 4, type: "resolved", date: "Il y a 1 jour", note: "Invitation offerte pour la famille" }
    ],
    internalNotes: ["Problème système résa identifié", "Client reconquis - reviendra"]
  },
  {
    id: 6,
    clientName: "Antoine Martin",
    clientEmail: "a.martin@gmail.com",
    rating: 1,
    message: "Commande complètement erronée et attitude défensive du manager quand j'ai voulu signaler le problème. Inacceptable.",
    date: "2024-01-12",
    dateRelative: "Il y a 3 jours",
    status: "resolved",
    category: "Service",
    timeline: [
      { id: 1, type: "received", date: "Il y a 3 jours" },
      { id: 2, type: "viewed", date: "Il y a 3 jours" },
      { id: 3, type: "contacted", date: "Il y a 2 jours", note: "Email personnalisé du directeur" },
      { id: 4, type: "resolved", date: "Il y a 1 jour", note: "Bon de 50€ offert" }
    ],
    internalNotes: ["Formation équipe prévue", "Suivi avec le manager concerné"]
  },
  {
    id: 7,
    clientName: "Julie Rousseau",
    clientEmail: "julie.r@yahoo.fr",
    rating: 3,
    message: "Bruit excessif, impossible d'avoir une conversation normale. La musique était beaucoup trop forte.",
    date: "2024-01-11",
    dateRelative: "Il y a 4 jours",
    status: "pending",
    category: "Ambiance",
    timeline: [
      { id: 1, type: "received", date: "Il y a 4 jours" }
    ],
    internalNotes: []
  }
]

// ============================================
// ANIMATIONS
// ============================================
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
}

const slidePanel = {
  hidden: { x: "100%", opacity: 0 },
  show: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: { x: "100%", opacity: 0, transition: { duration: 0.2 } }
}

// ============================================
// CONFETTI COMPONENT
// ============================================
function Confetti({ active }: { active: boolean }) {
  if (!active) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: ["#00C9A7", "#8B5CF6", "#F59E0B", "#EC4899", "#3B82F6"][Math.floor(Math.random() * 5)]
          }}
          initial={{ y: -20, opacity: 1, scale: 1 }}
          animate={{
            y: window.innerHeight + 20,
            opacity: 0,
            scale: 0,
            rotate: Math.random() * 360
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  )
}

// ============================================
// TOAST COMPONENT
// ============================================
function Toast({ message, visible, onClose }: { message: string; visible: boolean; onClose: () => void }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [visible, onClose])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1a1a1b] border border-white/10 shadow-2xl"
        >
          <div className="w-8 h-8 rounded-lg bg-[#00C9A7]/20 flex items-center justify-center">
            <Check size={16} className="text-[#00C9A7]" />
          </div>
          <span className="text-sm text-white/80">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================
// STAR RATING COMPONENT
// ============================================
function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3].map((star) => (
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
// STATUS BADGE COMPONENT
// ============================================
function StatusBadge({ status }: { status: FeedbackStatus }) {
  const config = {
    pending: {
      label: "À traiter",
      icon: AlertCircle,
      className: "bg-red-500/10 text-red-400 border-red-500/20"
    },
    in_progress: {
      label: "En cours",
      icon: Clock,
      className: "bg-amber-500/10 text-amber-400 border-amber-500/20"
    },
    resolved: {
      label: "Résolu",
      icon: CheckCircle2,
      className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    }
  }

  const { label, icon: Icon, className } = config[status]

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border ${className}`}>
      <Icon size={12} />
      {label}
    </span>
  )
}

// ============================================
// STAT CARD COMPONENT
// ============================================
function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType
  label: string
  value: number
  color: string
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
      <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}15` }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div>
        <p className="text-xl font-bold text-white">{value}</p>
        <p className="text-[11px] text-white/40">{label}</p>
      </div>
    </div>
  )
}

// ============================================
// FILTER PILL COMPONENT
// ============================================
function FilterPill({ active, children, onClick }: {
  active: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        active
          ? "text-[#00C9A7]"
          : "text-white/40 hover:text-white/60"
      }`}
    >
      {active && (
        <motion.div
          layoutId="activeFilterPill"
          className="absolute inset-0 rounded-lg bg-[#00C9A7]/10 border border-[#00C9A7]/20"
          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

// ============================================
// FEEDBACK ROW COMPONENT
// ============================================
function FeedbackRow({ feedback, selected, onSelect, showCheckbox }: {
  feedback: Feedback
  selected: boolean
  onSelect: () => void
  showCheckbox: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      variants={item}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
      className={`group relative flex items-center gap-4 px-4 py-4 rounded-xl cursor-pointer transition-all duration-200 ${
        selected
          ? "bg-[#00C9A7]/[0.08] border border-[#00C9A7]/20"
          : "bg-white/[0.01] border border-transparent hover:bg-white/[0.03] hover:border-white/[0.06]"
      }`}
    >
      {/* Urgency indicator */}
      {feedback.status === "pending" && feedback.rating <= 2 && (
        <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-gradient-to-b from-red-500 to-orange-500" />
      )}

      {/* Checkbox */}
      <div className={`w-5 transition-opacity duration-200 ${showCheckbox || hovered ? "opacity-100" : "opacity-0"}`}>
        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
          selected
            ? "bg-[#00C9A7] border-[#00C9A7]"
            : "border-white/20 hover:border-white/40"
        }`}>
          {selected && <Check size={12} className="text-black" />}
        </div>
      </div>

      {/* Avatar */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold shrink-0 ${
        feedback.rating === 1
          ? "bg-red-500/15 text-red-400"
          : feedback.rating === 2
          ? "bg-orange-500/15 text-orange-400"
          : "bg-amber-500/15 text-amber-400"
      }`}>
        {feedback.clientName.split(" ").map(n => n[0]).join("")}
      </div>

      {/* Client info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-white">{feedback.clientName}</span>
          {feedback.category && (
            <span className="px-2 py-0.5 text-[10px] font-medium text-white/40 bg-white/[0.04] rounded">
              {feedback.category}
            </span>
          )}
        </div>
        <p className="text-sm text-white/40 truncate">{feedback.message}</p>
      </div>

      {/* Rating */}
      <div className="shrink-0">
        <StarRating rating={feedback.rating} size={12} />
      </div>

      {/* Date */}
      <div className="shrink-0 w-24 text-right">
        <span className="text-xs text-white/30">{feedback.dateRelative}</span>
      </div>

      {/* Status */}
      <div className="shrink-0">
        <StatusBadge status={feedback.status} />
      </div>

      {/* Arrow */}
      <ChevronRight size={16} className={`shrink-0 text-white/20 transition-all ${
        hovered ? "translate-x-1 text-white/40" : ""
      }`} />
    </motion.div>
  )
}

// ============================================
// TIMELINE COMPONENT
// ============================================
function Timeline({ events }: { events: TimelineEvent[] }) {
  const iconMap = {
    received: { icon: Inbox, color: "#6B7280" },
    viewed: { icon: Eye, color: "#8B5CF6" },
    contacted: { icon: PhoneCall, color: "#3B82F6" },
    resolved: { icon: CheckCircle2, color: "#00C9A7" }
  }

  const labelMap = {
    received: "Feedback reçu",
    viewed: "Consulté",
    contacted: "Client contacté",
    resolved: "Résolu"
  }

  return (
    <div className="relative space-y-4">
      {/* Vertical line */}
      <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent" />

      {events.map((event, index) => {
        const { icon: Icon, color } = iconMap[event.type]
        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex items-start gap-3"
          >
            <div
              className="relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${color}20` }}
            >
              <Icon size={12} style={{ color }} />
            </div>
            <div className="flex-1 pt-0.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white/70">{labelMap[event.type]}</span>
                <span className="text-xs text-white/30">{event.date}</span>
              </div>
              {event.note && (
                <p className="text-xs text-white/40 mt-1">{event.note}</p>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// ============================================
// DETAIL PANEL COMPONENT
// ============================================
function DetailPanel({
  feedback,
  onClose,
  onStatusChange,
  onAddNote
}: {
  feedback: Feedback
  onClose: () => void
  onStatusChange: (status: FeedbackStatus) => void
  onAddNote: (note: string) => void
}) {
  const [newNote, setNewNote] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedResponse, setGeneratedResponse] = useState("")
  const [showAIModal, setShowAIModal] = useState(false)

  const handleGenerateAI = async () => {
    setIsGenerating(true)
    setShowAIModal(true)
    await new Promise(resolve => setTimeout(resolve, 1500))

    const responses: Record<string, string> = {
      "Attente": `Cher(e) ${feedback.clientName.split(" ")[0]},\n\nNous vous présentons nos sincères excuses pour l'attente que vous avez subie lors de votre visite. Ce n'est absolument pas représentatif du service que nous souhaitons offrir.\n\nNous avons depuis renforcé notre équipe aux heures de pointe pour éviter que cette situation ne se reproduise.\n\nEn guise de compensation, nous aimerions vous offrir un bon de -30% sur votre prochaine visite. Nous espérons sincèrement avoir l'opportunité de vous faire changer d'avis.\n\nCordialement`,
      "Prix": `Cher(e) ${feedback.clientName.split(" ")[0]},\n\nMerci d'avoir pris le temps de nous faire part de votre ressenti concernant nos tarifs.\n\nNos prix reflètent notre engagement pour des produits de qualité et un service irréprochable. Nous comprenons cependant que cela puisse ne pas correspondre à toutes les attentes.\n\nNous serions ravis de vous accueillir à nouveau et de vous faire découvrir notre menu découverte, plus accessible, qui saura peut-être mieux vous convenir.\n\nCordialement`,
      "Service": `Cher(e) ${feedback.clientName.split(" ")[0]},\n\nNous sommes profondément désolés pour l'expérience que vous avez vécue. Le comportement que vous décrivez est inacceptable et ne correspond pas à nos valeurs.\n\nNous avons pris des mesures immédiates avec l'équipe concernée pour que cela ne se reproduise plus.\n\nVotre anniversaire de mariage méritait un moment parfait. Permettez-nous de nous rattraper en vous offrant un dîner complet pour deux personnes.\n\nCordialement`,
      "default": `Cher(e) ${feedback.clientName.split(" ")[0]},\n\nNous vous remercions d'avoir partagé votre expérience avec nous. Vos retours sont précieux et nous aident à nous améliorer continuellement.\n\nNous sommes sincèrement désolés que votre visite n'ait pas été à la hauteur de vos attentes. Nous prenons vos remarques très au sérieux.\n\nNous aimerions vous offrir une nouvelle expérience et vous prouver notre engagement qualité. Seriez-vous disponible pour en discuter ?\n\nCordialement`
    }

    setGeneratedResponse(responses[feedback.category || "default"] || responses.default)
    setIsGenerating(false)
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(newNote)
      setNewNote("")
    }
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
        <div className="shrink-0 flex items-start justify-between p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold ${
              feedback.rating === 1
                ? "bg-red-500/15 text-red-400"
                : feedback.rating === 2
                ? "bg-orange-500/15 text-orange-400"
                : "bg-amber-500/15 text-amber-400"
            }`}>
              {feedback.clientName.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{feedback.clientName}</h3>
              <div className="flex items-center gap-3 mt-1">
                <StarRating rating={feedback.rating} size={14} />
                <StatusBadge status={feedback.status} />
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/40 hover:text-white/60 hover:bg-white/[0.04] transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contact info */}
        <div className="shrink-0 flex items-center gap-4 px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 text-sm text-white/50">
            <Mail size={14} />
            <span>{feedback.clientEmail}</span>
          </div>
          {feedback.clientPhone && (
            <div className="flex items-center gap-2 text-sm text-white/50">
              <Phone size={14} />
              <span>{feedback.clientPhone}</span>
            </div>
          )}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Feedback message */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare size={14} className="text-white/40" />
              <span className="text-xs font-medium text-white/40">Message du client</span>
              <span className="text-xs text-white/20">• {feedback.dateRelative}</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">{feedback.message}</p>
          </div>

          {/* Timeline */}
          <div>
            <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">Historique</h4>
            <Timeline events={feedback.timeline} />
          </div>

          {/* Internal notes */}
          <div>
            <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">Notes internes</h4>
            <div className="space-y-2">
              {feedback.internalNotes.map((note, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                >
                  <StickyNote size={14} className="text-amber-400/60 shrink-0 mt-0.5" />
                  <p className="text-sm text-white/50">{note}</p>
                </motion.div>
              ))}

              {/* Add note input */}
              <div className="flex items-center gap-2 mt-3">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                  placeholder="Ajouter une note..."
                  className="flex-1 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/[0.15] transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="p-2 rounded-lg bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/60 transition-all disabled:opacity-30"
                >
                  <Plus size={16} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions footer */}
        <div className="shrink-0 p-6 border-t border-white/[0.06] space-y-3">
          {/* Primary actions */}
          <div className="grid grid-cols-2 gap-2">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleGenerateAI}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 transition-all shadow-lg shadow-violet-500/20"
            >
              <Sparkles size={16} />
              Réponse IA
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-white/[0.04] text-white/70 border border-white/[0.08] hover:bg-white/[0.08] transition-all"
            >
              <Mail size={16} />
              Envoyer email
            </motion.button>
          </div>

          {/* Secondary actions */}
          <div className="grid grid-cols-2 gap-2">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/[0.02] text-white/50 border border-white/[0.06] hover:bg-white/[0.04] hover:text-white/70 transition-all"
            >
              <Gift size={14} />
              Geste commercial
            </motion.button>
            {feedback.status !== "resolved" ? (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onStatusChange("resolved")}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#00C9A7]/10 text-[#00C9A7] border border-[#00C9A7]/20 hover:bg-[#00C9A7]/20 transition-all"
              >
                <CheckCircle2 size={14} />
                Marquer résolu
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onStatusChange("pending")}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/[0.02] text-white/50 border border-white/[0.06] hover:bg-white/[0.04] hover:text-white/70 transition-all"
              >
                <Timer size={14} />
                Réouvrir
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* AI Response Modal */}
      <AnimatePresence>
        {showAIModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAIModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl bg-[#0f0f10] border border-white/[0.08] shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-violet-500/15">
                    <Sparkles size={18} className="text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">Réponse générée par IA</h3>
                    <p className="text-xs text-white/40">Personnalisée selon le feedback</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAIModal(false)}
                  className="p-2 rounded-lg text-white/40 hover:text-white/60 hover:bg-white/[0.04] transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-5">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 size={32} className="text-violet-400 animate-spin mb-4" />
                    <p className="text-sm text-white/50">Génération en cours...</p>
                  </div>
                ) : (
                  <textarea
                    value={generatedResponse}
                    onChange={(e) => setGeneratedResponse(e.target.value)}
                    className="w-full h-64 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white/80 placeholder-white/25 resize-none focus:outline-none focus:border-violet-500/30 transition-all leading-relaxed"
                  />
                )}
              </div>

              <div className="flex items-center justify-end gap-2 p-5 border-t border-white/[0.06]">
                <button
                  onClick={() => setShowAIModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white/50 hover:text-white/70 transition-all"
                >
                  Annuler
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#00C9A7] text-black hover:bg-[#00E4BC] transition-all disabled:opacity-50"
                >
                  <Send size={14} />
                  Envoyer l'email
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ============================================
// EMPTY STATE COMPONENT
// ============================================
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-[#00C9A7]/10 flex items-center justify-center mb-6"
      >
        <PartyPopper size={40} className="text-[#00C9A7]" />
      </motion.div>
      <h3 className="text-xl font-semibold text-white mb-2">Aucun feedback négatif</h3>
      <p className="text-sm text-white/40 text-center max-w-sm">
        Vos clients sont satisfaits ! Continuez comme ça, votre réputation est au top.
      </p>
    </motion.div>
  )
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function FeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState(feedbacksData)
  const [filter, setFilter] = useState<"all" | FeedbackStatus>("all")
  const [search, setSearch] = useState("")
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [toast, setToast] = useState({ visible: false, message: "" })
  const [showConfetti, setShowConfetti] = useState(false)

  const filteredFeedbacks = useMemo(() => {
    let result = [...feedbacks]

    if (filter !== "all") {
      result = result.filter(f => f.status === filter)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(f =>
        f.clientName.toLowerCase().includes(searchLower) ||
        f.message.toLowerCase().includes(searchLower) ||
        f.clientEmail.toLowerCase().includes(searchLower)
      )
    }

    return result
  }, [feedbacks, filter, search])

  const stats = useMemo(() => {
    const total = feedbacks.length
    const resolved = feedbacks.filter(f => f.status === "resolved").length
    const pending = feedbacks.filter(f => f.status === "pending").length
    const rate = total > 0 ? Math.round((resolved / total) * 100) : 0
    return { total, resolved, pending, rate }
  }, [feedbacks])

  const showToast = useCallback((message: string) => {
    setToast({ visible: true, message })
  }, [])

  const handleStatusChange = useCallback((feedbackId: number, newStatus: FeedbackStatus) => {
    setFeedbacks(prev => prev.map(f => {
      if (f.id === feedbackId) {
        const newTimeline = [...f.timeline]
        if (newStatus === "resolved" && !newTimeline.find(e => e.type === "resolved")) {
          newTimeline.push({
            id: newTimeline.length + 1,
            type: "resolved",
            date: "À l'instant",
            note: "Marqué comme résolu"
          })
        }
        return { ...f, status: newStatus, timeline: newTimeline }
      }
      return f
    }))

    if (newStatus === "resolved") {
      showToast("Feedback marqué comme résolu")

      // Check if all are resolved for confetti
      const allResolved = feedbacks.every(f => f.id === feedbackId ? true : f.status === "resolved")
      if (allResolved) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 4000)
      }
    }
  }, [feedbacks, showToast])

  const handleAddNote = useCallback((feedbackId: number, note: string) => {
    setFeedbacks(prev => prev.map(f => {
      if (f.id === feedbackId) {
        return { ...f, internalNotes: [...f.internalNotes, note] }
      }
      return f
    }))
    showToast("Note ajoutée")
  }, [showToast])

  const handleBulkAction = (action: "resolve" | "archive") => {
    if (action === "resolve") {
      selectedIds.forEach(id => handleStatusChange(id, "resolved"))
      setSelectedIds([])
    }
  }

  return (
    <div className="flex h-screen bg-[#0a0a0b]">
      <Confetti active={showConfetti} />
      <Toast message={toast.message} visible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />

      {/* Main content */}
      <motion.div
        className="flex-1 flex flex-col overflow-hidden"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <header className="shrink-0 px-8 py-6 border-b border-white/[0.06]">
          <motion.div variants={item} className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2.5 rounded-xl text-white/40 hover:text-white/60 hover:bg-white/[0.04] transition-all"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-orange-500/15">
                    <MessageSquareWarning size={20} className="text-orange-400" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">Feedbacks privés</h1>
                    <p className="text-sm text-white/40 mt-0.5">
                      Avis interceptés avant Google — Votre chance de reconquérir ces clients
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="w-72 pl-11 pr-16 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/[0.15] transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px] text-white/30">
                <Command size={10} />
                K
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={item} className="flex items-center gap-4 mb-6">
            <StatCard icon={Inbox} label="Ce mois" value={stats.total} color="#8B5CF6" />
            <StatCard icon={CheckCheck} label="Traités" value={stats.resolved} color="#00C9A7" />
            <StatCard icon={AlertCircle} label="En attente" value={stats.pending} color="#F97316" />
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="p-2 rounded-lg bg-emerald-500/15">
                <TrendingUp size={16} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-white">{stats.rate}%</p>
                <p className="text-[11px] text-white/40">Taux traitement</p>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div variants={item} className="flex items-center justify-between">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.02]">
              <FilterPill active={filter === "all"} onClick={() => setFilter("all")}>
                Tous ({feedbacks.length})
              </FilterPill>
              <FilterPill active={filter === "pending"} onClick={() => setFilter("pending")}>
                À traiter ({feedbacks.filter(f => f.status === "pending").length})
              </FilterPill>
              <FilterPill active={filter === "in_progress"} onClick={() => setFilter("in_progress")}>
                En cours ({feedbacks.filter(f => f.status === "in_progress").length})
              </FilterPill>
              <FilterPill active={filter === "resolved"} onClick={() => setFilter("resolved")}>
                Résolus ({feedbacks.filter(f => f.status === "resolved").length})
              </FilterPill>
            </div>

            {/* Bulk actions */}
            <AnimatePresence>
              {selectedIds.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-sm text-white/40">{selectedIds.length} sélectionné(s)</span>
                  <button
                    onClick={() => handleBulkAction("resolve")}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#00C9A7]/10 text-[#00C9A7] hover:bg-[#00C9A7]/20 transition-all"
                  >
                    <CheckCircle2 size={14} />
                    Résoudre
                  </button>
                  <button
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] text-white/50 hover:bg-white/[0.08] transition-all"
                  >
                    <Download size={14} />
                    Exporter
                  </button>
                  <button
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] text-white/50 hover:bg-white/[0.08] transition-all"
                  >
                    <Archive size={14} />
                    Archiver
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </header>

        {/* Feedback list */}
        <div className="flex-1 overflow-auto px-8 py-6">
          {filteredFeedbacks.length > 0 ? (
            <motion.div
              className="space-y-2"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredFeedbacks.map((feedback) => (
                <FeedbackRow
                  key={feedback.id}
                  feedback={feedback}
                  selected={selectedIds.includes(feedback.id)}
                  onSelect={() => setSelectedFeedback(feedback)}
                  showCheckbox={selectedIds.length > 0}
                />
              ))}
            </motion.div>
          ) : (
            <EmptyState />
          )}
        </div>
      </motion.div>

      {/* Detail panel */}
      <AnimatePresence>
        {selectedFeedback && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 480, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.35 }}
            className="shrink-0 border-l border-white/[0.06] overflow-hidden"
          >
            <DetailPanel
              feedback={selectedFeedback}
              onClose={() => setSelectedFeedback(null)}
              onStatusChange={(status) => handleStatusChange(selectedFeedback.id, status)}
              onAddNote={(note) => handleAddNote(selectedFeedback.id, note)}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
