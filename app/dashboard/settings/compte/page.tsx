"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Upload,
  Camera,
  Check,
  Loader2,
  ChevronDown,
  User,
  X,
  Eye,
  EyeOff,
} from "lucide-react"

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
// DATA
// ============================================
const languages = [
  { code: "fr", label: "Francais" },
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
function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  disabled = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  disabled?: boolean
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white/60">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm
          focus:outline-none focus:border-[#00C9A7]/50 focus:ring-1 focus:ring-[#00C9A7]/30 transition-all
          placeholder:text-white/20 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      />
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
          <span>{selected?.label || "Selectionner..."}</span>
          <ChevronDown size={16} className={`text-white/40 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

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
      </div>
    </div>
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
          Sauvegarde !
        </>
      ) : (
        "Sauvegarder"
      )}
    </motion.button>
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

// ============================================
// MAIN PAGE
// ============================================
export default function ComptePage() {
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
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-white/[0.04]">
            <User size={20} className="text-[#00C9A7]" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Compte</h1>
        </div>
        <p className="text-sm text-white/40">Gerez vos informations personnelles et preferences</p>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-2xl"
      >
        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
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
                label="Prenom"
                value={firstName}
                onChange={setFirstName}
                placeholder="Votre prenom"
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
        </div>
      </motion.div>

      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <PasswordModal onClose={() => setShowPasswordModal(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
