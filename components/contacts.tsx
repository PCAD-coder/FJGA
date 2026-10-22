"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowUpRight,
  ExternalLink,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react"

import {
  getPublicSocialLinks,
  type PublicSocialLink,
  type PublicSocialPlatform,
} from "@/app/services/public-content"

function FacebookIcon() {
  return (
    <svg
      className="size-5"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"
      />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg
      className="size-5"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
      />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg
      className="size-5"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48"
      />
    </svg>
  )
}

function SocialIcon({
  platform,
}: {
  platform: PublicSocialPlatform
}) {
  switch (platform) {
    case "facebook":
      return <FacebookIcon />

    case "instagram":
      return <InstagramIcon />

    case "tiktok":
      return <TikTokIcon />

    case "messenger":
      return <MessageCircle className="size-5" />

    case "email":
      return <Mail className="size-5" />

    case "phone":
      return <Phone className="size-5" />

    default:
      return <ExternalLink className="size-5" />
  }
}

function isExternalLink(platform: PublicSocialPlatform) {
  return !["email", "phone"].includes(platform)
}

const navigation = [
  {
    label: "Home",
    sectionId: "home",
  },
  {
    label: "Products",
    sectionId: "products",
  },
  {
    label: "Projects",
    sectionId: "projects",
  },
  {
    label: "Custom Orders",
    sectionId: "custom-order",
  },
  {
    label: "Customer Stories",
    sectionId: "feedback",
  },
]

export default function FooterSection() {
  const [socialLinks, setSocialLinks] = useState<
    PublicSocialLink[]
  >([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSocialLinks() {
      try {
        setLoading(true)

        const data = await getPublicSocialLinks()

        setSocialLinks(data)
      } catch (error) {
        console.error(
          "Failed to load public social links:",
          error
        )
      } finally {
        setLoading(false)
      }
    }

    void loadSocialLinks()
  }, [])

  function scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId)

    section?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
    <footer
      id="contacts"
      className="scroll-mt-20 border-t bg-foreground text-background"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main footer */}
        <div className="grid gap-14 py-16 md:py-20 lg:grid-cols-[1.4fr_0.6fr_0.7fr] lg:gap-20">
          {/* Brand */}
          <div className="max-w-lg">
            <div className="flex items-center gap-3">
              <span className="font-serif text-4xl leading-none font-medium tracking-[-0.12em]">
                FJ
              </span>

              <span className="text-xs font-semibold tracking-[0.08em] uppercase">
                FJ Glass and Aluminum
              </span>
            </div>

            <h2 className="mt-8 max-w-md font-serif text-3xl leading-tight font-medium sm:text-4xl">
              Quality glass and aluminum solutions built for your space.
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-background/65">
              From furniture and architectural fixtures to custom
              fabrication, FJ Glass and Aluminum creates practical
              solutions for residential, office, and commercial spaces.
            </p>

            <Link
              href="/sign-up"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold"
            >
              Start Your Project

              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-background/50 uppercase">
              Explore
            </p>

            <nav
              className="mt-6 flex flex-col items-start gap-4"
              aria-label="Footer navigation"
            >
              {navigation.map((item) => (
                <button
                  key={item.sectionId}
                  type="button"
                  onClick={() =>
                    scrollToSection(item.sectionId)
                  }
                  className="text-sm text-background/70 transition-colors hover:text-background"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact / social links */}
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-background/50 uppercase">
              Connect
            </p>

            {!loading && socialLinks.length > 0 ? (
              <div className="mt-6 flex flex-col items-start gap-4">
                {socialLinks.map((socialLink) => {
                  const external = isExternalLink(
                    socialLink.platform
                  )

                  return (
                    <Link
                      key={socialLink.id}
                      href={socialLink.url}
                      target={
                        external ? "_blank" : undefined
                      }
                      rel={
                        external
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="group flex items-center gap-3 text-sm text-background/70 transition-colors hover:text-background"
                    >
                      <span className="flex size-9 items-center justify-center rounded-full border border-background/15 transition-colors group-hover:border-background/40">
                        <SocialIcon
                          platform={socialLink.platform}
                        />
                      </span>

                      <span>{socialLink.label}</span>
                    </Link>
                  )
                })}
              </div>
            ) : !loading ? (
              <p className="mt-6 text-sm text-background/50">
                Contact information coming soon.
              </p>
            ) : (
              <p className="mt-6 text-sm text-background/50">
                Loading...
              </p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-background/15 py-6 text-xs text-background/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} FJ Glass and Aluminum.
            All rights reserved.
          </p>

          <p>
            Glass • Aluminum • Furniture • Custom Fabrication
          </p>
        </div>
      </div>
    </footer>
  )
}