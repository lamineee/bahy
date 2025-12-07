"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Star,
  Search,
  ChevronDown,
  MessageSquare,
  Check,
  Clock,
  Sparkles,
  Send,
  X,
  ArrowLeft,
  ExternalLink,
  Flag,
  ThumbsUp,
  Calendar,
  Loader2,
  TrendingUp,
  TrendingDown,
  Zap,
  AlertCircle,
  Filter,
  RotateCcw,
  Copy,
  Wand2,
  History,
  ChevronRight,
  MessageCircle,
  Award,
  Target,
  Flame,
  RefreshCw,
  MoreVertical,
  Share2,
  Trash2,
  Edit3,
  Bot,
} from "lucide-react"

// ============================================
// ANIMATIONS
// ============================================
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 16, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 150, damping: 20 }
  }
}

const slideIn = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  exit: { opacity: 0, x: 40, transition: { duration: 0.2 } }
}

// ============================================
// TYPES
// ============================================
type ReviewSource = "google" | "facebook" | "tripadvisor"
type FilterType = "all" | "positive" | "negative" | "unanswered"
type SortType = "recent" | "oldest" | "best" | "worst"

interface ReviewMessage {
  id: number
  type: "review" | "response"
  text: string
  date: string
  dateRelative: string
}

interface Review {
  id: number
  name: string
  avatar?: string
  rating: number
  text: string
  date: string
  dateRelative: string
  responded: boolean
  response?: string
  responseDate?: string
  source: ReviewSource
  helpful?: number
  verified?: boolean
  history?: ReviewMessage[]
}

// ============================================
// DATA
// ============================================
const reviewsData: Review[] = [
  {
    id: 1,
    name: "Marie Dupont",
    rating: 5,
    text: "Service exceptionnel ! L'équipe est très professionnelle et à l'écoute. Je recommande vivement cet établissement à tous ceux qui recherchent la qualité. Une expérience vraiment mémorable.",
    date: "2024-01-15",
    dateRelative: "Il y a 2 heures",
    responded: true,
    response: "Merci beaucoup Marie pour ce retour chaleureux ! Nous sommes ravis que votre expérience ait été à la hauteur de vos attentes. Au plaisir de vous revoir !",
    responseDate: "Il y a 1 heure",
    source: "google",
    helpful: 12,
    verified: true,
    history: [
      { id: 1, type: "review", text: "Service exceptionnel ! L'équipe est très professionnelle et à l'écoute.", date: "2024-01-15", dateRelative: "Il y a 2 heures" },
      { id: 2, type: "response", text: "Merci beaucoup Marie pour ce retour chaleureux !", date: "2024-01-15", dateRelative: "Il y a 1 heure" },
    ]
  },
  {
    id: 2,
    name: "Thomas Bernard",
    rating: 5,
    text: "Très professionnel, équipe au top. Rapport qualité-prix excellent. Je reviendrai sans hésiter !",
    date: "2024-01-15",
    dateRelative: "Il y a 5 heures",
    responded: true,
    response: "Merci Thomas ! Votre satisfaction est notre priorité. À très bientôt !",
    responseDate: "Il y a 3 heures",
    source: "google",
    helpful: 8,
    verified: true,
  },
  {
    id: 3,
    name: "Sophie Martin",
    rating: 4,
    text: "Bonne expérience dans l'ensemble. Le service était rapide et efficace. Petit bémol sur l'attente à l'entrée mais rien de grave. Je recommande quand même.",
    date: "2024-01-14",
    dateRelative: "Hier",
    responded: false,
    source: "facebook",
    helpful: 3,
  },
  {
    id: 4,
    name: "Lucas Petit",
    rating: 2,
    text: "Déçu par l'attente, plus de 30 minutes avant d'être servi. Le personnel semblait débordé. À améliorer sérieusement si vous voulez fidéliser vos clients.",
    date: "2024-01-14",
    dateRelative: "Hier",
    responded: false,
    source: "google",
  },
  {
    id: 5,
    name: "Emma Wilson",
    rating: 5,
    text: "Absolutely amazing experience! The staff went above and beyond to make our visit memorable. Will definitely come back and recommend to all my friends!",
    date: "2024-01-13",
    dateRelative: "Il y a 2 jours",
    responded: true,
    response: "Thank you so much Emma! We're thrilled you had such a great experience. See you soon!",
    responseDate: "Il y a 1 jour",
    source: "tripadvisor",
    helpful: 15,
    verified: true,
  },
  {
    id: 6,
    name: "Pierre Durand",
    rating: 1,
    text: "Très déçu. Service lent, personnel peu aimable. Je ne recommande absolument pas. Une expérience à oublier.",
    date: "2024-01-12",
    dateRelative: "Il y a 3 jours",
    responded: false,
    source: "google",
  },
  {
    id: 7,
    name: "Julie Moreau",
    rating: 5,
    text: "Parfait ! Exactement ce que je cherchais. Merci pour votre professionnalisme et votre accueil chaleureux.",
    date: "2024-01-11",
    dateRelative: "Il y a 4 jours",
    responded: true,
    response: "Merci Julie, c'est un plaisir de vous avoir accueillie !",
    responseDate: "Il y a 3 jours",
    source: "google",
    helpful: 6,
  },
  {
    id: 8,
    name: "Antoine Leroy",
    rating: 3,
    text: "Correct sans plus. Le service est bon mais rien d'exceptionnel. Prix un peu élevés pour la prestation.",
    date: "2024-01-10",
    dateRelative: "Il y a 5 jours",
    responded: false,
    source: "facebook",
  },
  {
    id: 9,
    name: "Camille Dubois",
    rating: 4,
    text: "Très bonne adresse ! J'y retournerai avec plaisir. L'ambiance est agréable et le service attentionné.",
    date: "2024-01-09",
    dateRelative: "Il y a 6 jours",
    responded: true,
    response: "Merci Camille, à très bientôt !",
    responseDate: "Il y a 5 jours",
    source: "google",
    verified: true,
  },
  {
    id: 10,
    name: "Marc Fontaine",
    rating: 5,
    text: "Expérience parfaite du début à la fin. Le personnel est aux petits soins. Un vrai bonheur !",
    date: "2024-01-08",
    dateRelative: "Il y a 1 semaine",
    responded: false,
    source: "google",
    helpful: 9,
    verified: true,
  },
]

// ============================================
// COMPONENTS
// ============================================

function AnimatedNumber({ value, decimals = 0, suffix = "" }: {
  value: number; decimals?: number; suffix?: string
}) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const duration = 1200
    const steps = 30
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplay(value)
        clearInterval(timer)
      } else {
        setDisplay(current)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return <>{display.toFixed(decimals)}{suffix}</>
}

function StarRating({ rating, size = 14, animated = false }: { rating: number; size?: number; animated?: boolean }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star, i) => (
        <motion.div
          key={star}
          initial={animated ? { opacity: 0, scale: 0, rotate: -180 } : false}
          animate={animated ? { opacity: 1, scale: 1, rotate: 0 } : false}
          transition={animated ? { delay: i * 0.08, type: "spring" } : undefined}
        >
          <Star
            size={size}
            className={star <= rating
              ? "text-[#EAB308] fill-[#EAB308] drop-shadow-[0_0_3px_rgba(234,179,8,0.4)]"
              : "text-white/10"
            }
          />
        </motion.div>
      ))}
    </div>
  )
}

function SourceIcon({ source, size = 16 }: { source: ReviewSource; size?: number }) {
  const icons = {
    google: (
      <svg className="shrink-0" style={{ width: size, height: size }} viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
    facebook: (
      <svg className="shrink-0 text-[#1877F2]" style={{ width: size, height: size }} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    tripadvisor: (
      <svg className="shrink-0 text-[#00AF87]" style={{ width: size, height: size }} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="6.5" cy="13.5" r="3" fill="currentColor"/>
        <circle cx="17.5" cy="13.5" r="3" fill="currentColor"/>
        <path d="M12 5C7 5 3 8 2 12h3c1-2 3-4 7-4s6 2 7 4h3c-1-4-5-7-10-7z" fill="currentColor"/>
      </svg>
    ),
  }
  return icons[source]
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix = "",
  trend,
  trendValue,
  color,
  glowColor
}: {
  icon: React.ElementType
  label: string
  value: number
  suffix?: string
  trend?: "up" | "down"
  trendValue?: string
  color: string
  glowColor: string
}) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="group relative rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5
        transition-all duration-300 hover:bg-white/[0.04] hover:border-white/[0.1]
        hover:shadow-2xl hover:shadow-black/20"
    >
      <div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{ background: glowColor }}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${color}20` }}>
            <Icon size={18} style={{ color }} />
          </div>
          {trend && trendValue && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
              trend === "up"
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-red-500/15 text-red-400"
            }`}>
              {trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {trendValue}
            </div>
          )}
        </div>
        <p className="text-[11px] font-medium text-white/40 uppercase tracking-wider mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-white">
            <AnimatedNumber value={value} decimals={suffix === "%" ? 0 : suffix === "/5" ? 1 : 0} />
          </span>
          <span className="text-lg text-white/30">{suffix}</span>
        </div>
      </div>
    </motion.div>
  )
}

function FilterPill({
  active,
  children,
  count,
  color,
  onClick
}: {
  active: boolean
  children: React.ReactNode
  count?: number
  color?: string
  onClick: () => void
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active
          ? "bg-[#00C9A7]/15 text-[#00C9A7] border border-[#00C9A7]/30 shadow-lg shadow-[#00C9A7]/10"
          : "bg-white/[0.03] text-white/50 border border-white/[0.06] hover:bg-white/[0.06] hover:text-white/70 hover:border-white/[0.1]"
      }`}
    >
      {active && (
        <motion.div
          layoutId="activeFilter"
          className="absolute inset-0 rounded-xl bg-[#00C9A7]/10 border border-[#00C9A7]/20"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="relative z-10">{children}</span>
      {count !== undefined && (
        <span className={`relative z-10 px-2 py-0.5 rounded-md text-xs font-bold ${
          active ? "bg-[#00C9A7]/25" : "bg-white/[0.08]"
        }`}>
          {count}
        </span>
      )}
    </motion.button>
  )
}

function ReviewCard({
  review,
  selected,
  onClick,
  onRespond
}: {
  review: Review
  selected: boolean
  onClick: () => void
  onRespond: () => void
}) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <motion.div
      layout
      variants={item}
      whileHover={{ x: 4 }}
      onClick={onClick}
      className={`group relative p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
        selected
          ? "bg-[#00C9A7]/[0.08] border-[#00C9A7]/30 shadow-lg shadow-[#00C9A7]/5"
          : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1]"
      }`}
    >
      {/* Urgency indicator for negative reviews */}
      {review.rating <= 2 && !review.responded && (
        <div className="absolute -left-px top-4 bottom-4 w-1 rounded-full bg-gradient-to-b from-red-500 to-orange-500" />
      )}

      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-transform group-hover:scale-105 ${
            review.rating >= 4
              ? "bg-gradient-to-br from-emerald-500/25 to-emerald-600/15 text-emerald-400 shadow-lg shadow-emerald-500/10"
              : review.rating === 3
              ? "bg-gradient-to-br from-amber-500/25 to-amber-600/15 text-amber-400 shadow-lg shadow-amber-500/10"
              : "bg-gradient-to-br from-red-500/25 to-red-600/15 text-red-400 shadow-lg shadow-red-500/10"
          }`}>
            {review.name.split(" ").map(n => n[0]).join("")}
          </div>
          {review.verified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0a0a0b] flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center">
                <Check size={8} className="text-white" strokeWidth={3} />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-white">{review.name}</span>
              <StarRating rating={review.rating} size={13} />
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.04]">
                <SourceIcon source={review.source} size={12} />
                <span className="text-[10px] text-white/40 capitalize">{review.source}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/30">{review.dateRelative}</span>
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
                  className="p-1.5 rounded-lg text-white/20 hover:text-white/50 hover:bg-white/[0.06] transition-all opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical size={14} />
                </button>
                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 8 }}
                      className="absolute right-0 top-full mt-1 w-40 p-1 rounded-xl bg-[#1a1a1b] border border-white/[0.1] shadow-2xl z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/60 hover:bg-white/[0.06] hover:text-white transition-all">
                        <Copy size={12} /> Copier
                      </button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/60 hover:bg-white/[0.06] hover:text-white transition-all">
                        <Share2 size={12} /> Partager
                      </button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/60 hover:bg-white/[0.06] hover:text-white transition-all">
                        <Flag size={12} /> Signaler
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <p className="text-sm text-white/60 leading-relaxed line-clamp-2 mb-3">{review.text}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {review.responded ? (
                <span className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-emerald-500/15 text-emerald-400 rounded-lg border border-emerald-500/20">
                  <Check size={12} />
                  Répondu
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-amber-500/15 text-amber-400 rounded-lg border border-amber-500/20 animate-pulse">
                  <Clock size={12} />
                  À répondre
                </span>
              )}
              {review.helpful && review.helpful > 0 && (
                <span className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-white/40 bg-white/[0.04] rounded-lg">
                  <ThumbsUp size={11} />
                  {review.helpful}
                </span>
              )}
            </div>

            {!review.responded && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => { e.stopPropagation(); onRespond() }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#00C9A7] text-black hover:bg-[#00E4BC] transition-all shadow-lg shadow-[#00C9A7]/20"
              >
                <MessageCircle size={13} />
                Répondre
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Quick response preview */}
      {review.responded && review.response && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 ml-16 p-3 rounded-xl bg-[#00C9A7]/[0.06] border border-[#00C9A7]/10"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 rounded-md bg-[#00C9A7]/20 flex items-center justify-center">
              <MessageSquare size={10} className="text-[#00C9A7]" />
            </div>
            <span className="text-[10px] font-medium text-[#00C9A7]">Votre réponse</span>
            <span className="text-[10px] text-white/20">• {review.responseDate}</span>
          </div>
          <p className="text-xs text-white/50 line-clamp-2">{review.response}</p>
        </motion.div>
      )}
    </motion.div>
  )
}

function ReviewDetailSidebar({
  review,
  onClose,
}: {
  review: Review
  onClose: () => void
}) {
  const [response, setResponse] = useState(review.response || "")
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<"response" | "history">("response")
  const [generationStyle, setGenerationStyle] = useState<"professional" | "friendly" | "apologetic">("professional")

  const handleGenerateAI = async () => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 2000))

    const styles = {
      professional: `Bonjour ${review.name.split(" ")[0]},\n\nNous vous remercions sincèrement pour votre retour. Votre satisfaction est au cœur de nos priorités et nous prenons note de chaque commentaire pour améliorer continuellement nos services.\n\nNous espérons avoir le plaisir de vous accueillir à nouveau.\n\nCordialement,\nL'équipe`,
      friendly: `Merci beaucoup ${review.name.split(" ")[0]} ! 😊\n\nVotre avis nous fait vraiment plaisir et motive toute l'équipe. C'est grâce à des clients comme vous qu'on se lève chaque matin avec le sourire !\n\nÀ très bientôt !`,
      apologetic: `Cher(e) ${review.name.split(" ")[0]},\n\nNous sommes sincèrement désolés que votre expérience n'ait pas été à la hauteur de vos attentes. Vos remarques sont très importantes pour nous et nous allons immédiatement prendre des mesures correctives.\n\nNous serions honorés de pouvoir vous offrir une meilleure expérience. N'hésitez pas à nous contacter directement.\n\nAvec nos excuses renouvelées.`
    }

    setResponse(styles[generationStyle])
    setIsGenerating(false)
  }

  return (
    <motion.div
      variants={slideIn}
      initial="hidden"
      animate="show"
      exit="exit"
      className="h-full flex flex-col bg-[#0a0a0b]"
    >
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between p-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
            review.rating >= 4
              ? "bg-gradient-to-br from-emerald-500/25 to-emerald-600/15 text-emerald-400"
              : review.rating === 3
              ? "bg-gradient-to-br from-amber-500/25 to-amber-600/15 text-amber-400"
              : "bg-gradient-to-br from-red-500/25 to-red-600/15 text-red-400"
          }`}>
            {review.name.split(" ")[0][0]}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{review.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <StarRating rating={review.rating} size={11} />
              <span className="text-[10px] text-white/30">• {review.dateRelative}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all"
        >
          <X size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="shrink-0 flex items-center gap-1 p-2 mx-5 mt-4 rounded-xl bg-white/[0.03]">
        <button
          onClick={() => setActiveTab("response")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "response"
              ? "bg-white/[0.08] text-white"
              : "text-white/40 hover:text-white/60"
          }`}
        >
          <MessageSquare size={14} />
          Répondre
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "history"
              ? "bg-white/[0.08] text-white"
              : "text-white/40 hover:text-white/60"
          }`}
        >
          <History size={14} />
          Historique
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-5 space-y-5">
        {activeTab === "response" ? (
          <>
            {/* Original review */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-3">
                <SourceIcon source={review.source} size={14} />
                <span className="text-xs text-white/40 capitalize">Avis {review.source}</span>
                {review.verified && (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-medium bg-blue-500/15 text-blue-400 rounded">
                    <Check size={8} /> Vérifié
                  </span>
                )}
              </div>
              <p className="text-sm text-white/70 leading-relaxed">{review.text}</p>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/[0.04]">
                <div className="flex items-center gap-1.5 text-xs text-white/30">
                  <Calendar size={12} />
                  {review.date}
                </div>
                {review.helpful && (
                  <div className="flex items-center gap-1.5 text-xs text-white/30">
                    <ThumbsUp size={12} />
                    {review.helpful} utile{review.helpful > 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>

            {/* AI Generation styles */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white/50">Style de réponse IA</span>
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20">
                  <Bot size={12} className="text-violet-400" />
                  <span className="text-[10px] font-medium text-violet-400">Propulsé par IA</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: "professional", label: "Pro", icon: Award },
                  { key: "friendly", label: "Amical", icon: MessageCircle },
                  { key: "apologetic", label: "Excuses", icon: AlertCircle },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setGenerationStyle(key as typeof generationStyle)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                      generationStyle === key
                        ? "bg-violet-500/15 border-violet-500/30 text-violet-400"
                        : "bg-white/[0.02] border-white/[0.06] text-white/40 hover:bg-white/[0.04] hover:text-white/60"
                    }`}
                  >
                    <Icon size={16} />
                    <span className="text-[10px] font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 transition-all disabled:opacity-50 shadow-lg shadow-violet-500/20"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Wand2 size={16} />
                  Générer une réponse IA
                </>
              )}
            </motion.button>

            {/* Response textarea */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white/50">
                  {review.responded ? "Modifier la réponse" : "Votre réponse"}
                </span>
                <span className="text-[10px] text-white/25">{response.length} caractères</span>
              </div>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Écrivez votre réponse personnalisée..."
                className="w-full h-40 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder-white/25 resize-none focus:outline-none focus:border-[#00C9A7]/50 focus:bg-white/[0.04] transition-all"
              />
            </div>
          </>
        ) : (
          /* History tab */
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-white/40">
              <History size={14} />
              <span>Historique des échanges</span>
            </div>

            <div className="relative pl-4 border-l-2 border-white/[0.06] space-y-4">
              {/* Original review */}
              <div className="relative">
                <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-[#0a0a0b] border-2 border-amber-500" />
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-white/60">{review.name}</span>
                    <span className="text-[10px] text-white/30">{review.dateRelative}</span>
                  </div>
                  <p className="text-sm text-white/50">{review.text}</p>
                </div>
              </div>

              {/* Response if exists */}
              {review.responded && review.response && (
                <div className="relative">
                  <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-[#0a0a0b] border-2 border-[#00C9A7]" />
                  <div className="p-4 rounded-xl bg-[#00C9A7]/[0.06] border border-[#00C9A7]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-[#00C9A7]">Votre réponse</span>
                      <span className="text-[10px] text-white/30">{review.responseDate}</span>
                    </div>
                    <p className="text-sm text-white/50">{review.response}</p>
                  </div>
                </div>
              )}

              {!review.responded && (
                <div className="relative">
                  <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-[#0a0a0b] border-2 border-dashed border-white/20" />
                  <div className="p-4 rounded-xl border border-dashed border-white/[0.1] bg-white/[0.01]">
                    <p className="text-xs text-white/30 text-center">En attente de réponse...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="shrink-0 p-5 border-t border-white/[0.06] space-y-3">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          disabled={!response.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-[#00C9A7] text-black hover:bg-[#00E4BC] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#00C9A7]/20"
        >
          <Send size={16} />
          {review.responded ? "Mettre à jour" : "Publier la réponse"}
        </motion.button>

        <div className="flex items-center gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium bg-white/[0.03] text-white/50 border border-white/[0.06] hover:bg-white/[0.06] hover:text-white/70 transition-all">
            <ExternalLink size={12} />
            Voir sur {review.source}
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium bg-white/[0.03] text-white/50 border border-white/[0.06] hover:bg-white/[0.06] hover:text-white/70 transition-all">
            <Flag size={12} />
            Signaler
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function UrgentReviewsBanner({ count, onClick }: { count: number; onClick: () => void }) {
  if (count === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10 border border-red-500/20 p-5"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5" />
      <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 rounded-full blur-3xl" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-3 rounded-xl bg-red-500/20"
          >
            <AlertCircle size={20} className="text-red-400" />
          </motion.div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              {count} avis négatif{count > 1 ? "s" : ""} en attente
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="px-2 py-0.5 text-[10px] font-bold bg-red-500/20 text-red-400 rounded-full"
              >
                URGENT
              </motion.span>
            </h3>
            <p className="text-xs text-white/40 mt-0.5">
              Répondre rapidement aux avis négatifs améliore votre e-réputation de 33%
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClick}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-400 transition-all shadow-lg shadow-red-500/30"
        >
          <Zap size={16} />
          Traiter maintenant
        </motion.button>
      </div>
    </motion.div>
  )
}

// ============================================
// MAIN PAGE
// ============================================
export default function AvisPage() {
  const [filter, setFilter] = useState<FilterType>("all")
  const [sort, setSort] = useState<SortType>("recent")
  const [search, setSearch] = useState("")
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [showSortMenu, setShowSortMenu] = useState(false)

  const filteredReviews = useMemo(() => {
    let result = [...reviewsData]

    if (filter === "positive") {
      result = result.filter(r => r.rating >= 4)
    } else if (filter === "negative") {
      result = result.filter(r => r.rating <= 3)
    } else if (filter === "unanswered") {
      result = result.filter(r => !r.responded)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(r =>
        r.name.toLowerCase().includes(searchLower) ||
        r.text.toLowerCase().includes(searchLower)
      )
    }

    switch (sort) {
      case "oldest":
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case "best":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "worst":
        result.sort((a, b) => a.rating - b.rating)
        break
      default:
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }

    return result
  }, [filter, sort, search])

  const counts = useMemo(() => ({
    all: reviewsData.length,
    positive: reviewsData.filter(r => r.rating >= 4).length,
    negative: reviewsData.filter(r => r.rating <= 3).length,
    unanswered: reviewsData.filter(r => !r.responded).length,
  }), [])

  const stats = useMemo(() => {
    const avgRating = reviewsData.reduce((s, r) => s + r.rating, 0) / reviewsData.length
    const responseRate = (reviewsData.filter(r => r.responded).length / reviewsData.length) * 100
    const urgentCount = reviewsData.filter(r => r.rating <= 2 && !r.responded).length
    return { avgRating, responseRate, urgentCount }
  }, [])

  const sortLabels: Record<SortType, string> = {
    recent: "Plus récents",
    oldest: "Plus anciens",
    best: "Meilleure note",
    worst: "Pire note",
  }

  return (
    <div className="flex h-screen bg-[#0a0a0b]">
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
                className="p-2.5 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-all"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                  Avis
                  <span className="px-3 py-1 text-sm font-semibold bg-gradient-to-r from-[#00C9A7]/20 to-[#00C9A7]/10 text-[#00C9A7] rounded-lg border border-[#00C9A7]/20">
                    {reviewsData.length}
                  </span>
                </h1>
                <p className="text-sm text-white/40 mt-1">Gérez et répondez à tous vos avis clients</p>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher dans les avis..."
                className="w-80 pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00C9A7]/50 focus:bg-white/[0.04] transition-all"
              />
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div variants={item} className="grid grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={MessageSquare}
              label="Total avis"
              value={reviewsData.length}
              trend="up"
              trendValue="+12%"
              color="#00C9A7"
              glowColor="rgba(0, 201, 167, 0.08)"
            />
            <StatCard
              icon={Star}
              label="Note moyenne"
              value={stats.avgRating}
              suffix="/5"
              trend="up"
              trendValue="+0.2"
              color="#EAB308"
              glowColor="rgba(234, 179, 8, 0.08)"
            />
            <StatCard
              icon={Zap}
              label="Taux de réponse"
              value={stats.responseRate}
              suffix="%"
              trend="up"
              trendValue="+5%"
              color="#8B5CF6"
              glowColor="rgba(139, 92, 246, 0.08)"
            />
            <StatCard
              icon={Target}
              label="À traiter"
              value={counts.unanswered}
              color="#F97316"
              glowColor="rgba(249, 115, 22, 0.08)"
            />
          </motion.div>

          {/* Urgent banner */}
          <motion.div variants={item}>
            <UrgentReviewsBanner
              count={stats.urgentCount}
              onClick={() => setFilter("negative")}
            />
          </motion.div>

          {/* Filters & Sort */}
          <motion.div variants={item} className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <FilterPill
                active={filter === "all"}
                count={counts.all}
                onClick={() => setFilter("all")}
              >
                Tous
              </FilterPill>
              <FilterPill
                active={filter === "positive"}
                count={counts.positive}
                onClick={() => setFilter("positive")}
              >
                Positifs (4-5★)
              </FilterPill>
              <FilterPill
                active={filter === "negative"}
                count={counts.negative}
                onClick={() => setFilter("negative")}
              >
                Négatifs (1-3★)
              </FilterPill>
              <FilterPill
                active={filter === "unanswered"}
                count={counts.unanswered}
                onClick={() => setFilter("unanswered")}
              >
                Non répondus
              </FilterPill>
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/[0.03] text-white/60 border border-white/[0.06] hover:bg-white/[0.06] hover:text-white/80 transition-all"
              >
                <Filter size={14} />
                {sortLabels[sort]}
                <ChevronDown size={14} className={`transition-transform ${showSortMenu ? "rotate-180" : ""}`} />
              </motion.button>

              <AnimatePresence>
                {showSortMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-48 p-1.5 rounded-xl bg-[#1a1a1b] border border-white/[0.08] shadow-2xl z-50"
                  >
                    {(Object.keys(sortLabels) as SortType[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => {
                          setSort(key)
                          setShowSortMenu(false)
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${
                          sort === key
                            ? "bg-[#00C9A7]/15 text-[#00C9A7]"
                            : "text-white/60 hover:bg-white/[0.06] hover:text-white"
                        }`}
                      >
                        {sortLabels[key]}
                        {sort === key && <Check size={14} />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </header>

        {/* Reviews list */}
        <div className="flex-1 overflow-auto px-8 py-6">
          <motion.div
            className="space-y-3"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence mode="popLayout">
              {filteredReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  selected={selectedReview?.id === review.id}
                  onClick={() => setSelectedReview(review)}
                  onRespond={() => setSelectedReview(review)}
                />
              ))}
            </AnimatePresence>

            {filteredReviews.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-5">
                  <MessageSquare size={32} className="text-white/15" />
                </div>
                <h3 className="text-lg font-semibold text-white/60 mb-2">Aucun avis trouvé</h3>
                <p className="text-sm text-white/30 mb-6">Essayez de modifier vos filtres ou votre recherche</p>
                <button
                  onClick={() => { setFilter("all"); setSearch("") }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white/50 bg-white/[0.04] hover:bg-white/[0.08] transition-all"
                >
                  <RotateCcw size={14} />
                  Réinitialiser les filtres
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Sidebar */}
      <AnimatePresence>
        {selectedReview && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 440, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="shrink-0 border-l border-white/[0.06] overflow-hidden"
          >
            <ReviewDetailSidebar
              review={selectedReview}
              onClose={() => setSelectedReview(null)}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
