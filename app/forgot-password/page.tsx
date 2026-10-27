"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle2, Loader2 } from "lucide-react"

import { createClient } from "@/lib/supabase/client"

import { LogoIcon } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const supabase = createClient()

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)

  const handleResetPassword = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        }
      )

      if (error) {
        setError(error.message)
        return
      }

      setSent(true)
    } catch (error) {
      console.error("Password reset error:", error)
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent"
    >
      <Button
        asChild
        variant="ghost"
        className="absolute left-4 top-4"
      >
        <Link href="/login">← Back to Login</Link>
      </Button>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8">
          <div className="text-center">
            <Link
              href="/"
              aria-label="go home"
              className="mx-auto block w-fit"
            >
              <LogoIcon />
            </Link>

            <h1 className="mt-4 mb-1 text-xl font-semibold">
              Forgot Password
            </h1>

            <p className="text-sm text-muted-foreground">
              Enter your email address and we'll send you a link to reset
              your password.
            </p>
          </div>

          {sent ? (
            <div className="mt-6 space-y-4 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-green-600" />

              <div>
                <p className="font-medium">Check your email</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  If an account exists for {email}, a password reset link
                  has been sent.
                </p>
              </div>

              <Button asChild className="w-full">
                <Link href="/login">Back to Login</Link>
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleResetPassword}
              className="mt-6 space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>

                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.section>
  )
}