import Link from "next/link"
import { Mail } from "lucide-react"

import { Button } from "@/components/ui/button"

interface VerifyEmailPageProps {
  searchParams: Promise<{
    email?: string
  }>
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { email } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md rounded-xl border bg-background p-8 shadow-lg">

        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Mail className="h-8 w-8 text-primary" />
          </div>
        </div>

        <h1 className="mt-6 text-center text-2xl font-bold">
          Verify your email
        </h1>

        <p className="mt-4 text-center text-muted-foreground">
          We've sent a verification link to:
        </p>

        <p className="mt-2 break-all text-center font-semibold">
          {email ?? "your email address"}
        </p>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Please open your inbox and click the verification link before signing in.
        </p>

        <p className="mt-2 text-center text-sm text-muted-foreground">
          If you don't see the email, check your spam or junk folder.
        </p>

        <div className="mt-8 space-y-3">
          <Button asChild className="w-full">
            <Link href="/login">
              Back to Login
            </Link>
          </Button>
        </div>

        <div className="mt-6 border-t pt-4">
          <p className="text-center text-xs text-muted-foreground">
            Didn't receive the email?
          </p>

          <p className="mt-1 text-center text-xs text-muted-foreground">
            Wait a minute, then try signing up again or use the future
            <span className="font-medium"> Resend Verification Email </span>
            feature.
          </p>
        </div>
      </div>
    </div>
  )
}