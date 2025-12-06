"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

export default function ShortCodeRedirect() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        const response = await fetch("/api/shortcode/" + code)
        const data = await response.json()

        if (data.id) {
          router.replace("/feedback/" + data.id)
        } else {
          setError("Code non trouvé")
        }
      } catch (e) {
        setError("Erreur de connexion")
      }
    }

    if (code) {
      fetchAndRedirect()
    }
  }, [code, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p>Redirection...</p>
      )}
    </div>
  )
}