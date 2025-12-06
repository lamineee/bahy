"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Save, Sparkles, Bell, MessageSquare } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface AIConfig {
  tonalite: string
  infos_custom: string
  auto_reply_5: boolean
  auto_reply_4: boolean
  auto_reply_3: boolean
  auto_reply_2: boolean
  auto_reply_1: boolean
  notify_1: boolean
  notify_2: boolean
  notify_email: string
}

const defaultConfig: AIConfig = {
  tonalite: "professionnel",
  infos_custom: "",
  auto_reply_5: true,
  auto_reply_4: true,
  auto_reply_3: true,
  auto_reply_2: false,
  auto_reply_1: false,
  notify_1: true,
  notify_2: true,
  notify_email: "",
}

export default function AIResponsesPage() {
  const [config, setConfig] = useState<AIConfig>(defaultConfig)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [etablissementId, setEtablissementId] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data: etab } = await supabase
        .from("etablissements")
        .select("id")
        .eq("client_id", user.id)
        .single()

      if (etab) {
        setEtablissementId(etab.id)

        const { data: configData } = await supabase
          .from("ai_config")
          .select("*")
          .eq("etablissement_id", etab.id)
          .single()

        if (configData) {
          setConfig({
            tonalite: configData.tonalite || "professionnel",
            infos_custom: configData.infos_custom || "",
            auto_reply_5: configData.auto_reply_5,
            auto_reply_4: configData.auto_reply_4,
            auto_reply_3: configData.auto_reply_3,
            auto_reply_2: configData.auto_reply_2,
            auto_reply_1: configData.auto_reply_1,
            notify_1: configData.notify_1,
            notify_2: configData.notify_2,
            notify_email: configData.notify_email || "",
          })
        }
      }
    }
    setLoading(false)
  }

  const saveConfig = async () => {
    if (!etablissementId) return

    setSaving(true)

    const { data: existing } = await supabase
      .from("ai_config")
      .select("id")
      .eq("etablissement_id", etablissementId)
      .single()

    if (existing) {
      await supabase
        .from("ai_config")
        .update({
          tonalite: config.tonalite,
          infos_custom: config.infos_custom,
          auto_reply_5: config.auto_reply_5,
          auto_reply_4: config.auto_reply_4,
          auto_reply_3: config.auto_reply_3,
          auto_reply_2: config.auto_reply_2,
          auto_reply_1: config.auto_reply_1,
          notify_1: config.notify_1,
          notify_2: config.notify_2,
          notify_email: config.notify_email,
        })
        .eq("etablissement_id", etablissementId)
    } else {
      await supabase
        .from("ai_config")
        .insert({
          etablissement_id: etablissementId,
          ...config,
        })
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) {
    return (
      <div className="p-6">
        <p>Chargement...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Réponses IA</h1>
        <p className="text-muted-foreground mt-1">
          Configurez comment l'IA répond à vos avis Google
        </p>
      </div>

      <div className="grid gap-6">
        {/* Tonalité */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="text-primary" size={24} />
            <h2 className="text-lg font-semibold">Tonalité des réponses</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["professionnel", "chaleureux", "decontracte", "formel"].map((tone) => (
              <button
                key={tone}
                onClick={() => setConfig({ ...config, tonalite: tone })}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  config.tonalite === tone
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted border-border"
                }`}
              >
                {tone.charAt(0).toUpperCase() + tone.slice(1)}
              </button>
            ))}
          </div>
        </Card>

        {/* Infos custom */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Informations pour l'IA</h2>
          <p className="text-sm text-muted-foreground mb-3">
            Ajoutez des infos que l'IA doit connaître (nom du commerce, spécialités, horaires, etc.)
          </p>
          <Textarea
            placeholder="Ex: Notre auto-école s'appelle 'Permis Express'. Nous sommes spécialisés dans la conduite accompagnée. Nos horaires sont 9h-19h du lundi au samedi."
            value={config.infos_custom}
            onChange={(e) => setConfig({ ...config, infos_custom: e.target.value })}
            className="min-h-[100px]"
          />
        </Card>

        {/* Réponses auto par note */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="text-primary" size={24} />
            <h2 className="text-lg font-semibold">Réponses automatiques</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Choisissez pour quelles notes l'IA répond automatiquement
          </p>
          
          <div className="space-y-4">
            {[5, 4, 3, 2, 1].map((note) => (
              <div key={note} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{"⭐".repeat(note)}</span>
                  <span className="text-sm text-muted-foreground">
                    {note >= 4 ? "Avis positif" : note === 3 ? "Avis neutre" : "Avis négatif"}
                  </span>
                </div>
                <Switch
                  checked={config[`auto_reply_${note}` as keyof AIConfig] as boolean}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, [`auto_reply_${note}`]: checked })
                  }
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="text-primary" size={24} />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Recevez une alerte pour les avis négatifs
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⭐</span>
                <span className="text-sm">M'alerter pour les avis 1 étoile</span>
              </div>
              <Switch
                checked={config.notify_1}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, notify_1: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⭐⭐</span>
                <span className="text-sm">M'alerter pour les avis 2 étoiles</span>
              </div>
              <Switch
                checked={config.notify_2}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, notify_2: checked })
                }
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Email de notification</label>
            <Input
              type="email"
              placeholder="votre@email.com"
              value={config.notify_email}
              onChange={(e) => setConfig({ ...config, notify_email: e.target.value })}
            />
          </div>
        </Card>

        {/* Save button */}
        <Button 
          onClick={saveConfig} 
          disabled={saving}
          className="w-full md:w-auto md:self-end gap-2"
          size="lg"
        >
          <Save size={18} />
          {saving ? "Enregistrement..." : saved ? "✓ Enregistré !" : "Enregistrer la configuration"}
        </Button>
      </div>
    </div>
  )
}