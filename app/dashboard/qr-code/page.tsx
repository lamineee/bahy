"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabase"
import {
  Copy,
  Check,
  Download,
  ExternalLink,
  QrCode,
  Palette,
  Settings2,
  Image,
  ChevronDown,
  FileImage,
  FileCode,
  FileText,
  Scan,
  TrendingUp,
  Square,
  Circle,
  Grid3X3,
  Upload,
  Loader2,
  Star,
} from "lucide-react"

// ============================================
// TYPES
// ============================================
type QRStyle = "squares" | "dots" | "rounded"

interface QRSettings {
  color: string
  style: QRStyle
  showLogo: boolean
  logoUrl: string | null
}

// ============================================
// ANIMATIONS
// ============================================
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 150, damping: 20 }
  }
}

// ============================================
// PRESET COLORS
// ============================================
const presetColors = [
  "#00C9A7", // Bahy green
  "#000000", // Black
  "#1a1a1a", // Dark
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#EF4444", // Red
  "#F59E0B", // Orange
]

// ============================================
// COMPONENTS
// ============================================
function Card({ children, className = "", glowColor }: {
  children: React.ReactNode
  className?: string
  glowColor?: string
}) {
  return (
    <motion.div
      variants={item}
      className={`relative rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 backdrop-blur-sm ${className}`}
      style={glowColor ? {
        boxShadow: `0 0 40px -10px ${glowColor}`
      } : undefined}
    >
      {children}
    </motion.div>
  )
}

function StatCard({ icon: Icon, label, value, trend }: {
  icon: React.ElementType
  label: string
  value: string
  trend?: string
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
      <div className="p-2 rounded-lg bg-white/[0.04]">
        <Icon size={16} className="text-white/40" />
      </div>
      <div className="flex-1">
        <p className="text-[11px] text-white/40 uppercase tracking-wider">{label}</p>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">{value}</span>
          {trend && (
            <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp size={10} />
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// Mini QR for template previews
function MiniQR({ color, size = 40 }: { color: string; size?: number }) {
  return (
    <QRCodeSVG
      value="https://bahy.io/demo"
      size={size}
      level="L"
      fgColor={color}
      bgColor="transparent"
    />
  )
}

// Template Preview Components
function TableTentPreview({ qrColor }: { qrColor: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-3 bg-gradient-to-b from-white to-gray-50 rounded-lg">
      <div className="text-[8px] font-bold text-gray-800 mb-1 text-center">Votre avis compte !</div>
      <div className="p-1.5 bg-white rounded shadow-sm mb-1">
        <MiniQR color={qrColor} size={36} />
      </div>
      <div className="text-[6px] text-gray-500 text-center">Scannez pour donner votre avis</div>
      <div className="flex items-center gap-0.5 mt-1">
        {[1,2,3,4,5].map(i => (
          <Star key={i} size={6} className="text-amber-400 fill-amber-400" />
        ))}
      </div>
    </div>
  )
}

function WindowStickerPreview({ qrColor }: { qrColor: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-white rounded-lg border-2 border-gray-200">
      <div className="p-2 rounded-lg" style={{ backgroundColor: `${qrColor}15` }}>
        <MiniQR color={qrColor} size={44} />
      </div>
      <div className="mt-2 text-[7px] font-semibold text-gray-700">Laissez-nous un avis</div>
      <div className="text-[5px] text-gray-400 mt-0.5">bahy.io</div>
    </div>
  )
}

function BusinessCardPreview({ qrColor }: { qrColor: string }) {
  return (
    <div className="w-full h-full flex items-center p-2 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg">
      <div className="flex-1">
        <div className="text-[7px] font-bold text-white">Mon Restaurant</div>
        <div className="text-[5px] text-gray-400 mt-0.5">Cuisine française</div>
        <div className="flex items-center gap-0.5 mt-1">
          {[1,2,3,4,5].map(i => (
            <Star key={i} size={5} className="text-amber-400 fill-amber-400" />
          ))}
        </div>
      </div>
      <div className="p-1 bg-white rounded">
        <MiniQR color={qrColor} size={28} />
      </div>
    </div>
  )
}

function PosterA4Preview({ qrColor }: { qrColor: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-3 bg-white rounded-lg">
      <div className="text-[10px] font-bold text-gray-800 mb-2 text-center">Votre avis<br/>nous intéresse</div>
      <div className="p-2 rounded-xl shadow-md" style={{ backgroundColor: `${qrColor}10` }}>
        <MiniQR color={qrColor} size={48} />
      </div>
      <div className="mt-2 text-[6px] text-gray-500 text-center">Scannez ce QR code</div>
      <div className="mt-1 px-2 py-0.5 rounded-full text-[5px] font-medium text-white" style={{ backgroundColor: qrColor }}>
        Donnez votre avis
      </div>
    </div>
  )
}

// ============================================
// MARKETING TEMPLATES
// ============================================
const getMarketingTemplates = (qrColor: string) => [
  {
    id: "table-tent",
    name: "Chevalet de table",
    description: "Idéal pour les restaurants",
    size: "10x15 cm",
    preview: <TableTentPreview qrColor={qrColor} />
  },
  {
    id: "window-sticker",
    name: "Sticker vitrine",
    description: "Pour l'entrée de votre commerce",
    size: "15x15 cm",
    preview: <WindowStickerPreview qrColor={qrColor} />
  },
  {
    id: "business-card",
    name: "Carte de visite",
    description: "Format carte classique",
    size: "8.5x5.5 cm",
    preview: <BusinessCardPreview qrColor={qrColor} />
  },
  {
    id: "poster-a4",
    name: "Affiche A4",
    description: "Grand format visible",
    size: "21x29.7 cm",
    preview: <PosterA4Preview qrColor={qrColor} />
  }
]

// ============================================
// MAIN PAGE
// ============================================
export default function QRCodePage() {
  const [codeCourt, setCodeCourt] = useState<string>("demo")
  const [etablissementName, setEtablissementName] = useState<string>("Mon établissement")
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)
  const downloadMenuRef = useRef<HTMLDivElement>(null)

  // QR Settings
  const [settings, setSettings] = useState<QRSettings>({
    color: "#00C9A7",
    style: "squares",
    showLogo: false,
    logoUrl: null
  })

  const feedbackUrl = `https://bahy.io/f/${codeCourt}`
  const shortUrl = `bahy.io/f/${codeCourt}`

  // Fetch etablissement
  useEffect(() => {
    const fetchEtablissement = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setLoading(false)
          return
        }

        const { data } = await supabase
          .from("etablissements")
          .select("id, code_court, nom")
          .eq("client_id", user.id)
          .single()

        if (data) {
          setCodeCourt(data.code_court || "demo")
          setEtablissementName(data.nom || "Mon établissement")
        }
      } catch (e) {
        console.error("Error:", e)
      }
      setLoading(false)
    }

    fetchEtablissement()
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target as Node)) {
        setShowDownloadMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Copy link
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(feedbackUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [feedbackUrl])

  // Download functions
  const downloadPNG = useCallback(() => {
    const canvas = qrRef.current?.querySelector("canvas")
    if (canvas) {
      const url = canvas.toDataURL("image/png", 1.0)
      const link = document.createElement("a")
      link.download = `qr-${codeCourt}.png`
      link.href = url
      link.click()
    }
    setShowDownloadMenu(false)
  }, [codeCourt])

  const downloadSVG = useCallback(() => {
    const svg = qrRef.current?.querySelector("svg")
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const blob = new Blob([svgData], { type: "image/svg+xml" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.download = `qr-${codeCourt}.svg`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
    }
    setShowDownloadMenu(false)
  }, [codeCourt])

  const marketingTemplates = getMarketingTemplates(settings.color)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 size={32} className="text-[#00C9A7]" />
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-white tracking-tight">QR Code</h1>
        <p className="text-sm text-white/40 mt-1">Partagez votre lien de collecte d'avis</p>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Preview & Actions (60%) */}
        <div className="col-span-7 space-y-4">
          {/* QR Preview Card */}
          <Card glowColor={`${settings.color}15`}>
            <div className="flex flex-col items-center">
              {/* QR Code */}
              <div
                ref={qrRef}
                className="relative p-6 rounded-2xl bg-white mb-5"
                style={{ boxShadow: `0 0 60px -20px ${settings.color}40` }}
              >
                {/* Canvas for PNG download (hidden) */}
                <div className="hidden">
                  <QRCodeCanvas
                    value={feedbackUrl}
                    size={300}
                    level="H"
                    fgColor={settings.color}
                    bgColor="#FFFFFF"
                    includeMargin={false}
                  />
                </div>
                {/* SVG for display */}
                <QRCodeSVG
                  value={feedbackUrl}
                  size={200}
                  level="H"
                  fgColor={settings.color}
                  bgColor="#FFFFFF"
                  includeMargin={false}
                />
              </div>

              {/* Short Link */}
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] mb-5">
                <span className="text-sm font-mono text-white/70">{shortUrl}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-white/[0.04] text-white/70 border border-white/[0.08] hover:bg-white/[0.08] transition-all"
                >
                  {copied ? (
                    <>
                      <Check size={16} className="text-emerald-400" />
                      <span className="text-emerald-400">Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copier le lien
                    </>
                  )}
                </motion.button>

                {/* Download Dropdown */}
                <div className="relative" ref={downloadMenuRef}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                    className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-semibold bg-[#00C9A7] text-black hover:bg-[#00E4BC] transition-all"
                  >
                    <Download size={16} />
                    Télécharger
                    <ChevronDown size={14} className={`transition-transform ${showDownloadMenu ? "rotate-180" : ""}`} />
                  </motion.button>

                  <AnimatePresence>
                    {showDownloadMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl bg-[#141415] border border-white/[0.1] shadow-2xl z-50"
                      >
                        <button
                          onClick={downloadPNG}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/[0.06] transition-all"
                        >
                          <FileImage size={16} className="text-blue-400" />
                          PNG (Image)
                        </button>
                        <button
                          onClick={downloadSVG}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/[0.06] transition-all"
                        >
                          <FileCode size={16} className="text-purple-400" />
                          SVG (Vectoriel)
                        </button>
                        <button
                          onClick={() => setShowDownloadMenu(false)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/[0.06] transition-all"
                        >
                          <FileText size={16} className="text-orange-400" />
                          PDF (Impression)
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.a
                  href={feedbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-medium bg-white/[0.04] text-white/70 border border-white/[0.08] hover:bg-white/[0.08] transition-all"
                >
                  <ExternalLink size={16} />
                </motion.a>
              </div>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <StatCard
                icon={Scan}
                label="Scans ce mois"
                value="1,247"
                trend="+23%"
              />
            </Card>
            <Card>
              <StatCard
                icon={TrendingUp}
                label="Taux de complétion"
                value="34%"
                trend="+5%"
              />
            </Card>
          </div>
        </div>

        {/* Right Column - Customization (40%) */}
        <div className="col-span-5">
          <Card className="h-full">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-xl bg-white/[0.04]">
                <Settings2 size={16} className="text-white/40" />
              </div>
              <span className="text-sm font-semibold text-white">Personnalisation</span>
            </div>

            <div className="space-y-6">
              {/* Color Picker */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-white/50 uppercase tracking-wider mb-3">
                  <Palette size={12} />
                  Couleur
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {presetColors.map((color) => (
                    <motion.button
                      key={color}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSettings(s => ({ ...s, color }))}
                      className={`w-8 h-8 rounded-lg transition-all ${
                        settings.color === color
                          ? "ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0b]"
                          : "hover:ring-1 hover:ring-white/30"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <div className="relative">
                    <input
                      type="color"
                      value={settings.color}
                      onChange={(e) => setSettings(s => ({ ...s, color: e.target.value }))}
                      className="absolute inset-0 w-8 h-8 opacity-0 cursor-pointer"
                    />
                    <div
                      className="w-8 h-8 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-white/40 transition-all"
                    >
                      <span className="text-[10px] text-white/40">+</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Style */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-white/50 uppercase tracking-wider mb-3">
                  <Grid3X3 size={12} />
                  Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "squares", label: "Carré", icon: Square },
                    { id: "rounded", label: "Arrondi", icon: Circle },
                    { id: "dots", label: "Points", icon: Grid3X3 },
                  ].map((styleOption) => (
                    <motion.button
                      key={styleOption.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSettings(s => ({ ...s, style: styleOption.id as QRStyle }))}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                        settings.style === styleOption.id
                          ? "bg-white/[0.08] border-white/[0.15] text-white"
                          : "bg-white/[0.02] border-white/[0.06] text-white/50 hover:bg-white/[0.04]"
                      }`}
                    >
                      <styleOption.icon size={18} />
                      <span className="text-[11px] font-medium">{styleOption.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Logo Toggle */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-white/50 uppercase tracking-wider mb-3">
                  <Image size={12} />
                  Logo au centre
                </label>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-sm text-white/60">Afficher le logo</span>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSettings(s => ({ ...s, showLogo: !s.showLogo }))}
                    className={`relative w-11 h-6 rounded-full transition-all ${
                      settings.showLogo ? "bg-[#00C9A7]" : "bg-white/10"
                    }`}
                  >
                    <motion.div
                      animate={{ x: settings.showLogo ? 20 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
                    />
                  </motion.button>
                </div>

                <AnimatePresence>
                  {settings.showLogo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3"
                    >
                      <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-white/[0.1] hover:border-white/[0.2] transition-all cursor-pointer">
                        <div className="p-2 rounded-lg bg-white/[0.04]">
                          <Upload size={18} className="text-white/40" />
                        </div>
                        <div>
                          <p className="text-sm text-white/70">Importer un logo</p>
                          <p className="text-[11px] text-white/30">PNG, JPG (max 1MB)</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Marketing Templates Section */}
      <motion.div variants={item}>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-white/[0.04]">
            <FileText size={16} className="text-white/40" />
          </div>
          <span className="text-sm font-semibold text-white">Prêt à imprimer</span>
          <span className="text-xs text-white/30 ml-2">Templates marketing</span>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {marketingTemplates.map((template) => (
            <motion.div
              key={template.id}
              whileHover={{ y: -4, scale: 1.01 }}
              className="group relative p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all cursor-pointer"
            >
              {/* Preview Area */}
              <div className="aspect-[3/4] rounded-xl overflow-hidden mb-3 border border-white/[0.06]">
                {template.preview}
              </div>

              {/* Info */}
              <h3 className="text-sm font-semibold text-white mb-0.5">{template.name}</h3>
              <p className="text-[11px] text-white/40">{template.description}</p>
              <p className="text-[10px] text-white/25 mt-0.5">{template.size}</p>

              {/* Download Button - Appears on hover */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="absolute inset-x-3 bottom-3 py-2.5 rounded-xl text-xs font-semibold bg-[#00C9A7]/90 text-black opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Download size={14} />
                Télécharger PDF
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
