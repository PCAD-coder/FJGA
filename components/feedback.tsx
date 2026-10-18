"use client"

import { useEffect, useState } from "react"
import { Quote, Star } from "lucide-react"

import {
  getPublicFeaturedFeedback,
  type PublicFeaturedFeedback,
} from "@/app/services/public-content"

export default function FeedbackSection() {
  const [feedback, setFeedback] = useState<
    PublicFeaturedFeedback[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function loadFeedback() {
      try {
        setLoading(true)
        setError(false)

        const data = await getPublicFeaturedFeedback()

        setFeedback(data)
      } catch (error) {
        console.error(
          "Failed to load featured feedback:",
          error
        )

        setError(true)
      } finally {
        setLoading(false)
      }
    }

    void loadFeedback()
  }, [])

  if (!loading && (error || feedback.length === 0)) {
    return null
  }

  return (
    <section
      id="feedback"
      className="py-16 md:py-32"
    >
      <div className="mx-auto max-w-5xl border-t px-6">
        <span className="text-caption -ml-6 -mt-5.5 block w-max bg-background px-6">
          Customer Feedback
        </span>

        <div className="mt-12 gap-4 sm:grid sm:grid-cols-2 md:mt-16">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">
              What Our Customers Say
            </h2>
          </div>

          <div className="mt-6 sm:mt-0">
            <p className="text-muted-foreground">
              See what our customers have to say about their
              experience with FJ Glass and Aluminum.
            </p>
          </div>
        </div>

        <div className="mt-10 md:mt-14">
          {loading ? (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">
                Loading customer feedback...
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {feedback.map((item) => (
                <article
                  key={item.id}
                  className="relative rounded-2xl border bg-card p-6 md:p-8"
                >
                  <Quote
                    className="absolute right-6 top-6 size-8 text-muted-foreground/20"
                    aria-hidden="true"
                  />

                  <div
                    className="flex gap-1"
                    aria-label={`${item.rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }).map(
                      (_, index) => (
                        <Star
                          key={index}
                          className={
                            index < item.rating
                              ? "size-4 fill-current"
                              : "size-4 text-muted-foreground/30"
                          }
                        />
                      )
                    )}
                  </div>

                  <blockquote className="mt-6 text-base leading-relaxed">
                    “{item.comment}”
                  </blockquote>

                  <div className="mt-6 border-t pt-4">
                    <p className="font-medium">
                      {item.customerName}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      FJ Glass and Aluminum Customer
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}