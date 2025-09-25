"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MessageSquare, BookmarkPlus, Maximize, Minimize, Eye } from "lucide-react"
import { ReadingControls, type ReadingSettings } from "@/components/reading-controls"
import { NotesPanel } from "@/components/notes-panel"
import { ChatPanel } from "@/components/chat-panel"
import type { LibraryBook } from "@/types/books"

interface ReadingEnvironmentProps {
  book: LibraryBook
  onBack: () => void
}

export function ReadingEnvironment({ book, onBack }: ReadingEnvironmentProps) {
  const [focusMode, setFocusMode] = useState(false)
  const [activePanel, setActivePanel] = useState<"notes" | "chat" | null>(null)
  const [readingSettings, setReadingSettings] = useState<ReadingSettings>({
    fontSize: 16,
    fontFamily: "serif",
    lineHeight: 1.7,
    theme: "dark",
  })

  const sampleContent = `
Chapter 1: The Lean Startup Method

The Lean Startup method is not about cost, it is about speed. Lean, in the context of Lean Startup, refers to a process of building companies and products based on validated learning, scientific experimentation, and iterative product releases to shorten product development cycles, measure progress, and gain valuable customer feedback.

The fundamental activity of a startup is to turn ideas into products, measure how customers respond, and then learn whether to pivot or persevere. All successful startup processes should be geared to accelerate that feedback loop.

This methodology enables companies to design their products or services to meet the demands of their customer base without requiring large amounts of initial funding or expensive product launches.

The Build-Measure-Learn Loop

The Build-Measure-Learn feedback loop is at the core of the Lean Startup model. The goal is to turn ideas into products, measure how customers respond, and learn whether to pivot or persevere.

1. Build: The goal of the Build step is to build a Minimum Viable Product (MVP) as quickly as possible to begin the process of learning as quickly as possible.

2. Measure: The goal of the Measure step is to measure the progress and determine whether the product is moving the business model in the right direction.

3. Learn: The goal of the Learn step is to determine whether to pivot (make a fundamental change to the product) or persevere (keep improving the current product).

This cycle should be repeated as quickly as possible, with each iteration building upon the learnings from the previous cycle.
  `

  return (
    <div className="min-h-screen bg-reading-bg text-reading-text">
      {/* Header - Hidden in focus mode */}
      {!focusMode && (
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={onBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Library
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <div>
                  <h1 className="font-semibold">{book.title}</h1>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActivePanel(activePanel === "notes" ? null : "notes")}
                  className={activePanel === "notes" ? "bg-accent" : ""}
                >
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  Notes
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActivePanel(activePanel === "chat" ? null : "chat")}
                  className={activePanel === "chat" ? "bg-accent" : ""}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setFocusMode(!focusMode)}>
                  {focusMode ? <Minimize className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <ReadingControls settings={readingSettings} onSettingsChange={setReadingSettings} />
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Reading Area */}
      <div className="flex">
        {/* Content Area */}
        <div className={`flex-1 ${activePanel ? "mr-80" : ""} transition-all duration-300`}>
          <div className="container mx-auto px-6 py-8 max-w-4xl">
            {/* Progress Bar */}
            {!focusMode && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>
                    Page {book.currentPage} of {book.totalPages}
                  </span>
                  <span>{book.progress}% complete</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1">
                  <div
                    className="bg-primary h-1 rounded-full transition-all duration-300"
                    style={{ width: `${book.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Reading Content */}
            <div
              className={`
                reading-text prose prose-lg max-w-none
                ${readingSettings.fontFamily === "serif"
                  ? "reading-serif"
                  : readingSettings.fontFamily === "mono"
                    ? "reading-mono"
                    : "reading-sans"
                }
              `}
              style={{
                fontSize: `${readingSettings.fontSize}px`,
                lineHeight: readingSettings.lineHeight,
              }}
            >
              <div className="whitespace-pre-line">{sampleContent}</div>
            </div>

            {/* Focus Mode Toggle (floating) */}
            {focusMode && (
              <Button
                className="fixed bottom-6 right-6 rounded-full w-12 h-12 p-0 shadow-lg"
                onClick={() => setFocusMode(false)}
              >
                <Maximize className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Side Panel */}
        {activePanel && (
          <div className="fixed right-0 top-0 h-full w-80 bg-card border-l border-border z-40">
            {activePanel === "notes" && <NotesPanel book={book} />}
            {activePanel === "chat" && <ChatPanel book={book} />}
          </div>
        )}
      </div>
    </div>
  )
}
