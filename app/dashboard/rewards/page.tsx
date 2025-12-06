"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"

export default function RewardsPage() {
  const [rewards, setRewards] = useState([
    { id: 1, name: "Café gratuit", probability: 30, active: true },
    { id: 2, name: "Réduction 20%", probability: 25, active: true },
    { id: 3, name: "Dessert gratuit", probability: 25, active: true },
    { id: 4, name: "Apéritif gratuit", probability: 20, active: false },
  ])
  const [showForm, setShowForm] = useState(false)
  const [newReward, setNewReward] = useState({ name: "", probability: 0 })

  const handleAddReward = () => {
    if (newReward.name && newReward.probability > 0) {
      setRewards([
        ...rewards,
        {
          id: Date.now(),
          name: newReward.name,
          probability: newReward.probability,
          active: true,
        },
      ])
      setNewReward({ name: "", probability: 0 })
      setShowForm(false)
    }
  }

  const handleToggleReward = (id: number) => {
    setRewards(rewards.map((r) => (r.id === id ? { ...r, active: !r.active } : r)))
  }

  const handleDeleteReward = (id: number) => {
    setRewards(rewards.filter((r) => r.id !== id))
  }

  const totalProbability = rewards.reduce((sum, r) => sum + r.probability, 0)

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

      {/* Add Reward Form */}
      {showForm && (
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Nouvelle récompense</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nom de la récompense</label>
              <Input
                placeholder="ex: Café gratuit"
                value={newReward.name}
                onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Probabilité (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="30"
                value={newReward.probability}
                onChange={(e) => setNewReward({ ...newReward, probability: Number.parseInt(e.target.value) || 0 })}
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

      {/* Rewards Grid */}
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
                        <h3 className="font-semibold text-foreground">{reward.name}</h3>
                        <p className="text-sm text-muted-foreground">Probabilité: {reward.probability}%</p>
                      </div>
                      <div className="text-right">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={reward.active}
                            onChange={() => handleToggleReward(reward.id)}
                            className="w-4 h-4"
                          />
                          <span className="ml-2 text-sm font-medium text-muted-foreground">
                            {reward.active ? "Actif" : "Inactif"}
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
              </p>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
