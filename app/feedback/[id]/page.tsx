"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"

export default function FeedbackPage() {
  const params = useParams()
  const router = useRouter()
  const etablissementId = params.id as string

  const [etablissement, setEtablissement] = useState<any>(null)
  const [step, setStep] = useState<"rating" | "feedback" | "wheel" | "thanks">("rating")
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchEtablissement = async () => {
      const { data } = await supabase
        .from("etablissements")
        .select("*")
        .eq("id", etablissementId)
        .single()
      
      if (data) {
        setEtablissement(data)
      }
    }

    if (etablissementId) {
      fetchEtablissement()
    }
  }, [etablissementId])

  const handleRatingSubmit = async () => {
    if (rating === 0) return

    if (rating >= 4) {
      // Rediriger vers Google Maps pour laisser un avis public
      // Pour l'instant, on passe à la roue de la fortune
      await saveAvis(true)
      setStep("wheel")
      
      // Si l'établissement a une URL Google Maps, ouvrir dans un nouvel onglet
      if (etablissement?.google_maps_url) {
        window.open(etablissement.google_maps_url, "_blank")
      }
    } else {
      // Avis négatif → formulaire privé
      setStep("feedback")
    }
  }

  const handleFeedbackSubmit = async () => {
    setLoading(true)
    await saveAvis(false)
    setLoading(false)
    setStep("wheel")
  }

  const saveAvis = async (isPublic: boolean) => {
    await supabase.from("avis").insert({
      etablissement_id: etablissementId,
      note: rating,
      commentaire: comment || null,
      public: isPublic,
    })
  }

  const handleWheelSpin = () => {
    // Pour l'instant, on simule un gain
    setTimeout(() => {
      setStep("thanks")
    }, 2000)
  }

  if (!etablissement) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <p>Chargement...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="w-full max-w-md p-8">
        
        {/* ÉTAPE 1: Notation */}
        {step === "rating" && (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">{etablissement.nom}</h1>
            <p className="text-gray-600 mb-8">Comment s'est passée votre expérience ?</p>
            
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={48}
                    fill={(hoverRating || rating) >= star ? "#FBBF24" : "none"}
                    stroke={(hoverRating || rating) >= star ? "#FBBF24" : "#D1D5DB"}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>

            <Button 
              onClick={handleRatingSubmit} 
              disabled={rating === 0}
              className="w-full"
              size="lg"
            >
              Continuer
            </Button>

            <p className="text-xs text-gray-400 mt-4">
              🎁 Tentez de gagner un cadeau après votre avis !
            </p>
          </div>
        )}

        {/* ÉTAPE 2: Feedback privé (si note < 4) */}
        {step === "feedback" && (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Aidez-nous à nous améliorer</h1>
            <p className="text-gray-600 mb-6">
              Votre avis reste privé et nous aide à progresser.
            </p>

            <Textarea
              placeholder="Qu'est-ce qui pourrait être amélioré ?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mb-6 min-h-[120px]"
            />

            <Button 
              onClick={handleFeedbackSubmit} 
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? "Envoi..." : "Envoyer et jouer 🎁"}
            </Button>
          </div>
        )}

        {/* ÉTAPE 3: Roue de la fortune */}
        {step === "wheel" && (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">🎉 Merci pour votre avis !</h1>
            <p className="text-gray-600 mb-8">
              Tentez votre chance pour gagner un cadeau !
            </p>

            <div className="w-48 h-48 mx-auto mb-8 rounded-full bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 flex items-center justify-center animate-pulse">
              <div className="w-40 h-40 rounded-full bg-white flex items-center justify-center">
                <span className="text-4xl">🎁</span>
              </div>
            </div>

            <Button 
              onClick={handleWheelSpin}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600"
              size="lg"
            >
              Tourner la roue !
            </Button>
          </div>
        )}

        {/* ÉTAPE 4: Merci */}
        {step === "thanks" && (
          <div className="text-center">
            <div className="text-6xl mb-4">🎊</div>
            <h1 className="text-2xl font-bold mb-2">Félicitations !</h1>
            <p className="text-gray-600 mb-4">
              Vous avez gagné : <strong>10% de réduction</strong> sur votre prochaine visite !
            </p>
            <p className="text-sm text-gray-500">
              Montrez cet écran lors de votre prochaine visite.
            </p>
          </div>
        )}

      </Card>
    </div>
  )
}