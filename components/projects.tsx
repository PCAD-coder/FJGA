"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

import {
  getPublicContentProjects,
  type PublicContentProject,
} from "@/app/services/public-content"

export default function ProjectsSection() {
  const [projects, setProjects] = useState<PublicContentProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true)
        setError(null)

        const data = await getPublicContentProjects()

        setProjects(data)
      } catch (error) {
        console.error("Failed to load public projects:", error)

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load projects."
        )
      } finally {
        setLoading(false)
      }
    }

    void loadProjects()
  }, [])

  return (
    <section
      id="projects"
      className="scroll-mt-20 border-t bg-background py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section heading */}
        <div className="grid gap-8 md:grid-cols-[1fr_0.8fr] md:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-muted-foreground uppercase">
              Our Work
            </p>

            <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight font-medium tracking-tight sm:text-5xl">
              Built With Precision.
              <br />
              Designed for Real Spaces.
            </h2>
          </div>

          <div className="md:pb-1">
            <p className="max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
              Explore a selection of completed FJ Glass and Aluminum
              projects crafted for residential, office, and commercial
              spaces.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t" />

        {/* Content */}
        <div className="mt-10">
          {loading ? (
            <div className="py-20 text-center">
              <p className="text-sm text-muted-foreground">
                Loading projects...
              </p>
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <p className="text-sm text-destructive">
                Unable to load projects at this time.
              </p>
            </div>
          ) : projects.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-sm text-muted-foreground">
                No projects are currently available.
              </p>
            </div>
          ) : (
            <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
              {projects.map((project, index) => (
                <article
                  key={project.id}
                  className="group"
                >
                  {/* Project image */}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted">
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                      unoptimized
                    />
                  </div>

                  {/* Project information */}
                  <div className="pt-5">
                    <div className="flex items-start justify-between gap-6">
                      <div className="min-w-0">
                        <h3 className="font-serif text-2xl font-medium leading-tight">
                          {project.title}
                        </h3>

                        {project.category && (
                          <p className="mt-2 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                            {project.category}
                          </p>
                        )}
                      </div>

                      <span className="shrink-0 pt-1 text-xs text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {project.description && (
                      <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
                        {project.description}
                      </p>
                    )}
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