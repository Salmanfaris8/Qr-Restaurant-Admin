"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"
import { cn } from "../ui/utils"
import { ArrowRight, Sparkles } from "lucide-react"

export function CTA() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-page-background via-page-card to-page-background" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated waves/gradient */}
        <div className="absolute top-0 left-0 right-0 h-full">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 animate-gradient-x" />
        </div>
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div
          className={cn(
            "max-w-4xl mx-auto text-center transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {/* Badge */}
          <div
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 transition-all duration-700",
              isVisible
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95"
            )}
          >
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">
              14-Day Free Trial
            </span>
          </div>

          {/* Heading */}
          <h2
            className={cn(
              "text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 transition-all duration-700 delay-100 text-balance",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            )}
          >
            Start Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
              Free Trial
            </span>{" "}
            Today
          </h2>

          {/* Description */}
          <p
            className={cn(
              "text-lg lg:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto transition-all duration-700 delay-200 text-pretty",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            )}
          >
            Join thousands of restaurants already using QR Menu Pro. No credit
            card required. Set up in minutes.
          </p>

          {/* CTA Buttons */}
          <div
            className={cn(
              "flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-300",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            )}
          >
            <Button
              size="lg"
              className="h-14 px-10 bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30 group"
            >
              Sign Up Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-10 border-border bg-page-card/50 text-foreground font-semibold text-lg hover:bg-page-card hover:border-primary/50 transition-all duration-300"
            >
              Schedule Demo
            </Button>
          </div>

          {/* Trust indicators */}
          <div
            className={cn(
              "flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-muted-foreground transition-all duration-700 delay-500",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            )}
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Setup in 5 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
