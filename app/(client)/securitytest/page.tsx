"use client"

import { useState } from "react"

import { createClient } from "@/lib/supabase/client"

export default function SecurityTestPage() {
  const [result, setResult] = useState("Not tested yet.")

  async function testRoleEscalation() {
    const supabase = createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setResult(
        `Authentication error: ${
          userError?.message ?? "No authenticated user"
        }`
      )
      return
    }

    console.log("Testing as:", user.email)
    console.log("Auth user ID:", user.id)

    const { data, error } = await supabase
      .from("profiles")
      .update({
        role: "admin",
      })
      .eq("auth_user_id", user.id)
      .select("id, email, role, status")

    if (error) {
      console.error("SECURITY TEST BLOCKED:", error)

      setResult(
        `BLOCKED ✓\n\n${error.message}`
      )

      return
    }

    console.error("SECURITY TEST FAILED:", data)

    setResult(
      `DANGER: Update succeeded!\n\n${JSON.stringify(
        data,
        null,
        2
      )}`
    )
  }
  async function testNormalProfileUpdate() {
  const supabase = createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    setResult(
      `Authentication error: ${
        userError?.message ?? "No authenticated user"
      }`
    )
    return
  }

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select("contact_number")
      .eq("auth_user_id", user.id)
      .single()

  if (profileError) {
    setResult(`Could not load profile: ${profileError.message}`)
    return
  }

  // Write the exact same harmless value back.
  // This avoids changing your real profile data.
  const { data, error } = await supabase
    .from("profiles")
    .update({
      contact_number: profile.contact_number,
    })
    .eq("auth_user_id", user.id)
    .select("id, email, role, status, contact_number")

  if (error) {
    console.log("NORMAL UPDATE BLOCKED:", error)

    setResult(
      `FAILED ✗\n\nNormal profile update was blocked:\n${error.message}`
    )
    return
  }

  console.log("NORMAL UPDATE ALLOWED:", data)

  setResult(
    `ALLOWED ✓\n\nNormal profile update succeeded.\n\n${JSON.stringify(
      data,
      null,
      2
    )}`
  )
}

async function testProductionAccess() {
  const supabase = createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    setResult(
      `Authentication error: ${
        userError?.message ?? "No authenticated user"
      }`
    )
    return
  }

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select("id")
      .eq("auth_user_id", user.id)
      .single()

  if (profileError) {
    setResult(`Profile error: ${profileError.message}`)
    return
  }

  const { data: orders, error: orderError } =
    await supabase
      .from("orders")
      .select("id, order_number")
      .eq("customer_id", profile.id)

  if (orderError) {
    setResult(`Order error: ${orderError.message}`)
    return
  }

  const orderIds = orders?.map((order) => order.id) ?? []

  if (orderIds.length === 0) {
    setResult("No orders found for this client.")
    return
  }

const { data: jobs, error: jobsError } =
  await supabase
    .from("production_jobs")
    .select("id, order_id, current_stage, status")
    .in("order_id", orderIds)

  if (jobsError) {
    setResult(
      `FAILED ✗\n\nProduction jobs error:\n${jobsError.message}`
    )
    return
  }

  const jobIds = jobs?.map((job) => job.id) ?? []

  let history: unknown[] = []

  if (jobIds.length > 0) {
    const { data: historyData, error: historyError } =
      await supabase
        .from("production_stage_history")
        .select("*")
        .in("production_job_id", jobIds)

    if (historyError) {
      setResult(
        `FAILED ✗\n\nProduction history error:\n${historyError.message}`
      )
      return
    }

    history = historyData ?? []
  }

  setResult(
    `PRODUCTION ACCESS ✓

Orders belonging to client: ${orders?.length ?? 0}
Visible production jobs: ${jobs?.length ?? 0}
Visible stage-history rows: ${history.length}

${JSON.stringify(
  {
    orders,
    jobs,
    history,
  },
  null,
  2
)}`
  )
}

async function testFeedbackSecurity() {
  const supabase = createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error("Authentication required")
    return
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user.id)
    .single()

  if (profileError || !profile) {
    console.error("Profile not found")
    return
  }

  const { data: feedback, error: feedbackError } = await supabase
    .from("feedback")
    .select("id, order_id, rating, comment, status, featured")
    .limit(1)
    .maybeSingle()

  if (feedbackError) {
    console.error("Feedback read error:", feedbackError.message)
    return
  }

  if (!feedback) {
    console.log(
      "No existing feedback for this client. UPDATE test skipped."
    )
    return
  }

  console.log("Visible own feedback:", feedback)

  const { error: updateError } = await supabase
    .from("feedback")
    .update({
      featured: true,
    })
    .eq("id", feedback.id)

  if (updateError) {
    console.log(
      "CLIENT FEEDBACK UPDATE BLOCKED ✓",
      updateError.message
    )
    return
  }

  console.error(
    "SECURITY FAILURE: client was able to update feedback"
  )
}
  return (
    <main className="p-8">
      <h1 className="mb-4 text-2xl font-bold">
        Temporary Security Test
      </h1>

      <p className="mb-6">
        Sign in as a CLIENT account before running this test.
      </p>

      <button
        type="button"
        onClick={testRoleEscalation}
        className="rounded bg-red-600 px-4 py-2 text-white"
      >
        Test Client Role Escalation
      </button>
      <button
  type="button"
  onClick={testNormalProfileUpdate}
  className="ml-3 rounded bg-green-600 px-4 py-2 text-white"
>
  Test Normal Profile Update
</button>

<button
  type="button"
  onClick={testProductionAccess}
  className="ml-3 rounded bg-blue-600 px-4 py-2 text-white"
>
  Test Production Access
</button>
<button onClick={testFeedbackSecurity}>
  Test Feedback Security
</button>

      <pre className="mt-6 whitespace-pre-wrap rounded border p-4">
        {result}
      </pre>
    </main>
  )
}