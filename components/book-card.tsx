"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { HeartIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"

interface BookCardProps {
  book: {
    id: string
    title: string
    author: string
    coverImageUrl: string
  }
  isBookmarkedInitial: boolean
  onBookmarkToggle: (bookId: string, isBookmarked: boolean) => void
}

export function BookCard({ book, isBookmarkedInitial, onBookmarkToggle }: BookCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(isBookmarkedInitial)

  useEffect(() => {
    setIsBookmarked(isBookmarkedInitial)
  }, [isBookmarkedInitial])

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the Link
    const newBookmarkState = !isBookmarked
    setIsBookmarked(newBookmarkState)
    onBookmarkToggle(book.id, newBookmarkState)
  }

  return (
    <div className="relative bg-card rounded-lg shadow-md overflow-hidden group">
      <Link href={`/books/${book.id}`} className="block">
        <Image
          src={book.coverImageUrl || "/placeholder.svg?height=300&width=200&query=book cover"}
          alt={`Cover of ${book.title}`}
          width={200}
          height={300}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-foreground text-balance">{book.title}</h3>
          <p className="text-sm text-muted-foreground">{book.author}</p>
        </div>
      </Link>
      <button
        onClick={handleBookmarkClick}
        className={cn(
          "absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm",
          "transition-colors duration-200",
          isBookmarked ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-primary",
        )}
        aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
      >
        <HeartIcon fill={isBookmarked ? "currentColor" : "none"} className="w-5 h-5" />
      </button>
    </div>
  )
}
