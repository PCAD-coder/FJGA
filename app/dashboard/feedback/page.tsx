'use client'

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

export default function FeedbackPage() {
  return (
    <div className="space-y-6">

      {/* 🔹 HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Customer Feedback</h1>
        <p className="text-sm text-muted-foreground">
          Monitor customer reviews and satisfaction
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Average Rating */}
        <Card className="p-4">
            <p className="text-sm text-muted-foreground">Average Rating</p>
            <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">4.3</span>
            <span className="text-yellow-500">★★★★★</span>
            </div>
        </Card>

        {/* Total Reviews */}
        <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Reviews</p>
            <p className="text-2xl font-bold text-blue-500">6</p>
        </Card>

        {/* 5-Star Reviews */}
        <Card className="p-4">
            <p className="text-sm text-muted-foreground">5-Star Reviews</p>
            <p className="text-2xl font-bold text-green-500">3</p>
        </Card>

        {/* With Responses */}
        <Card className="p-4">
            <p className="text-sm text-muted-foreground">With Responses</p>
            <p className="text-2xl font-bold text-purple-500">2</p>
        </Card>

        </div>

      {/* 🔹 SEARCH */}
      <div className="flex gap-2">
        <Input placeholder="Search by name or order ID..." />
        <Button variant="outline">Filter</Button>
      </div>

      {/* 🔹 FEEDBACK LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

        {/* CARD */}
        <Card className="p-4 space-y-3">

          {/* HEADER */}
          <div className="flex items-center justify-between">
            <p className="font-semibold">Michael Chen</p>
            <span className="text-xs text-muted-foreground">Mar 24, 2026</span>
          </div>

          {/* STARS */}
          <div className="flex gap-1 text-yellow-500">
            {[1,2,3,4,5].map((star) => (
              <Star key={star} size={16} fill="currentColor" />
            ))}
          </div>

          {/* ORDER */}
          <p className="text-xs text-muted-foreground">
            Order ID: ORD-2026-142
          </p>

          {/* MESSAGE */}
          <p className="text-sm">
            Excellent workmanship and fast installation. Highly recommended!
          </p>

        </Card>

        {/* CARD */}
        <Card className="p-4 space-y-3">

          <div className="flex items-center justify-between">
            <p className="font-semibold">Maria Santos</p>
            <span className="text-xs text-muted-foreground">Mar 22, 2026</span>
          </div>

          <div className="flex gap-1 text-yellow-500">
            {[1,2,3,4].map((star) => (
              <Star key={star} size={16} fill="currentColor" />
            ))}
            <Star size={16} className="text-muted-foreground" />
          </div>

          <p className="text-xs text-muted-foreground">
            Order ID: ORD-2026-138
          </p>

          <p className="text-sm">
            Good service but installation took longer than expected.
          </p>

        </Card>

        {/* CARD */}
        <Card className="p-4 space-y-3">

          <div className="flex items-center justify-between">
            <p className="font-semibold">David Lee</p>
            <span className="text-xs text-muted-foreground">Mar 20, 2026</span>
          </div>

          <div className="flex gap-1 text-yellow-500">
            {[1,2,3].map((star) => (
              <Star key={star} size={16} fill="currentColor" />
            ))}
            {[4,5].map((star) => (
              <Star key={star} size={16} className="text-muted-foreground" />
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            Order ID: ORD-2026-130
          </p>

          <p className="text-sm">
            Product quality is okay, but support response was slow.
          </p>

        </Card>

      </div>

    </div>
  )
}