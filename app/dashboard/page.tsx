"use client"

import { useEffect, useState, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  Star,
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
  MessageSquare,
  Zap,
  DollarSign,
  Eye,
  Copy,
  Flame,
  Bell,
  BarChart3,
  Check,
  Activity,
  ExternalLink,
  Search,
  Command,
  Share2,
  X,
  Mail,
  MessageSquareWarning,
} from "lucide-react"

// ============================================
// ANIMATIONS
// ============================================
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
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

// ============================================
// DATA
// ============================================
const generateChartData = () => {
  const data = []
  let rating = 4.3
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    rating += (Math.random() - 0.45) * 0.08
    rating = Math.max(4.0, Math.min(5, rating))
    data.push({
      date: date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
      rating: Math.round(rating * 100) / 100,
    })
  }
  return data
}

const recentReviews = [
  { id: 1, name: "Marie Dupont", rating: 5, text: "Service exceptionnel, je recommande vivement !", time: "12 min", responded: true },
  { id: 2, name: "Thomas Bernard", rating: 5, text: "Très professionnel, équipe au top.", time: "2h", responded: true },
  { id: 3, name: "Sophie Martin", rating: 4, text: "Bonne expérience dans l'ensemble.", time: "5h", responded: false },
  { id: 4, name: "Lucas Petit", rating: 2, text: "Déçu par l'attente, à améliorer.", time: "1j", responded: false },
]


// Feedbacks interceptés (avis négatifs récoltés avant Google)
const interceptedFeedbacks = [
  { id: 1, rating: 2, category: "Service", comment: "Le serveur était désagréable et pressé.", email: "marie.l@gmail.com", date: "Il y a 2h" },
  { id: 2, rating: 1, category: "Attente", comment: "Plus de 40 minutes d'attente, inadmissible.", email: null, date: "Hier" },
  { id: 3, rating: 2, category: "Prix", comment: "Trop cher pour ce que c'est.", email: "thomas.m@outlook.fr", date: "Il y a 3j" },
  { id: 4, rating: 3, category: "Propreté", comment: "Toilettes pas très propres.", email: null, date: "Il y a 5j" },
]

// ============================================
// UTILITY
// ============================================
function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Bonjour"
  if (hour < 18) return "Bon après-midi"
  return "Bonsoir"
}

// ============================================
// COMPONENTS
// ============================================

function AnimatedNumber({ value, decimals = 0, prefix = "", suffix = "" }: {
  value: number; decimals?: number; prefix?: string; suffix?: string
}) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const duration = 1500
    const steps = 40
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

  return <>{prefix}{display.toFixed(decimals)}{suffix}</>
}

function Card({ children, className = "", glowColor }: {
  children: React.ReactNode
  className?: string
  glowColor?: string
}) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`group relative rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5
        transition-all duration-300 hover:bg-white/[0.04] hover:border-white/[0.1]
        hover:shadow-2xl hover:shadow-black/20 ${className}`}
    >
      {glowColor && (
        <div
          className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
          style={{ background: glowColor }}
        />
      )}
      <div className="relative">{children}</div>
    </motion.div>
  )
}

function SyncBadge() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <span className="text-[11px] font-medium text-emerald-400">Synchronisé</span>
    </div>
  )
}

function StreakBadge({ days }: { days: number }) {
  return (
    <motion.div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/15 to-red-500/15 border border-orange-500/20"
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
      >
        <Flame size={14} className="text-orange-400" />
      </motion.div>
      <span className="text-[11px] font-bold text-orange-400">{days}j streak</span>
    </motion.div>
  )
}

function SearchBar() {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/30 hover:bg-white/[0.05] hover:border-white/[0.1] transition-all cursor-pointer">
      <Search size={14} />
      <span className="text-xs">Rechercher...</span>
      <div className="flex items-center gap-1 ml-8 px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px]">
        <Command size={10} />
        <span>K</span>
      </div>
    </div>
  )
}

function StarRating({ rating, size = 14, animated = false }: { rating: number; size?: number; animated?: boolean }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star, i) => (
        <motion.div
          key={star}
          initial={animated ? { opacity: 0, scale: 0, rotate: -180 } : false}
          animate={animated ? { opacity: 1, scale: 1, rotate: 0 } : false}
          transition={animated ? { delay: 0.3 + i * 0.1, type: "spring" } : undefined}
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

function HealthGauge({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 42
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? "#00C9A7" : score >= 60 ? "#F59E0B" : "#EF4444"
  const label = score >= 80 ? "EXCELLENT" : score >= 60 ? "BON" : "À AMÉLIORER"

  return (
    <div className="relative">
      <svg width="110" height="110" className="-rotate-90">
        <circle cx="55" cy="55" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
        <motion.circle
          cx="55" cy="55" r="42"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          style={{ filter: `drop-shadow(0 0 8px ${color}50)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-bold text-white"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
        >
          {score}
        </motion.span>
        <span className="text-[9px] text-white/40 uppercase tracking-wider mt-0.5 font-semibold">{label}</span>
      </div>
    </div>
  )
}

function RatingDistribution({ data }: { data: { rating: number; percentage: number }[] }) {
  return (
    <div className="space-y-2.5">
      {data.map((item, i) => (
        <motion.div
          key={item.rating}
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + i * 0.08 }}
        >
          <div className="flex items-center gap-1 w-7">
            <span className="text-xs font-medium text-white/50">{item.rating}</span>
            <Star size={10} className="text-[#EAB308] fill-[#EAB308]" />
          </div>
          <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: item.rating >= 4
                  ? "linear-gradient(90deg, #00C9A7, #00E4BC)"
                  : item.rating === 3
                  ? "linear-gradient(90deg, #F59E0B, #FBBF24)"
                  : "linear-gradient(90deg, #EF4444, #F87171)",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${item.percentage}%` }}
              transition={{ duration: 1, delay: 0.7 + i * 0.08 }}
            />
          </div>
          <span className="text-[11px] text-white/30 w-9 text-right">{item.percentage}%</span>
        </motion.div>
      ))}
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-white/[0.04] rounded-lg animate-pulse" />
        <div className="h-4 w-48 bg-white/[0.03] rounded-lg animate-pulse" />
      </div>
      <div className="grid grid-cols-12 gap-4">
        {[4, 5, 3, 4, 4, 4].map((span, i) => (
          <div
            key={i}
            className={`col-span-${span} h-40 bg-white/[0.02] rounded-2xl animate-pulse`}
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    </div>
  )
}

// ============================================
// MAIN DASHBOARD
// ============================================
export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [userName, setUserName] = useState("there")
  const [selectedFeedback, setSelectedFeedback] = useState<typeof interceptedFeedbacks[0] | null>(null)
  const [showAllFeedbacks, setShowAllFeedbacks] = useState(false)
  const [stats, setStats] = useState({
    rating: 4.7,
    ratingChange: 0.2,
    totalReviews: 284,
    monthReviews: 47,
    responseRate: 92,
    avgResponseTime: 2.4,
    viewsThisMonth: 1247,
    streak: 12,
  })

  const chartData = useMemo(() => generateChartData(), [])

  const healthScore = useMemo(() => {
    return 95 // Fixed pour le design
  }, [])

  const healthBreakdown = {
    note: { value: 47, max: 50 },
    reponses: { value: 28, max: 30 },
    tendance: { value: 20, max: 20 },
  }

  const estimatedROI = useMemo(() => {
    return Math.round(stats.viewsThisMonth * 0.12 * 45)
  }, [stats.viewsThisMonth])

  const ratingDistribution = useMemo(() => [
    { rating: 5, percentage: 65 },
    { rating: 4, percentage: 20 },
    { rating: 3, percentage: 8 },
    { rating: 2, percentage: 4 },
    { rating: 1, percentage: 3 },
  ], [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setLoading(false); return }

        if (user.user_metadata?.full_name) {
          setUserName(user.user_metadata.full_name.split(' ')[0])
        } else if (user.email) {
          setUserName(user.email.split('@')[0])
        }

        const { data: clientData } = await supabase.from("clients").select("id").eq("id", user.id).single()
        if (!clientData) { setLoading(false); return }

        const { data: etabData } = await supabase.from("etablissements").select("*").eq("client_id", clientData.id).single()
        if (etabData) {
          const { data: avisData } = await supabase.from("avis").select("*").eq("etablissement_id", etabData.id)
          if (avisData && avisData.length > 0) {
            const avg = avisData.reduce((s, a) => s + a.note, 0) / avisData.length
            const monthAgo = new Date()
            monthAgo.setMonth(monthAgo.getMonth() - 1)
            const monthReviews = avisData.filter(a => new Date(a.created_at) > monthAgo).length

            setStats(prev => ({
              ...prev,
              rating: Math.round(avg * 10) / 10,
              totalReviews: avisData.length,
              monthReviews,
            }))
          }
        }
      } catch (e) { console.error(e) }
      finally { setTimeout(() => setLoading(false), 800) }
    }
    fetchData()
  }, [])

  const handleCopy = async () => {
    await navigator.clipboard.writeText("https://bahy.app/r/votre-commerce")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return <DashboardSkeleton />

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.header variants={item} className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <SyncBadge />
            <StreakBadge days={stats.streak} />
          </div>
          <div className="flex items-center gap-3">
            <SearchBar />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.06] hover:border-white/[0.1] transition-all"
            >
              <ExternalLink size={14} />
              Voir ma page
            </motion.button>
            <motion.button
              onClick={handleCopy}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.06] hover:border-white/[0.1] transition-all"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {copied ? "Copié !" : "Copier le lien"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all"
            >
              <Bell size={16} />
              <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full shadow-lg shadow-red-500/30">
                2
              </span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00C9A7] text-xs font-semibold text-black hover:bg-[#00E4BC] transition-all"
            >
              <Share2 size={14} />
              Partager
            </motion.button>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <motion.h1
              className="text-3xl font-bold text-white mb-1 flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {getGreeting()}, {userName}
              <motion.span
                className="inline-block text-2xl"
                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
              >
                👋
              </motion.span>
            </motion.h1>
            <motion.p
              className="text-white/40 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Voici les performances de votre établissement
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 rounded-full">
                <TrendingUp size={10} /> +23% ce mois
              </span>
            </motion.p>
          </div>

          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <TrendingUp size={14} className="text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-400">+12%</span>
              <span className="text-xs text-white/30">ce mois</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <Star size={14} className="text-[#EAB308] fill-[#EAB308]" />
              <span className="text-sm font-semibold text-[#EAB308]">+{stats.ratingChange}</span>
              <span className="text-xs text-white/30">note</span>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Main KPIs - 3 colonnes */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Valeur Générée */}
        <Card glowColor="rgba(0, 201, 167, 0.08)">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00C9A7]/20 to-[#00C9A7]/10">
              <DollarSign size={18} className="text-[#00C9A7]" />
            </div>
            <div className="flex items-center gap-1.5 text-[#00C9A7]">
              <TrendingUp size={14} />
              <span className="text-xs font-semibold">+23%</span>
            </div>
          </div>
          <p className="text-[11px] font-medium text-white/40 uppercase tracking-wider mb-1">Valeur générée</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">
              €<AnimatedNumber value={6750} />
            </span>
            <span className="text-sm text-white/30">ce mois</span>
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.04]">
            <p className="text-[11px] text-white/30">
              {stats.viewsThisMonth.toLocaleString()} vues → ~{Math.round(stats.viewsThisMonth * 0.12)} clients
            </p>
          </div>
        </Card>

        {/* Note Google */}
        <Card glowColor="rgba(234, 179, 8, 0.06)">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#EAB308]/20 to-[#EAB308]/10">
              <Star size={18} className="text-[#EAB308] fill-[#EAB308]" />
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <TrendingUp size={12} className="text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400">+{stats.ratingChange}</span>
            </div>
          </div>
          <p className="text-[11px] font-medium text-white/40 uppercase tracking-wider mb-1">Note Google</p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold text-white">
              <AnimatedNumber value={stats.rating} decimals={1} />
            </span>
            <span className="text-xl text-white/20">/5</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <StarRating rating={5} size={18} animated />
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-white/50">{stats.totalReviews} avis</span>
            <span className="text-[#00C9A7] font-medium">+{stats.monthReviews} ce mois</span>
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.04]">
            <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#EAB308] to-[#F59E0B]"
                initial={{ width: 0 }}
                animate={{ width: `${(stats.rating / 5) * 100}%` }}
                transition={{ duration: 1.2, delay: 0.5 }}
              />
            </div>
          </div>
        </Card>

        {/* Score Santé */}
        <Card glowColor="rgba(0, 201, 167, 0.06)">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-xl bg-white/[0.04]">
              <Activity size={16} className="text-white/40" />
            </div>
            <span className="text-[11px] font-medium text-white/40 uppercase tracking-wider">Score Santé</span>
          </div>
          <div className="flex items-center justify-center py-2">
            <HealthGauge score={healthScore} />
          </div>
          <div className="space-y-2.5 mt-4 pt-4 border-t border-white/[0.04]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/40">Note</span>
              <span className="font-semibold text-[#EAB308]">{healthBreakdown.note.value}/{healthBreakdown.note.max}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/40">Réponses</span>
              <span className="font-semibold text-sky-400">{healthBreakdown.reponses.value}/{healthBreakdown.reponses.max}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/40">Tendance</span>
              <span className="font-semibold text-[#00C9A7]">{healthBreakdown.tendance.value}/{healthBreakdown.tendance.max}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card glowColor="rgba(99, 102, 241, 0.08)">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 rounded-xl bg-indigo-500/15">
              <MessageSquare size={16} className="text-indigo-400" />
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <TrendingUp size={12} />
              <span className="text-xs font-semibold">+12%</span>
            </div>
          </div>
          <p className="text-[11px] font-medium text-white/40 uppercase tracking-wider mb-1">Avis ce mois</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">
              <AnimatedNumber value={stats.monthReviews} />
            </span>
            <span className="text-xs text-white/25">vs 42 mois dernier</span>
          </div>
        </Card>

        <Card glowColor="rgba(236, 72, 153, 0.08)">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 rounded-xl bg-pink-500/15">
              <Eye size={16} className="text-pink-400" />
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <TrendingUp size={12} />
              <span className="text-xs font-semibold">+34%</span>
            </div>
          </div>
          <p className="text-[11px] font-medium text-white/40 uppercase tracking-wider mb-1">Vues ce mois</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">
              <AnimatedNumber value={stats.viewsThisMonth} />
            </span>
            <span className="text-xs text-white/25">personnes</span>
          </div>
        </Card>

        <Card glowColor="rgba(14, 165, 233, 0.08)">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 rounded-xl bg-sky-500/15">
              <Zap size={16} className="text-sky-400" />
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <TrendingUp size={12} />
              <span className="text-xs font-semibold">+5%</span>
            </div>
          </div>
          <p className="text-[11px] font-medium text-white/40 uppercase tracking-wider mb-1">Taux de réponse</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">
              <AnimatedNumber value={stats.responseRate} suffix="%" />
            </span>
            <span className="text-xs text-white/25">~{stats.avgResponseTime}h délai</span>
          </div>
        </Card>
      </div>

      {/* Chart & Distribution */}
      <div className="grid grid-cols-12 gap-4 mb-4">
        <Card className="col-span-8 !p-0 overflow-hidden" glowColor="rgba(0, 201, 167, 0.04)">
          <div className="p-5 pb-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-white/[0.04]">
                  <TrendingUp size={16} className="text-white/40" />
                </div>
                <span className="text-sm font-medium text-white/60">Évolution de la note</span>
              </div>
              <div className="flex items-center p-1 rounded-xl bg-white/[0.03]">
                {["7j", "30j", "90j", "1an"].map((p, i) => (
                  <button
                    key={p}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      i === 1
                        ? "bg-white/[0.08] text-white shadow-sm"
                        : "text-white/30 hover:text-white/60"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="h-52 px-2 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00C9A7" stopOpacity={0.2} />
                    <stop offset="50%" stopColor="#00C9A7" stopOpacity={0.05} />
                    <stop offset="100%" stopColor="#00C9A7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "rgba(255,255,255,0.2)" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={[4, 5]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "rgba(255,255,255,0.2)" }}
                  width={28}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.9)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    fontSize: 13,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                  }}
                  labelStyle={{ color: "rgba(255,255,255,0.5)" }}
                  itemStyle={{ color: "#00C9A7" }}
                />
                <Area
                  type="monotone"
                  dataKey="rating"
                  name="Note"
                  stroke="#00C9A7"
                  strokeWidth={2.5}
                  fill="url(#chartGrad)"
                  dot={false}
                  activeDot={{ r: 6, fill: "#00C9A7", stroke: "#0a0a0b", strokeWidth: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="col-span-4" glowColor="rgba(234, 179, 8, 0.06)">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-[#EAB308]/15">
              <BarChart3 size={16} className="text-[#EAB308]" />
            </div>
            <span className="text-[11px] font-medium text-white/40 uppercase tracking-wider">Distribution</span>
          </div>
          <RatingDistribution data={ratingDistribution} />
        </Card>
      </div>

      {/* Feedbacks interceptés & Recent Reviews */}
      <div className="grid grid-cols-12 gap-4">
        {/* Widget Feedbacks interceptés */}
        <Card className="col-span-4" glowColor="rgba(249, 115, 22, 0.08)">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-orange-500/15">
                <MessageSquareWarning size={16} className="text-orange-400" />
              </div>
              <span className="text-[11px] font-medium text-white/40 uppercase tracking-wider">Feedbacks interceptés</span>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-500/15 text-orange-400 rounded-full">
              {interceptedFeedbacks.length}
            </span>
          </div>
          <div className="space-y-2">
            {interceptedFeedbacks.slice(0, 3).map((feedback) => (
              <motion.div
                key={feedback.id}
                whileHover={{ x: 4 }}
                onClick={() => setSelectedFeedback(feedback)}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-orange-500/5 cursor-pointer transition-colors border border-transparent hover:border-orange-500/20"
              >
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={10} className={star <= feedback.rating ? "text-orange-400 fill-orange-400" : "text-white/10"} />
                  ))}
                </div>
                <span className="px-1.5 py-0.5 text-[9px] font-medium bg-white/[0.06] text-white/50 rounded">
                  {feedback.category}
                </span>
                <span className="text-[10px] text-white/30 ml-auto">{feedback.date}</span>
                <ChevronRight size={12} className="text-white/15" />
              </motion.div>
            ))}
          </div>
          {interceptedFeedbacks.length > 3 && (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setShowAllFeedbacks(true)}
              className="w-full mt-3 py-2 text-[11px] font-medium text-white/40 hover:text-white/60 transition-colors flex items-center justify-center gap-1"
            >
              Voir tout <ArrowUpRight size={12} />
            </motion.button>
          )}
        </Card>

        <Card className="col-span-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-white/[0.04]">
                <MessageSquare size={16} className="text-white/40" />
              </div>
              <span className="text-sm font-medium text-white/60">Derniers avis</span>
            </div>
            <motion.button
              whileHover={{ x: 2 }}
              className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              Voir tout <ArrowUpRight size={12} />
            </motion.button>
          </div>
          <div className="space-y-1">
            {recentReviews.slice(0, 3).map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.08 }}
                whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.02)" }}
                className="flex items-center gap-4 px-3 py-3.5 rounded-xl cursor-pointer transition-colors"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                  review.rating >= 4
                    ? "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 text-emerald-400"
                    : review.rating === 3
                    ? "bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-400"
                    : "bg-gradient-to-br from-red-500/20 to-red-600/10 text-red-400"
                }`}>
                  {review.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-0.5">
                    <span className="text-sm font-medium text-white/80">{review.name}</span>
                    <StarRating rating={review.rating} size={12} />
                    {review.responded && (
                      <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 rounded-md">
                        <Check size={10} /> Répondu
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/35 truncate">{review.text}</p>
                </div>
                <span className="text-xs text-white/20">{review.time}</span>
                <ChevronRight size={14} className="text-white/10" />
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Modal détail feedback */}
      <AnimatePresence>
        {selectedFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedFeedback(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-[#0f0f10] border border-white/[0.1] shadow-2xl overflow-hidden"
            >
              <div className="p-5 border-b border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-orange-500/15">
                      <MessageSquareWarning size={18} className="text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Feedback intercepté</h3>
                      <p className="text-[11px] text-white/40">{selectedFeedback.date}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedFeedback(null)}
                    className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
                  >
                    <X size={18} />
                  </motion.button>
                </div>
              </div>
              <div className="p-5 space-y-4">
                {/* Note & Catégorie */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} className={star <= selectedFeedback.rating ? "text-orange-400 fill-orange-400" : "text-white/10"} />
                    ))}
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-white/[0.06] text-white/60 rounded-lg">
                    {selectedFeedback.category}
                  </span>
                </div>
                {/* Commentaire */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-sm text-white/70 leading-relaxed">{selectedFeedback.comment}</p>
                </div>
                {/* Email */}
                {selectedFeedback.email ? (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <Mail size={14} className="text-emerald-400" />
                    <span className="text-xs text-emerald-400">{selectedFeedback.email}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <Mail size={14} className="text-white/30" />
                    <span className="text-xs text-white/30">Email non fourni</span>
                  </div>
                )}
              </div>
              {/* Actions */}
              {selectedFeedback.email && (
                <div className="p-5 border-t border-white/[0.06]">
                  <motion.a
                    href={`mailto:${selectedFeedback.email}?subject=Suite à votre retour`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-[#00C9A7] text-black hover:bg-[#00E4BC] transition-all"
                  >
                    <Mail size={16} />
                    Répondre par email
                  </motion.a>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal voir tout */}
      <AnimatePresence>
        {showAllFeedbacks && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAllFeedbacks(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg max-h-[80vh] rounded-2xl bg-[#0f0f10] border border-white/[0.1] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-5 border-b border-white/[0.06] shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-orange-500/15">
                      <MessageSquareWarning size={18} className="text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Tous les feedbacks</h3>
                      <p className="text-[11px] text-white/40">{interceptedFeedbacks.length} feedbacks interceptés</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAllFeedbacks(false)}
                    className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
                  >
                    <X size={18} />
                  </motion.button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4 space-y-2">
                {interceptedFeedbacks.map((feedback) => (
                  <motion.div
                    key={feedback.id}
                    whileHover={{ x: 4 }}
                    onClick={() => { setShowAllFeedbacks(false); setSelectedFeedback(feedback); }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-orange-500/5 cursor-pointer transition-colors border border-transparent hover:border-orange-500/20"
                  >
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={11} className={star <= feedback.rating ? "text-orange-400 fill-orange-400" : "text-white/10"} />
                      ))}
                    </div>
                    <span className="px-1.5 py-0.5 text-[9px] font-medium bg-white/[0.06] text-white/50 rounded">
                      {feedback.category}
                    </span>
                    <p className="flex-1 text-xs text-white/50 truncate">{feedback.comment}</p>
                    {feedback.email && <Mail size={12} className="text-emerald-400/60" />}
                    <span className="text-[10px] text-white/30">{feedback.date}</span>
                    <ChevronRight size={12} className="text-white/15" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
