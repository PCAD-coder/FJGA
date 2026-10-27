"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { createClient } from "@/lib/supabase/client"

import { LogoIcon } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const validatePassword = (value: string) => {
    if (value.length < 12) {
      return "Password must be at least 12 characters."
    }

    if (!/[A-Z]/.test(value)) {
      return "Password must contain at least one uppercase letter."
    }

    if (!/[a-z]/.test(value)) {
      return "Password must contain at least one lowercase letter."
    }

    if (!/[0-9]/.test(value)) {
      return "Password must contain at least one number."
    }

    if (!/[^A-Za-z0-9]/.test(value)) {
      return "Password must contain at least one special character."
    }

    return null
  }

  const handleUpdatePassword = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    setLoading(true)
    setError("")

    try {
      const passwordError = validatePassword(password)

      if (passwordError) {
        setError(passwordError)
        return
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.")
        return
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setError(
          "Your password reset link is invalid or has expired. Please request a new one."
        )
        return
      }

      const { error: updateError } =
        await supabase.auth.updateUser({
          password,
        })

      if (updateError) {
        setError(updateError.message)
        return
      }

      await supabase.auth.signOut()

      router.replace("/login?password-reset=success")
    } catch (error) {
      console.error("Update password error:", error)

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
      <motion.form
        onSubmit={handleUpdatePassword}
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
              Reset Password
            </h1>

            <p className="text-sm text-muted-foreground">
              Create a new password for your FJ Glass and Aluminum
              account.
            </p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">
                New Password
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="pr-10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">
                Confirm New Password
              </Label>

              <div className="relative">
                <Input
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  className="pr-10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="rounded-md border bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">
                Password must contain at least 12 characters,
                including an uppercase letter, lowercase letter,
                number, and special character.
              </p>
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
                  Updating Password...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </div>
        </div>
      </motion.form>
    </motion.section>
  )
}