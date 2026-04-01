'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function ContentPage() {
  return (
    <div className="space-y-6">

      {/* 🔹 HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Content Management</h1>
          <p className="text-sm text-muted-foreground">
            Update website content and media
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">Preview</Button>
          <Button>Publish Updates</Button>
        </div>
      </div>

      {/* 🔹 TABS */}
      <Tabs defaultValue="homepage" className="w-full">

        <TabsList>
          <TabsTrigger value="homepage">Homepage Content</TabsTrigger>
          <TabsTrigger value="gallery">Projects Gallery</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* ========================= */}
        {/* 🔥 HOMEPAGE TAB */}
        {/* ========================= */}
        <TabsContent value="homepage" className="space-y-4">

          {/* HERO */}
          <Card className="p-4 space-y-3">
            <h2 className="font-semibold">Hero Section</h2>

            <Input placeholder="Hero Text" defaultValue="Premium Glass & Aluminum Solutions for Modern Spaces" />

            <div className="rounded-lg bg-primary text-primary-foreground p-6 text-center font-semibold">
              Premium Glass & Aluminum Solutions for Modern Spaces
            </div>
          </Card>

          {/* ABOUT */}
          <Card className="p-4 space-y-3">
            <h2 className="font-semibold">Company Description</h2>

            <Textarea
              placeholder="About Us Text"
              defaultValue="FJ Glass and Aluminum has been serving the construction industry for over 20 years..."
            />

            <div className="border rounded-lg p-4 text-sm text-muted-foreground">
              FJ Glass and Aluminum has been serving the construction industry for over 20 years.
              We specialize in custom glass fabrication, aluminum frames, and installation services.
            </div>
          </Card>

        </TabsContent>

        {/* ========================= */}
        {/* 🔥 PROJECTS GALLERY */}
        {/* ========================= */}
        <TabsContent value="gallery" className="space-y-4">

          {/* UPLOAD AREA */}
          <Card className="p-6 text-center border-dashed border-2">
            <p className="text-sm text-muted-foreground">
              Upload Project Images
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Drag and drop or click to browse (Max 10 images)
            </p>

            <Button variant="outline">Choose Files</Button>
          </Card>

          {/* GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">

            {[1,2,3,4,5,6].map((item) => (
              <div
                key={item}
                className="h-32 rounded-lg border flex items-center justify-center text-sm text-muted-foreground"
              >
                Project {item}
              </div>
            ))}

          </div>

        </TabsContent>

        {/* ========================= */}
        {/* 🔥 DOCUMENTS TAB */}
        {/* ========================= */}
        <TabsContent value="documents" className="space-y-4">

          {/* UPLOAD DOCUMENT */}
          <Card className="p-6 text-center border-dashed border-2">
            <p className="text-sm font-medium">Upload Documents</p>
            <p className="text-xs text-muted-foreground mb-3">
              Upload receipts, quotations, or templates (PDF, DOCX)
            </p>

            <Button variant="outline">Upload File</Button>
          </Card>

          {/* DOCUMENT LIST */}
          <div className="space-y-3">

            {[
              "Quotation Template.pdf",
              "Official Receipt Layout.docx",
              "Invoice Format.xlsx",
            ].map((doc, i) => (
              <Card key={i} className="p-4 flex items-center justify-between">
                <p className="text-sm">{doc}</p>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Download</Button>
                  <Button size="sm" variant="destructive">Delete</Button>
                </div>
              </Card>
            ))}

          </div>

        </TabsContent>

      </Tabs>
    </div>
  )
}