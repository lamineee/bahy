"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SettingsPage() {
  const [businessName, setBusinessName] = useState("Mon Commerce")
  const [email, setEmail] = useState("contact@commerce.com")
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    console.log("Save settings:", { businessName, email })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
        <p className="text-muted-foreground mt-1">Gérez votre profil et vos préférences</p>
      </div>

      <div className="max-w-2xl">
        {/* Profile Settings */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Informations du commerce</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nom du commerce</label>
              <Input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {saved && (
              <div className="p-3 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md text-sm">
                Paramètres sauvegardés avec succès!
              </div>
            )}
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
              Enregistrer les modifications
            </Button>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-destructive/50">
          <h2 className="text-xl font-bold text-destructive mb-6">Zone de danger</h2>
          <div>
            <p className="text-muted-foreground mb-4">
              Supprimer votre compte supprimera tous les avis et données associés.
            </p>
            <Button
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
            >
              Supprimer mon compte
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
