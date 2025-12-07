"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import {
  Upload,
  Camera,
  Check,
  Loader2,
  LinkIcon,
  CheckCircle2,
  ChevronDown,
  Building2,
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
const businessTypes = [
  "Restaurant",
  "Hotel",
  "Salon de coiffure",
  "Commerce",
  "Autre"
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
export default function EtablissementPage() {
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
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-white/[0.04]">
            <Building2 size={20} className="text-[#00C9A7]" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Etablissement</h1>
        </div>
        <p className="text-sm text-white/40">Informations de votre etablissement affichees sur vos reponses</p>
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
              label="Nom de l'etablissement"
              value={name}
              onChange={setName}
              placeholder="Nom de votre etablissement"
            />

            {/* Type */}
            <SelectField
              label="Type d'activite"
              value={type}
              onChange={setType}
              options={businessTypes.map(t => ({ value: t, label: t }))}
            />

            {/* Address */}
            <InputField
              label="Adresse complete"
              value={address}
              onChange={setAddress}
              placeholder="Adresse de votre etablissement"
            />

            {/* Phone */}
            <InputField
              label="Telephone"
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
                  {isVerified ? "Verifie" : "Verifier"}
                </motion.button>
              </div>
            </div>

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
