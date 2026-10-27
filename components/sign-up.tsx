"use client"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import { LogoIcon } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react"
import { TERMS_SECTIONS, TERMS_VERSION } from "@/lib/terms"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

export default function SignUp() {
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)

  const passwordRequirements = [
    { label: "At least 12 characters", met: password.length >= 12 },
    { label: "An uppercase letter (A-Z)", met: /[A-Z]/.test(password) },
    { label: "A lowercase letter (a-z)", met: /[a-z]/.test(password) },
    { label: "A number (0-9)", met: /[0-9]/.test(password) },
    {
      label: "A special character (e.g. !, @, #)",
      met: /[^a-zA-Z0-9\s]/.test(password),
    },
  ]
  const isPasswordValid = passwordRequirements.every(({ met }) => met)
  const passwordsMatch = password.length > 0 && password === confirmPassword

  const handleGoogleSignIn = async () => {
    if (!acceptedTerms) {
      setError("Please accept the Terms and Conditions before continuing.")
      return
    }
    setLoading(true)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    }
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle()

    if (existing) {
      setError("This email is already registered. Please sign in instead.")
      return
    }
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setError("")

    if (!acceptedTerms) {
      setError(
        "Please accept the Terms and Conditions before creating an account."
      )
      return
    }

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last name.")
      return
    }

    if (!isPasswordValid) {
      setError("Please meet all password requirements.")
      return
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)

    try {
      //check email if already exists in the profiles table
      const { data: existingUser, error: lookupError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email.trim().toLowerCase())
        .maybeSingle()

      if (lookupError) {
        setError("Something went wrong. Please try again.")
        setLoading(false)
        return
      }

      if (existingUser) {
        setError(
          "An account with this email already exists. Please sign in instead."
        )
        setLoading(false)
        return
      }
      // Create the authentication account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            full_name: `${firstName.trim()} ${lastName.trim()}`,
            terms_version: TERMS_VERSION,
            terms_accepted_at: new Date().toISOString(),
          },
        },
      })

      console.log("DATA:", JSON.stringify(data, null, 2))
      console.log("ERROR:", JSON.stringify(error, null, 2))

      if (error) {
        setError(error.message)
      }
      if (error) throw error

      if (!data.user) {
        throw new Error("Unable to create account.")
      }

      if (
        data.user &&
        Array.isArray(data.user.identities) &&
        data.user.identities.length === 0
      ) {
        setError("An account with this email already exists.")
        return
      }

      router.push(`/verify-email?email=${encodeURIComponent(email)}`)
    } catch (err: any) {
      console.error("SIGNUP ERROR:", err)
      console.error("MESSAGE:", err?.message)
      console.error("FULL:", JSON.stringify(err, null, 2))

      setError(err?.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative flex min-h-screen items-center justify-center bg-background px-4 py-20 sm:px-6 sm:py-16"
    >
      <Button
        variant="ghost"
        className="absolute top-4 left-4 gap-2 text-muted-foreground sm:left-6"
        onClick={() => router.back()}
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back
      </Button>

      <motion.form
        onSubmit={handleSignUp}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="w-full max-w-[460px] overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm"
      >
        <div className="px-6 pt-7 pb-6 sm:px-8 sm:pt-8">
          <div className="text-center">
            <Link href="/" aria-label="go home" className="mx-auto block w-fit">
              <LogoIcon />
            </Link>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight">
              Create your account
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Join FJGA to order pieces and bring your ideas to life.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstname" className="block text-sm">
                  First name
                </Label>
                <Input
                  id="firstname"
                  autoComplete="given-name"
                  placeholder="First name"
                  className="h-10 rounded-lg bg-background/50 shadow-none"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname" className="block text-sm">
                  Last name
                </Label>
                <Input
                  id="lastname"
                  autoComplete="family-name"
                  placeholder="Last name"
                  className="h-10 rounded-lg bg-background/50 shadow-none"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">
                Email address
              </Label>
              <Input
                id="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="h-10 rounded-lg bg-background/50 shadow-none"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="pwd" className="text-sm">
                  Password
                </Label>
              </div>
              <Input
                id="pwd"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={12}
                aria-describedby="password-requirements"
                required
                className="h-10 rounded-lg bg-background/50 shadow-none"
              />
              <ul
                id="password-requirements"
                className="grid gap-x-3 gap-y-1 pt-1 text-[10px] leading-4 sm:grid-cols-2"
                aria-label="Password requirements"
              >
                {passwordRequirements.map(({ label, met }) => {
                  const Icon = met ? CheckCircle2 : Circle
                  return (
                    <li
                      key={label}
                      className={`flex items-center gap-1.5 ${met ? "text-green-700 dark:text-green-400" : "text-muted-foreground"}`}
                    >
                      <Icon className="size-3 shrink-0" aria-hidden="true" />
                      <span>
                        <span className="sr-only">
                          {met ? "Met: " : "Not met: "}
                        </span>
                        {label}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPwd" className="block text-sm">
                Confirm password
              </Label>
              <Input
                id="confirmPwd"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                className="h-10 rounded-lg bg-background/50 shadow-none"
              />
            </div>
            <p
              className={`-mt-1 flex items-center gap-1.5 text-[11px] ${passwordsMatch ? "text-green-700 dark:text-green-400" : "text-muted-foreground"}`}
            >
              {passwordsMatch ? (
                <CheckCircle2 className="size-3" aria-hidden="true" />
              ) : (
                <Circle className="size-3" aria-hidden="true" />
              )}
              {passwordsMatch ? "Passwords match" : "Passwords must match"}
            </p>
            <div className="flex items-center gap-2.5">
              <input
                id="show-password"
                type="checkbox"
                checked={showPassword}
                onChange={(event) => setShowPassword(event.target.checked)}
                className="size-4 cursor-pointer accent-primary"
              />
              <Label htmlFor="show-password" className="cursor-pointer text-sm">
                Show password
              </Label>
            </div>
            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="accept-terms"
                type="checkbox"
                required
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                disabled={loading}
                className="mt-1 size-4 shrink-0 cursor-pointer accent-primary"
              />
              <label
                htmlFor="accept-terms"
                className="text-xs leading-6 text-muted-foreground"
              >
                I have read and agree to the{" "}
                <button
                  type="button"
                  onClick={() => setTermsOpen(true)}
                  aria-haspopup="dialog"
                  className="font-medium text-primary underline underline-offset-4"
                >
                  Terms and Conditions
                </button>
                .
              </label>
            </div>
            {error && (
              <p
                role="alert"
                className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-xs leading-5 text-destructive"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="h-11 w-full rounded-lg font-medium shadow-none"
              disabled={
                loading || !isPasswordValid || !passwordsMatch || !acceptedTerms
              }
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </div>

          <div className="my-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <hr className="border-border/70" />
            <span className="text-xs text-muted-foreground">or</span>
            <hr className="border-border/70" />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full rounded-lg bg-transparent shadow-none"
              onClick={handleGoogleSignIn}
              disabled={loading || !acceptedTerms}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="0.98em"
                height="1em"
                viewBox="0 0 256 262"
              >
                <path
                  fill="#4285f4"
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                ></path>
                <path
                  fill="#34a853"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                ></path>
                <path
                  fill="#fbbc05"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                ></path>
                <path
                  fill="#eb4335"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                ></path>
              </svg>
              <span>Continue with Google</span>
            </Button>
          </div>
        </div>

        <div className="border-t border-border/60 bg-muted/30 px-6 py-4">
          <p className="text-center text-xs text-muted-foreground">
            Already have an account?
            <Button
              asChild
              variant="link"
              className="h-auto px-1.5 py-0 text-xs font-semibold"
            >
              <Link href="/login">Log In</Link>
            </Button>
          </p>
        </div>
      </motion.form>
      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="flex max-h-[85dvh] flex-col overflow-hidden sm:max-w-2xl">
          <DialogHeader className="shrink-0 pr-8">
            <DialogTitle>Terms and Conditions</DialogTitle>
            <DialogDescription>
              FJ Glass and Aluminum · Version {TERMS_VERSION}. Please read
              before accepting.
            </DialogDescription>
          </DialogHeader>
          <div
            tabIndex={0}
            aria-label="Terms and Conditions content"
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-3 focus-visible:outline-2 focus-visible:outline-ring"
          >
            {TERMS_SECTIONS.map((section, index) => (
              <section
                key={section.title}
                className="border-b py-4 last:border-0"
              >
                <h2 className="text-sm font-semibold">
                  {index + 1}. {section.title}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-3 text-sm leading-7 text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
          <DialogFooter className="shrink-0">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>
            <Button
              type="button"
              disabled={loading}
              onClick={() => {
                setAcceptedTerms(true)
                setTermsOpen(false)
              }}
            >
              I Agree
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.section>
  )
}
