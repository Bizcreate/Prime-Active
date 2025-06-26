"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Code,
  Layers,
  BarChart3,
  Palette,
  Smartphone,
  Users,
  Check,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Menu,
  X,
  ArrowUpRight,
  Play,
  Star,
  Zap,
  Globe,
  Sparkles,
  Mail,
  Lock,
} from "lucide-react"

// Modal Components
function SignInModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="bg-white rounded-3xl p-8 w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-2 border-gray-300 hover:border-gray-400 bg-transparent"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3">
              Sign In
            </Button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account? <button className="text-blue-600 hover:text-blue-700 font-medium">Sign up</button>
          </p>
        </div>
      </div>
    </div>
  )
}

function GetStartedModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Let's Get Started</h2>
          <p className="text-gray-600 mt-2">Tell us about your project</p>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="john@company.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your Company"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Select a service</option>
              <option>Web Development</option>
              <option>Web3 Integration</option>
              <option>Mobile App</option>
              <option>UI/UX Design</option>
              <option>Business Intelligence</option>
              <option>Community Platform</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Details</label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Tell us about your project goals and requirements..."
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-2 border-gray-300 hover:border-gray-400 bg-transparent"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3">
              Submit Project Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [signInModalOpen, setSignInModalOpen] = useState(false)
  const [getStartedModalOpen, setGetStartedModalOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setMobileMenuOpen(false)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Modals */}
      <SignInModal isOpen={signInModalOpen} onClose={() => setSignInModalOpen(false)} />
      <GetStartedModal isOpen={getStartedModalOpen} onClose={() => setGetStartedModalOpen(false)} />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BizCreate
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("services")}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("portfolio")}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Work
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Reviews
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("team")}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Team
            </button>
          </nav>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
              onClick={() => setSignInModalOpen(true)}
            >
              Sign In
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              onClick={() => setGetStartedModalOpen(true)}
            >
              Get Started
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 z-50 shadow-xl">
            <div className="container py-6 flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection("services")}
                className="text-left text-lg font-medium py-3 hover:text-blue-600 transition-colors"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("portfolio")}
                className="text-left text-lg font-medium py-3 hover:text-blue-600 transition-colors"
              >
                Work
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="text-left text-lg font-medium py-3 hover:text-blue-600 transition-colors"
              >
                Reviews
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-left text-lg font-medium py-3 hover:text-blue-600 transition-colors"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection("team")}
                className="text-left text-lg font-medium py-3 hover:text-blue-600 transition-colors"
              >
                Team
              </button>
              <div className="flex flex-col gap-3 pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setSignInModalOpen(true)
                  }}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setGetStartedModalOpen(true)
                  }}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
          <div
            className="absolute top-20 -right-20 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          ></div>
          <div
            className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
            style={{ transform: `translateY(${scrollY * -0.1}px)` }}
          ></div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="flex flex-col space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-sm font-medium text-blue-700 w-fit">
                  <Zap className="h-4 w-4" />
                  Digital Innovation Studio
                </div>

                <div className="space-y-6">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                      Design that
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      converts
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                    We craft digital experiences that don&apos;t just look stunning—they drive results. From web3
                    integration to mobile apps, we build the future.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6"
                    onClick={() => setGetStartedModalOpen(true)}
                  >
                    Start Your Project
                    <ArrowUpRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-gray-300 hover:border-gray-400 text-lg px-8 py-6 group bg-transparent"
                  >
                    <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Watch Our Work
                  </Button>
                </div>

                <div className="flex gap-8 pt-8">
                  <div>
                    <div className="text-3xl font-bold text-gray-900">150+</div>
                    <div className="text-sm text-gray-600">Projects Delivered</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">98%</div>
                    <div className="text-sm text-gray-600">Client Satisfaction</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">$2M+</div>
                    <div className="text-sm text-gray-600">Revenue Generated</div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-white to-gray-50 p-8">
                  <Image
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop"
                    width={600}
                    height={400}
                    alt="Modern team collaborating on digital solutions with laptops and design tools"
                    className="rounded-2xl object-cover w-full"
                  />
                </div>

                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl"></div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="w-full py-20 md:py-32 relative">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-6 mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-sm font-medium text-blue-700">
                <Globe className="h-4 w-4" />
                Our Services
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                  Everything you need to
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  dominate digital
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From concept to launch, we handle every aspect of your digital transformation with cutting-edge
                technology and creative excellence.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Code className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Web Development</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Lightning-fast websites built with modern frameworks. Optimized for performance, SEO, and
                    conversions.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      Next.js
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">React</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      TypeScript
                    </span>
                  </div>
                </div>
              </div>

              <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Layers className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Web3 Integration</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Future-proof your business with blockchain technology, smart contracts, and decentralized solutions.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                      Ethereum
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                      Solidity
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                      Web3.js
                    </span>
                  </div>
                </div>
              </div>

              <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Smartphone className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Mobile Apps</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Native and cross-platform mobile experiences that users love. Built for scale and performance.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      React Native
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      Flutter
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      Swift
                    </span>
                  </div>
                </div>
              </div>

              <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-pink-200">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Palette className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">UI/UX Design</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Stunning designs that convert visitors into customers. User-centered approach with data-driven
                    insights.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs rounded-full font-medium">Figma</span>
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs rounded-full font-medium">
                      Adobe XD
                    </span>
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs rounded-full font-medium">Sketch</span>
                  </div>
                </div>
              </div>

              <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-200">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Business Intelligence</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Data-driven insights and automation tools to scale your business operations efficiently.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                      Analytics
                    </span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                      Automation
                    </span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                      AI/ML
                    </span>
                  </div>
                </div>
              </div>

              <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-indigo-200">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Community Platforms</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Build engaged communities around your brand with custom platforms and engagement tools.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                      Discord
                    </span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                      Forums
                    </span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                      Social
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="portfolio" className="w-full py-20 md:py-32 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-6 mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-sm font-medium text-blue-700">
                <Star className="h-4 w-4" />
                Featured Work
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                  Projects that
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  drive results
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Real projects, real results. See how we&apos;ve helped businesses transform their digital presence and
                achieve measurable growth.
              </p>
            </div>

            <div className="mb-12">
              <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <div className="flex justify-center mb-12">
                  <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 bg-white/50 backdrop-blur-sm p-2 rounded-2xl">
                    <TabsTrigger
                      value="all"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md"
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger
                      value="web"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md"
                    >
                      Web
                    </TabsTrigger>
                    <TabsTrigger
                      value="web3"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md"
                    >
                      Web3
                    </TabsTrigger>
                    <TabsTrigger
                      value="mobile"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md"
                    >
                      Mobile
                    </TabsTrigger>
                    <TabsTrigger
                      value="design"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md"
                    >
                      Design
                    </TabsTrigger>
                    <TabsTrigger
                      value="automation"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md"
                    >
                      AI/Auto
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="mt-0">
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <div className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100">
                      <div className="aspect-video overflow-hidden relative">
                        <Image
                          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop"
                          alt="Enterprise SaaS dashboard with analytics and data visualization"
                          width={800}
                          height={500}
                          className="object-cover transition-all duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button
                            size="sm"
                            className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
                          >
                            View Case Study
                            <ArrowUpRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-8">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span className="text-sm text-gray-500 font-medium">DataSync Pro</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-900">Enterprise SaaS Platform</h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          Scalable multi-tenant platform with advanced API integrations, real-time analytics, and
                          automated billing systems.
                        </p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                            Next.js
                          </span>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            Node.js
                          </span>
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                            PostgreSQL
                          </span>
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                            AWS
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">500+</div>
                            <div className="text-gray-500">Active Users</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">$50K+</div>
                            <div className="text-gray-500">Monthly Revenue</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">99.9%</div>
                            <div className="text-gray-500">Uptime</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">25%</div>
                            <div className="text-gray-500">Monthly Growth</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                      <div className="aspect-video overflow-hidden relative">
                        <Image
                          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop"
                          alt="NFT marketplace interface with digital art collections"
                          width={600}
                          height={400}
                          className="object-cover transition-all duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-4 right-4">
                          <div className="px-3 py-1 bg-purple-500 text-white text-xs rounded-full font-medium">
                            Web3
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                          <span className="text-sm text-gray-500">CryptoArt Collective</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900">NFT Marketplace</h3>
                        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                          Custom marketplace with smart contracts and wallet integration.
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-bold text-green-600">1,000+</div>
                            <div className="text-gray-500 text-xs">Users</div>
                          </div>
                          <div>
                            <div className="font-bold text-blue-600">$50K+</div>
                            <div className="text-gray-500 text-xs">Sales</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                      <div className="aspect-video overflow-hidden relative">
                        <Image
                          src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop"
                          alt="Mobile fitness app interface showing workout tracking"
                          width={600}
                          height={400}
                          className="object-cover transition-all duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-4 right-4">
                          <div className="px-3 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
                            Mobile
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-2 w-2 rounded-full bg-red-500"></div>
                          <span className="text-sm text-gray-500">FitLife Community</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900">Fitness App</h3>
                        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                          Cross-platform app with social features and premium subscriptions.
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-bold text-green-600">+60%</div>
                            <div className="text-gray-500 text-xs">Retention</div>
                          </div>
                          <div>
                            <div className="font-bold text-blue-600">4.8★</div>
                            <div className="text-gray-500 text-xs">Rating</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                      <div className="aspect-video overflow-hidden relative">
                        <Image
                          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"
                          alt="E-commerce platform dashboard with sales analytics"
                          width={600}
                          height={400}
                          className="object-cover transition-all duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-4 right-4">
                          <div className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full font-medium">Web</div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span className="text-sm text-gray-500">TechStart Solutions</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900">E-Commerce Platform</h3>
                        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                          Custom platform with subscription integration and analytics.
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-bold text-green-600">+40%</div>
                            <div className="text-gray-500 text-xs">Revenue</div>
                          </div>
                          <div>
                            <div className="font-bold text-blue-600">85%</div>
                            <div className="text-gray-500 text-xs">Retention</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="web" className="mt-0">
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <div className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                      <div className="aspect-video overflow-hidden">
                        <Image
                          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"
                          alt="E-Commerce Platform"
                          width={600}
                          height={400}
                          className="object-cover transition-all duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2">E-Commerce Platform</h3>
                        <p className="text-gray-600 mb-4">Custom Next.js platform with Stripe integration</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-bold text-green-600">+40%</div>
                            <div className="text-gray-500">Revenue</div>
                          </div>
                          <div>
                            <div className="font-bold text-blue-600">85%</div>
                            <div className="text-gray-500">Retention</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-gray-300 hover:border-gray-400 text-lg px-8 py-4 bg-transparent"
              >
                View All Projects
                <ArrowUpRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-6 mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-sm font-medium text-blue-700">
                <Star className="h-4 w-4" />
                Client Love
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                  What our clients
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  are saying
                </span>
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  &quot;BizCreate transformed our online presence completely. The new website increased our revenue by
                  40% in just 3 months. Their attention to detail is incredible.&quot;
                </p>
                <div className="flex items-center gap-4">
                  <Image
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"
                    alt="Sarah Johnson"
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Sarah Johnson</div>
                    <div className="text-sm text-gray-500">CEO, TechStart Solutions</div>
                  </div>
                </div>
              </div>

              <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  &quot;The Web3 integration was seamless. We launched our NFT marketplace in record time and hit $50K
                  in sales within 60 days. Exceptional work!&quot;
                </p>
                <div className="flex items-center gap-4">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
                    alt="Michael Chen"
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Michael Chen</div>
                    <div className="text-sm text-gray-500">Founder, CryptoArt Collective</div>
                  </div>
                </div>
              </div>

              <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  &quot;Our mobile app has a 4.8-star rating and 60% higher user retention. The design and functionality
                  exceeded all our expectations.&quot;
                </p>
                <div className="flex items-center gap-4">
                  <Image
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
                    alt="Jessica Williams"
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Jessica Williams</div>
                    <div className="text-sm text-gray-500">Director, FitLife Community</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="team" className="w-full py-20 md:py-32 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-6 mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-sm font-medium text-blue-700">
                <Users className="h-4 w-4" />
                Our Team
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                  Meet the experts
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  behind your success
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our diverse team of designers, developers, and strategists brings years of experience from top tech
                companies to deliver exceptional results.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center">
                <div className="relative mb-6">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                    alt="Alex Rodriguez - CEO & Founder"
                    width={150}
                    height={150}
                    className="rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Alex Rodriguez</h3>
                <p className="text-blue-600 font-medium mb-4">CEO & Founder</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Former Google engineer with 10+ years building scalable web applications. Passionate about turning
                  ideas into digital reality.
                </p>
                <div className="flex justify-center gap-3">
                  <Link href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </Link>
                  <Link href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                    <Twitter className="h-5 w-5" />
                  </Link>
                  <Link href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                    <Github className="h-5 w-5" />
                  </Link>
                </div>
              </div>

              <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center">
                <div className="relative mb-6">
                  <Image
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
                    alt="Sarah Chen - Lead Designer"
                    width={150}
                    height={150}
                    className="rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Palette className="h-4 w-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sarah Chen</h3>
                <p className="text-pink-600 font-medium mb-4">Lead Designer</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Award-winning designer from Apple with expertise in user experience and interface design. Creates
                  beautiful, conversion-focused designs.
                </p>
                <div className="flex justify-center gap-3">
                  <Link href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </Link>
                  <Link href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
                    <Twitter className="h-5 w-5" />
                  </Link>
                  <Link href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
                    <Instagram className="h-5 w-5" />
                  </Link>
                </div>
              </div>

              <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center">
                <div className="relative mb-6">
                  <Image
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                    alt="Marcus Johnson - CTO"
                    width={150}
                    height={150}
                    className="rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Code className="h-4 w-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Marcus Johnson</h3>
                <p className="text-green-600 font-medium mb-4">CTO & Web3 Expert</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Blockchain pioneer and former Microsoft architect. Specializes in Web3 integration, smart contracts,
                  and decentralized applications.
                </p>
                <div className="flex justify-center gap-3">
                  <Link href="#" className="text-gray-400 hover:text-green-600 transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </Link>
                  <Link href="#" className="text-gray-400 hover:text-green-600 transition-colors">
                    <Twitter className="h-5 w-5" />
                  </Link>
                  <Link href="#" className="text-gray-400 hover:text-green-600 transition-colors">
                    <Github className="h-5 w-5" />
                  </Link>
                </div>
              </div>

              <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center">
                <div className="relative mb-6">
                  <Image
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
                    alt="Emily Davis - Mobile Lead"
                    width={150}
                    height={150}
                    className="rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <Smartphone className="h-4 w-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Emily Davis</h3>
                <p className="text-purple-600 font-medium mb-4">Mobile Development Lead</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  React Native specialist with apps in the App Store reaching millions of users. Expert in
                  cross-platform mobile development.
                </p>
                <div className="flex justify-center gap-3">
                  <Link href="#" className="text-gray-400 hover:text-purple-600 transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </Link>
                  <Link href="#" className="text-gray-400 hover:text-purple-600 transition-colors">
                    <Twitter className="h-5 w-5" />
                  </Link>
                  <Link href="#" className="text-gray-400 hover:text-purple-600 transition-colors">
                    <Github className="h-5 w-5" />
                  </Link>
                </div>
              </div>

              <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center">
                <div className="relative mb-6">
                  <Image
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
                    alt="David Kim - Data Scientist"
                    width={150}
                    height={150}
                    className="rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">David Kim</h3>
                <p className="text-orange-600 font-medium mb-4">Data Scientist & AI Expert</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  PhD in Machine Learning from Stanford. Builds intelligent systems that help businesses make
                  data-driven decisions and automate processes.
                </p>
                <div className="flex justify-center gap-3">
                  <Link href="#" className="text-gray-400 hover:text-orange-600 transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </Link>
                  <Link href="#" className="text-gray-400 hover:text-orange-600 transition-colors">
                    <Twitter className="h-5 w-5" />
                  </Link>
                  <Link href="#" className="text-gray-400 hover:text-orange-600 transition-colors">
                    <Github className="h-5 w-5" />
                  </Link>
                </div>
              </div>

              <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center">
                <div className="relative mb-6">
                  <Image
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face"
                    alt="Lisa Thompson - Project Manager"
                    width={150}
                    height={150}
                    className="rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Lisa Thompson</h3>
                <p className="text-indigo-600 font-medium mb-4">Senior Project Manager</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Agile certified PM with 8+ years managing complex digital projects. Ensures every project is delivered
                  on time, on budget, and exceeds expectations.
                </p>
                <div className="flex justify-center gap-3">
                  <Link href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </Link>
                  <Link href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                    <Twitter className="h-5 w-5" />
                  </Link>
                  <Link href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                    <Mail className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="text-center mt-16">
              <div className="inline-flex items-center gap-4 px-8 py-4 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">Join our team!</span> We're always looking for talented
                  individuals.
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  View Careers
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-20 md:py-32 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-6 mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-sm font-medium text-blue-700">
                <Zap className="h-4 w-4" />
                Pricing Plans
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                  Transparent pricing
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  for every stage
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From startups to enterprise, we have the perfect plan to accelerate your digital transformation.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
              <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                  <p className="text-gray-600 mb-6">Perfect for small businesses</p>
                  <div className="text-5xl font-bold text-gray-900 mb-2">$999</div>
                  <div className="text-gray-500">per project</div>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Responsive website design</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Basic SEO optimization</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Content management system</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">1 month support</span>
                  </li>
                </ul>

                <Button
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3"
                  onClick={() => setGetStartedModalOpen(true)}
                >
                  Get Started
                </Button>
              </div>

              <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 shadow-2xl text-white transform scale-105">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Professional</h3>
                  <p className="text-blue-100 mb-6">For growing businesses</p>
                  <div className="text-5xl font-bold mb-2">$2,499</div>
                  <div className="text-blue-200">per project</div>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span>Advanced web development</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span>E-commerce functionality</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span>Custom integrations</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span>3 months support</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span>Basic Web3 integration</span>
                  </li>
                </ul>

                <Button
                  className="w-full bg-white text-blue-600 hover:bg-gray-50 py-3 font-semibold"
                  onClick={() => setGetStartedModalOpen(true)}
                >
                  Get Started
                </Button>
              </div>

              <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                  <p className="text-gray-600 mb-6">Custom solutions</p>
                  <div className="text-5xl font-bold text-gray-900 mb-2">Custom</div>
                  <div className="text-gray-500">contact us</div>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Full-stack development</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Advanced Web3 integration</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Mobile app development</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">12 months support</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Dedicated team</span>
                  </li>
                </ul>

                <Button
                  variant="outline"
                  className="w-full border-2 border-gray-300 hover:border-gray-400 py-3 bg-transparent"
                  onClick={() => setGetStartedModalOpen(true)}
                >
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="text-center space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Ready to build something
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  extraordinary?
                </span>
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                Let&apos;s discuss your project and create a digital experience that drives real results for your
                business.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-8 py-6 shadow-xl"
                  onClick={() => setGetStartedModalOpen(true)}
                >
                  Start Your Project
                  <ArrowUpRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 bg-transparent"
                >
                  Schedule a Call
                </Button>
              </div>

              <div className="flex items-center justify-center gap-8 pt-8 text-blue-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">24h</div>
                  <div className="text-sm">Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-sm">Satisfaction Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">150+</div>
                  <div className="text-sm">Projects Delivered</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full bg-gray-900 text-white py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-4">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold">BizCreate</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Digital solutions for modern businesses. We craft experiences that convert and scale.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-6 w-6" />
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-lg font-semibold">Services</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Web Development
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Web3 Integration
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Mobile Apps
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    UI/UX Design
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-lg font-semibold">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Our Work
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-lg font-semibold">Resources</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">© 2025 BizCreate. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
