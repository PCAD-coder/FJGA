"use client"

import React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ThemeToggleBtn } from "./themeToggleBtn"

const menuItems = [
  { name: "Home", href: "home" },
  { name: "Products", href: "products" },
  { name: "Projects", href: "projects" },
  { name: "About", href: "about" },
  { name: "Contact", href: "contacts" },
]

export const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30)
    }

    handleScroll()

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }

    setMenuState(false)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        data-state={menuState ? "active" : "inactive"}
        className={cn(
          "border-b border-transparent transition-all duration-300",
          isScrolled && "border-border bg-background/95 backdrop-blur-md"
        )}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div
            className={cn(
              "flex h-20 items-center justify-between transition-all duration-300",
              isScrolled && "h-16"
            )}
          >
            {/* Logo */}
            <Link
              href="/"
              aria-label="FJ Glass and Aluminum home"
              className="relative z-50 flex shrink-0 items-center"
            >
              <Logo />
            </Link>

            {/* Desktop navigation */}
            <div className="hidden items-center lg:flex">
              <ul className="flex items-center gap-8">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(item.href)}
                      className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Desktop actions */}
            <div className="hidden items-center gap-2 lg:flex">
              <ThemeToggleBtn />

              <Button asChild variant="outline" size="sm">
                <Link href="/login">Sign In</Link>
              </Button>

              <Button asChild size="sm">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMenuState((current) => !current)}
              aria-label={menuState ? "Close menu" : "Open menu"}
              aria-expanded={menuState}
              className="relative z-50 flex size-10 items-center justify-center rounded-md transition-colors hover:bg-muted lg:hidden"
            >
              {menuState ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        <div
          className={cn(
            "overflow-hidden border-t bg-background transition-all duration-300 lg:hidden",
            menuState
              ? "max-h-[600px] opacity-100"
              : "max-h-0 border-transparent opacity-0"
          )}
        >
          <div className="mx-auto max-w-7xl px-6 py-6">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(item.href)}
                    className="flex w-full rounded-lg px-3 py-3 text-left text-base font-medium transition-colors hover:bg-muted"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t pt-6">
              <div className="grid gap-3">
                <Button asChild variant="outline">
                  <Link
                    href="/login"
                    onClick={() => setMenuState(false)}
                  >
                    Sign In
                  </Link>
                </Button>

                <Button asChild>
                  <Link
                    href="/sign-up"
                    onClick={() => setMenuState(false)}
                  >
                    Get Started
                  </Link>
                </Button>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Appearance
                </span>

                <ThemeToggleBtn />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}