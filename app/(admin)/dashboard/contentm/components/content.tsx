"use client"

import { useEffect, useState } from "react"
import { Facebook, House, ImageIcon, MessageSquareQuote } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import type { HomepageContent } from "../types/content"
import HomepageContentCard from "./homepage-content-card"
import EditHomepageDialog from "./edit-homepage-dialog"

import {
  deleteContentImage,
  getHomepageContent,
  updateHomepageContent,
} from "../services/content"

export default function Content() {
  const [homepage, setHomepage] = useState<HomepageContent | null>(null)

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
          error instanceof Error
            ? error.message
            : "Failed to load homepage content."
        )
      } finally {
        setHomepageLoading(false)
      }
    }

    void loadHomepage()
  }, [])

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Content Management
        </h1>

        <p className="text-muted-foreground">
          Manage the content displayed on the FJ Glass and Aluminum website.
        </p>
      </div>

      <Tabs defaultValue="homepage" className="space-y-6">
        <TabsList>
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
            <div className="rounded-lg border p-10 text-center">
              <p className="text-sm text-muted-foreground">
                Loading homepage content...
              </p>
            </div>
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
    </div>
  )
}
