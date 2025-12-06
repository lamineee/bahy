"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export default function SignupPage() {
  const [nom, setNom] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // 1. Créer le compte auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (authData.user) {
      // 2. Ajouter le client dans la table clients
      await supabase.from("clients").insert({
        id: authData.user.id,
        email: email,
        nom: nom,
      })

      // 3. Créer un établissement par défaut
      await supabase.from("etablissements").insert({
        client_id: authData.user.id,
        nom: nom,
      })

      // 4. Rediriger vers Stripe Checkout
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          userId: authData.user.id,
        }),
      })

      const { url, error: stripeError } = await response.json()

      if (stripeError) {
        setError(stripeError)
        setLoading(false)
        return
      }

      // Rediriger vers Stripe
      window.location.href = url
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Bahy</h1>
          <p className="text-gray-600">Créer votre compte</p>
          <p className="text-sm text-blue-600 mt-2">Essai gratuit 14 jours • 99€/mois ensuite</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom du commerce</label>
            <Input
              type="text"
              placeholder="Mon Commerce"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mot de passe</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Création..." : "Créer un compte et payer"}
          </Button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Déjà un compte?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Se connecter
          </Link>
        </p>
      </Card>
    </div>
  )
}