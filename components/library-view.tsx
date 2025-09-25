"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, BookOpen, Brain, Clock, TrendingUp } from "lucide-react"
import type { LibraryBook } from "@/types/books"

interface LibraryViewProps {
  onBookSelect: (book: LibraryBook) => void
}

export function LibraryView({ onBookSelect }: LibraryViewProps) {
  const [books] = useState<LibraryBook[]>([
    {
      id: 1,
      title: "The Lean Startup",
      author: "Eric Ries",
      progress: 45,
      totalPages: 320,
      currentPage: 144,
      uploadDate: "2024-01-15",
      tags: ["Business", "Entrepreneurship"],
      summary: "A methodology for developing businesses and products that aims to shorten product development cycles.",
      readingTime: "2h 30m",
      highlights: 23,
      notes: 8,
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      progress: 78,
      totalPages: 285,
      currentPage: 222,
      uploadDate: "2024-01-10",
      tags: ["Self-Help", "Psychology"],
      summary: "A comprehensive guide to building good habits and breaking bad ones through small changes.",
      readingTime: "4h 15m",
      highlights: 41,
      notes: 15,
    },
    {
      id: 3,
      title: "Deep Work",
      author: "Cal Newport",
      progress: 12,
      totalPages: 296,
      currentPage: 36,
      uploadDate: "2024-01-20",
      tags: ["Productivity", "Focus"],
      summary: "Rules for focused success in a distracted world, emphasizing the value of deep, concentrated work.",
      readingTime: "0h 45m",
      highlights: 7,
      notes: 3,
    },
  ])

  const stats = {
    totalBooks: books.length,
    totalReadingTime: "7h 30m",
    averageProgress: Math.round(books.reduce((acc, book) => acc + book.progress, 0) / books.length),
    totalHighlights: books.reduce((acc, book) => acc + book.highlights, 0),
  }

  return (
    <main className="container mx-auto px-6 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back</h2>
        <p className="text-muted-foreground text-lg">Continue your learning journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Books</p>
                <p className="text-2xl font-bold">{stats.totalBooks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Reading Time</p>
                <p className="text-2xl font-bold">{stats.totalReadingTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Progress</p>
                <p className="text-2xl font-bold">{stats.averageProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Highlights</p>
                <p className="text-2xl font-bold">{stats.totalHighlights}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Section */}
      <Card className="mb-8 border-dashed border-2 border-muted-foreground/25 hover:border-primary/50 transition-colors">
        <CardContent className="p-8 text-center">
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Upload a new book</h3>
          <p className="text-muted-foreground mb-4">Drag and drop your PDF files here, or click to browse</p>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Choose Files
          </Button>
        </CardContent>
      </Card>

      {/* Books Grid */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Your Library</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Card
              key={book.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onBookSelect(book)}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight mb-1">{book.title}</CardTitle>
                    <CardDescription className="text-sm">{book.author}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {book.progress}%
                  </Badge>
                </div>
                <Progress value={book.progress} className="h-2" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{book.summary}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {book.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {book.currentPage}/{book.totalPages} pages
                  </span>
                  <span>{book.readingTime}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{book.highlights} highlights</span>
                  <span>{book.notes} notes</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
