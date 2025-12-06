"use client"

import { useEffect, useState, useRef } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function QRCodePage() {
  const [codeCourt, setCodeCourt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const qrRef = useRef<HTMLDivElement>(null)

  const feedbackUrl = codeCourt ? `https://bahy.io/f/${codeCourt}` : ""

  useEffect(() => {
    const fetchEtablissement = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (!user) {
          setError("Utilisateur non connecté")
          setLoading(false)
          return
        }

        const { data, error: dbError } = await supabase
          .from("etablissements")
          .select("id, code_court")
          .eq("client_id", user.id)
          .single()
        
        if (dbError) {
          setError(`Erreur DB: ${dbError.message}`)
          setLoading(false)
          return
        }
        
        if (data) {
          setCodeCourt(data.code_court)
        } else {
          setError("Aucun établissement trouvé")
        }
      } catch (e) {
        console.error("Error:", e)
        setError("Erreur inattendue")
      }
      setLoading(false)
    }

    fetchEtablissement()
  }, [])

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas")
    if (canvas) {
      const url = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = "bahy-qrcode.png"
      link.href = url
      link.click()
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Mon QR Code</h1>
        <p className="text-muted-foreground mt-1">Partagez ce QR code pour recevoir des avis</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="p-8 flex items-center justify-center bg-white dark:bg-slate-900">
            <div ref={qrRef} className="flex items-center justify-center">
              {loading ? (
                <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Chargement...</p>
                </div>
              ) : error ? (
                <div className="w-64 h-64 bg-red-50 rounded-lg flex items-center justify-center p-4">
                  <p className="text-red-500 text-center text-sm">{error}</p>
                </div>
              ) : codeCourt ? (
                <QRCodeCanvas 
                  value={feedbackUrl}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              ) : (
                <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Aucun QR code</p>
                </div>
              )}
            </div>
          </Card>
          <Button onClick={handleDownload} className="w-full mt-4 gap-2 bg-primary hover:bg-primary/90">
            <Download size={20} />
            Télécharger le QR code
          </Button>
          {feedbackUrl && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {feedbackUrl}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Instructions</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Imprimez le QR code</h3>
                  <p className="text-muted-foreground text-sm">
                    Téléchargez et imprimez le QR code ci-contre en bonne qualité.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Affichez dans votre établissement</h3>
                  <p className="text-muted-foreground text-sm">
                    Collez le QR code sur un lieu visible comme la caisse ou la porte.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Collectez les avis</h3>
                  <p className="text-muted-foreground text-sm">
                    Vos clients scanneront le QR pour vous laisser leurs avis facilement.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}