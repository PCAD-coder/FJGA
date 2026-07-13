"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface Props {
  open: boolean

  onOpenChange: (open: boolean) => void

  onSend: (message: string) => void

  clientName?: string
}

export default function ReplyFeedbackDialog({
  open,
  onOpenChange,
  onSend,
  clientName,
}: Props) {
  const [message, setMessage] = useState("")

  const handleSend = () => {
    onSend(message)

    setMessage("")

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reply to Client</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Send response to{" "}
          <span className="font-medium text-foreground">{clientName}</span>
        </p>

        <Textarea
          rows={5}
          value={message}
          placeholder="Write your message..."
          onChange={(e) => setMessage(e.target.value)}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button onClick={handleSend}>Send Reply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
