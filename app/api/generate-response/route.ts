import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { avis, note } = await request.json()

    if (!avis) {
      return NextResponse.json({ error: "Avis manquant" }, { status: 400 })
    }

    let tone = ""
    if (note >= 4) {
      tone = "chaleureuse et reconnaissante"
    } else if (note === 3) {
      tone = "professionnelle et constructive"
    } else {
      tone = "empathique et orientée solution"
    }

    const prompt = `Tu es un assistant qui aide les commerces à répondre aux avis Google.

Génère une réponse ${tone} pour cet avis (note: ${note}/5):

"${avis}"

Règles:
- Réponse courte (2-4 phrases max)
- Personnalisée selon le contenu de l'avis
- Professionnelle mais humaine
- Si avis négatif: montre de l'empathie, propose une solution
- Si avis positif: remercie chaleureusement
- Ne jamais mentionner que tu es une IA
- Signe avec "L'équipe" sans nom spécifique

Réponse:`

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    })

    const data = await response.json()

    if (data.content && data.content[0]) {
      return NextResponse.json({ reponse: data.content[0].text })
    } else {
      return NextResponse.json({ error: "Erreur API" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}