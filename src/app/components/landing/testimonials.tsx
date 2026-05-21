"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { cn } from "../ui/utils"
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react"
import { Button } from "../ui/button"

const testimonials = [
  {
    quote:
      "QR Menu Pro transformed our restaurant operations. Customers love scanning the code and browsing our menu on their phones. Our table turnover increased by 20%!",
    author: "Maria Santos",
    role: "Owner, La Bella Italia",
    rating: 5,
    image: "MS",
  },
  {
    quote:
      "The analytics feature is a game-changer. We now know exactly which dishes are most popular and can optimize our menu accordingly. Incredible value for the price.",
    author: "James Chen",
    role: "Manager, Golden Dragon",
    rating: 5,
    image: "JC",
  },
  {
    quote:
      "Setup was incredibly easy - we had our digital menu running within an hour. The support team was also very helpful when we had questions about customization.",
    author: "Sophie Williams",
    role: "Owner, The Rustic Kitchen",
    rating: 5,
    image: "SW",
  },
  {
    quote:
      "We've tried other QR menu solutions, but none compare to QR Menu Pro. The design is elegant, it's easy to update, and our customers always compliment the experience.",
    author: "Ahmed Hassan",
    role: "Chef & Owner, Spice Route",
    rating: 5,
    image: "AH",
  },
]

const restaurantLogos = [
  "The Grand Hotel",
  "Bistro Milano",
  "Sakura Sushi",
  "Le Petit Café",
  "Urban Grill",
  "Ocean Blue",
]

export function Testimonials() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
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
    if (isPaused || !isVisible) return
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isPaused, isVisible])

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [])

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-page-background via-page-card/50 to-page-background" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-white/20 mb-6 transition-all duration-700",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            )}
          >
            <span className="text-sm text-white font-medium">Testimonials</span>
          </div>

          <h2
            className={cn(
              "text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 transition-all duration-700 delay-100 text-balance",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            )}
          >
            Trusted by{" "}
            <span className="text-gray-600 bg-clip-text bg-gradient-to-r from-gold to-gold-light">
              Restaurant Owners
            </span>{" "}
            Worldwide
          </h2>
        </div>

        {/* Testimonials Carousel */}
        <div
          className={cn(
            "max-w-4xl mx-auto transition-all duration-700 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative">
            {/* Quote icon */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <Quote className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>

            {/* Testimonial Card */}
            <div className="bg-page-card rounded-2xl p-8 lg:p-12 border border-border pt-12">
              <div className="relative overflow-hidden">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className={cn(
                      "transition-all duration-500",
                      activeIndex === index
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 absolute inset-0 translate-x-8"
                    )}
                    aria-hidden={activeIndex !== index}
                  >
                    {/* Rating */}
                    <div className="flex justify-center gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-amber-500 text-yellow-500"
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-lg lg:text-xl text-white text-center leading-relaxed mb-8">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                        {testimonial.image}
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-white">
                          {testimonial.author}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPrev}
                  className="rounded-full border-border bg-page-secondary hover:bg-page-secondary/80 hover:border-primary/50"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </Button>

                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        activeIndex === index
                          ? "bg-white w-6"
                          : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      )}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNext}
                  className="rounded-full border-border bg-page-secondary hover:bg-page-secondary/80 hover:border-primary/50"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Logos */}
        <div
          className={cn(
            "mt-16 lg:mt-20 transition-all duration-700 delay-400",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <p className="text-center text-sm text-muted-foreground mb-8">
            Trusted by leading restaurants worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
            {restaurantLogos.map((logo, index) => (
              <div
                key={index}
                className="text-muted-foreground/50 transition-colors duration-300 text-lg font-semibold"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
