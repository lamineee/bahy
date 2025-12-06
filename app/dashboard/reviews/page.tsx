"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

export default function ReviewsPage() {
  const [filter, setFilter] = useState("all")

  const allReviews = [
    { id: 1, rating: 5, comment: "Excellent service!", date: "2024-12-07", published: true },
    { id: 2, rating: 4, comment: "Très bon", date: "2024-12-06", published: true },
    { id: 3, rating: 5, comment: "Parfait!", date: "2024-12-05", published: false },
    { id: 4, rating: 3, comment: "Correct", date: "2024-12-04", published: true },
    { id: 5, rating: 2, comment: "Décevant", date: "2024-12-03", published: true },
    { id: 6, rating: 5, comment: "Recommandé!", date: "2024-12-02", published: true },
  ]

  const filteredReviews = allReviews.filter((review) => {
    if (filter === "positive") return review.rating >= 4
    if (filter === "negative") return review.rating <= 3
    return true
  })

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Avis reçus</h1>
        <p className="text-muted-foreground mt-1">Gérez tous vos avis clients</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          className={filter === "all" ? "bg-primary" : ""}
        >
          Tous ({allReviews.length})
        </Button>
        <Button
          variant={filter === "positive" ? "default" : "outline"}
          onClick={() => setFilter("positive")}
          className={filter === "positive" ? "bg-green-600 hover:bg-green-700" : ""}
        >
          Positifs (4-5)
        </Button>
        <Button
          variant={filter === "negative" ? "default" : "outline"}
          onClick={() => setFilter("negative")}
          className={filter === "negative" ? "bg-red-600 hover:bg-red-700" : ""}
        >
          Négatifs (1-3)
        </Button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    review.published
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  }`}
                >
                  {review.published ? "Public" : "Privé"}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">{review.date}</span>
            </div>
            <p className="text-foreground">{review.comment}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
