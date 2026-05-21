"use client"

import { useState, useCallback } from "react"

import { Header } from "../components/landing/header"
import { Hero } from "../components/landing/hero"
import { Features } from "../components/landing/features"
import { MenuPreview } from "../components/landing/menu-preview"
import { Pricing } from "../components/landing/pricing"
import { Testimonials } from "../components/landing/testimonials"
import { Footer } from "../components/landing/footer"
import { LoginDialog } from "../components/landing/login-dialog"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  const handleLogin = useCallback(() => {
    setIsLoggedIn(true)
    setUserName("Restaurant Owner")
  }, [])

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false)
    setUserName("")
    
    localStorage.removeItem("token")
    localStorage.removeItem("admin")
    localStorage.removeItem("token_expires_at")
  }, [])

  return (
    <main className="min-h-screen bg-black">
      <Header
        isLoggedIn={isLoggedIn}
        userName={userName}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <Hero />

      <Features />

      <MenuPreview />

      <Pricing
        openLogin={() => setShowLoginDialog(true)}
      />

      <Testimonials />

      {/* <CTA /> */}

      <Footer />

      {/* Global Login Popup */}
      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onSuccess={() => {
          handleLogin()
          setShowLoginDialog(false)
        }}
      />
    </main>
  )
}