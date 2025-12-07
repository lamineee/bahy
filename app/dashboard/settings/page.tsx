"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Building2,
  User,
  Bell,
  Puzzle,
  CreditCard,
  Upload,
  Camera,
  Check,
  X,
  ExternalLink,
  Loader2,
  Eye,
  EyeOff,
  ChevronDown,
  Globe,
  Clock,
  FileText,
  Download,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Zap,
} from "lucide-react"

// ============================================
// TYPES
// ============================================
type TabId = "etablissement" | "compte" | "notifications" | "integrations" | "facturation"

interface NotificationSetting {
  id: string
  label: string
  description: string
  enabled: boolean
}

interface Integration {
  id: string
  name: string
  icon: string
  connected: boolean
  lastSync?: string
  comingSoon?: boolean
}

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

const fadeIn = {
  hidden: { opacity: 0, x: 10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, x: -10, transition: { duration: 0.15 } }
}

// ============================================
// TABS DATA
// ============================================
const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "etablissement", label: "Établissement", icon: Building2 },
  { id: "compte", label: "Compte", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "integrations", label: "Intégrations", icon: Puzzle },
  { id: "facturation", label: "Facturation", icon: CreditCard },
]

const businessTypes = [
  "Restaurant",
  "Hôtel",
  "Salon de coiffure",
  "Commerce",
  "Autre"
]

const languages = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" }
]

const timezones = [
  { code: "Europe/Paris", label: "Paris (UTC+1)" },
  { code: "Europe/London", label: "Londres (UTC+0)" },
  { code: "America/New_York", label: "New York (UTC-5)" },
  { code: "America/Los_Angeles", label: "Los Angeles (UTC-8)" },
]

// ============================================
// COMPONENTS
// ============================================
function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-white mb-1">{title}</h2>
      <p className="text-sm text-white/40">{description}</p>
    </div>
  )
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  disabled = false,
  suffix,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  disabled?: boolean
  suffix?: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white/60">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm
            focus:outline-none focus:border-[#00C9A7]/50 focus:ring-1 focus:ring-[#00C9A7]/30 transition-all
            placeholder:text-white/20 ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${suffix ? "pr-24" : ""}`}
        />
        {suffix && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {suffix}
          </div>
        )}
      </div>
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const selected = options.find(o => o.value === value)

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white/60">{label}</label>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm
            focus:outline-none focus:border-[#00C9A7]/50 focus:ring-1 focus:ring-[#00C9A7]/30 transition-all
            flex items-center justify-between"
        >
          <span>{selected?.label || "Sélectionner..."}</span>
          <ChevronDown size={16} className={`text-white/40 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-2 py-2 rounded-xl bg-[#1a1a1b] border border-white/[0.08] shadow-xl"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                    value === option.value
                      ? "text-[#00C9A7] bg-[#00C9A7]/10"
                      : "text-white/70 hover:bg-white/[0.04]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

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

function ImageUpload({
  currentImage,
  onImageChange,
  shape = "square",
  size = "large"
}: {
  currentImage?: string
  onImageChange: (file: File) => void
  shape?: "square" | "circle"
  size?: "small" | "large"
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(currentImage || null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      onImageChange(file)
    }
  }

  const dimensions = size === "large" ? "w-32 h-32" : "w-20 h-20"
  const iconSize = size === "large" ? 32 : 20

  return (
    <div className="flex items-center gap-4">
      <motion.div
        whileHover={{ scale: 1.02 }}
        onClick={() => inputRef.current?.click()}
        className={`${dimensions} ${shape === "circle" ? "rounded-full" : "rounded-2xl"}
          bg-white/[0.04] border-2 border-dashed border-white/[0.1]
          flex items-center justify-center cursor-pointer group overflow-hidden
          hover:border-[#00C9A7]/50 transition-all relative`}
      >
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera size={iconSize} className="text-white" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-white/30 group-hover:text-white/50 transition-colors">
            <Upload size={iconSize} />
            {size === "large" && <span className="text-xs">Upload</span>}
          </div>
        )}
      </motion.div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      {size === "large" && (
        <div className="text-sm text-white/40">
          <p>Format: JPG, PNG</p>
          <p>Taille max: 2MB</p>
        </div>
      )}
    </div>
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
          Sauvegardé !
        </>
      ) : (
        "Sauvegarder"
      )}
    </motion.button>
  )
}

// ============================================
// SECTION COMPONENTS
// ============================================
function EtablissementSection() {
  const [logo, setLogo] = useState<File | null>(null)
  const [name, setName] = useState("Mon Restaurant")
  const [type, setType] = useState("Restaurant")
  const [address, setAddress] = useState("123 Rue de la Paix, 75001 Paris")
  const [phone, setPhone] = useState("+33 1 23 45 67 89")
  const [website, setWebsite] = useState("https://mon-restaurant.fr")
  const [googleLink, setGoogleLink] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleVerify = () => {
    if (!googleLink) return
    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
      setIsVerified(true)
    }, 1500)
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
    <motion.div variants={container} initial="hidden" animate="show">
      <SectionHeader
        title="Établissement"
        description="Informations de votre établissement affichées sur vos réponses"
      />

      <motion.div variants={item} className="space-y-6">
        {/* Logo */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/60">Logo / Photo</label>
          <ImageUpload
            onImageChange={setLogo}
            shape="square"
            size="large"
          />
        </div>

        {/* Name */}
        <InputField
          label="Nom de l'établissement"
          value={name}
          onChange={setName}
          placeholder="Nom de votre établissement"
        />

        {/* Type */}
        <SelectField
          label="Type d'activité"
          value={type}
          onChange={setType}
          options={businessTypes.map(t => ({ value: t, label: t }))}
        />

        {/* Address */}
        <InputField
          label="Adresse complète"
          value={address}
          onChange={setAddress}
          placeholder="Adresse de votre établissement"
        />

        {/* Phone */}
        <InputField
          label="Téléphone"
          value={phone}
          onChange={setPhone}
          type="tel"
          placeholder="+33 1 23 45 67 89"
        />

        {/* Website */}
        <InputField
          label="Site web"
          value={website}
          onChange={setWebsite}
          type="url"
          placeholder="https://votre-site.fr"
        />

        {/* Google Business Profile */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/60">Lien Google Business Profile</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="url"
                value={googleLink}
                onChange={(e) => {
                  setGoogleLink(e.target.value)
                  setIsVerified(false)
                }}
                placeholder="https://g.page/votre-etablissement"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm
                  focus:outline-none focus:border-[#00C9A7]/50 focus:ring-1 focus:ring-[#00C9A7]/30 transition-all
                  placeholder:text-white/20"
              />
              {isVerified && (
                <CheckCircle2 size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00C9A7]" />
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleVerify}
              disabled={isVerifying || !googleLink}
              className="px-4 py-3 rounded-xl text-sm font-medium bg-white/[0.04] border border-white/[0.08]
                text-white/70 hover:bg-white/[0.08] disabled:opacity-50 disabled:cursor-not-allowed transition-all
                flex items-center gap-2"
            >
              {isVerifying ? (
                <Loader2 size={16} className="animate-spin" />
              ) : isVerified ? (
                <Check size={16} className="text-[#00C9A7]" />
              ) : (
                <LinkIcon size={16} />
              )}
              {isVerified ? "Vérifié" : "Vérifier"}
            </motion.button>
          </div>
        </div>

        {/* Save */}
        <div className="pt-4">
          <SaveButton onClick={handleSave} isSaving={isSaving} saved={saved} />
        </div>
      </motion.div>
    </motion.div>
  )
}

function CompteSection() {
  const [avatar, setAvatar] = useState<File | null>(null)
  const [firstName, setFirstName] = useState("Jean")
  const [lastName, setLastName] = useState("Dupont")
  const [email] = useState("jean.dupont@email.com")
  const [language, setLanguage] = useState("fr")
  const [timezone, setTimezone] = useState("Europe/Paris")
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 1000)
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <SectionHeader
        title="Compte"
        description="Gérez vos informations personnelles et préférences"
      />

      <motion.div variants={item} className="space-y-6">
        {/* Avatar */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/60">Avatar</label>
          <ImageUpload
            onImageChange={setAvatar}
            shape="circle"
            size="small"
          />
        </div>

        {/* Name fields */}
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Prénom"
            value={firstName}
            onChange={setFirstName}
            placeholder="Votre prénom"
          />
          <InputField
            label="Nom"
            value={lastName}
            onChange={setLastName}
            placeholder="Votre nom"
          />
        </div>

        {/* Email */}
        <InputField
          label="Email"
          value={email}
          onChange={() => {}}
          type="email"
          disabled={true}
        />

        {/* Password */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/60">Mot de passe</label>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setShowPasswordModal(true)}
            className="px-4 py-3 rounded-xl text-sm font-medium bg-white/[0.04] border border-white/[0.08]
              text-white/70 hover:bg-white/[0.08] transition-all"
          >
            Changer le mot de passe
          </motion.button>
        </div>

        {/* Language */}
        <SelectField
          label="Langue"
          value={language}
          onChange={setLanguage}
          options={languages.map(l => ({ value: l.code, label: l.label }))}
        />

        {/* Timezone */}
        <SelectField
          label="Fuseau horaire"
          value={timezone}
          onChange={setTimezone}
          options={timezones.map(t => ({ value: t.code, label: t.label }))}
        />

        {/* Save */}
        <div className="pt-4">
          <SaveButton onClick={handleSave} isSaving={isSaving} saved={saved} />
        </div>
      </motion.div>

      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <PasswordModal onClose={() => setShowPasswordModal(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function PasswordModal({ onClose }: { onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) return
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      onClose()
    }, 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-md p-6 rounded-2xl bg-[#0c0c0d] border border-white/[0.08] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Changer le mot de passe</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">Mot de passe actuel</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm
                  focus:outline-none focus:border-[#00C9A7]/50 focus:ring-1 focus:ring-[#00C9A7]/30 transition-all"
              />
              <button
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">Nouveau mot de passe</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm
                  focus:outline-none focus:border-[#00C9A7]/50 focus:ring-1 focus:ring-[#00C9A7]/30 transition-all"
              />
              <button
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border text-white text-sm
                focus:outline-none transition-all ${
                  confirmPassword && newPassword !== confirmPassword
                    ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/30"
                    : "border-white/[0.08] focus:border-[#00C9A7]/50 focus:ring-[#00C9A7]/30"
                }`}
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-400">Les mots de passe ne correspondent pas</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-medium bg-white/[0.04] text-white/70
                border border-white/[0.08] hover:bg-white/[0.08] transition-all"
            >
              Annuler
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={!currentPassword || !newPassword || newPassword !== confirmPassword || isSaving}
              className="flex-1 py-3 rounded-xl text-sm font-semibold bg-[#00C9A7] text-black
                hover:bg-[#00E4BC] disabled:opacity-50 disabled:cursor-not-allowed transition-all
                flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : "Confirmer"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function NotificationsSection() {
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: "new-feedback",
      label: "Nouveau feedback reçu",
      description: "Recevoir un email à chaque nouvel avis",
      enabled: true
    },
    {
      id: "negative-only",
      label: "Feedbacks négatifs uniquement",
      description: "Alertes seulement pour les avis 1-3 étoiles",
      enabled: false
    },
    {
      id: "weekly-report",
      label: "Rapport hebdomadaire",
      description: "Résumé de vos performances chaque lundi",
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
    <motion.div variants={container} initial="hidden" animate="show">
      <SectionHeader
        title="Notifications"
        description="Choisissez comment et quand recevoir des alertes"
      />

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
    </motion.div>
  )
}

function IntegrationsSection() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "google",
      name: "Google Business Profile",
      icon: "🔍",
      connected: true,
      lastSync: "il y a 2 heures"
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: "📘",
      connected: false,
      comingSoon: true
    },
    {
      id: "tripadvisor",
      name: "TripAdvisor",
      icon: "🦉",
      connected: false,
      comingSoon: true
    },
    {
      id: "zapier",
      name: "Zapier",
      icon: "⚡",
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
    <motion.div variants={container} initial="hidden" animate="show">
      <SectionHeader
        title="Intégrations"
        description="Connectez vos plateformes d'avis pour centraliser la gestion"
      />

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
              <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center text-2xl">
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
                      Connecté
                    </span>
                  )}
                </div>
                {integration.lastSync && integration.connected && (
                  <p className="text-xs text-white/40 mt-0.5">Dernière sync : {integration.lastSync}</p>
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
                {integration.connected ? "Déconnecter" : "Connecter"}
              </motion.button>
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

function FacturationSection() {
  const [invoices] = useState<Invoice[]>([
    { id: "INV-001", date: "1 décembre 2024", amount: "49€", status: "paid", pdfUrl: "#" },
    { id: "INV-002", date: "1 novembre 2024", amount: "49€", status: "paid", pdfUrl: "#" },
    { id: "INV-003", date: "1 octobre 2024", amount: "49€", status: "paid", pdfUrl: "#" },
  ])

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <SectionHeader
        title="Facturation"
        description="Gérez votre abonnement et consultez vos factures"
      />

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
              <p className="text-white/40 text-sm">49€/mois</p>
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
            Gérer l'abonnement
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
                    {invoice.status === "paid" ? "Payée" : "En attente"}
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
              Voir tout l'historique →
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============================================
// MAIN PAGE
// ============================================
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("etablissement")

  const renderSection = () => {
    switch (activeTab) {
      case "etablissement":
        return <EtablissementSection />
      case "compte":
        return <CompteSection />
      case "notifications":
        return <NotificationsSection />
      case "integrations":
        return <IntegrationsSection />
      case "facturation":
        return <FacturationSection />
      default:
        return null
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white tracking-tight">Paramètres</h1>
        <p className="text-sm text-white/40 mt-1">Gérez votre compte et vos préférences</p>
      </motion.div>

      {/* Content with sidebar navigation */}
      <div className="flex gap-8">
        {/* Sidebar Navigation */}
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-52 flex-shrink-0"
        >
          <div className="sticky top-8 space-y-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                    isActive
                      ? "text-white bg-white/[0.06]"
                      : "text-white/40 hover:text-white/70 hover:bg-white/[0.02]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeSettingsTab"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-[#00C9A7] rounded-full"
                    />
                  )}
                  <tab.icon size={18} className={isActive ? "text-white/80" : "text-white/30"} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </motion.nav>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 max-w-2xl"
        >
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={fadeIn}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
