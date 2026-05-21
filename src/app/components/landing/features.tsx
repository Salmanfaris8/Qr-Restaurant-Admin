"use client"

import { useEffect, useRef, useState } from "react"
import { QrCode, Edit3, BarChart3, Smartphone } from "lucide-react"
import { cn } from "../ui/utils"

const features = [
  {
    icon: QrCode,
    title: "QR Code Menu Generator",
    description:
      "Create stunning QR codes that link directly to your digital menu. Customize colors and styles to match your brand.",
  },
  {
    icon: Edit3,
    title: "Easy Menu Editing",
    description:
      "Update your menu in real-time. Add dishes, change prices, or update descriptions instantly without reprinting.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description:
      "Track menu views, popular items, and customer engagement. Make data-driven decisions to boost sales.",
  },
  {
    icon: Smartphone,
    title: "Mobile-Friendly Design",
    description:
      "Beautiful menus optimized for any device. Your customers get a seamless experience on phones and tablets.",
  },
]

export function Features() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
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

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-black" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-page-color/10 border border-page-color/20 mb-6 transition-all duration-700",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            )}
          >
            <span className="text-sm text-page-color font-medium">Features</span>
          </div>

          <h2
            className={cn(
              "text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 transition-all duration-700 delay-100 text-balance",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            )}
          >
            Everything You Need to{" "}
            <span className="text-page-color bg-clip-text bg-gradient-to-r from-page-color to-page-color/80">
              Digitize Your Menu
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
            Powerful tools designed specifically for restaurants. Create, manage,
            and analyze your digital menus with ease.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "group relative bg-page-card rounded-2xl p-6 lg:p-8 border border-page-border transition-all duration-500 hover:border-page-color/50 hover:shadow-xl hover:shadow-page-color/5 hover:-translate-y-2",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              )}
              style={{
                transitionDelay: isVisible ? `${300 + index * 100}ms` : "0ms",
              }}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-page-color/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-page-color/20 to-page-color/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-page-color" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-page-color transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
