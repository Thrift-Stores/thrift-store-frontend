"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { login, register, clearError } from "@/store/auth-slice"

export function AuthModals() {
  const router = useRouter()
  const { toast } = useToast()
  const dispatch = useAppDispatch()
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth)

  const [loginOpen, setLoginOpen] = useState(false)
  const [signupOpen, setSignupOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  useEffect(() => {
    const handleOpenLogin = () => setLoginOpen(true)
    const handleOpenSignup = () => setSignupOpen(true)

    window.addEventListener("open-login", handleOpenLogin)
    window.addEventListener("open-signup", handleOpenSignup)

    return () => {
      window.removeEventListener("open-login", handleOpenLogin)
      window.removeEventListener("open-signup", handleOpenSignup)
    }
  }, [])

  // Clear errors when modals open/close
  useEffect(() => {
    if (!loginOpen && !signupOpen && error) {
      dispatch(clearError())
    }
  }, [loginOpen, signupOpen, error, dispatch])

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      toast({
        title: "Success!",
        description: "You are now logged in.",
        duration: 3000,
      })

      // Close modals
      setLoginOpen(false);
      setSignupOpen(false);

      // Redirect to dashboard or home page
      // router.push("/dashboard")
    }
  }, [isAuthenticated, router, toast])

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await dispatch(
      login({
        email: loginEmail,
        password: loginPassword,
      }),
    )
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await dispatch(
      register({
        username: signupName,
        email: signupEmail,
        password: signupPassword,
      }),
    )
  }

  return (
    <>
      {/* Login Modal */}
      <Dialog
        open={loginOpen}
        onOpenChange={(open) => {
          setLoginOpen(open)
          if (!open) dispatch(clearError())
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Welcome Back</DialogTitle>
            <DialogDescription className="text-center">Log in to your account to continue</DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                  className="pl-10"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-blue-600 hover:underline"
                  onClick={() => setLoginOpen(false)}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-10 w-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm font-normal">
                Remember me
              </Label>
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-2 text-xs text-muted-foreground">OR CONTINUE WITH</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full">
              <Image
                src="/assets/Store Logo.png"
                alt="Thrift Store Logo"
                width={250}
                height={150}
                className="rounded"
                priority
              />
            </Button>
            <Button variant="outline" className="w-full">
              <Image
                src="/placeholder.svg?height=20&width=20"
                alt="Facebook logo"
                width={20}
                height={20}
                className="mr-2"
              />
              Facebook
            </Button>
          </div>

          <DialogFooter className="flex flex-col items-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-blue-600"
                onClick={() => {
                  setLoginOpen(false)
                  setSignupOpen(true)
                }}
              >
                Sign up
              </Button>
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Signup Modal */}
      <Dialog
        open={signupOpen}
        onOpenChange={(open) => {
          setSignupOpen(open)
          if (!open) dispatch(clearError())
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Create an Account</DialogTitle>
            <DialogDescription className="text-center">Join Thrift Store to buy and sell items</DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignupSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signup-name"
                  placeholder="Enter your full name"
                  className="pl-10"
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signup-email"
                  placeholder="Enter your email"
                  type="email"
                  className="pl-10"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signup-password"
                  placeholder="Create a password"
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-10 w-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long with a mix of letters, numbers, and symbols.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                required
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm font-normal">
                I agree to the{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading || !termsAccepted}>
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-2 text-xs text-muted-foreground">OR CONTINUE WITH</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full">
              <Image
                src="/assets/Store Logo.png"
                alt="Thrift Store Logo"
                width={250}
                height={150}
                className="rounded"
                priority
              />
            </Button>
            <Button variant="outline" className="w-full">
              <Image
                src="/placeholder.svg?height=20&width=20"
                alt="Facebook logo"
                width={20}
                height={20}
                className="mr-2"
              />
              Facebook
            </Button>
          </div>

          <DialogFooter className="flex flex-col items-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-blue-600"
                onClick={() => {
                  setSignupOpen(false)
                  setLoginOpen(true)
                }}
              >
                Log in
              </Button>
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

