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

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  //------------------------------------------
  // GOOGLE LOGIN
  //------------------------------------------

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError("")

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
  }

  //------------------------------------------
  // EMAIL LOGIN
  //------------------------------------------

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    setLoading(true)
    setError("")

    try {
      //--------------------------------------
      // Check if email exists
      //--------------------------------------

      const { data: existingUser } = await supabase
        .from("profiles")
        .select("auth_user_id")
        .eq("email", email)
        .maybeSingle()

      if (!existingUser) {
        setError("No account exists with this email.")
        return
      }

      //--------------------------------------
      // Login
      //--------------------------------------

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })

      if (error) {
        setError("Incorrect password.")
        return
      }

      if (!data.user) {
        setError("Unable to sign in.")
        return
      }

      //--------------------------------------
      // Email Verification
      //--------------------------------------

      if (!data.user.email_confirmed_at) {
        await supabase.auth.signOut()

        router.push(
          `/verify-email?email=${encodeURIComponent(email)}`
        )

        return
      }

      //--------------------------------------
      // Get Role
      //--------------------------------------

      router.push("/auth/redirect");
    } catch (err) {
      console.error(err)
      setError("Something went wrong.")
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
        variant="ghost"
        className="absolute left-4 top-4"
        onClick={() => router.back()}
      >
        ← Back
      </Button>

      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">

          <div className="text-center">

            <Link
              href="/"
              aria-label="go home"
              className="mx-auto block w-fit"
            >
              <LogoIcon />
            </Link>

            <h1 className="mt-4 mb-1 text-xl font-semibold">
              Sign In to FJ Glass And Aluminum
            </h1>

            <p className="text-sm">
              Welcome back! Sign in to continue.
            </p>

          </div>

          <div className="mt-6 space-y-6">

            <div className="space-y-2">

              <Label htmlFor="email">
                Email Address
              </Label>

              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

            </div>

            <div className="space-y-2">

              <div className="flex items-center justify-between">

                <Label htmlFor="password">
                  Password
                </Label>

                <Button
                  asChild
                  variant="link"
                  size="sm"
                >
                  <Link href="/forgot-password">
                    Forgot Password?
                  </Link>
                </Button>

              </div>

              <div className="relative">

                <Input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  required
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
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

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
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>

          <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <hr className="border-dashed" />
            <span className="text-xs text-muted-foreground">
              Or continue with
            </span>
            <hr className="border-dashed" />
          </div>

          <div className="grid grid-cols-1 gap-3">

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={loading}
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
                />
                <path
                  fill="#34a853"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                />
                <path
                  fill="#fbbc05"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                />
                <path
                  fill="#eb4335"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                />
              </svg>

              <span>Continue with Google</span>
            </Button>

          </div>
        </div>

        <div className="p-3">
          <p className="text-center text-sm text-accent-foreground">
            Don't have an account?
            <Button
              asChild
              variant="link"
              className="px-2"
            >
              <Link href="/sign-up">
                Create Account
              </Link>
            </Button>
          </p>
        </div>

      </motion.form>
    </motion.section>
  )
}