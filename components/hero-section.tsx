"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import {
  ArrowRight,
  Gem,
  Hammer,
  Headphones,
  Settings2,
  Truck,
} from "lucide-react"

import {
  getPublicHomepageContent,
  type PublicHomepageContent,
} from "@/app/services/public-content"
import { Button } from "@/components/ui/button"
import { HeroHeader } from "./header"

const benefits = [
  {
    title: "Quality Materials",
    description: "Durable and long-lasting",
    icon: Gem,
  },
  {
    title: "Custom Solutions",
    description: "Designed to fit your needs",
    icon: Settings2,
  },
  {
    title: "Reliable Delivery",
    description: "Safe and on-time service",
    icon: Truck,
  },
  {
    title: "Expert Craftsmanship",
    description: "Quality in every detail",
    icon: Hammer,
  },
]

export default function HeroSection() {
  const [content, setContent] =
    useState<PublicHomepageContent | null>(null)

  useEffect(() => {
    async function loadHomepageContent() {
      try {
        const data = await getPublicHomepageContent()
        setContent(data)
      } catch (error) {
        console.error(
          "Failed to load public homepage content:",
          error
        )
      }
    }

    void loadHomepageContent()
  }, [])

  const heroTitle =
    content?.heroTitle || "FJ Glass and Aluminum"

  const heroDescription =
    content?.heroDescription ||
    "We design and manufacture high-quality aluminum and glass furniture for homes, offices, and commercial spaces."

  const heroImageUrl = content?.heroImageUrl

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  return (
    <>
      <HeroHeader />

      <main id="home" className="pt-20">
        {/* Hero image */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="relative mx-auto min-h-[620px] max-w-7xl overflow-hidden rounded-sm bg-muted md:min-h-[680px] lg:min-h-[720px]">
            {/* Dynamic Content-module image */}
            {heroImageUrl ? (
              <Image
                src={heroImageUrl}
                alt="FJ Glass and Aluminum"
                fill
                priority
                sizes="100vw"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 bg-muted" />
            )}

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/45" />

            {/* Subtle gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />

            {/* Hero content */}
            <div className="relative z-10 mx-auto flex min-h-[620px] max-w-7xl items-center px-6 py-16 md:min-h-[680px] md:px-12 lg:min-h-[720px] lg:px-16">
              <div className="max-w-3xl text-white">
                <p className="mb-5 text-xs font-semibold tracking-[0.3em] text-white/80 uppercase sm:text-sm">
                  Quality Glass and Aluminum Solutions
                </p>

                <h1 className="max-w-3xl font-serif text-5xl leading-[0.98] font-medium tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-[5.5rem]">
                  {heroTitle}
                </h1>

                <p className="mt-7 max-w-2xl text-base leading-7 text-white/85 md:text-lg md:leading-8">
                  {heroDescription}
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    size="lg"
                    variant="secondary"
                    onClick={() => scrollToSection("products")}
                    className="group h-12 rounded-md px-6"
                  >
                    Explore Our Products

                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Button>

                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    onClick={() => scrollToSection("custom-order")}
                    className="h-12 rounded-md border-white/60 bg-black/10 px-6 text-white hover:bg-white hover:text-black"
                  >
                    Request a Custom Order
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl border-x border-b bg-background">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon

                return (
                  <div
                    key={benefit.title}
                    className={`flex items-center gap-4 px-6 py-6 lg:px-7 ${
                      index !== benefits.length - 1
                        ? "border-b sm:border-b-0 lg:border-r"
                        : ""
                    }`}
                  >
                    <div className="flex size-11 shrink-0 items-center justify-center">
                      <Icon
                        className="size-7 stroke-[1.4]"
                        aria-hidden="true"
                      />
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold">
                        {benefit.title}
                      </h2>

                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}