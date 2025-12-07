"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bot,
  Sparkles,
  Sliders,
  MessageSquare,
  Star,
  Plus,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Save,
  Zap,
  TestTube,
  ListFilter,
  User,
  ThumbsUp,
  Gift,
  Clock,
  X,
  AlertCircle,
  Loader2,
} from "lucide-react"

// ============================================
// TYPES
// ============================================
interface StyleSettings {
  tone: number // 0-100 (formel to décontracté)
  length: number // 0-100 (court to détaillé)
  includeFirstName: boolean
  thankForReview: boolean
  inviteToReturn: boolean
  offerGesture: boolean
}

interface RatingTemplate {
  rating: number
  template: string
  defaultTemplate: string
}

interface CustomRule {
  id: string
  trigger: string
  response: string
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
// DEFAULT TEMPLATES
// ============================================
const defaultTemplates: RatingTemplate[] = [
  {
    rating: 5,
    template: "Merci beaucoup {prenom} pour ce magnifique avis 5 étoiles ! Nous sommes ravis que votre expérience chez {etablissement} vous ait pleinement satisfait. C'est un réel plaisir de vous compter parmi nos clients. À très bientôt !",
    defaultTemplate: "Merci beaucoup {prenom} pour ce magnifique avis 5 étoiles ! Nous sommes ravis que votre expérience chez {etablissement} vous ait pleinement satisfait. C'est un réel plaisir de vous compter parmi nos clients. À très bientôt !"
  },
  {
    rating: 4,
    template: "Merci {prenom} pour votre avis positif ! Nous sommes heureux que vous ayez passé un bon moment chez {etablissement}. Nous prenons note de vos retours pour continuer à nous améliorer. Au plaisir de vous revoir !",
    defaultTemplate: "Merci {prenom} pour votre avis positif ! Nous sommes heureux que vous ayez passé un bon moment chez {etablissement}. Nous prenons note de vos retours pour continuer à nous améliorer. Au plaisir de vous revoir !"
  },
  {
    rating: 3,
    template: "Merci {prenom} pour votre retour. Nous sommes contents que certains aspects vous aient plu, mais regrettons de ne pas avoir entièrement répondu à vos attentes. Vos remarques sont précieuses et nous aideront à nous améliorer.",
    defaultTemplate: "Merci {prenom} pour votre retour. Nous sommes contents que certains aspects vous aient plu, mais regrettons de ne pas avoir entièrement répondu à vos attentes. Vos remarques sont précieuses et nous aideront à nous améliorer."
  },
  {
    rating: 2,
    template: "Merci {prenom} d'avoir pris le temps de partager votre expérience. Nous sommes sincèrement désolés que votre visite chez {etablissement} n'ait pas été à la hauteur de vos attentes. Nous prenons vos remarques très au sérieux.",
    defaultTemplate: "Merci {prenom} d'avoir pris le temps de partager votre expérience. Nous sommes sincèrement désolés que votre visite chez {etablissement} n'ait pas été à la hauteur de vos attentes. Nous prenons vos remarques très au sérieux."
  },
  {
    rating: 1,
    template: "Merci {prenom} pour votre retour. Nous sommes vraiment navrés de votre expérience décevante chez {etablissement}. Ce n'est pas le niveau de service que nous souhaitons offrir. Nous aimerions comprendre ce qui s'est passé et vous inviter à nous contacter directement.",
    defaultTemplate: "Merci {prenom} pour votre retour. Nous sommes vraiment navrés de votre expérience décevante chez {etablissement}. Ce n'est pas le niveau de service que nous souhaitons offrir. Nous aimerions comprendre ce qui s'est passé et vous inviter à nous contacter directement."
  }
]

// ============================================
// COMPONENTS
// ============================================
function Card({ children, className = "" }: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={item}
      className={`relative rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 backdrop-blur-sm ${className}`}
    >
      {children}
    </motion.div>
  )
}

function SectionHeader({ icon: Icon, title, badge }: {
  icon: React.ElementType
  title: string
  badge?: string
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="p-2.5 rounded-xl bg-white/[0.04]">
        <Icon size={18} className="text-white/50" />
      </div>
      <h2 className="text-base font-semibold text-white">{title}</h2>
      {badge && (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
          {badge}
        </span>
      )}
    </div>
  )
}

function Toggle({ enabled, onChange, size = "default" }: {
  enabled: boolean
  onChange: (value: boolean) => void
  size?: "default" | "large"
}) {
  const isLarge = size === "large"
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => onChange(!enabled)}
      className={`relative rounded-full transition-all ${
        enabled ? "bg-[#00C9A7]" : "bg-white/10"
      } ${isLarge ? "w-14 h-8" : "w-11 h-6"}`}
    >
      <motion.div
        animate={{ x: enabled ? (isLarge ? 26 : 20) : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`absolute top-1 rounded-full bg-white shadow-md ${
          isLarge ? "w-6 h-6" : "w-4 h-4"
        }`}
      />
    </motion.button>
  )
}

function Slider({ value, onChange, leftLabel, rightLabel }: {
  value: number
  onChange: (value: number) => void
  leftLabel: string
  rightLabel: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/40">{leftLabel}</span>
        <span className="text-xs text-white/40">{rightLabel}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-white/[0.06] rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[#00C9A7]
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:shadow-[#00C9A7]/30
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-[#00C9A7]
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:cursor-pointer"
          style={{
            background: `linear-gradient(to right, #00C9A7 0%, #00C9A7 ${value}%, rgba(255,255,255,0.06) ${value}%, rgba(255,255,255,0.06) 100%)`
          }}
        />
      </div>
    </div>
  )
}

function Checkbox({ checked, onChange, label, description }: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
  description?: string
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="pt-0.5">
        <motion.div
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(!checked)}
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
            checked
              ? "bg-[#00C9A7] border-[#00C9A7]"
              : "border-white/20 group-hover:border-white/40"
          }`}
        >
          {checked && <Check size={12} className="text-black" strokeWidth={3} />}
        </motion.div>
      </div>
      <div className="flex-1">
        <span className="text-sm text-white/80 group-hover:text-white transition-colors">{label}</span>
        {description && (
          <p className="text-xs text-white/40 mt-0.5">{description}</p>
        )}
      </div>
    </label>
  )
}

function StarButton({ rating, selected, onClick }: {
  rating: number
  selected: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
        selected
          ? "bg-white/[0.08] border-white/[0.15] text-white"
          : "bg-white/[0.02] border-white/[0.06] text-white/50 hover:bg-white/[0.04]"
      } border`}
    >
      <span className="text-sm font-medium">{rating}</span>
      <Star size={14} className={selected ? "text-amber-400 fill-amber-400" : "text-white/40"} />
    </motion.button>
  )
}

function VariableChip({ variable, onClick }: {
  variable: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="px-2 py-1 rounded-md text-xs font-mono bg-[#00C9A7]/10 text-[#00C9A7] hover:bg-[#00C9A7]/20 transition-all"
    >
      {variable}
    </button>
  )
}

// ============================================
// MAIN PAGE
// ============================================
export default function ReponsesIAPage() {
  // Main toggle
  const [autoResponseEnabled, setAutoResponseEnabled] = useState(true)

  // Style settings
  const [styleSettings, setStyleSettings] = useState<StyleSettings>({
    tone: 50,
    length: 50,
    includeFirstName: true,
    thankForReview: true,
    inviteToReturn: false,
    offerGesture: false
  })

  // Templates
  const [templates, setTemplates] = useState<RatingTemplate[]>(defaultTemplates)
  const [selectedRating, setSelectedRating] = useState(5)

  // Custom rules
  const [rules, setRules] = useState<CustomRule[]>([
    { id: "1", trigger: "attente", response: "Nous sommes désolés pour le temps d'attente. Nous travaillons à améliorer notre rapidité de service." },
    { id: "2", trigger: "prix", response: "Nous nous efforçons d'offrir le meilleur rapport qualité-prix possible." }
  ])
  const [showRuleModal, setShowRuleModal] = useState(false)
  const [newRule, setNewRule] = useState({ trigger: "", response: "" })
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null)

  // Test section
  const [testReview, setTestReview] = useState("")
  const [testRating, setTestRating] = useState(5)
  const [generatedResponse, setGeneratedResponse] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  // Saving
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Get current template
  const currentTemplate = templates.find(t => t.rating === selectedRating)

  // Update template
  const updateTemplate = (rating: number, newTemplate: string) => {
    setTemplates(prev => prev.map(t =>
      t.rating === rating ? { ...t, template: newTemplate } : t
    ))
  }

  // Reset template to default
  const resetTemplate = (rating: number) => {
    setTemplates(prev => prev.map(t =>
      t.rating === rating ? { ...t, template: t.defaultTemplate } : t
    ))
  }

  // Add rule
  const addRule = () => {
    if (newRule.trigger && newRule.response) {
      if (editingRuleId) {
        setRules(prev => prev.map(r =>
          r.id === editingRuleId ? { ...r, trigger: newRule.trigger, response: newRule.response } : r
        ))
        setEditingRuleId(null)
      } else {
        setRules(prev => [...prev, {
          id: Date.now().toString(),
          trigger: newRule.trigger,
          response: newRule.response
        }])
      }
      setNewRule({ trigger: "", response: "" })
      setShowRuleModal(false)
    }
  }

  // Edit rule
  const editRule = (rule: CustomRule) => {
    setNewRule({ trigger: rule.trigger, response: rule.response })
    setEditingRuleId(rule.id)
    setShowRuleModal(true)
  }

  // Delete rule
  const deleteRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id))
  }

  // Generate test response
  const generateResponse = () => {
    if (!testReview.trim()) return

    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      const template = templates.find(t => t.rating === testRating)?.template || ""
      let response = template
        .replace(/{prenom}/g, "Client")
        .replace(/{note}/g, testRating.toString())
        .replace(/{etablissement}/g, "votre établissement")

      // Apply custom rules
      rules.forEach(rule => {
        if (testReview.toLowerCase().includes(rule.trigger.toLowerCase())) {
          response += " " + rule.response
        }
      })

      setGeneratedResponse(response)
      setIsGenerating(false)
    }, 1500)
  }

  // Copy response
  const copyResponse = () => {
    navigator.clipboard.writeText(generatedResponse)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Save settings
  const saveSettings = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 1000)
  }

  // Insert variable into template
  const insertVariable = (variable: string) => {
    if (currentTemplate) {
      updateTemplate(selectedRating, currentTemplate.template + variable)
    }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-8"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">Réponses IA</h1>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-500/20 text-violet-400 border border-violet-500/30">
              BETA
            </span>
          </div>
          <p className="text-sm text-white/40 mt-1">Répondez automatiquement aux avis Google avec l'IA</p>
        </div>

        {/* Main Toggle */}
        <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Bot size={18} className={autoResponseEnabled ? "text-[#00C9A7]" : "text-white/40"} />
            <span className="text-sm font-medium text-white/70">Réponses automatiques</span>
          </div>
          <Toggle
            enabled={autoResponseEnabled}
            onChange={setAutoResponseEnabled}
            size="large"
          />
        </div>
      </motion.div>

      {/* Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Settings */}
        <div className="col-span-7 space-y-6">
          {/* Section 1 - Ton & Style */}
          <Card>
            <SectionHeader icon={Sliders} title="Ton & Style" />

            <div className="space-y-6">
              {/* Sliders */}
              <div className="space-y-5">
                <div>
                  <label className="text-sm text-white/60 mb-3 block">Ton de la réponse</label>
                  <Slider
                    value={styleSettings.tone}
                    onChange={(v) => setStyleSettings(s => ({ ...s, tone: v }))}
                    leftLabel="Formel"
                    rightLabel="Décontracté"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/60 mb-3 block">Longueur de la réponse</label>
                  <Slider
                    value={styleSettings.length}
                    onChange={(v) => setStyleSettings(s => ({ ...s, length: v }))}
                    leftLabel="Court"
                    rightLabel="Détaillé"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/[0.06]" />

              {/* Checkboxes */}
              <div className="grid grid-cols-2 gap-4">
                <Checkbox
                  checked={styleSettings.includeFirstName}
                  onChange={(v) => setStyleSettings(s => ({ ...s, includeFirstName: v }))}
                  label="Inclure le prénom du client"
                />
                <Checkbox
                  checked={styleSettings.thankForReview}
                  onChange={(v) => setStyleSettings(s => ({ ...s, thankForReview: v }))}
                  label="Remercier pour l'avis"
                />
                <Checkbox
                  checked={styleSettings.inviteToReturn}
                  onChange={(v) => setStyleSettings(s => ({ ...s, inviteToReturn: v }))}
                  label="Proposer de revenir"
                  description="Pour les avis positifs"
                />
                <Checkbox
                  checked={styleSettings.offerGesture}
                  onChange={(v) => setStyleSettings(s => ({ ...s, offerGesture: v }))}
                  label="Proposer un geste commercial"
                  description="Pour les avis négatifs"
                />
              </div>
            </div>
          </Card>

          {/* Section 2 - Templates par note */}
          <Card>
            <SectionHeader icon={MessageSquare} title="Templates par note" />

            {/* Rating Tabs */}
            <div className="flex items-center gap-2 mb-5">
              {[5, 4, 3, 2, 1].map((rating) => (
                <StarButton
                  key={rating}
                  rating={rating}
                  selected={selectedRating === rating}
                  onClick={() => setSelectedRating(rating)}
                />
              ))}
            </div>

            {/* Template Editor */}
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={currentTemplate?.template || ""}
                  onChange={(e) => updateTemplate(selectedRating, e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm resize-none focus:outline-none focus:border-[#00C9A7]/50 focus:ring-1 focus:ring-[#00C9A7]/30 transition-all"
                  placeholder="Écrivez votre template de réponse..."
                />
              </div>

              {/* Variables & Reset */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/40">Variables :</span>
                  <VariableChip variable="{prenom}" onClick={() => insertVariable("{prenom}")} />
                  <VariableChip variable="{note}" onClick={() => insertVariable("{note}")} />
                  <VariableChip variable="{etablissement}" onClick={() => insertVariable("{etablissement}")} />
                </div>
                <button
                  onClick={() => resetTemplate(selectedRating)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/[0.04] transition-all"
                >
                  <RefreshCw size={12} />
                  Réinitialiser
                </button>
              </div>
            </div>
          </Card>

          {/* Section 3 - Règles personnalisées */}
          <Card>
            <SectionHeader icon={ListFilter} title="Règles personnalisées" />

            <div className="space-y-3">
              {/* Rules List */}
              {rules.map((rule) => (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="group flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-white/40">Si l'avis contient</span>
                      <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-amber-500/20 text-amber-400">
                        "{rule.trigger}"
                      </span>
                    </div>
                    <p className="text-sm text-white/70 line-clamp-2">{rule.response}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => editRule(rule)}
                      className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
                    >
                      <Sliders size={14} />
                    </button>
                    <button
                      onClick={() => deleteRule(rule.id)}
                      className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}

              {/* Add Rule Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  setNewRule({ trigger: "", response: "" })
                  setEditingRuleId(null)
                  setShowRuleModal(true)
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-white/[0.08] text-white/50 hover:border-white/[0.15] hover:text-white/70 transition-all"
              >
                <Plus size={16} />
                <span className="text-sm font-medium">Ajouter une règle</span>
              </motion.button>
            </div>
          </Card>
        </div>

        {/* Right Column - Test & Preview */}
        <div className="col-span-5 space-y-6">
          {/* Test Section */}
          <Card>
            <SectionHeader icon={TestTube} title="Tester une réponse" />

            <div className="space-y-4">
              {/* Test Review Input */}
              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">
                  Avis de test
                </label>
                <textarea
                  value={testReview}
                  onChange={(e) => setTestReview(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm resize-none focus:outline-none focus:border-[#00C9A7]/50 focus:ring-1 focus:ring-[#00C9A7]/30 transition-all"
                  placeholder="Collez un avis pour tester la génération..."
                />
              </div>

              {/* Test Rating */}
              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">
                  Note de l'avis
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <motion.button
                      key={rating}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setTestRating(rating)}
                      className="p-1"
                    >
                      <Star
                        size={24}
                        className={`transition-colors ${
                          rating <= testRating
                            ? "text-amber-400 fill-amber-400"
                            : "text-white/20"
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateResponse}
                disabled={isGenerating || !testReview.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-[#00C9A7] text-black hover:bg-[#00E4BC] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Générer la réponse
                  </>
                )}
              </motion.button>

              {/* Generated Response */}
              <AnimatePresence>
                {generatedResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    <div className="h-px bg-white/[0.06]" />

                    <div>
                      <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">
                        Réponse générée
                      </label>
                      <div className="p-4 rounded-xl bg-[#00C9A7]/5 border border-[#00C9A7]/20">
                        <p className="text-sm text-white/80 leading-relaxed">{generatedResponse}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={copyResponse}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-white/[0.04] text-white/70 border border-white/[0.08] hover:bg-white/[0.08] transition-all"
                      >
                        {copied ? (
                          <>
                            <Check size={14} className="text-[#00C9A7]" />
                            <span className="text-[#00C9A7]">Copié !</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            Copier
                          </>
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={generateResponse}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-white/[0.04] text-white/70 border border-white/[0.08] hover:bg-white/[0.08] transition-all"
                      >
                        <RefreshCw size={14} />
                        Régénérer
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>

          {/* Preview Card */}
          <Card>
            <SectionHeader icon={Zap} title="Aperçu en direct" />

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00C9A7] to-[#00A389] flex items-center justify-center">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">Votre établissement</span>
                    <span className="text-[10px] text-white/30">• Propriétaire</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={10}
                        className={i <= selectedRating ? "text-amber-400 fill-amber-400" : "text-white/20"}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-xs text-white/60 leading-relaxed">
                {currentTemplate?.template
                  .replace(/{prenom}/g, "Marie")
                  .replace(/{note}/g, selectedRating.toString())
                  .replace(/{etablissement}/g, "notre restaurant") || "Sélectionnez un template..."}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2 text-[11px] text-white/30">
              <AlertCircle size={12} />
              <span>Aperçu avec les variables remplacées</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <motion.div
        variants={item}
        className="flex flex-col items-center gap-4 pt-6 border-t border-white/[0.06]"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={saveSettings}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold bg-[#00C9A7] text-black hover:bg-[#00E4BC] disabled:opacity-70 transition-all shadow-lg shadow-[#00C9A7]/20"
        >
          {isSaving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sauvegarde...
            </>
          ) : saved ? (
            <>
              <Check size={16} />
              Sauvegardé !
            </>
          ) : (
            <>
              <Save size={16} />
              Sauvegarder
            </>
          )}
        </motion.button>

        <p className="text-xs text-white/30 flex items-center gap-2">
          <Bot size={14} />
          Les réponses sont générées par IA et envoyées automatiquement sur Google
        </p>
      </motion.div>

      {/* Add/Edit Rule Modal */}
      <AnimatePresence>
        {showRuleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowRuleModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg p-6 rounded-2xl bg-[#0c0c0d] border border-white/[0.08] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/[0.04]">
                    <ListFilter size={18} className="text-white/50" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {editingRuleId ? "Modifier la règle" : "Nouvelle règle"}
                  </h3>
                </div>
                <button
                  onClick={() => setShowRuleModal(false)}
                  className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">
                    Si l'avis contient...
                  </label>
                  <input
                    type="text"
                    value={newRule.trigger}
                    onChange={(e) => setNewRule(r => ({ ...r, trigger: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#00C9A7]/50 focus:ring-1 focus:ring-[#00C9A7]/30 transition-all"
                    placeholder="ex: attente, prix, service..."
                  />
                </div>

                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">
                    Alors ajouter à la réponse...
                  </label>
                  <textarea
                    value={newRule.response}
                    onChange={(e) => setNewRule(r => ({ ...r, response: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm resize-none focus:outline-none focus:border-[#00C9A7]/50 focus:ring-1 focus:ring-[#00C9A7]/30 transition-all"
                    placeholder="ex: Nous sommes désolés pour le temps d'attente..."
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setShowRuleModal(false)}
                    className="flex-1 py-3 rounded-xl text-sm font-medium bg-white/[0.04] text-white/70 border border-white/[0.08] hover:bg-white/[0.08] transition-all"
                  >
                    Annuler
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addRule}
                    disabled={!newRule.trigger || !newRule.response}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold bg-[#00C9A7] text-black hover:bg-[#00E4BC] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {editingRuleId ? "Modifier" : "Ajouter la règle"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
