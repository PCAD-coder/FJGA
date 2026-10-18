import { Eye, EyeOff, ImageIcon, Pencil, Plus, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import type { ContentProject } from "../types/content"

interface Props {
  projects: ContentProject[]
  loading: boolean
  error: string | null
  onAdd: () => void
  onEdit: (project: ContentProject) => void
  onDelete: (project: ContentProject) => void
  onToggleVisibility: (project: ContentProject) => void
}

export default function ProjectList({
  projects,
  loading,
  error,
  onAdd,
  onEdit,
  onDelete,
  onToggleVisibility,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">
            Projects
          </h2>

          <p className="text-sm text-muted-foreground">
            Manage the projects displayed on the FJ Glass and Aluminum website.
          </p>
        </div>

        <Button type="button" onClick={onAdd}>
          <Plus className="mr-2 size-4" />
          Add Project
        </Button>
      </div>

      {loading ? (
        <div className="rounded-lg border p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Loading projects...
          </p>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/50 p-10 text-center">
          <p className="text-sm text-destructive">
            {error}
          </p>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
          <ImageIcon className="mb-3 size-10 text-muted-foreground" />

          <h3 className="font-medium">
            No projects yet
          </h3>

          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Add completed FJ Glass and Aluminum projects to display them on the website.
          </p>

          <Button
            type="button"
            className="mt-4"
            onClick={onAdd}
          >
            <Plus className="mr-2 size-4" />
            Add First Project
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="overflow-hidden"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute right-3 top-3">
                  <Badge
                    variant={
                      project.isVisible
                        ? "default"
                        : "secondary"
                    }
                  >
                    {project.isVisible
                      ? "Visible"
                      : "Hidden"}
                  </Badge>
                </div>
              </div>

              <CardContent className="space-y-4 p-5">
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold leading-tight">
                      {project.title}
                    </h3>

                    <span className="shrink-0 text-xs text-muted-foreground">
                      #{project.displayOrder}
                    </span>
                  </div>

                  {project.category && (
                    <p className="text-sm text-muted-foreground">
                      {project.category}
                    </p>
                  )}
                </div>

                {project.description && (
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {project.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 border-t pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onToggleVisibility(project)
                    }
                  >
                    {project.isVisible ? (
                      <EyeOff className="mr-2 size-4" />
                    ) : (
                      <Eye className="mr-2 size-4" />
                    )}

                    {project.isVisible
                      ? "Hide"
                      : "Show"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(project)}
                  >
                    <Pencil className="mr-2 size-4" />
                    Edit
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(project)}
                  >
                    <Trash2 className="mr-2 size-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}