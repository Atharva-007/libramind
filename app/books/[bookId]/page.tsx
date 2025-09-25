"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Bookmark,
  ArrowLeft,
  Settings,
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface BookDetails {
  id: string
  title: string
  author: string
  coverImageUrl: string
  description: string
  totalPages: number
  genre: string
  publishedDate: string
  isbn: string
  publisher: string
  averageRating: number
  content: string
}

interface ReadingProgress {
  pages_read: number
  total_pages: number
  last_read_date: string
}

export default function BookPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.bookId as string

  const [book, setBook] = useState<BookDetails | null>(null)
  const [progress, setProgress] = useState<ReadingProgress | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (bookId) {
      fetchBookDetails()
      fetchReadingProgress()
      checkBookmarkStatus()
    }
  }, [bookId])

  const fetchBookDetails = async () => {
    try {
      const response = await fetch(`/api/books/${bookId}`)
      if (response.ok) {
        const data = await response.json()
        setBook(data)
      } else if (response.status === 404) {
        router.push("/")
      }
    } catch (error) {
      console.error("Error fetching book details:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReadingProgress = async () => {
    try {
      const response = await fetch("/api/reading-progress")
      if (response.ok) {
        const allProgress = await response.json()
        const bookProgress = allProgress.find((p: ReadingProgress & { book_id: string }) => p.book_id === bookId)
        if (bookProgress) {
          setProgress(bookProgress)
          setCurrentPage(bookProgress.pages_read || 1)
        }
      }
    } catch (error) {
      console.error("Error fetching reading progress:", error)
    }
  }

  const checkBookmarkStatus = async () => {
    try {
      const response = await fetch("/api/user-bookmarks")
      if (response.ok) {
        const bookmarks = await response.json()
        setIsBookmarked(bookmarks.includes(bookId))
      }
    } catch (error) {
      console.error("Error checking bookmark status:", error)
    }
  }

  const toggleBookmark = async () => {
    try {
      const response = await fetch("/api/bookmarks", {
        method: isBookmarked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ book_id: bookId }),
      })

      if (response.ok) {
        setIsBookmarked(!isBookmarked)
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
    }
  }

  const updateReadingProgress = async (pagesRead: number) => {
    if (!book) return

    try {
      const response = await fetch("/api/reading-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          book_id: bookId,
          pages_read: pagesRead,
          total_pages: book.totalPages,
        }),
      })

      if (response.ok) {
        setProgress({
          pages_read: pagesRead,
          total_pages: book.totalPages,
          last_read_date: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error("Error updating reading progress:", error)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (book && newPage >= 1 && newPage <= book.totalPages) {
      setCurrentPage(newPage)
      updateReadingProgress(newPage)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading book...</div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Book not found</h1>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const progressPercentage = progress ? (progress.pages_read / progress.total_pages) * 100 : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-semibold truncate max-w-md">{book.title}</h1>
                <p className="text-sm text-muted-foreground">by {book.author}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isBookmarked ? "default" : "outline"}
                size="sm"
                onClick={toggleBookmark}
              >
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Book Info Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Image
                    src={book.coverImageUrl}
                    alt={book.title}
                    width={200}
                    height={280}
                    className="mx-auto rounded-lg shadow-md"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="font-semibold text-lg">{book.title}</h2>
                    <p className="text-muted-foreground">{book.author}</p>
                  </div>

                  <Badge variant="secondary">{book.genre}</Badge>

                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pages:</span>
                      <span>{book.totalPages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Published:</span>
                      <span>{book.publishedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Publisher:</span>
                      <span className="truncate ml-2">{book.publisher}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rating:</span>
                      <span>{book.averageRating}/5.0</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Reading Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {progress?.pages_read || 0}/{book.totalPages}
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="mb-2" />
                    <p className="text-xs text-muted-foreground">
                      {Math.round(progressPercentage)}% complete
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {/* TODO: Add notes feature */ }}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Add Notes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reading Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    Chapter 1 - Page {currentPage}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm px-2">
                      {currentPage} / {book.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= book.totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="prose prose-gray max-w-none">
                  <p className="text-base leading-relaxed">
                    {book.content}
                  </p>
                  <p className="text-base leading-relaxed mt-6">
                    This is a sample reading experience. In a real implementation,
                    this would display the actual book content with proper pagination,
                    text formatting, and reading features like font size adjustment,
                    theme switching, and highlighting.
                  </p>
                  <p className="text-base leading-relaxed mt-6">
                    The reading progress is automatically saved as you navigate through
                    the pages, allowing you to resume reading from where you left off.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous Page
              </Button>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= book.totalPages}
              >
                Next Page
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
