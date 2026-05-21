"use client"

import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Menu, X, QrCodeIcon, User, LogOut } from "lucide-react"
import { cn } from "../ui/utils"
import { LoginDialog } from "./login-dialog"

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
]

interface HeaderProps {
  isLoggedIn?: boolean
  userName?: string
  onLogin?: () => void
  onLogout?: () => void
}

export function Header({ isLoggedIn = false, userName = "", onLogin, onLogout }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 20)

    const sections = navLinks.map(link => link.href.slice(1))

    let currentSection = "home"
    let minDistance = Infinity

    sections.forEach((section) => {
      const el = document.getElementById(section)
      if (!el) return

      const rect = el.getBoundingClientRect()

      // distance from top (adjust for navbar height)
      const distance = Math.abs(rect.top - 100)

      if (distance < minDistance) {
        minDistance = distance
        currentSection = section
      }
    })

    setActiveSection(currentSection)
  }

  window.addEventListener("scroll", handleScroll)
  return () => window.removeEventListener("scroll", handleScroll)
}, [])

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-[#0A0A0C] backdrop-blur-lg border-b border-border shadow-lg shadow-black/10"
            : "bg-black"
        )}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#home" className="flex items-center gap-2 group">
              <div className="relative flex items-center justify-center w-9 h-9 bg-[#DDA754] rounded-[8px] shrink-0">
                <div className="grid grid-cols-2 gap-[3px]">
                  <div className="w-[5px] h-[5px] border-[1.5px] border-[#0A0A0A] rounded-[2px]"></div>
                  <div className="w-[5px] h-[5px] border-[1.5px] border-[#0A0A0A] rounded-[2px]"></div>
                  <div className="w-[5px] h-[5px] border-[1.5px] border-[#0A0A0A] rounded-[2px]"></div>
                  <div className="w-[5px] h-[5px] bg-[#0A0A0A] rounded-[2px]"></div>
                </div>
              </div>
              <span className="text-[22px] font-bold text-white tracking-wide ml-1">
                QRMenuPro
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative text-[15px] font-medium transition-colors duration-300 hover:text-[#DDA754]",
                    activeSection === link.href.slice(1)
                      ? "text-[#DDA754]"
                      : "text-[#A0A0A0]"
                  )}
                >
                  {link.label}
                  {activeSection === link.href.slice(1) && (
                    <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#DDA754] rounded-full" />
                  )}
                </a>
              ))}
            </div>

            {/* Auth Section */}
            <div className="hidden lg:flex items-center gap-4">
              {isLoggedIn ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-page-card/50 rounded-full border border-border animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#DDA754] to-[#DDA754]/80 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-white">
                      {userName || "Owner"}
                    </span>
                  </div>
                  <a href="https://admin.qkwash.com" target="_blank">
                    <Button 
                      className="bg-[#DDA754] text-black font-semibold hover:bg-[#DDA754]/90 transition-all duration-300 hover:scale-105"
                    >
                      Dashboard
                    </Button>
                  </a>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onLogout}
                    className="text-[#A0A0A0] hover:text-white hover:bg-white/10"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowLoginDialog(true)}
                  className="bg-[#DDA754] text-black font-semibold hover:bg-[#DDA754]/90 transition-all duration-300 rounded-[8px] px-8 py-2"
                >
                  Login
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-foreground p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border transition-all duration-300 overflow-hidden",
            isMobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "text-base font-medium py-2 transition-colors",
                  activeSection === link.href.slice(1)
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-border">
              {isLoggedIn ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-foreground">{userName || "Owner"}</span>
                  </div>
                  <a href="https://admin.qkwash.com" target="_blank">
                    <Button className="w-full bg-primary text-primary-foreground">
                      Dashboard
                    </Button>
                  </a>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    setShowLoginDialog(true)
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full bg-primary text-primary-foreground"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <LoginDialog 
        open={showLoginDialog} 
        onOpenChange={setShowLoginDialog}
        onSuccess={() => {
          onLogin?.()
          setShowLoginDialog(false)
        }}
      />
    </>
  )
}
