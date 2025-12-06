import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star, QrCode, Gift, TrendingUp, Shield } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bahy</h1>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Connexion</Button>
          </Link>
          <Link href="/signup">
            <Button>Essai gratuit</Button>
          </Link>
        </div>
      </header>

      <section className="container mx-auto px-4 py-20 text-center">
        <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-6">
          🚀 +500 commerces nous font confiance
        </div>
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Passez de 3.2 à 4.7 étoiles<br />
          <span className="text-blue-600">en 60 jours</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Collectez automatiquement des avis 5 étoiles sur Google Maps. 
          Les avis négatifs restent privés. Résultats garantis ou remboursé.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8 py-6">
              Démarrer gratuitement
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Sans carte bancaire - Installation en 2 minutes - Annulation à tout moment
        </p>
      </section>

      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche ?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">1. Affichez le QR code</h3>
            <p className="text-gray-600">
              Imprimez votre QR code unique et affichez-le dans votre établissement.
            </p>
          </Card>
          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">2. Clients notent</h3>
            <p className="text-gray-600">
              Vos clients scannent et donnent leur avis en 30 secondes.
            </p>
          </Card>
          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">3. Note qui monte</h3>
            <p className="text-gray-600">
              Les avis positifs vont sur Google, les négatifs restent privés.
            </p>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 bg-white rounded-3xl my-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">
              La magie ? Les avis négatifs<br />
              <span className="text-blue-600">ne vont jamais sur Google.</span>
            </h2>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="text-green-600">✓</span>
                <p><strong>Note 4-5 étoiles :</strong> Le client est redirigé vers Google Maps pour publier son avis positif.</p>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600">→</span>
                <p><strong>Note 1-3 étoiles :</strong> Le feedback reste privé. Vous recevez le commentaire pour vous améliorer.</p>
              </li>
              <li className="flex gap-3">
                <Gift className="w-5 h-5 text-yellow-600" />
                <p><strong>Bonus :</strong> Chaque client tourne la roue pour gagner un cadeau.</p>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-center text-gray-500 mb-4">Exemple de résultat</p>
              <div className="flex justify-center gap-1 mb-2">
                <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              </div>
              <p className="text-center text-2xl font-bold">4.7 / 5</p>
              <p className="text-center text-gray-500 text-sm">+127 avis en 2 mois</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">Un prix simple</h2>
        <p className="text-center text-gray-600 mb-12">Pas de surprise, pas d engagement</p>
        
        <Card className="max-w-md mx-auto p-8 border-2 border-blue-600">
          <div className="text-center">
            <p className="text-gray-500 mb-2">Tout inclus</p>
            <div className="flex items-end justify-center gap-1 mb-4">
              <span className="text-5xl font-bold">99€</span>
              <span className="text-gray-500 mb-2">/mois</span>
            </div>
            <p className="text-sm text-gray-500 mb-6">HT - Sans engagement</p>
            
            <ul className="text-left space-y-3 mb-8">
              <li className="flex gap-2"><span className="text-green-600">✓</span>QR code personnalisé illimité</li>
              <li className="flex gap-2"><span className="text-green-600">✓</span>Filtrage automatique des avis</li>
              <li className="flex gap-2"><span className="text-green-600">✓</span>Roue de la fortune intégrée</li>
              <li className="flex gap-2"><span className="text-green-600">✓</span>Dashboard avec statistiques</li>
              <li className="flex gap-2"><span className="text-green-600">✓</span>Réponses IA aux avis Google</li>
              <li className="flex gap-2"><span className="text-green-600">✓</span>Support prioritaire</li>
              <li className="flex gap-2"><span className="text-green-600">✓</span>Satisfait ou remboursé 60 jours</li>
            </ul>

            <Link href="/signup">
              <Button className="w-full" size="lg">
                Commencer maintenant
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      <section className="container mx-auto px-4 py-20">
        <Card className="bg-green-50 border-green-200 p-8 max-w-3xl mx-auto">
          <div className="flex gap-6 items-start">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Garantie 60 jours satisfait ou remboursé</h3>
              <p className="text-gray-600">
                Si vous ne voyez pas d amélioration de votre note Google en 60 jours, 
                on vous rembourse intégralement. Pas de questions posées.
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Prêt à booster vos avis Google ?</h2>
        <p className="text-gray-600 mb-8">Rejoignez +500 commerces qui ont transformé leur réputation</p>
        <Link href="/signup">
          <Button size="lg" className="text-lg px-8 py-6">
            Démarrer mon essai gratuit
          </Button>
        </Link>
      </section>

      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <p>© 2024 Bahy. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="#">Mentions légales</Link>
            <Link href="#">CGV</Link>
            <Link href="#">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}