"use client"

import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

export default function DashboardPage() {
  const reviews = [
    { id: 1, rating: 5, comment: "Excellent service!", date: "2024-12-07", published: true },
    { id: 2, rating: 4, comment: "Très bon", date: "2024-12-06", published: true },
    { id: 3, rating: 5, comment: "Parfait!", date: "2024-12-05", published: false },
    { id: 4, rating: 3, comment: "Correct", date: "2024-12-04", published: true },
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Mon Commerce</h1>
        <p className="text-muted-foreground mt-1">Bienvenue sur votre tableau de bord</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Current Rating */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Note actuelle</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-foreground">4.2</span>
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                  <Star size={16} className="fill-yellow-400/50 text-yellow-400/50" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Reviews This Month */}
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground mb-2">Avis ce mois</p>
          <p className="text-4xl font-bold text-foreground">23</p>
          <p className="text-xs text-muted-foreground mt-2">+5 ce mois-ci</p>
        </Card>

        {/* Positive Rate */}
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground mb-2">Taux positif</p>
          <p className="text-4xl font-bold text-foreground">87%</p>
          <p className="text-xs text-muted-foreground mt-2">Avis 4-5 étoiles</p>
        </Card>
      </div>

      {/* Recent Reviews */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Derniers avis</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Note</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Commentaire</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Date</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Statut</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-foreground text-sm">{review.comment}</td>
                  <td className="py-3 px-4 text-muted-foreground text-sm">{review.date}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        review.published
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      {review.published ? "Public" : "Privé"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
