"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp"
import { Label } from "../ui/label"
import { Mail, ArrowLeft, Loader2 } from "lucide-react"
import axios from "axios"
import { GoogleLogin } from "@react-oauth/google"
import { useNavigate } from "react-router-dom"

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function LoginDialog({ open, onOpenChange, onSuccess }: LoginDialogProps) {
  const [step, setStep] = useState<"method" | "email" | "otp">("method")
  const [email, setEmail] = useState("")
  const [mobile, setMobile] = useState("")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [errors, setErrors] = useState({
    email: "",
    mobile: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const API_BASE_URL = import.meta.env.VITE_API_URL
  

  const TOKEN_KEY = "token"
  const ADMIN_KEY = "admin"
  const EXPIRES_KEY = "token_expires_at"

  const saveToken = (token: string, admin: any) => {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admin))
    localStorage.setItem(EXPIRES_KEY, expiresAt)
  }

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(value)
  }

  const validateMobile = (value) => {
    const regex = /^[6-9]\d{9}$/   // Indian numbers
    return regex.test(value)
  }

  const isFormValid =
  validateEmail(email) && validateMobile(mobile)

  useEffect(() => {
    if (!error) return

    const timer = setTimeout(() => {
      setError("")
    }, 3000) // 3 seconds

    return () => clearTimeout(timer)
  }, [error])

  // ✅ FIXED GOOGLE LOGIN
  const handleGoogleLogin = async (credentialResponse: any) => {
    setIsLoading(true)
    setError("") 

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/hotel-admin/google-login`,
        {
          token: credentialResponse.credential,
        }
      )

      saveToken(data.token, data.admin)
      onSuccess?.()
      navigate("/dashboard")

      onSuccess?.() // ✅ trigger success (no navigate here)
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendOtp = async () => {
    if (!email) return
    setIsLoading(true)
    setError("") 

    try {
      await axios.post(`${API_BASE_URL}/hotel-admin/send-otp`, { email, mobile })
      setStep("otp")
    } catch (err) {
      setError(
      err?.response?.data?.message
    )
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return
    setIsLoading(true)
    setError("") 

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/hotel-admin/verify-otp`,
        { email, otp }
      )

      saveToken(data.token, data.admin)

      onSuccess?.()
      navigate("/dashboard")
    } catch (err:any) {
      setError(
      err?.response?.data?.message
    )
    } finally {
      setIsLoading(false)
    }
  }

  const resetDialog = () => {
    setStep("method")
    setEmail("")
    setOtp("")
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetDialog()
      onOpenChange(isOpen)
    }}>
      <DialogContent className="sm:max-w-md bg-page-card border-page-border text-white">
        
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-white">
            {step === "method" && "Welcome Back"}
            {step === "email" && "Enter Your Email"}
            {step === "otp" && "Verify Your Email"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {step === "method" && "Sign in to access your dashboard"}
            {step === "email" && "We'll send you a verification code"}
            {step === "otp" && `We sent a code to ${email}`}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mb-4 p-4 rounded-xl 
            bg-gradient-to-br from-[#1A1A1D] to-[#0F0F11]
            border border-red-500/30
            shadow-[0_0_20px_rgba(220,38,38,0.15)]
            backdrop-blur-sm
            flex items-center gap-3
          ">
            {/* Icon */}
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <span className="text-red-500 text-sm font-bold">!</span>
            </div>

            {/* Text */}
            <p className="text-sm text-red-400 leading-relaxed">
              {error}
            </p>
          </div>
        )}

        <div>
          {step === "method" && (
            <div className="flex flex-col gap-4">
              
              {/* ✅ FIXED GOOGLE */}
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => console.log("Google login failed")}
              />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-page-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-page-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button
                onClick={() => setStep("email")}
                className="w-full h-12 text-white cursor-pointer border border-page-border"
              >
                <Mail className="w-5 h-5 mr-2" />
                Continue with Email
              </Button>
            </div>
          )}

          {step === "email" && (
            <div className="flex flex-col gap-4">
              {/* <Button
                variant="ghost"
                className="w-fit -ml-2"
                onClick={() => setStep("method")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button> */}

              <div className="space-y-3">
                <Label className="text-white text-sm">Email</Label>
                <Input
                  className={`h-10 px-4 text-lg font-semibold bg-white text-black ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  type="email"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => {
                    const value = e.target.value
                    setEmail(value)

                    if (!validateEmail(value)) {
                      setErrors((prev) => ({ ...prev, email: "Invalid email format" }))
                    } else {
                      setErrors((prev) => ({ ...prev, email: "" }))
                    }
                  }}
                />
                {errors.email && (
                  <p className="text-red-400 text-sm">{errors.email}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-white text-sm">Mobile Number</Label>
                <Input
                  className={`h-10 px-4 text-lg font-semibold bg-white text-black ${
                    errors.mobile ? "border-red-500" : ""
                  }`}
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter Your Mobile Number"
                  value={mobile}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "")
                    setMobile(value)

                    if (!validateMobile(value)) {
                      setErrors((prev) => ({
                        ...prev,
                        mobile: "Enter valid 10-digit number",
                      }))
                    } else {
                      setErrors((prev) => ({ ...prev, mobile: "" }))
                    }
                  }}
                />
                {errors.mobile && (
                  <p className="text-red-400 text-sm">{errors.mobile}</p>
                )}
              </div>

              <Button
                onClick={handleSendOtp}
                disabled={!isFormValid || isLoading}
                className={`
                  w-full transition-all duration-300 mt-2
                  ${email && !isLoading
                    ? "bg-[#DDA754] hover:bg-[#c8953f] active:bg-[#b8842f] active:scale-95 text-black"
                    : "bg-gray-400 cursor-not-allowed text-white"}
                `}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Send Code"
                )}
              </Button>
            </div>
          )}

          {step === "otp" && (
            <div className="flex flex-col items-center gap-4 mt-0">
              <Button variant="ghost" onClick={() => setStep("email")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <InputOTP
                value={otp}
                onChange={(value) => {
                  // 🔒 Allow only numbers
                  const numeric = value.replace(/\D/g, "")
                  setOtp(numeric)
                }}
                maxLength={6}
                inputMode="numeric"
                pattern="\d*"
              >
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="
                        w-12 h-14 text-xl font-bold
                        bg-gray-50 border border-gray-300
                        rounded-lg
                        text-black [&>*]:text-black caret-black
                        focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                        transition-all
                      "
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>

              <Button 
                onClick={handleVerifyOtp} 
                disabled={otp.length !== 6 || isLoading}
                className={`
                  w-full transition-all duration-300
                  ${otp.length === 6 
                    ? "bg-[#DDA754] hover:bg-[#c8953f] text-black" 
                    : ""}
                `}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Verify"
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}