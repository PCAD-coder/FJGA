"use client"

import { getErrorMessage } from "@/lib/error-message"

import { DashboardCard } from "@/components/dashboard_cards"
import { ContentPanelSkeleton } from "./content-skeleton"
import ContentPagination from "./content-pagination"
import { toast } from "sonner"

import { useEffect, useState } from "react"
import { Facebook, House, ImageIcon, MessageSquareQuote } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import type {
  ContentFeedback,
  ContentProject,
  ContentSocialLink,
  HomepageContent,
} from "../types/content"
import ProjectList from "./project-list"
import HomepageContentCard from "./homepage-content-card"
import EditHomepageDialog from "./edit-homepage-dialog"
import AddProjectDialog from "./add-project-dialog"
import EditProjectDialog from "./edit-project-dialog"
import DeleteProjectDialog from "./delete-project-dialog"
import FeedbackList from "./feedback-list"
import AddSocialLinkDialog from "./add-social-link-dialog"
import SocialMediaList from "./social-media-list"
import EditSocialLinkDialog from "./edit-social-link-dialog"
import DeleteSocialLinkDialog from "./delete-social-link-dialog"

import {
  deleteContentImage,
  deleteContentProject,
  getContentProjects,
  getHomepageContent,
  updateContentProject,
  updateHomepageContent,
  getContentFeedback,
  setFeedbackFeatured,
  getContentSocialLinks,
  deleteContentSocialLink,
  updateContentSocialLink,
} from "../services/content"

export default function Content() {
  const [projectsPage, setProjectsPage] = useState(1)
  const [feedbackPage, setFeedbackPage] = useState(1)
  const [socialPage, setSocialPage] = useState(1)
  const [homepage, setHomepage] = useState<HomepageContent | null>(null)
  const [projects, setProjects] = useState<ContentProject[]>([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [projectsError, setProjectsError] = useState<string | null>(null)

  const [addProjectOpen, setAddProjectOpen] = useState(false)
  const [editProjectOpen, setEditProjectOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<ContentProject | null>(
    null
  )

  const [feedback, setFeedback] = useState<ContentFeedback[]>([])
  const [feedbackLoading, setFeedbackLoading] = useState(true)
  const [feedbackError, setFeedbackError] = useState<string | null>(null)
  const [updatingFeedbackId, setUpdatingFeedbackId] = useState<string | null>(
    null
  )

  const [deleteProjectOpen, setDeleteProjectOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<ContentProject | null>(
    null
  )

  const [socialLinks, setSocialLinks] = useState<ContentSocialLink[]>([])
  const [socialLinksLoading, setSocialLinksLoading] = useState(true)
  const [socialLinksError, setSocialLinksError] = useState<string | null>(null)
  const [addSocialLinkOpen, setAddSocialLinkOpen] = useState(false)
  const [selectedSocialLink, setSelectedSocialLink] =
    useState<ContentSocialLink | null>(null)
  const [editSocialLinkOpen, setEditSocialLinkOpen] = useState(false)
  const [deleteSocialLinkOpen, setDeleteSocialLinkOpen] = useState(false)
  const [deletingSocialLink, setDeletingSocialLink] = useState(false)

  const [homepageLoading, setHomepageLoading] = useState(true)
  const [homepageError, setHomepageError] = useState<string | null>(null)

  const [editHomepageOpen, setEditHomepageOpen] = useState(false)

  useEffect(() => {
    async function loadHomepage() {
      try {
        setHomepageLoading(true)
        setHomepageError(null)

        const data = await getHomepageContent()

        setHomepage(data)
      } catch (error) {
        console.error("Failed to load homepage content:", error)

        setHomepageError(
          getErrorMessage(error, "Failed to load homepage content.")
        )
      } finally {
        setHomepageLoading(false)
      }
    }

    void loadHomepage()
  }, [])

  useEffect(() => {
    async function loadProjects() {
      try {
        setProjectsLoading(true)
        setProjectsError(null)

        const data = await getContentProjects()

        setProjects(data)
      } catch (error) {
        console.error("Failed to load content projects:", error)

        setProjectsError(
          getErrorMessage(error, "Failed to load projects.")
        )
      } finally {
        setProjectsLoading(false)
      }
    }

    void loadProjects()
  }, [])

  useEffect(() => {
    async function loadFeedback() {
      try {
        setFeedbackLoading(true)
        setFeedbackError(null)

        const data = await getContentFeedback()

        setFeedback(data)
      } catch (error) {
        console.error("Failed to load content feedback:", error)

        setFeedbackError(
          getErrorMessage(error, "Failed to load feedback.")
        )
      } finally {
        setFeedbackLoading(false)
      }
    }

    void loadFeedback()
  }, [])

  useEffect(() => {
    async function loadSocialLinks() {
      try {
        setSocialLinksLoading(true)
        setSocialLinksError(null)

        const data = await getContentSocialLinks()

        setSocialLinks(data)
      } catch (error) {
        console.error("Failed to load social links:", error)

        setSocialLinksError(
          getErrorMessage(error, "Failed to load social links.")
        )
      } finally {
        setSocialLinksLoading(false)
      }
    }

    void loadSocialLinks()
  }, [])

  const projectPage = Math.min(
    projectsPage,
    Math.max(1, Math.ceil(projects.length / 10))
  )
  const reviewPage = Math.min(
    feedbackPage,
    Math.max(1, Math.ceil(feedback.length / 10))
  )
  const linkPage = Math.min(
    socialPage,
    Math.max(1, Math.ceil(socialLinks.length / 10))
  )

  return (
    <div className="mx-auto w-full max-w-[1600px] min-w-0 space-y-4 px-1 pt-2 pb-12 sm:px-4 sm:pt-3 lg:px-6">
      <div className="border-b border-border/70 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Content Management
        </h1>

        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
          Manage the content displayed on the FJ Glass and Aluminum website.
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3">
        <DashboardCard
          title="Homepage Content"
          value={homepageLoading ? "..." : String(homepage ? 1 : 0)}
          description="Homepage content configuration"
          icon={House}
          color="text-blue-600 dark:text-blue-400"
        />
        <DashboardCard
          title="Projects"
          value={projectsLoading ? "..." : String(projects.length)}
          description="Projects in the content library"
          icon={ImageIcon}
          color="text-primary"
        />
        <DashboardCard
          title="Customer Feedback"
          value={feedbackLoading ? "..." : String(feedback.length)}
          description="Customer reviews available to feature"
          icon={MessageSquareQuote}
          color="text-amber-600 dark:text-amber-400"
        />
        <DashboardCard
          title="Social Links"
          value={socialLinksLoading ? "..." : String(socialLinks.length)}
          description="Social and contact links"
          icon={Facebook}
          color="text-emerald-600 dark:text-emerald-400"
        />
      </div>

      <Tabs defaultValue="homepage" className="space-y-4">
        <TabsList className="h-auto max-w-full flex-wrap justify-start gap-1 rounded-lg border bg-card p-1">
          <TabsTrigger value="homepage" className="gap-2">
            <House className="size-4" />
            Homepage
          </TabsTrigger>

          <TabsTrigger value="projects" className="gap-2">
            <ImageIcon className="size-4" />
            Projects
          </TabsTrigger>

          <TabsTrigger value="feedback" className="gap-2">
            <MessageSquareQuote className="size-4" />
            Feedback
          </TabsTrigger>

          <TabsTrigger value="social-media" className="gap-2">
            <Facebook className="size-4" />
            Social Media
          </TabsTrigger>
        </TabsList>

        <TabsContent value="homepage">
          {homepageLoading ? (
            <ContentPanelSkeleton variant="homepage" />
          ) : homepageError ? (
            <div className="rounded-lg border border-destructive/50 p-10 text-center">
              <p className="text-sm text-destructive">{homepageError}</p>
            </div>
          ) : homepage ? (
            <HomepageContentCard
              content={homepage}
              onEdit={() => setEditHomepageOpen(true)}
            />
          ) : (
            <div className="rounded-lg border p-10 text-center">
              <p className="text-sm text-muted-foreground">
                No homepage content found.
              </p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="projects">
          <ProjectList
            projects={projects.slice((projectPage - 1) * 10, projectPage * 10)}
            loading={projectsLoading}
            error={projectsError}
            onAdd={() => setAddProjectOpen(true)}
            onEdit={(project) => {
              setSelectedProject(project)
              setEditProjectOpen(true)
            }}
            onDelete={(project) => {
              setProjectToDelete(project)
              setDeleteProjectOpen(true)
            }}
            onToggleVisibility={async (project) => {
              try {
                const updatedProject = await updateContentProject(project.id, {
                  isVisible: !project.isVisible,
                })

                toast.success("Project visibility updated.")
                setProjects((currentProjects) =>
                  currentProjects.map((currentProject) =>
                    currentProject.id === updatedProject.id
                      ? updatedProject
                      : currentProject
                  )
                )
              } catch (error) {
                console.error("Failed to update project visibility:", error)
                toast.error(
                  getErrorMessage(error, "Unable to update content.")
                )
              }
            }}
          />
          {!projectsLoading && !projectsError && (
            <ContentPagination
              total={projects.length}
              page={projectPage}
              onPageChange={setProjectsPage}
              label="projects"
            />
          )}
        </TabsContent>
        <TabsContent value="feedback">
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold">Customer Feedback</h2>

              <p className="text-sm text-muted-foreground">
                Choose published customer feedback to feature on the FJ Glass
                and Aluminum website.
              </p>
            </div>

            <FeedbackList
              feedback={feedback.slice((reviewPage - 1) * 10, reviewPage * 10)}
              loading={feedbackLoading}
              error={feedbackError}
              updatingId={updatingFeedbackId}
              onToggleFeatured={async (item) => {
                try {
                  setUpdatingFeedbackId(item.id)
                  setFeedbackError(null)

                  const updatedFeedback = await setFeedbackFeatured(
                    item.id,
                    !item.featured
                  )

                  toast.success("Featured feedback updated.")
                  setFeedback((currentFeedback) =>
                    currentFeedback.map((currentItem) =>
                      currentItem.id === updatedFeedback.id
                        ? updatedFeedback
                        : currentItem
                    )
                  )
                } catch (error) {
                  console.error("Failed to update featured feedback:", error)
                  toast.error(
                    getErrorMessage(error, "Unable to update content.")
                  )

                  setFeedbackError(
                    getErrorMessage(error, "Failed to update feedback.")
                  )
                } finally {
                  setUpdatingFeedbackId(null)
                }
              }}
            />
          </div>
          {!feedbackLoading && !feedbackError && (
            <ContentPagination
              total={feedback.length}
              page={reviewPage}
              onPageChange={setFeedbackPage}
              label="feedback"
            />
          )}
        </TabsContent>
        <TabsContent value="social-media">
          <SocialMediaList
            links={socialLinks.slice((linkPage - 1) * 10, linkPage * 10)}
            loading={socialLinksLoading}
            error={socialLinksError}
            onAdd={() => setAddSocialLinkOpen(true)}
            onEdit={(link) => {
              setSelectedSocialLink(link)
              setEditSocialLinkOpen(true)
            }}
            onToggleVisibility={async (link) => {
              try {
                setSocialLinksError(null)

                const updatedLink = await updateContentSocialLink(link.id, {
                  isVisible: !link.isVisible,
                })

                toast.success("Social link visibility updated.")
                setSocialLinks((currentLinks) =>
                  currentLinks.map((currentLink) =>
                    currentLink.id === updatedLink.id
                      ? updatedLink
                      : currentLink
                  )
                )
              } catch (error) {
                console.error("Failed to change social link visibility:", error)
                toast.error(
                  getErrorMessage(error, "Unable to update content.")
                )

                setSocialLinksError(
                  getErrorMessage(error, "Failed to update social link.")
                )
              }
            }}
            onDelete={(link) => {
              setSelectedSocialLink(link)
              setDeleteSocialLinkOpen(true)
            }}
          />
          {!socialLinksLoading && !socialLinksError && (
            <ContentPagination
              total={socialLinks.length}
              page={linkPage}
              onPageChange={setSocialPage}
              label="social-media"
            />
          )}
        </TabsContent>
      </Tabs>
      {homepage && (
        <EditHomepageDialog
          open={editHomepageOpen}
          onOpenChange={setEditHomepageOpen}
          content={homepage}
          onSave={async (updatedContent) => {
            const previousImageUrl = homepage.heroImageUrl

            const savedContent = await updateHomepageContent(homepage.id, {
              heroTitle: updatedContent.heroTitle,
              heroDescription: updatedContent.heroDescription,
              heroImageUrl: updatedContent.heroImageUrl,
            })

            toast.success("Homepage content saved.")
            setHomepage(savedContent)
            setEditHomepageOpen(false)

            if (
              previousImageUrl &&
              savedContent.heroImageUrl &&
              previousImageUrl !== savedContent.heroImageUrl
            ) {
              try {
                await deleteContentImage(previousImageUrl)
              } catch (error) {
                console.error(
                  "Homepage updated, but the previous hero image could not be deleted:",
                  error
                )
              }
            }
          }}
        />
      )}
      <AddProjectDialog
        open={addProjectOpen}
        onOpenChange={setAddProjectOpen}
        onCreated={(project) => {
          setProjects((currentProjects) =>
            [...currentProjects, project].sort(
              (a, b) =>
                a.displayOrder - b.displayOrder ||
                a.createdAt.localeCompare(b.createdAt)
            )
          )
        }}
      />

      <EditProjectDialog
        open={editProjectOpen}
        onOpenChange={(open) => {
          setEditProjectOpen(open)

          if (!open) {
            setSelectedProject(null)
          }
        }}
        project={selectedProject}
        onUpdated={(updatedProject) => {
          setProjects((currentProjects) =>
            currentProjects
              .map((project) =>
                project.id === updatedProject.id ? updatedProject : project
              )
              .sort(
                (a, b) =>
                  a.displayOrder - b.displayOrder ||
                  a.createdAt.localeCompare(b.createdAt)
              )
          )
        }}
      />
      <DeleteProjectDialog
        open={deleteProjectOpen}
        onOpenChange={(open) => {
          setDeleteProjectOpen(open)

          if (!open) {
            setProjectToDelete(null)
          }
        }}
        project={projectToDelete}
        onDeleted={(projectId) => {
          setProjects((currentProjects) =>
            currentProjects.filter((project) => project.id !== projectId)
          )
        }}
      />
      <AddSocialLinkDialog
        open={addSocialLinkOpen}
        onOpenChange={setAddSocialLinkOpen}
        onCreated={(createdLink) => {
          setSocialLinks((currentLinks) =>
            [...currentLinks, createdLink].sort(
              (a, b) =>
                a.displayOrder - b.displayOrder ||
                a.createdAt.localeCompare(b.createdAt)
            )
          )
        }}
      />
      <EditSocialLinkDialog
        open={editSocialLinkOpen}
        onOpenChange={(open) => {
          setEditSocialLinkOpen(open)

          if (!open) {
            setSelectedSocialLink(null)
          }
        }}
        link={selectedSocialLink}
        onUpdated={(updatedLink) => {
          setSocialLinks((currentLinks) =>
            currentLinks
              .map((currentLink) =>
                currentLink.id === updatedLink.id ? updatedLink : currentLink
              )
              .sort(
                (a, b) =>
                  a.displayOrder - b.displayOrder ||
                  a.createdAt.localeCompare(b.createdAt)
              )
          )
        }}
      />
      <DeleteSocialLinkDialog
        open={deleteSocialLinkOpen}
        onOpenChange={(open) => {
          setDeleteSocialLinkOpen(open)

          if (!open) {
            setSelectedSocialLink(null)
          }
        }}
        link={selectedSocialLink}
        deleting={deletingSocialLink}
        onConfirm={async () => {
          if (!selectedSocialLink) return

          try {
            setDeletingSocialLink(true)
            setSocialLinksError(null)

            await deleteContentSocialLink(selectedSocialLink.id)

            setSocialLinks((currentLinks) =>
              currentLinks.filter(
                (currentLink) => currentLink.id !== selectedSocialLink.id
              )
            )

            toast.success("Social link deleted.")
            setDeleteSocialLinkOpen(false)
            setSelectedSocialLink(null)
          } catch (error) {
            console.error("Failed to delete social link:", error)
            toast.error(
              getErrorMessage(error, "Unable to update content.")
            )

            setSocialLinksError(
              getErrorMessage(error, "Failed to delete social link.")
            )
          } finally {
            setDeletingSocialLink(false)
          }
        }}
      />
    </div>
  )
}
