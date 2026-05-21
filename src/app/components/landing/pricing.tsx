"use client"

import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Button } from "../ui/button"
import { cn } from "../ui/utils"
import { Check, Sparkles } from "lucide-react"

interface Feature {
  id: number
  name: string
}

interface Plan {
  id: number
  name: string
  price: number
  duration: string
  Features: Feature[]
}

interface PricingProps {
  openLogin: () => void
}

const API_BASE_URL = import.meta.env.VITE_API_URL

export function Pricing({ openLogin }: PricingProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

  const sectionRef = useRef<HTMLElement>(null)

  const navigate = useNavigate()

  useEffect(() => {
    fetchPlans()

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const fetchPlans = async () => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/public/plans`
      )

      setPlans(data.data || [])
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePlanClick = () => {
    const token = localStorage.getItem("token")
    const expiresAt = localStorage.getItem("token_expires_at")

    if (token && expiresAt) {
      if (new Date() <= new Date(expiresAt)) {
        navigate("/dashboard")
      } else {
        localStorage.removeItem("token")
        localStorage.removeItem("admin")
        localStorage.removeItem("token_expires_at")

        openLogin()
      }
    } else {
      openLogin()
    }
  }

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-page-card/30 via-page-background to-page-card/30" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-white/20 mb-6 transition-all duration-700",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            )}
          >
            <span className="text-sm text-white font-medium">
              Pricing Plans
            </span>
          </div>

          <h2
            className={cn(
              "text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 transition-all duration-700 delay-100 text-balance",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            )}
          >
            Simple Pricing for{" "}
            <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              Every Restaurant
            </span>
          </h2>

          <p
            className={cn(
              "text-lg text-muted-foreground transition-all duration-700 delay-200 text-pretty",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            )}
          >
            Choose the perfect plan for your restaurant business.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center text-white text-lg">
            Loading plans...
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => {
              const isPopular = index === 1

              return (
                <div
                  key={plan.id}
                  className={cn(
                    "relative group rounded-2xl transition-all duration-500",
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8",
                    isPopular && "lg:-mt-4 lg:mb-4"
                  )}
                  style={{
                    transitionDelay: isVisible
                      ? `${300 + index * 100}ms`
                      : "0ms",
                  }}
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <div className="flex items-center gap-1.5 px-4 py-1.5 bg-primary rounded-full text-sm font-semibold text-primary-foreground shadow-lg">
                        <Sparkles className="w-4 h-4" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  {/* Card */}
                  <div
                    className={cn(
                      "h-full bg-page-card rounded-2xl p-6 lg:p-8 border transition-all duration-300 relative overflow-hidden",
                      "border-page-border hover:border-primary hover:shadow-lg hover:shadow-primary/20"
                    )}
                  >
                    {/* Glow */}
                    {isPopular && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                    )}

                    <div className="relative z-10 flex flex-col h-full justify-between">
                      {/* Top Content */}
                      <div>
                        {/* Plan Name */}
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {plan.name}
                        </h3>

                        {/* Duration */}
                        <p className="text-sm text-muted-foreground mb-6">
                          {plan.duration} Days Plan
                        </p>

                        {/* Price */}
                        <div className="flex items-baseline gap-1 mb-6">
                          <span className="text-4xl lg:text-5xl font-bold text-white">
                            ₹{plan.price}
                          </span>

                          <span className="text-muted-foreground">
                            / month
                          </span>
                        </div>

                        {/* Features */}
                        <ul className="space-y-3 mb-8">
                          {plan.Features?.map((feature) => (
                            <li
                              key={feature.id}
                              className="flex items-center gap-3"
                            >
                              <div className="w-5 h-5 rounded-full flex items-center justify-center bg-page-secondary">
                                <Check className="w-3 h-3 text-muted-foreground" />
                              </div>

                              <span className="text-sm text-white">
                                {feature.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Bottom Button */}
                      <Button
                        onClick={handlePlanClick}
                        className={cn(
                          "w-full h-12 font-semibold transition-all duration-300 border mt-6",
                          "bg-page-secondary text-white hover:bg-page-secondary/80 hover:border-primary/50 border-border"
                        )}
                      >
                        Get Started
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Footer */}
        <p
          className={cn(
            "text-center text-sm text-muted-foreground mt-12 transition-all duration-700",
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          )}
          style={{
            transitionDelay: isVisible ? "700ms" : "0ms",
          }}
        >
          30-day money-back guarantee • Cancel anytime
        </p>
      </div>
    </section>
  )
}