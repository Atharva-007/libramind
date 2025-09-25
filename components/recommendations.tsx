"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Bookmark, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

interface Book {
  id: string
  title: string
  author: string
  coverImageUrl: string
  description: string
  totalPages: number
  genre: string
}

export function Recommendations() {
  const [books, setBooks] = useState<Book[]>([])
  const [bookmarkedBooks, setBookmarkedBooks] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecommendations()
    fetchBookmarks()
  }, [])

  const fetchRecommendations = async () => {
    try {
      // Fetch science fiction books as recommendations
      const response = await fetch("/api/books?category=science fiction")
      if (response.ok) {
        const data = await response.json()
        setBooks(data.slice(0, 6)) // Show top 6 recommendations
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBookmarks = async () => {
    try {
      const response = await fetch("/api/user-bookmarks")
      if (response.ok) {
        const data = await response.json()
        setBookmarkedBooks(data)
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error)
    }
  }

  const toggleBookmark = async (bookId: string) => {
    const isBookmarked = bookmarkedBooks.includes(bookId)

    try {
      const response = await fetch("/api/bookmarks", {
        method: isBookmarked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ book_id: bookId }),
      })

      if (response.ok) {
        if (isBookmarked) {
          setBookmarkedBooks(prev => prev.filter(id => id !== bookId))
        } else {
          setBookmarkedBooks(prev => [...prev, bookId])
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading recommendations...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5" />
          Recommended for You
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Based on popular science fiction titles
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <div key={book.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex gap-3 mb-3">
                <Image
                  src={book.coverImageUrl}
                  alt={book.title}
                  width={48}
                  height={64}
                  className="w-12 h-16 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{book.title}</h3>
                  <p className="text-muted-foreground text-xs">{book.author}</p>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {book.genre}
                  </Badge>
                </div>
              </div>
              <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
                {book.description}
              </p>
              <div className="flex gap-2">
                <Link href={`/books/${book.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Read
                  </Button>
                </Link>
                <Button
                  variant={bookmarkedBooks.includes(book.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleBookmark(book.id)}
                >
                  <Bookmark className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        {books.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No recommendations available at the moment.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
