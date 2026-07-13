"use client"

import { Card, CardContent } from "@/components/ui/card"

import {
  FileText,
  Package,
  Wrench,
  Truck,
} from "lucide-react"

export default function ProductionStageLegend() {
  const legends = [
    {
      title: "Quotation Approved",
      description:
        "Design and pricing confirmed",

      icon: (
        <FileText className="h-5 w-5 text-blue-500" />
      ),

      bg: "bg-blue-100",
    },

    {
      title: "Material Prep",
      description:
        "Sourcing and cutting materials",

      icon: (
        <Package className="h-5 w-5 text-yellow-500" />
      ),

      bg: "bg-yellow-100",
    },

    {
      title: "Fabrication",
      description:
        "Assembly and finishing work",

      icon: (
        <Wrench className="h-5 w-5 text-purple-500" />
      ),

      bg: "bg-purple-100",
    },

    {
      title: "Ready",
      description:
        "Quality checked, ready to ship",

      icon: (
        <Truck className="h-5 w-5 text-green-500" />
      ),

      bg: "bg-green-100",
    },
  ]

  return (
    <Card>

      <CardContent className="p-6">

        <h2 className="mb-6 text-lg font-semibold">
          Production Stage Legend
        </h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {legends.map((item) => (

            <div
              key={item.title}
              className="flex items-start gap-4"
            >

              <div
                className={`rounded-full p-3 ${item.bg}`}
              >
                {item.icon}
              </div>

              <div>

                <h3 className="font-medium">
                  {item.title}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>

              </div>

            </div>

          ))}

        </div>

      </CardContent>

    </Card>
  )
}