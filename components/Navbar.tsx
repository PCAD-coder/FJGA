"use client"
import { useTheme } from "next-themes"
import { Sun, Moon, Laptop } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu" 
import { useState, useEffect } from "react"

const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Tiny button with minimal padding */}
        <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          {theme === "light" ? (
            <Sun className="h-5 w-5" />
          ) : theme === "dark" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Laptop className="h-5 w-5" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" /> Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Laptop className="mr-2 h-4 w-4" /> System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
const Navbar = () => {
  return (
    <nav className="p-4 relative">
      {/* Fixed Theme Button in top-right corner */}
       <div className="fixed top-4 right-2 z-50">
        <ThemeSwitcher />
      </div>
    </nav>
  )
}
export default Navbar