"use client"

import { useEffect, useState } from "react"
import { Quote, Star } from "lucide-react"

import {
  getPublicFeaturedFeedback,
  type PublicFeaturedFeedback,
} from "@/app/services/public-content"

export default function FeedbackSection() {
  const [feedback, setFeedback] = useState<PublicFeaturedFeedback[]>([])
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
      className="scroll-mt-20 border-t bg-background py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section heading */}
        <div className="grid gap-8 md:grid-cols-[1fr_0.8fr] md:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-muted-foreground uppercase">
              Customer Stories
            </p>

            <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight font-medium tracking-tight sm:text-5xl">
              Trusted by Our Customers
            </h2>
          </div>

          <div className="md:pb-1">
            <p className="max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
              Hear from customers who have worked with FJ Glass and Aluminum
              for their glass, aluminum, furniture, and custom fabrication
              needs.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t" />

        {/* Feedback */}
        <div className="mt-10">
          {loading ? (
            <div className="py-20 text-center">
              <p className="text-sm text-muted-foreground">
                Loading customer feedback...
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {feedback.map((item, index) => (
                <article
                  key={item.id}
                  className="grid gap-8 py-10 first:pt-0 md:grid-cols-[0.7fr_1.3fr] md:gap-16 md:py-14"
                >
                  {/* Customer information */}
                  <div className="flex flex-col justify-between gap-8">
                    <div>
                      <div
                        className="flex gap-1"
                        aria-label={`${item.rating} out of 5 stars`}
                      >
                        {Array.from({ length: 5 }).map(
                          (_, starIndex) => (
                            <Star
                              key={starIndex}
                              className={
                                starIndex < item.rating
                                  ? "size-4 fill-current"
                                  : "size-4 text-muted-foreground/25"
                              }
                              aria-hidden="true"
                            />
                          )
                        )}
                      </div>

                      <p className="mt-6 font-medium">
                        {item.customerName}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        FJ Glass and Aluminum Customer
                      </p>
                    </div>

                    <span className="hidden text-xs text-muted-foreground md:block">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Testimonial */}
                  <div className="relative pr-2 md:pr-12">
                    <Quote
                      className="absolute -top-1 right-0 size-9 text-muted-foreground/15 md:size-12"
                      aria-hidden="true"
                    />

                    <blockquote className="max-w-3xl pr-10 font-serif text-2xl leading-relaxed font-medium tracking-tight sm:text-3xl md:pr-14">
                      “{item.comment}”
                    </blockquote>
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