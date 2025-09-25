"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus } from "lucide-react"
import type { LibraryBook } from "@/types/books"

interface NotesPanelProps {
  book: LibraryBook
}

export function NotesPanel({ book }: NotesPanelProps) {
  const [notes] = useState([
    {
      id: 1,
      content: "The Build-Measure-Learn loop is fundamental to the Lean Startup methodology",
      page: 23,
      tag: "Key Concept",
      color: "yellow",
      timestamp: "2024-01-15T10:30:00Z",
    },
    {
      id: 2,
      content: "MVP should be built as quickly as possible to start learning",
      page: 45,
      tag: "Important",
      color: "blue",
      timestamp: "2024-01-15T11:15:00Z",
    },
    {
      id: 3,
      content: "Question: How does this apply to B2B products?",
      page: 67,
      tag: "Question",
      color: "green",
      timestamp: "2024-01-15T14:20:00Z",
    },
  ])

  const [newNote, setNewNote] = useState("")

  const tagColors = {
    "Key Concept": "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
    Important: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
    Question: "bg-green-500/20 text-green-700 dark:text-green-300",
    "To Research": "bg-pink-500/20 text-pink-700 dark:text-pink-300",
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Notes &amp; Highlights</h3>
          <Badge variant="secondary">{notes.length}</Badge>
        </div>

        <p className="text-xs text-muted-foreground mb-2">Book: {book.title}</p>

        {/* Legend */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Legend</p>
          <div className="flex flex-wrap gap-1">
            {Object.entries(tagColors).map(([tag, className]) => (
              <Badge key={tag} className={`text-xs ${className}`}>
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {notes.map((note) => (
            <Card key={note.id} className="text-sm">
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <Badge className={`text-xs ${tagColors[note.tag as keyof typeof tagColors]}`}>{note.tag}</Badge>
                  <span className="text-xs text-muted-foreground">p. {note.page}</span>
                </div>
                <p className="text-sm leading-relaxed">{note.content}</p>
                <p className="text-xs text-muted-foreground mt-2">{new Date(note.timestamp).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Add Note */}
      <div className="p-4 border-t border-border">
        <Textarea
          placeholder="Add a note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="mb-2 min-h-[60px]"
        />
        <Button size="sm" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Note
        </Button>
      </div>
    </div>
  )
}
