import { Geist, Geist_Mono } from "next/font/google" 
// @ts-ignore: allow importing global CSS without type declarations
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"; 
import { cn } from "@/lib/utils"; 
import { Toaster } from "sonner"
import { cookies } from "next/headers";
const fontSans = Geist({ 
  subsets: ["latin"], 
  variable: "--font-sans", 
}) 
  const fontMono = Geist_Mono({ 
    subsets: ["latin"], 
    variable: "--font-mono", 
  }) 
  export default function RootLayout({ 
    children, 
  }: Readonly<{ 
    children: React.ReactNode }>) { 

      return ( 
      <html 
      lang="en" suppressHydrationWarning 
      className={cn("antialiased", fontMono.variable, "font-sans", fontSans.variable)} 
      > 
      <body> 
        <ThemeProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem 
        disableTransitionOnChange 
        > 
        {children}
        </ThemeProvider> 
        <Toaster richColors position="top-right" />
        </body> 
</html> ) }