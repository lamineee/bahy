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
  Clock,
  Zap,
  Shield,
  Instagram,
  Settings,
  Bot,
  Check,
  X,
  ArrowRight,
  Calendar,
  Sparkles,
  MessageSquare,
  BrainCircuit,
  Rocket
} from "lucide-react"

// Conversation DM simulée - plus réaliste et engageante
const dmConversation = [
  { sender: "prospect", message: "Salut ! J'ai vu ta vidéo sur le coaching, ça m'intéresse beaucoup", delay: 0 },
  { sender: "ai", message: "Hey ! Merci pour ton message ! Qu'est-ce qui t'a particulièrement parlé dans la vidéo ?", delay: 2000 },
  { sender: "prospect", message: "Le passage sur la productivité, j'ai vraiment du mal à m'organiser en ce moment", delay: 4500 },
  { sender: "ai", message: "Je comprends totalement, c'est un problème super courant ! Tu es entrepreneur ou salarié actuellement ?", delay: 6500 },
  { sender: "prospect", message: "Entrepreneur, j'ai lancé mon activité il y a 6 mois", delay: 9000 },
  { sender: "ai", message: "Top ! On propose un appel découverte gratuit pour voir comment t'aider. Ça te dit ?", delay: 11000 },
  { sender: "prospect", message: "Oui carrément, je suis dispo jeudi !", delay: 14000 },
  { sender: "ai", message: "Parfait ! Voici le lien pour réserver : calendly.com/coaching. À jeudi !", delay: 16000 },
]

function DMDemo() {
  const [visibleMessages, setVisibleMessages] = useState<number>(0)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (visibleMessages < dmConversation.length) {
      const nextMessage = dmConversation[visibleMessages]
      const delay = visibleMessages === 0 ? 1500 : dmConversation[visibleMessages].delay - dmConversation[visibleMessages - 1].delay

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
      const resetTimer = setTimeout(() => {
        setVisibleMessages(0)
      }, 5000)
      return () => clearTimeout(resetTimer)
    }
  }, [visibleMessages])

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {/* Glow effect behind */}
      <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-violet-600/20 rounded-3xl blur-2xl" />

      <div className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-2xl p-5 shadow-2xl border border-gray-700/50 max-w-md mx-auto backdrop-blur-sm">
        {/* Header DM */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-700/50 mb-5">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Instagram className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold">Messages Instagram</p>
            <p className="text-gray-400 text-sm">Bahy IA active</p>
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              En ligne 24/7
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-4 min-h-[350px] max-h-[350px] overflow-hidden">
          <AnimatePresence>
            {dmConversation.slice(0, visibleMessages).map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`flex ${msg.sender === "ai" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "ai"
                      ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20"
                      : "bg-gray-700/80 text-gray-100"
                  }`}
                >
                  {msg.sender === "ai" && (
                    <span className="flex items-center gap-1.5 text-xs text-violet-200/80 mb-1 font-medium">
                      <Bot className="w-3.5 h-3.5" /> Bahy IA
                    </span>
                  )}
                  {msg.message}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-start"
              >
                <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 rounded-2xl shadow-lg shadow-violet-500/20">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-white/90 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-white/90 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-white/90 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer indicator */}
        <div className="mt-4 pt-4 border-t border-gray-700/50 flex items-center justify-center gap-2 text-gray-500 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Conversation générée par l'IA en temps réel</span>
        </div>
      </div>
    </motion.div>
  )
}

// Bénéfices qualitatifs honnêtes (pas de stats inventées)
const benefits = [
  {
    icon: Zap,
    title: "Répond instantanément",
    description: "Tes prospects reçoivent une réponse en quelques secondes, même à 3h du matin"
  },
  {
    icon: Clock,
    title: "Disponible 24/7",
    description: "Ton IA ne dort jamais, ne prend pas de vacances, ne tombe pas malade"
  },
  {
    icon: Shield,
    title: "Zéro formation requise",
    description: "L'IA apprend ton style en quelques minutes, pas besoin de former qui que ce soit"
  },
  {
    icon: BrainCircuit,
    title: "Qualifie intelligemment",
    description: "Pose les bonnes questions pour identifier les prospects vraiment intéressés"
  },
]

const steps = [
  {
    step: "01",
    title: "Connecte ton Instagram",
    description: "Liaison sécurisée en 2 clics avec ton compte Instagram Business. Conforme aux guidelines Meta.",
    icon: Instagram,
  },
  {
    step: "02",
    title: "Configure ton IA",
    description: "Définis ta personnalité, tes offres, tes critères de qualification. L'IA s'adapte à ton style.",
    icon: Settings,
  },
  {
    step: "03",
    title: "L'IA prend le relais",
    description: "Elle répond, qualifie et redirige les prospects qualifiés vers ton Calendly. Toi, tu closes.",
    icon: Bot,
  },
]

const comparisonData = {
  without: {
    title: "Setter humain",
    subtitle: "Solution traditionnelle",
    price: "1 500€ - 2 000€",
    priceLabel: "/ mois minimum",
    items: [
      "Horaires limités",
      "Temps de réponse variable",
      "Qualité inconsistante",
      "Formation nécessaire",
      "Turnover fréquent",
      "Coût imprévisible",
    ],
  },
  with: {
    title: "Bahy IA",
    subtitle: "Solution automatisée",
    items: [
      "Disponible 24h/24, 7j/7",
      "Réponse instantanée",
      "Qualité constante",
      "Prêt à l'emploi",
      "Jamais de turnover",
      "Coût fixe et prévisible",
    ],
  },
}

const faqs = [
  {
    question: "Comment l'IA apprend-elle mon style de communication ?",
    answer: "Lors de l'onboarding, tu nous fournis des exemples de conversations passées et ta tonalité préférée. L'IA analyse tout ça pour reproduire ton style naturellement. Tu peux ajuster à tout moment.",
  },
  {
    question: "Est-ce que les prospects savent qu'ils parlent à une IA ?",
    answer: "L'IA répond de manière naturelle et personnalisée. Tu choisis ton niveau de transparence. Dans tous les cas, l'objectif est de fournir une expérience fluide et utile au prospect.",
  },
  {
    question: "Que se passe-t-il si l'IA ne sait pas répondre ?",
    answer: "L'IA détecte automatiquement les questions complexes et te notifie en temps réel. Tu peux reprendre la conversation manuellement quand tu veux.",
  },
  {
    question: "Comment fonctionne l'intégration Calendly ?",
    answer: "Une fois le prospect qualifié, l'IA envoie automatiquement ton lien Calendly. Simple, efficace, sans friction.",
  },
  {
    question: "Est-ce conforme aux règles d'Instagram ?",
    answer: "Oui. Nous utilisons les APIs officielles et respectons les guidelines de Meta. Ton compte est en sécurité.",
  },
  {
    question: "Puis-je tester avant de m'engager ?",
    answer: "Absolument. On propose un appel découverte gratuit pour te montrer exactement comment ça fonctionne avec ton cas d'usage.",
  },
]

// Floating CTA Component
function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 600)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Link href="https://calendly.com/bahyamine28/30min" target="_blank">
            <Button
              size="lg"
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white border-0 shadow-2xl shadow-violet-500/30 px-6 py-6 rounded-full"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Réserver un appel
            </Button>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Floating CTA */}
      <FloatingCTA />

      {/* Header - Simple, non-fixe, transparent */}
      <header className="relative z-40 py-6 bg-transparent">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Bahy</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold bg-violet-500/20 text-violet-300 px-2 py-1 rounded-full border border-violet-500/30 uppercase tracking-wider">
              <Rocket className="w-3 h-3" />
              Early Access
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href="https://calendly.com/bahyamine28/30min" target="_blank">
              <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white border-0 shadow-lg shadow-violet-500/20">
                <Calendar className="w-4 h-4 mr-2" />
                Réserver une démo
              </Button>
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-r from-violet-600/10 via-fuchsia-600/10 to-violet-600/10 blur-3xl rounded-full" />

        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 text-violet-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4" />
                Setter IA pour créateurs & coaches
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-[1.1] tracking-tight">
                Ton assistant IA qui{" "}
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                  répond à tes DMs
                </span>{" "}
                pendant que tu dors
              </h1>

              <p className="text-lg sm:text-xl text-gray-400 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Automatise tes conversations Instagram. L'IA qualifie tes prospects et les envoie vers ton Calendly — 24h/24, 7j/7.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="https://calendly.com/bahyamine28/30min" target="_blank">
                  <Button size="lg" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white border-0 text-base px-8 py-7 w-full sm:w-auto shadow-xl shadow-violet-500/25 transition-all hover:shadow-2xl hover:shadow-violet-500/30 hover:-translate-y-0.5">
                    <Calendar className="w-5 h-5 mr-2" />
                    Réserver ma démo gratuite
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-gray-300 hover:text-white hover:bg-transparent text-base px-6 py-7 transition-all group"
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Voir comment ça marche
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <p className="text-sm text-gray-500 mt-6">
                Appel de 30 min — Sans engagement — Places limitées
              </p>
            </motion.div>

            <div className="lg:pl-8">
              <DMDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card className="bg-gray-900/30 border-gray-800/50 p-6 h-full hover:bg-gray-900/50 hover:border-violet-500/30 transition-all duration-300 group">
                  <div className="w-12 h-12 mb-5 rounded-xl bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 flex items-center justify-center group-hover:from-violet-600/30 group-hover:to-fuchsia-600/30 transition-all">
                    <benefit.icon className="w-6 h-6 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{benefit.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-14 lg:py-20 scroll-mt-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-5 tracking-tight">Comment ça marche ?</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              3 étapes pour automatiser tes DMs et générer plus de rendez-vous
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
              >
                <Card className="bg-gray-900/30 border-gray-800/50 p-8 lg:p-10 relative overflow-hidden group hover:border-violet-500/30 transition-all duration-300 h-full">
                  <div className="absolute top-6 right-6 text-7xl font-bold text-gray-800/50 group-hover:text-violet-900/40 transition-colors">
                    {step.step}
                  </div>
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/20">
                      <step.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-white">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{step.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* CTA after steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-14"
          >
            <Link href="https://calendly.com/bahyamine28/30min" target="_blank">
              <Button size="lg" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white border-0 px-8 py-6 shadow-xl shadow-violet-500/20">
                <Calendar className="w-5 h-5 mr-2" />
                Découvrir en appel gratuit
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-14 lg:py-20 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-5 tracking-tight">Pourquoi passer à l'IA ?</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Compare le coût et l'efficacité d'un setter humain vs Bahy
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Setter humain */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gray-900/20 border-gray-800/50 p-8 lg:p-10 h-full">
                <div className="text-center mb-10">
                  <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-500/10 flex items-center justify-center">
                    <X className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{comparisonData.without.title}</h3>
                  <p className="text-gray-500 mb-4">{comparisonData.without.subtitle}</p>
                  <div className="text-3xl font-bold text-red-400">
                    {comparisonData.without.price}
                    <span className="text-base font-normal text-gray-500 ml-1">{comparisonData.without.priceLabel}</span>
                  </div>
                </div>
                <ul className="space-y-4">
                  {comparisonData.without.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <X className="w-4 h-4 text-red-400" />
                      </div>
                      <span className="text-gray-400">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            {/* Bahy IA */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-violet-900/20 to-fuchsia-900/20 border-violet-500/30 p-8 lg:p-10 h-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-fuchsia-600/5" />
                <div className="relative">
                  <div className="text-center mb-10">
                    <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{comparisonData.with.title}</h3>
                    <p className="text-violet-300 mb-4">{comparisonData.with.subtitle}</p>
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 px-4 py-2 rounded-full">
                      <Sparkles className="w-4 h-4 text-violet-400" />
                      <span className="text-violet-300 font-semibold">Tarif early access sur demande</span>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {comparisonData.with.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/20">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 lg:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-5 tracking-tight">Questions fréquentes</h2>
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
                  className="bg-gray-900/30 border border-gray-800/50 rounded-xl px-6 data-[state=open]:border-violet-500/30 transition-colors"
                >
                  <AccordionTrigger className="text-left text-white hover:text-violet-400 hover:no-underline py-6 text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 pb-6 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-14 lg:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-br from-violet-900/30 to-fuchsia-900/30 border-violet-500/20 p-10 lg:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-600/10 via-transparent to-transparent" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
                  <MessageSquare className="w-4 h-4" />
                  Prêt à automatiser ?
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
                  Arrête de passer tes journées<br className="hidden sm:block" /> dans les DMs
                </h2>

                <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                  Rejoins les créateurs qui automatisent leur acquisition client. L'IA gère tes DMs, tu te concentres sur ton expertise.
                </p>

                <Link href="https://calendly.com/bahyamine28/30min" target="_blank">
                  <Button size="lg" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white border-0 text-lg px-12 py-8 shadow-2xl shadow-violet-500/30 transition-all hover:shadow-violet-500/40 hover:-translate-y-0.5">
                    <Calendar className="w-5 h-5 mr-2" />
                    Réserver ma démo gratuite
                  </Button>
                </Link>

                <p className="text-sm text-gray-500 mt-6">
                  Appel de 30 min — Sans engagement — Places limitées
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <span>© 2025 Bahy</span>
            <span className="text-gray-700">·</span>
            <a
              href="https://www.instagram.com/amine_setting/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-violet-400 transition-colors"
            >
              @amine_setting
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
