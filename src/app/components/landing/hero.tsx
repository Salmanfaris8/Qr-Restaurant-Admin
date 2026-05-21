"use client"

import { useEffect, useRef } from "react"
import { Button } from "../ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function Hero() {
  const qrRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = qrRef.current
    if (!svg) return

    const paths = svg.querySelectorAll("rect")
    paths.forEach((path, index) => {
      path.style.opacity = "0"
      path.style.transform = "scale(0)"
      path.style.transformOrigin = "center"
      path.style.transition = `all 0.3s ease ${index * 0.02}s`
      
      setTimeout(() => {
        path.style.opacity = "1"
        path.style.transform = "scale(1)"
      }, 500)
    })
  }, [])

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-[#0A0A0C]"
    >
      {/* Faint Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#DDA754]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="text-center lg:text-left order-2 lg:order-1 pt-12 lg:pt-0">
            <h1 className="text-5xl sm:text-6xl lg:text-[80px] font-bold leading-[1.1] mb-6 tracking-tight">
              <span className="text-white block">Bring Your</span>
              <span className="text-white block">Restaurant</span>
              <span className="text-[#DDA754] block mt-2">Menu to Life</span>
            </h1>

            <p className="text-lg lg:text-[22px] text-[#A0A0A0] max-w-xl mx-auto lg:mx-0 leading-relaxed text-pretty font-light">
              Generate QR code menus for your customers instantly
              and elegantly. Transform the dining experience with
              beautiful digital menus.
            </p>
          </div>

          {/* QR Code Animation */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end animate-in fade-in zoom-in-95 duration-1000 delay-300 relative">
            <div className="relative">
              
              {/* Connecting line for floating card */}
              <svg className="absolute -top-10 -right-4 w-40 h-32 pointer-events-none z-0" viewBox="0 0 160 128">
                <path d="M 120,40 L 40,40 Q 20,40 20,60 L 20,100" fill="none" stroke="#DDA754" strokeWidth="1" strokeOpacity="0.4" />
              </svg>

              {/* QR Code Container */}
              <div className="relative z-10 bg-[#16171B] p-8 lg:p-12 rounded-[2rem] border border-white/5 shadow-2xl">
                
                {/* Floating menu cards */}
                <div className="absolute -top-8 left-60 bg-[#1A1C20] border border-white/5 rounded-2xl p-4 shadow-xl z-20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#DDA754]/20 flex items-center justify-center">
                       <div className="w-7 h-7 rounded-[4px] bg-[#DDA754]" />
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <div className="w-16 h-2 bg-[#404040] rounded-full" />
                      <div className="w-10 h-2 bg-[#DDA754]/70 rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 bg-[#1A1C20] border border-white/5 rounded-2xl p-3 shadow-xl z-20">
                  <div className="w-12 h-12 rounded-xl bg-[#DDA754]/20 flex items-center justify-center">
                    <div className="w-7 h-7 rounded-[4px] bg-[#DDA754]" />
                  </div>
                </div>

                {/* QR Code SVG */}
                <svg
                  ref={qrRef}
                  viewBox="0 0 200 200"
                  className="w-56 h-56 lg:w-72 lg:h-72"
                >
                  {/* QR Code Pattern */}
                  {[...Array(11)].map((_, row) =>
                    [...Array(11)].map((_, col) => {
                      // Center block area to keep clear
                      const isCenter = row >= 4 && row <= 6 && col >= 4 && col <= 6
                      if (isCenter) return null;

                      // Top-left, Top-right, Bottom-left corners are usually solid
                      const isCorner =
                        (row < 3 && col < 3) ||
                        (row < 3 && col > 7) ||
                        (row > 7 && col < 3)
                      
                      const shouldFill = isCorner || Math.random() > 0.4
                      const color = Math.random() > 0.65 ? "fill-white" : "fill-[#DDA754]"
                      
                      return shouldFill ? (
                        <rect
                          key={`${row}-${col}`}
                          x={col * 18 + 2}
                          y={row * 18 + 2}
                          width={14}
                          height={14}
                          rx={4}
                          className={isCorner ? "fill-[#DDA754]" : color}
                        />
                      ) : null
                    })
                  )}
                  {/* Center logo area */}
                  <rect
                    x="71"
                    y="71"
                    width="56"
                    height="56"
                    rx="12"
                    className="fill-[#DDA754]"
                  />
                  <text
                    x="99"
                    y="105"
                    textAnchor="middle"
                    className="fill-black text-[22px] font-bold"
                  >
                    QR
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#05070A] to-transparent" />
    </section>
  )
}
