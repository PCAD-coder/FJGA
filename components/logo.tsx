import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  uniColor?: boolean
}

export const Logo = ({
  className,
}: LogoProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 text-foreground",
        className
      )}
    >
      {/* FJ Monogram */}
      <div className="flex shrink-0 items-center">
        <span className="font-serif text-[2.25rem] leading-none font-medium tracking-[-0.12em]">
          FJ
        </span>
      </div>

      {/* Wordmark */}
      <div className="hidden sm:block">
        <span className="block whitespace-nowrap text-[11px] leading-none font-semibold tracking-[0.08em] uppercase">
          FJ Glass and Aluminum
        </span>
      </div>
    </div>
  )
}

export const LogoIcon = ({
  className,
}: LogoProps) => {
  return (
    <div
      className={cn(
        "flex items-center text-foreground",
        className
      )}
      aria-label="FJ Glass and Aluminum"
    >
      <span className="font-serif text-3xl leading-none font-medium tracking-[-0.12em]">
        FJ
      </span>
    </div>
  )
}