"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Bookmark, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
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

export function ReadingList() {
  const [books, setBooks] = useState<Book[]>([])
  const [bookmarkedBooks, setBookmarkedBooks] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBooks()
    fetchBookmarks()
  }, [])

  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/books")
      if (response.ok) {
        const data = await response.json()
        setBooks(data)
      }
    } catch (error) {
      console.error("Error fetching books:", error)
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

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.genre.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Reading List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading books...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Reading List</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search books by title, author, or genre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book) => (
            <div key={book.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex gap-3">
                <Image
                  src={book.coverImageUrl}
                  alt={book.title}
                  width={64}
                  height={80}
                  className="w-16 h-20 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{book.title}</h3>
                  <p className="text-muted-foreground text-xs">{book.author}</p>
                  <p className="text-muted-foreground text-xs">{book.genre}</p>
                  <p className="text-muted-foreground text-xs">{book.totalPages} pages</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
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
        {filteredBooks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery ? "No books found matching your search." : "No books available."}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
