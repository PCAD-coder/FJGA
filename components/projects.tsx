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
          error instanceof Error ? error.message : "Failed to load projects."
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
      className="bg-gray-50 py-16 md:py-32 dark:bg-transparent"
    >
      <div className="mx-auto max-w-5xl border-t px-6">
        <span className="text-caption -mt-5.5 -ml-6 block w-max bg-gray-50 px-6 dark:bg-transparent">
          Projects
        </span>

        <div className="mt-12 gap-4 sm:grid sm:grid-cols-2 md:mt-5">
          <div className="sm:w-2/5">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Our Latest Projects
            </h2>
          </div>

          <div className="mt-6 sm:mt-0">
            <p>
              Perfect fit, flawless finish — we work side by side with you to
              craft glass and aluminum solutions that bring your vision to life.
            </p>
          </div>
        </div>

        <div className="mt-10 md:mt-7">
          {loading ? (
            <div className="py-16 text-center">
              <p className="text-sm text-muted-foreground">
                Loading projects...
              </p>
            </div>
          ) : error ? (
            <div className="py-16 text-center">
              <p className="text-sm text-destructive">
                Unable to load projects at this time.
              </p>
            </div>
          ) : projects.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-muted-foreground">
                No projects are currently available.
              </p>
            </div>
          ) : (
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <div key={project.id} className="group overflow-hidden">
                  <Image
                    className="h-96 w-full rounded-md object-cover object-top grayscale transition-all duration-500 group-hover:h-[22.5rem] group-hover:rounded-xl hover:grayscale-0"
                    src={project.imageUrl}
                    alt={project.title}
                    width={826}
                    height={1239}
                    sizes="(max-width: 768px) 100vw, 280px"
                    unoptimized
                  />

                  <div className="px-2 pt-2 sm:pt-4 sm:pb-0">
                    <div className="flex justify-between gap-4">
                      <h3 className="text-base font-medium transition-all duration-500 group-hover:tracking-wider">
                        {project.title}
                      </h3>

                      <span className="shrink-0 text-xs">
                        _{String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="mt-1">
                      {project.category && (
                        <span className="text-sm text-muted-foreground">
                          {project.category}
                        </span>
                      )}

                      {project.description && (
                        <p className="mt-3 text-sm text-muted-foreground">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
