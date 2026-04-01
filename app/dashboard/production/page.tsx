'use client'

import { useState } from "react"
import {
  DndContext,
  closestCenter,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Card } from "@/components/ui/card"

type Task = {
  id: string
  column: string
}

const initialTasks: Task[] = [
  { id: "ORD-2026-156", column: "pending" },
  { id: "ORD-2026-157", column: "cutting" },
  { id: "ORD-2026-158", column: "assembly" },
  { id: "ORD-2026-159", column: "quality" },
  { id: "ORD-2026-160", column: "delivery" },
]

const columns = [
  { id: "pending", title: "Pending Fabrication", color: "bg-gray-100 dark:bg-gray-900" },
  { id: "cutting", title: "Glass Cutting", color: "bg-blue-100 dark:bg-blue-950" },
  { id: "assembly", title: "Assembly", color: "bg-purple-100 dark:bg-purple-950" },
  { id: "quality", title: "Quality Check", color: "bg-yellow-100 dark:bg-yellow-950" },
  { id: "delivery", title: "Ready for Delivery", color: "bg-green-100 dark:bg-green-950" },
]

export default function ProductionPage() {
  const [tasks, setTasks] = useState(initialTasks)

  function handleDragEnd(event: any) {
    const { active, over } = event
    if (!over) return

    setTasks((prev) =>
      prev.map((task) =>
        task.id === active.id
          ? { ...task, column: over.id }
          : task
      )
    )
  }

  return (
    <div className="space-y-6 w-full">

      {/* 🔹 HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Production Management</h1>
        <p className="text-sm text-muted-foreground">
          Track fabrication progress across production stages
        </p>
      </div>

      {/* 🔹 SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {columns.map((col) => {
          const count = tasks.filter(t => t.column === col.id).length

          return (
            <div key={col.id} className="p-4 rounded-xl border bg-card">
              <p className="text-sm text-muted-foreground">
                {col.title}
              </p>
              <p className="text-2xl font-bold">{count}</p>
            </div>
          )
        })}
      </div>

      {/* 🔹 KANBAN BOARD */}
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
    
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">

                {columns.map((col) => (
                <Column key={col.id} column={col}>
                    {tasks
                    .filter((task) => task.column === col.id)
                    .map((task) => (
                        <DraggableCard key={task.id} id={task.id} />
                    ))}
                </Column>
                ))}

            </div>

        </DndContext>

    </div>
  )
}

function Column({ column, children }: any) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`min-w-[200px] rounded-xl p-3 ${column.color}`}
    >
      <h3 className="font-semibold mb-3">{column.title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function DraggableCard({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-3 cursor-grab active:cursor-grabbing"
    >
      <p className="font-medium">{id}</p>
    </Card>
  )
}