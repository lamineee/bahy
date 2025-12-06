import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { to, etablissement, note, commentaire } = await request.json()

    if (!to || !etablissement) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 })
    }

    // Import dynamique de Resend
    const { Resend } = await import("resend")
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { data, error } = await resend.emails.send({
      from: "Bahy <onboarding@resend.dev>",
      to: to,
      subject: `⚠️ Avis ${note} étoile${note > 1 ? "s" : ""} reçu - ${etablissement}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e11d48;">⚠️ Nouvel avis négatif</h2>
          <p>Votre établissement <strong>${etablissement}</strong> vient de recevoir un avis <strong>${note} étoile${note > 1 ? "s" : ""}</strong>.</p>
          ${commentaire ? `<div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;"><p style="margin: 0; color: #374151;">"${commentaire}"</p></div>` : `<p style="color: #6b7280;">Aucun commentaire laissé.</p>`}
          <p>Connectez-vous à votre dashboard pour voir les détails.</p>
          <a href="https://bahy.io/dashboard/reviews" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">Voir les avis</a>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 32px;">— L'équipe Bahy</p>
        </div>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}