"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  MessageCircle,
  Clock,
  Zap,
  Target,
  TrendingDown,
  Instagram,
  Settings,
  Bot,
  Check,
  X,
  ArrowRight,
  Calendar,
  Sparkles
} from "lucide-react"

// Conversation DM simulée
const dmConversation = [
  { sender: "prospect", message: "Salut ! J'ai vu ta vidéo sur le coaching, ça m'intéresse", delay: 0 },
  { sender: "ai", message: "Hey ! Merci pour ton message ! Tu as bien fait de m'écrire. Qu'est-ce qui t'a particulièrement parlé dans la vidéo ?", delay: 1500 },
  { sender: "prospect", message: "Le passage sur la productivité, j'ai du mal à m'organiser", delay: 3500 },
  { sender: "ai", message: "Je comprends totalement ! C'est un problème super courant. Tu es entrepreneur ou salarié actuellement ?", delay: 5000 },
  { sender: "prospect", message: "Entrepreneur, j'ai lancé mon activité il y a 6 mois", delay: 7000 },
  { sender: "ai", message: "Top ! Les 6 premiers mois sont cruciaux. On propose justement un appel découverte gratuit pour voir comment on peut t'aider. Ça te dit de bloquer 30min cette semaine ? Voici le lien : calendly.com/coaching", delay: 8500 },
  { sender: "prospect", message: "Oui parfait, je réserve !", delay: 11000 },
]

function DMDemo() {
  const [visibleMessages, setVisibleMessages] = useState<number>(0)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (visibleMessages < dmConversation.length) {
      const nextMessage = dmConversation[visibleMessages]
      const delay = visibleMessages === 0 ? 1000 : dmConversation[visibleMessages].delay - dmConversation[visibleMessages - 1].delay

      if (nextMessage.sender === "ai") {
        setIsTyping(true)
        const typingTimer = setTimeout(() => {
          setIsTyping(false)
          setVisibleMessages(prev => prev + 1)
        }, delay)
        return () => clearTimeout(typingTimer)
      } else {
        const timer = setTimeout(() => {
          setVisibleMessages(prev => prev + 1)
        }, delay)
        return () => clearTimeout(timer)
      }
    } else {
      // Reset après la conversation complète
      const resetTimer = setTimeout(() => {
        setVisibleMessages(0)
      }, 4000)
      return () => clearTimeout(resetTimer)
    }
  }, [visibleMessages])

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 shadow-2xl border border-gray-700 max-w-sm mx-auto">
      {/* Header DM */}
      <div className="flex items-center gap-3 pb-3 border-b border-gray-700 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center">
          <Instagram className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm">Messages Instagram</p>
          <p className="text-gray-400 text-xs">Bahy IA répond en temps réel</p>
        </div>
        <div className="ml-auto">
          <span className="inline-flex items-center gap-1 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            En ligne
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-3 min-h-[320px]">
        <AnimatePresence>
          {dmConversation.slice(0, visibleMessages).map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.sender === "ai" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                  msg.sender === "ai"
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                    : "bg-gray-700 text-gray-100"
                }`}
              >
                {msg.sender === "ai" && (
                  <span className="flex items-center gap-1 text-xs text-violet-200 mb-1">
                    <Bot className="w-3 h-3" /> Bahy IA
                  </span>
                )}
                {msg.message}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 rounded-2xl">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

const stats = [
  { icon: Clock, value: "24/7", label: "Disponibilité", description: "Jamais de pause" },
  { icon: Zap, value: "<2min", label: "Temps de réponse", description: "Ultra rapide" },
  { icon: Target, value: "85%", label: "Taux de qualification", description: "Leads qualifiés" },
  { icon: TrendingDown, value: "-90%", label: "Temps DM", description: "Économisé" },
]

const steps = [
  {
    step: "01",
    title: "Connecte ton Instagram",
    description: "Liaison sécurisée en 2 clics avec ton compte Instagram Business. Aucune donnée sensible stockée.",
    icon: Instagram,
  },
  {
    step: "02",
    title: "Configure ton IA",
    description: "Définis ta personnalité, tes offres, ton calendrier. L'IA apprend ton style de communication.",
    icon: Settings,
  },
  {
    step: "03",
    title: "L'IA gère tout",
    description: "Elle répond, qualifie les prospects et envoie vers ton Calendly. Toi, tu closes.",
    icon: Bot,
  },
]

const comparisonData = {
  without: {
    title: "Sans Bahy",
    subtitle: "Setter humain traditionnel",
    items: [
      { text: "1 500€ - 2 000€ / mois", negative: true },
      { text: "Horaires limités (pas 24/7)", negative: true },
      { text: "Temps de réponse variable", negative: true },
      { text: "Qualité inconsistante", negative: true },
      { text: "Formation nécessaire", negative: true },
      { text: "Turnover fréquent", negative: true },
    ],
  },
  with: {
    title: "Avec Bahy",
    subtitle: "IA Setter automatisé",
    items: [
      { text: "À partir de 297€ / mois", positive: true },
      { text: "Disponible 24h/24, 7j/7", positive: true },
      { text: "Réponse en moins de 2 min", positive: true },
      { text: "Qualité constante garantie", positive: true },
      { text: "Prêt à l'emploi", positive: true },
      { text: "Jamais de turnover", positive: true },
    ],
  },
}

const pricingPlans = [
  {
    name: "Starter",
    price: "297",
    description: "Parfait pour démarrer",
    features: [
      "1 compte Instagram",
      "500 conversations / mois",
      "Réponses IA personnalisées",
      "Qualification automatique",
      "Intégration Calendly",
      "Dashboard analytics",
      "Support email",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "497",
    description: "Pour les créateurs ambitieux",
    features: [
      "3 comptes Instagram",
      "Conversations illimitées",
      "Réponses IA avancées",
      "Qualification + scoring leads",
      "Intégration Calendly + CRM",
      "Analytics avancés",
      "Support prioritaire 24/7",
      "Appel setup personnalisé",
    ],
    popular: true,
  },
]

const faqs = [
  {
    question: "Comment l'IA apprend-elle mon style de communication ?",
    answer: "Lors de l'onboarding, tu nous fournis des exemples de conversations passées, ta tonalité préférée, et tes réponses types. L'IA analyse tout ça pour reproduire ton style naturellement. Tu peux affiner à tout moment.",
  },
  {
    question: "Est-ce que les prospects savent qu'ils parlent à une IA ?",
    answer: "L'IA répond de manière naturelle et personnalisée. La plupart des prospects ne font pas la différence. Tu peux choisir d'être transparent ou non, selon ta préférence.",
  },
  {
    question: "Que se passe-t-il si l'IA ne sait pas répondre ?",
    answer: "L'IA détecte automatiquement les questions complexes ou hors-scope et te notifie en temps réel. Tu peux reprendre la conversation manuellement à tout moment.",
  },
  {
    question: "Comment fonctionne l'intégration avec Calendly ?",
    answer: "Une fois le prospect qualifié, l'IA envoie automatiquement ton lien Calendly. Tu reçois une notification et le prospect apparaît dans ton planning. Simple et efficace.",
  },
  {
    question: "Puis-je annuler à tout moment ?",
    answer: "Oui, sans engagement. Tu peux annuler ton abonnement à tout moment depuis ton dashboard. Pas de frais cachés, pas de pénalité.",
  },
  {
    question: "Est-ce conforme aux règles d'Instagram ?",
    answer: "Absolument. Nous utilisons l'API officielle Instagram et respectons toutes les guidelines de Meta. Ton compte est en sécurité.",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold">Bahy</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-4"
        >
          <Link href="/login">
            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
              Connexion
            </Button>
          </Link>
          <Link href="https://calendly.com" target="_blank">
            <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white border-0">
              Réserver une démo
            </Button>
          </Link>
        </motion.div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Setter IA pour Instagram
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Ton closer IA qui{" "}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                répond 24/7
              </span>{" "}
              à tes DMs
            </h1>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              Automatise tes conversations Instagram. L'IA qualifie tes prospects et les envoie vers ton Calendly pendant que tu te concentres sur ce qui compte vraiment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="https://calendly.com" target="_blank">
                <Button size="lg" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white border-0 text-lg px-8 py-6 w-full sm:w-auto">
                  <Calendar className="w-5 h-5 mr-2" />
                  Réserver ma démo gratuite
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-gray-700 text-gray-300 hover:bg-white/5 text-lg px-8 py-6">
                Voir comment ça marche
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Setup en 15 min - Sans engagement - Résultats garantis
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <DMDemo />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <Card className="bg-gray-900/50 border-gray-800 p-6 text-center hover:border-violet-500/50 transition-colors">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-violet-400" />
                </div>
                <p className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </p>
                <p className="text-white font-medium">{stat.label}</p>
                <p className="text-gray-500 text-sm">{stat.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Comment ça marche */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Comment ça marche ?</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            3 étapes simples pour automatiser tes DMs et générer plus de rendez-vous
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
            >
              <Card className="bg-gray-900/50 border-gray-800 p-8 relative overflow-hidden group hover:border-violet-500/50 transition-all">
                <div className="absolute top-4 right-4 text-6xl font-bold text-gray-800 group-hover:text-violet-900/30 transition-colors">
                  {step.step}
                </div>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center mb-6">
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Comparaison */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Pourquoi choisir Bahy ?</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Compare le coût et l'efficacité d'un setter humain vs notre IA
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Sans Bahy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gray-900/30 border-gray-800 p-8 h-full">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                  <X className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">{comparisonData.without.title}</h3>
                <p className="text-gray-500">{comparisonData.without.subtitle}</p>
              </div>
              <ul className="space-y-4">
                {comparisonData.without.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <X className="w-4 h-4 text-red-400" />
                    </div>
                    <span className="text-gray-400">{item.text}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>

          {/* Avec Bahy */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-violet-900/20 to-fuchsia-900/20 border-violet-500/30 p-8 h-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-fuchsia-600/5"></div>
              <div className="relative">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{comparisonData.with.title}</h3>
                  <p className="text-violet-300">{comparisonData.with.subtitle}</p>
                </div>
                <ul className="space-y-4">
                  {comparisonData.with.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Tarifs simples et transparents</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Choisis l'offre adaptée à tes besoins. Sans engagement, annulable à tout moment.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingPlans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
            >
              <Card
                className={`p-8 h-full relative ${
                  plan.popular
                    ? "bg-gradient-to-br from-violet-900/30 to-fuchsia-900/30 border-violet-500/50"
                    : "bg-gray-900/50 border-gray-800"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                      Le plus populaire
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-5xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                      {plan.price}€
                    </span>
                    <span className="text-gray-500 mb-2">/mois HT</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        plan.popular
                          ? "bg-gradient-to-r from-violet-600 to-fuchsia-600"
                          : "bg-violet-600/20"
                      }`}>
                        <Check className={`w-3 h-3 ${plan.popular ? "text-white" : "text-violet-400"}`} />
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="https://calendly.com" target="_blank" className="block">
                  <Button
                    className={`w-full py-6 text-lg ${
                      plan.popular
                        ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white border-0"
                        : "bg-transparent border-gray-700 text-white hover:bg-white/5"
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Commencer maintenant
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Questions fréquentes</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Tout ce que tu dois savoir avant de te lancer
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="bg-gray-900/50 border border-gray-800 rounded-xl px-6 data-[state=open]:border-violet-500/50"
              >
                <AccordionTrigger className="text-left text-white hover:text-violet-400 hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-br from-violet-900/40 to-fuchsia-900/40 border-violet-500/30 p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-600/10 via-transparent to-transparent"></div>
            <div className="relative">
              <h2 className="text-4xl font-bold mb-4">
                Prêt à automatiser tes DMs ?
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Rejoins les créateurs qui génèrent plus de rendez-vous sans passer leurs journées sur Instagram
              </p>
              <Link href="https://calendly.com" target="_blank">
                <Button size="lg" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white border-0 text-lg px-10 py-7">
                  <Calendar className="w-5 h-5 mr-2" />
                  Réserver ma démo gratuite
                </Button>
              </Link>
              <p className="text-sm text-gray-500 mt-4">
                Appel de 15 min - Sans engagement - 100% gratuit
              </p>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span>© 2024 Bahy. Tous droits réservés.</span>
          </div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-violet-400 transition-colors">Mentions légales</Link>
            <Link href="#" className="hover:text-violet-400 transition-colors">CGV</Link>
            <Link href="#" className="hover:text-violet-400 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
