"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "../ui/utils"
import { Star, Scan } from "lucide-react"

const menuItems = [
  {
    name: "Grilled Salmon",
    description: "Fresh Atlantic salmon with herb butter sauce",
    price: "$28",
    rating: 4.9,
    image: "🍣",
    category: "Main Course",
  },
  {
    name: "Truffle Risotto",
    description: "Creamy arborio rice with black truffle shavings",
    price: "$32",
    rating: 4.8,
    image: "🍝",
    category: "Main Course",
  },
  {
    name: "Wagyu Steak",
    description: "A5 grade wagyu with seasonal vegetables",
    price: "$85",
    rating: 5.0,
    image: "🥩",
    category: "Premium",
  },
  {
    name: "Crème Brûlée",
    description: "Classic vanilla custard with caramelized sugar",
    price: "$14",
    rating: 4.7,
    image: "🍮",
    category: "Dessert",
  },
]

export function MenuPreview() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeCard, setActiveCard] = useState(0)
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

  useEffect(() => {
    if (!isVisible) return
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % menuItems.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [isVisible])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden bg-black"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-page-background to-page-card/30" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div
            className={cn(
              "transition-all duration-700",
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            )}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-white/20 mb-6">
              <span className="text-sm text-white font-medium">Menu Preview</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
              Beautiful Menus That{" "}
              <span className="text-gray-600 bg-clip-text bg-gradient-to-r from-gold to-gold-light">
                Impress Customers
              </span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Your dishes deserve to be showcased beautifully. Our menu cards are
              designed to make your food look irresistible and your prices clear.
            </p>

            {/* Feature list */}
            <ul className="space-y-4 mb-8">
              {[
                "High-quality image support for every dish",
                "Customizable categories and sections",
                "Real-time price and availability updates",
                "Dietary and allergen information display",
              ].map((item, index) => (
                <li
                  key={index}
                  className={cn(
                    "flex items-center gap-3 transition-all duration-500",
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-4"
                  )}
                  style={{
                    transitionDelay: isVisible ? `${400 + index * 100}ms` : "0ms",
                  }}
                >
                  <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gold" />
                  </div>
                  <span className="text-white">{item}</span>
                </li>
              ))}
            </ul>

            {/* QR Scan Animation */}
            <div
              className={cn(
                "inline-flex items-center gap-4 px-6 py-4 bg-page-card rounded-xl border border-border transition-all duration-700",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: isVisible ? "800ms" : "0ms" }}
            >
              <div className="relative">
                <div className="w-16 h-16 bg-foreground rounded-lg flex items-center justify-center">
                  <div className="absolute inset-0 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-white animate-scan-slow" />
                  </div>
                  <Scan className="w-8 h-8 text-page-background relative z-10" />
                </div>
              </div>
              <div>
                <p className="font-semibold text-white">Instant Access</p>
                <p className="text-sm text-muted-foreground">
                  Customers scan & view in seconds
                </p>
              </div>
            </div>
          </div>

          {/* Menu Cards Preview */}
          <div
            className={cn(
              "relative transition-all duration-700 delay-300",
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            )}
          >
            {/* Phone Frame */}
            <div className="relative mx-auto max-w-sm">
              {/* Phone outline */}
              <div className="relative bg-page-card rounded-[3rem] p-3 border-4 border-page-border shadow-2xl">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-page-card rounded-b-2xl z-20" />
                
                {/* Screen */}
                <div className="bg-page-background rounded-[2.5rem] overflow-hidden">
                  {/* Status bar */}
                  <div className="px-6 py-3 flex justify-between items-center text-xs text-muted-foreground">
                    <span>9:41</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-2 bg-muted-foreground/50 rounded-sm" />
                      <div className="w-4 h-2 bg-muted-foreground/50 rounded-sm" />
                      <div className="w-6 h-2 bg-gold rounded-sm" />
                    </div>
                  </div>

                  {/* Menu Header */}
                  <div className="px-6 py-4 border-b border-border">
                    <h3 className="text-lg font-semibold text-white">
                      The Golden Fork
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Fine Dining Experience
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="p-4 space-y-3 max-h-96 overflow-hidden">
                    {menuItems.map((item, index) => (
                      <div
                        key={index}
                        className={cn(
                          "bg-page-card rounded-xl p-4 border transition-all duration-500",
                          activeCard === index
                            ? "border-gold shadow-lg shadow-gold/10 scale-[1.02]"
                            : "border-border"
                        )}
                      >
                        <div className="flex gap-4">
                          {/* Food emoji as placeholder */}
                          <div className="w-16 h-16 rounded-lg bg-page-secondary flex items-center justify-center text-3xl shrink-0">
                            {item.image}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-semibold text-white truncate">
                                {item.name}
                              </h4>
                              <span className="text-white font-bold whitespace-nowrap">
                                {item.price}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {item.description}
                            </p>
                            <div className="flex items-center gap-1 mt-2">
                              <Star className="w-3 h-3 fill-gold text-white" />
                              <span className="text-xs text-white font-medium">
                                {item.rating}
                              </span>
                              <span className="text-xs text-muted-foreground ml-2">
                                {item.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-gold/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gold/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
