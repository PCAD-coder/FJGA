"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { ProjectDetailsData, ProjectDetailsStep } from "./project-details-step"
import { WizardProgress } from "./wizard-progress"

import {
  DesignReferenceData,
  DesignReferenceStep,
} from "./design-reference-step"

import { SpecificationsData, SpecificationsStep } from "./specifications-step"

import { ReviewStep } from "./review-step"
import { createCustomOrderRequest } from "../../services/custom-order-request.service"

interface CustomOrderWizardProps {
  onCancel: () => void
  onSuccess: () => void
}

const initialProjectDetails: ProjectDetailsData = {
  category: "",
  projectName: "",
  quantity: 1,
  description: "",
}
const initialDesignReference: DesignReferenceData = {
  images: [],
  notes: "",
}
const initialSpecifications: SpecificationsData = {
  dimensionUnit: "cm",

  width: "",
  height: "",
  depth: "",
  measurementsApproximate: false,

  specifications: {},

  preferredFrame: "",
  preferredGlass: "",
  preferredFinish: "",

  letFjgaRecommend: false,
  otherPreferences: "",
}

export function CustomOrderWizard({
  onCancel,
  onSuccess,
}: CustomOrderWizardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit() {
    if (isSubmitting) return

    try {
      setIsSubmitting(true)
      setError(null)

      await createCustomOrderRequest({
        projectDetails,
        designReference,
        specifications,
      })

      onSuccess()
    } catch (error) {
      console.error("Failed to create custom order request:", error)

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create custom order request."
      )
    } finally {
      setIsSubmitting(false)
    }
  }
  const [currentStep, setCurrentStep] = useState(1)

  const [projectDetails, setProjectDetails] = useState<ProjectDetailsData>(
    initialProjectDetails
  )
  const [designReference, setDesignReference] = useState<DesignReferenceData>(
    initialDesignReference
  )
  const [specifications, setSpecifications] = useState<SpecificationsData>(
    initialSpecifications
  )

  const [error, setError] = useState<string | null>(null)

  function validateProjectDetails() {
    if (!projectDetails.category) {
      setError(
        "Please select what type of project you would like FJGA to make."
      )
      return false
    }

    if (!projectDetails.projectName.trim()) {
      setError("Please enter a project name.")
      return false
    }

    if (projectDetails.quantity < 1) {
      setError("Quantity must be at least 1.")
      return false
    }

    if (!projectDetails.description.trim()) {
      setError("Please provide a short description of your custom project.")
      return false
    }

    setError(null)
    return true
  }
  function validateDesignReference() {
    if (designReference.images.length === 0) {
      setError(
        "Please upload at least one reference image for your custom design."
      )
      return false
    }

    setError(null)
    return true
  }
  function validateSpecifications() {
    const width = Number(specifications.width)
    const height = Number(specifications.height)

    if (!specifications.width || !Number.isFinite(width) || width <= 0) {
      setError("Please enter a valid width for your custom project.")
      return false
    }

    if (!specifications.height || !Number.isFinite(height) || height <= 0) {
      setError("Please enter a valid height for your custom project.")
      return false
    }

    if (specifications.depth && Number(specifications.depth) <= 0) {
      setError("Depth must be greater than zero when provided.")
      return false
    }

    setError(null)
    return true
  }

  function handleContinue() {
    if (currentStep === 1) {
      if (!validateProjectDetails()) {
        return
      }
    }

    if (currentStep === 2) {
      if (!validateDesignReference()) {
        return
      }
    }

    if (currentStep === 3) {
      if (!validateSpecifications()) {
        return
      }
    }

    if (currentStep < 4) {
      setCurrentStep((step) => step + 1)
      setError(null)
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep((step) => step - 1)
      setError(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create Custom Order
          </h1>

          <p className="mt-1 text-muted-foreground">
            Tell us what you would like FJGA to build.
          </p>
        </div>

        <Button type="button" variant="ghost" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="px-6 py-6 sm:px-10">
          <WizardProgress currentStep={currentStep} />
        </CardContent>
      </Card>

      {/* Form */}
      <Card>
        <CardHeader className="border-b">
          <div>
            <p className="text-sm font-medium text-primary">
              Step {currentStep} of 4
            </p>

            <CardTitle className="mt-1">
              {currentStep === 1 && "Project Details"}
              {currentStep === 2 && "Design Reference"}
              {currentStep === 3 && "Specifications"}
              {currentStep === 4 && "Review Request"}
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              {currentStep === 1 &&
                "Start by telling us what you would like us to make."}

              {currentStep === 2 &&
                "Upload photos, sketches, or other references for your design."}

              {currentStep === 3 &&
                "Provide dimensions and your preferred materials."}

              {currentStep === 4 &&
                "Review everything before submitting your request."}
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          {currentStep === 1 && (
            <ProjectDetailsStep
              data={projectDetails}
              onChange={(data) => {
                if (data.category !== projectDetails.category) {
                  setSpecifications((current) => ({
                    ...current,
                    specifications: {},
                  }))
                }

                setProjectDetails(data)

                if (error) {
                  setError(null)
                }
              }}
            />
          )}

          {currentStep === 2 && (
            <DesignReferenceStep
              data={designReference}
              onChange={(data) => {
                setDesignReference(data)

                if (error) {
                  setError(null)
                }
              }}
              onFileError={(message) => {
                setError(message)
              }}
            />
          )}

          {currentStep === 3 && (
            <SpecificationsStep
              category={projectDetails.category}
              data={specifications}
              onChange={(data) => {
                setSpecifications(data)

                if (error) {
                  setError(null)
                }
              }}
            />
          )}

          {currentStep === 4 && (
            <ReviewStep
              projectDetails={projectDetails}
              designReference={designReference}
              specifications={specifications}
              onEdit={(step) => {
                setCurrentStep(step)
                setError(null)
              }}
            />
          )}

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
            </div>

            {currentStep < 4 ? (
              <Button type="button" onClick={handleContinue}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
