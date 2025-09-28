'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Search,
    Bookmark,
    Star,
    Book,
    Eye,
    Heart
} from 'lucide-react'
import { ModernNavigation } from '@/components/navigation/modern-navigation'
import { FadeInAnimation, StaggerAnimation, StaggerItem } from '@/components/animations/layout-animations'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface BookType {
    id: string
    title: string
    author: string
    coverImageUrl: string
    description: string
    genre: string
    totalPages: number
    averageRating?: number
    isBookmarked?: boolean
}

export default function WorkingReadingListPage() {
    const [books, setBooks] = useState<BookType[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedGenre, setSelectedGenre] = useState<string>('all')
    const [user, setUser] = useState<User | null>(null)
    const [userBookmarks, setUserBookmarks] = useState<string[]>([])
    const supabase = useMemo(() => createClient(), [])

    const checkUser = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
    }, [supabase])

    const loadBooks = useCallback(async () => {
        try {
            const response = await fetch('/api/books')
            if (response.ok) {
                const data = await response.json()
                setBooks(data)
            }
        } catch (error) {
            console.error('Error loading books:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    const loadUserBookmarks = useCallback(async () => {
        try {
            const response = await fetch('/api/user-bookmarks')
            if (response.ok) {
                const bookmarks = await response.json()
                setUserBookmarks(bookmarks)
            }
        } catch (error) {
            console.error('Error loading bookmarks:', error)
        }
    }, [])

    useEffect(() => {
        checkUser()
        loadBooks()
    }, [checkUser, loadBooks])

    useEffect(() => {
        if (user) {
            loadUserBookmarks()
        }
    }, [user, loadUserBookmarks])

    const toggleBookmark = async (bookId: string) => {
        if (!user) return

        const isCurrentlyBookmarked = userBookmarks.includes(bookId)

        try {
            const response = await fetch('/api/bookmarks', {
                method: isCurrentlyBookmarked ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ book_id: bookId }),
            })

            if (response.ok) {
                setUserBookmarks(prev =>
                    isCurrentlyBookmarked
                        ? prev.filter(id => id !== bookId)
                        : [...prev, bookId]
                )
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error)
        }
    }

    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesGenre = selectedGenre === 'all' || book.genre.toLowerCase() === selectedGenre.toLowerCase()
        return matchesSearch && matchesGenre
    })

    const genres = ['all', ...Array.from(new Set(books.map(book => book.genre)))]

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <ModernNavigation />
                <main className="pt-20 pb-12">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <ModernNavigation />

            <main className="pt-20 pb-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <FadeInAnimation>
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold mb-4">Reading List</h1>
                            <p className="text-xl text-muted-foreground">
                                Discover your next great read from our curated collection
                            </p>
                        </div>
                    </FadeInAnimation>

                    {/* Filters */}
                    <FadeInAnimation delay={0.1}>
                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                            <Input
                                                placeholder="Search books or authors..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:w-48">
                                        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Genre" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {genres.map((genre) => (
                                                    <SelectItem key={genre} value={genre}>
                                                        {genre === 'all' ? 'All Genres' : genre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </FadeInAnimation>

                    {/* Results Summary */}
                    <FadeInAnimation delay={0.2}>
                        <div className="mb-6">
                            <p className="text-sm text-muted-foreground">
                                Showing {filteredBooks.length} of {books.length} books
                                {selectedGenre !== 'all' && ` in ${selectedGenre}`}
                                {searchQuery && ` matching "${searchQuery}"`}
                            </p>
                        </div>
                    </FadeInAnimation>

                    {/* Books Grid */}
                    <StaggerAnimation>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredBooks.map((book) => (
                                <StaggerItem key={book.id}>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="group h-full"
                                    >
                                        <Card className="h-full flex flex-col">
                                            <CardContent className="p-6 flex-1">
                                                {/* Book Cover */}
                                                <div className="aspect-[3/4] mb-4 relative overflow-hidden rounded-lg">
                                                    <Image
                                                        src={book.coverImageUrl}
                                                        alt={book.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    {user && (
                                                        <Button
                                                            size="sm"
                                                            variant={userBookmarks.includes(book.id) ? "default" : "secondary"}
                                                            className="absolute top-2 right-2 h-8 w-8 p-0"
                                                            onClick={() => toggleBookmark(book.id)}
                                                        >
                                                            <Bookmark className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>

                                                {/* Book Details */}
                                                <div className="space-y-2 flex-1">
                                                    <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                                                        {book.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        by {book.author}
                                                    </p>

                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary" className="text-xs">
                                                            {book.genre}
                                                        </Badge>
                                                        {book.averageRating && (
                                                            <div className="flex items-center text-xs text-muted-foreground">
                                                                <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                                                                {book.averageRating}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                                        {book.description}
                                                    </p>

                                                    <div className="flex items-center text-xs text-muted-foreground">
                                                        <Book className="w-3 h-3 mr-1" />
                                                        {book.totalPages} pages
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="mt-4 space-y-2">
                                                    <Button asChild className="w-full">
                                                        <Link href={`/books/${book.id}`}>
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            Read Book
                                                        </Link>
                                                    </Button>

                                                    {user && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full"
                                                            onClick={() => toggleBookmark(book.id)}
                                                        >
                                                            <Heart className={`w-4 h-4 mr-2 ${userBookmarks.includes(book.id) ? 'fill-red-500 text-red-500' : ''}`} />
                                                            {userBookmarks.includes(book.id) ? 'Bookmarked' : 'Add to List'}
                                                        </Button>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </StaggerItem>
                            ))}
                        </div>
                    </StaggerAnimation>

                    {filteredBooks.length === 0 && (
                        <FadeInAnimation delay={0.3}>
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <Book className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                                    <h3 className="text-xl font-semibold mb-2">No books found</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Try adjusting your search or filter criteria
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSearchQuery('')
                                            setSelectedGenre('all')
                                        }}
                                    >
                                        Clear Filters
                                    </Button>
                                </CardContent>
                            </Card>
                        </FadeInAnimation>
                    )}
                </div>
            </main>
        </div>
    )
}