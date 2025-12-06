"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Reward {
  id: string
  nom: string
  probabilite: number
  actif: boolean
}

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newReward, setNewReward] = useState({ nom: "", probabilite: 0 })
  const [etablissementId, setEtablissementId] = useState<string | null>(null)

  useEffect(() => {
    fetchRewards()
  }, [])

  const fetchRewards = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Récupérer l'établissement
      const { data: etab } = await supabase
        .from("etablissements")
        .select("id")
        .eq("client_id", user.id)
        .single()

      if (etab) {
        setEtablissementId(etab.id)

        // Récupérer les récompenses
        const { data: rewardsData } = await supabase
          .from("recompenses")
          .select("*")
          .eq("etablissement_id", etab.id)
          .order("created_at", { ascending: false })

        if (rewardsData) {
          setRewards(rewardsData)
        }
      }
    }
    setLoading(false)
  }

  const handleAddReward = async () => {
    if (!newReward.nom || newReward.probabilite <= 0 || !etablissementId) return

    const { data, error } = await supabase
      .from("recompenses")
      .insert({
        etablissement_id: etablissementId,
        nom: newReward.nom,
        probabilite: newReward.probabilite,
        actif: true,
      })
      .select()
      .single()

    if (data) {
      setRewards([data, ...rewards])
      setNewReward({ nom: "", probabilite: 0 })
      setShowForm(false)
    }
  }

  const handleToggleReward = async (id: string, currentStatus: boolean) => {
    await supabase
      .from("recompenses")
      .update({ actif: !currentStatus })
      .eq("id", id)

    setRewards(rewards.map((r) => (r.id === id ? { ...r, actif: !r.actif } : r)))
  }

  const handleDeleteReward = async (id: string) => {
    await supabase
      .from("recompenses")
      .delete()
      .eq("id", id)

    setRewards(rewards.filter((r) => r.id !== id))
  }

  const totalProbability = rewards.reduce((sum, r) => sum + r.probabilite, 0)

  if (loading) {
    return (
      <div className="p-6">
        <p>Chargement...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Récompenses</h1>
          <p className="text-muted-foreground mt-1">Gérez votre roue de la fortune</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2 bg-primary hover:bg-primary/90">
          <Plus size={20} />
          Ajouter une récompense
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Nouvelle récompense</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nom de la récompense</label>
              <Input
                placeholder="ex: Café gratuit"
                value={newReward.nom}
                onChange={(e) => setNewReward({ ...newReward, nom: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Probabilité (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="30"
                value={newReward.probabilite || ""}
                onChange={(e) => setNewReward({ ...newReward, probabilite: Number.parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddReward} className="flex-1 bg-primary hover:bg-primary/90">
                Ajouter
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                Annuler
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {rewards.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Aucune récompense pour le moment</p>
          </Card>
        ) : (
          <>
            {rewards.map((reward) => (
              <Card key={reward.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{reward.nom}</h3>
                        <p className="text-sm text-muted-foreground">Probabilité: {reward.probabilite}%</p>
                      </div>
                      <div className="text-right">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={reward.actif}
                            onChange={() => handleToggleReward(reward.id, reward.actif)}
                            className="w-4 h-4"
                          />
                          <span className="ml-2 text-sm font-medium text-muted-foreground">
                            {reward.actif ? "Actif" : "Inactif"}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteReward(reward.id)}
                    className="ml-4 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </Card>
            ))}
            <Card className="p-4 bg-muted/50">
              <p className="text-sm text-muted-foreground">
                Probabilité totale: <span className="font-bold text-foreground">{totalProbability}%</span>
                {totalProbability !== 100 && (
                  <span className="text-yellow-600 ml-2">(devrait être 100%)</span>
                )}
              </p>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}