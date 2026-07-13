"use client"

import { useState } from "react"

import {
  HomepageContent,
  GalleryItem,
  DocumentTemplate,
} from "./types/content"

import HomepageContentCard from "./components/homepage-content-card"
import GalleryGrid from "./components/gallery-grid"
import DocumentList from "./components/document-list"

import EditHomepageDialog from "./components/edit-homepage-dialog"
import AddGalleryItemDialog from "./components/add-gallery-item-dialog"
import UploadDocumentDialog from "./components/upload-document-dialog"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { Button } from "@/components/ui/button"

import {
  ImageIcon,
  FileText,
  Pencil,
  Plus,
} from "lucide-react"

const initialHomepage: HomepageContent = {
  id:1,

  heroTitle:
    "Premium Glass & Aluminum Solutions for Modern Spaces",

  heroImage:
    "/hero-image.jpg",

  companyDescription:
    "FJ Glass and Aluminum has been serving the construction industry for over 20 years.",
}

const initialGallery: GalleryItem[] = [
  {
    id: 1,
    title:
      "Sliding Window Project",
    category: "Windows",
    image:
      "/gallery/project1.jpg",
    uploadedAt:
      "Apr 20, 2026",
  },

  {
    id: 2,
    title:
      "Glass Door Installation",
    category: "Doors",
    image:
      "/gallery/project2.jpg",
    uploadedAt:
      "Apr 21, 2026",
  },
]

const initialDocuments: DocumentTemplate[] =
  [
    {
      id: 1,
      name:
        "Quotation Template",
      type:
        "Quotation",
      fileName:
        "quotation-template.pdf",
      uploadedAt:
        "Apr 18, 2026",
    },

    {
      id: 2,
      name:
        "Official Receipt",
      type:
        "Receipt",
      fileName:
        "official-receipt.docx",
      uploadedAt:
        "Apr 19, 2026",
    },
  ]

export default function ContentPage() {
  const [homepage,
    setHomepage] =
    useState(
      initialHomepage
    )

  const [gallery,
    setGallery] =
    useState(
      initialGallery
    )

  const [documents,
    setDocuments] =
    useState(
      initialDocuments
    )

  const [editHomepageOpen,
    setEditHomepageOpen] =
    useState(false)

  const [addGalleryOpen,
    setAddGalleryOpen] =
    useState(false)

  const [uploadDocumentOpen,
    setUploadDocumentOpen] =
    useState(false)

  const handleSaveHomepage = (
    updated: HomepageContent
  ) => {
    setHomepage(updated)

    setEditHomepageOpen(false)

    /**
     * FUTURE DATABASE LOGIC
     *
     * await updateHomepageContent(updated)
     */
  }

  const handleAddGalleryItem = (
    item: GalleryItem
  ) => {
    setGallery((prev) => [
      ...prev,
      item,
    ])

    /**
     * FUTURE DATABASE LOGIC
     *
     * await createGalleryItem(item)
     */
  }

  const handleAddDocument = (
    document: DocumentTemplate
  ) => {
    setDocuments((prev) => [
      ...prev,
      document,
    ])

    /**
     * FUTURE DATABASE LOGIC
     *
     * await uploadDocument(document)
     */
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Content Management
          </h1>

          <p className="text-muted-foreground">
            Manage website content,
            project gallery,
            and document templates.
          </p>
        </div>

      </div>

      <Tabs
        defaultValue="homepage"
        className="space-y-6"
      >

        <TabsList>

          <TabsTrigger value="homepage">
            Homepage
          </TabsTrigger>

          <TabsTrigger value="gallery">
            Gallery
          </TabsTrigger>

          <TabsTrigger value="documents">
            Documents
          </TabsTrigger>

        </TabsList>

        {/* HOMEPAGE */}

        <TabsContent value="homepage">

          <div className="flex justify-end mb-4">

            <Button
              onClick={() =>
                setEditHomepageOpen(
                  true
                )
              }
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Homepage
            </Button>

          </div>

          <HomepageContentCard
            content={homepage}
            onEdit={() => setEditHomepageOpen(true)}
          />

        </TabsContent>

        {/* GALLERY */}

        <TabsContent value="gallery">

          <div className="flex justify-end mb-4">

            <Button
              onClick={() =>
                setAddGalleryOpen(
                  true
                )
              }
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Add Gallery Item
            </Button>

          </div>

          <GalleryGrid
            items={gallery}
          />

        </TabsContent>

        {/* DOCUMENTS */}

        <TabsContent value="documents">

          <div className="flex justify-end mb-4">

            <Button
              onClick={() =>
                setUploadDocumentOpen(
                  true
                )
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Upload Document
            </Button>

          </div>

          <DocumentList
            documents={
              documents
            }
          />

        </TabsContent>

      </Tabs>

      <EditHomepageDialog
        open={
          editHomepageOpen
        }
        onOpenChange={
          setEditHomepageOpen
        }
        content={homepage}
        onSave={
          handleSaveHomepage
        }
      />

      <AddGalleryItemDialog
        open={
          addGalleryOpen
        }
        onOpenChange={
          setAddGalleryOpen
        }
        onAdd={
          handleAddGalleryItem
        }
      />

      <UploadDocumentDialog
        open={
          uploadDocumentOpen
        }
        onOpenChange={
          setUploadDocumentOpen
        }
        onAdd={
          handleAddDocument
        }
      />

    </div>
  )
}