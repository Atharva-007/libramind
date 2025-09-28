'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
    BookOpen,
    Share,
    Plus,
    Grid,
    List
} from 'lucide-react'
import { ModernNavigation } from '@/components/navigation/modern-navigation'
import { FadeInAnimation, StaggerAnimation, StaggerItem, ScaleAnimation } from '@/components/animations/layout-animations'
import { ShineEffect } from '@/components/animations/micro-animations'
import Image from 'next/image'
import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Book {
    id: string
    title: string
    author: string
    coverImageUrl: string
    description: string
    genre: string
    rating: number
    totalPages: number
    publishedDate: string
    readingProgress?: number
    isBookmarked?: boolean
    readingStatus: 'want-to-read' | 'reading' | 'completed'
    tags: string[]
    estimatedReadTime: string
}

export default function EnhancedReadingListPage() {
    const [books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedGenre, setSelectedGenre] = useState<string>('all')
    const [selectedStatus, setSelectedStatus] = useState<string>('all')
    const [sortBy, setSortBy] = useState<string>('title')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [activeTab, setActiveTab] = useState('all')

    // Mock data - in real app, fetch from API
    useEffect(() => {
        const mockBooks: Book[] = [
            {
                id: '1',
                title: 'The Midnight Library',
                author: 'Matt Haig',
                coverImageUrl: '/placeholder.jpg',
                description: 'A dazzling novel about the infinite possibilities that lie within each of us.',
                genre: 'Fiction',
                rating: 4.5,
                totalPages: 288,
                publishedDate: '2020-08-13',
                readingProgress: 65,
                isBookmarked: true,
                readingStatus: 'reading',
                tags: ['Philosophy', 'Life', 'Choices'],
                estimatedReadTime: '4h 30m'
            },
            {
                id: '2',
                title: 'Atomic Habits',
                author: 'James Clear',
                coverImageUrl: '/placeholder.jpg',
                description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.',
                genre: 'Self-Help',
                rating: 4.8,
                totalPages: 320,
                publishedDate: '2018-10-16',
                readingProgress: 100,
                isBookmarked: true,
                readingStatus: 'completed',
                tags: ['Productivity', 'Psychology', 'Success'],
                estimatedReadTime: '5h 15m'
            },
            {
                id: '3',
                title: 'Dune',
                author: 'Frank Herbert',
                coverImageUrl: '/dune-cover.jpg',
                description: 'A stunning blend of adventure and mysticism, environmentalism and politics.',
                genre: 'Sci-Fi',
                rating: 4.6,
                totalPages: 688,
                publishedDate: '1965-06-01',
                readingProgress: 0,
                isBookmarked: false,
                readingStatus: 'want-to-read',
                tags: ['Epic', 'Desert', 'Politics'],
                estimatedReadTime: '11h 20m'
            },
            {
                id: '4',
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                coverImageUrl: '/the-great-gatsby-cover.jpg',
                description: 'A classic American novel about the Jazz Age and the American Dream.',
                genre: 'Classic',
                rating: 4.2,
                totalPages: 180,
                publishedDate: '1925-04-10',
                readingProgress: 85,
                isBookmarked: true,
                readingStatus: 'reading',
                tags: ['American Dream', 'Romance', 'Tragedy'],
                estimatedReadTime: '3h 45m'
            }
        ]

        setTimeout(() => {
            setBooks(mockBooks)
            setLoading(false)
        }, 1000)
    }, [])

    const filteredAndSortedBooks = useMemo(() => {
        const filtered = books.filter(book => {
            const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.author.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre
            const matchesStatus = selectedStatus === 'all' || book.readingStatus === selectedStatus
            const matchesTab = activeTab === 'all' ||
                (activeTab === 'reading' && book.readingStatus === 'reading') ||
                (activeTab === 'completed' && book.readingStatus === 'completed') ||
                (activeTab === 'bookmarked' && book.isBookmarked)

            return matchesSearch && matchesGenre && matchesStatus && matchesTab
        })

        // Sort books
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title)
                case 'author':
                    return a.author.localeCompare(b.author)
                case 'rating':
                    return b.rating - a.rating
                case 'progress':
                    return (b.readingProgress || 0) - (a.readingProgress || 0)
                case 'date':
                    return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
                default:
                    return 0
            }
        })

        return filtered
    }, [books, searchQuery, selectedGenre, selectedStatus, sortBy, activeTab])

    const genres = Array.from(new Set(books.map(book => book.genre)))

    const stats = {
        total: books.length,
        reading: books.filter(b => b.readingStatus === 'reading').length,
        completed: books.filter(b => b.readingStatus === 'completed').length,
        bookmarked: books.filter(b => b.isBookmarked).length,
        averageRating: books.reduce((acc, book) => acc + book.rating, 0) / books.length || 0
    }

    const toggleBookmark = async (bookId: string) => {
        setBooks(prev => prev.map(book =>
            book.id === bookId
                ? { ...book, isBookmarked: !book.isBookmarked }
                : book
        ))
    }

    const BookCard = ({ book }: { book: Book }) => (
        <StaggerItem>
            <ShineEffect>
                <ScaleAnimation>
                    <Card className="group h-full border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                        <div className="relative">
                            <div className="aspect-[3/4] relative overflow-hidden">
                                <Image
                                    src={book.coverImageUrl}
                                    alt={book.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Action buttons overlay */}
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => toggleBookmark(book.id)}
                                        className={`p-2 rounded-full backdrop-blur-sm ${book.isBookmarked
                                            ? 'bg-yellow-500 text-white'
                                            : 'bg-white/80 text-gray-700 hover:bg-white'
                                            } transition-colors`}
                                    >
                                        <Bookmark className="w-4 h-4" />
                                    </motion.button>
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        className="p-2 rounded-full bg-white/80 text-gray-700 hover:bg-white backdrop-blur-sm transition-colors"
                                    >
                                        <Share className="w-4 h-4" />
                                    </motion.button>
                                </div>

                                {/* Status badge */}
                                <div className="absolute top-2 left-2">
                                    <Badge
                                        variant={
                                            book.readingStatus === 'completed' ? 'default' :
                                                book.readingStatus === 'reading' ? 'secondary' : 'outline'
                                        }
                                        className="text-xs font-medium"
                                    >
                                        {book.readingStatus === 'want-to-read' ? 'Want to Read' :
                                            book.readingStatus === 'reading' ? 'Reading' : 'Completed'}
                                    </Badge>
                                </div>

                                {/* Progress bar for reading books */}
                                {book.readingStatus === 'reading' && book.readingProgress && (
                                    <div className="absolute bottom-0 left-0 right-0 p-2">
                                        <Progress value={book.readingProgress} className="h-1" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <CardContent className="p-4">
                            <div className="space-y-2">
                                <div>
                                    <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                        {book.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">{book.author}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs">{book.rating}</span>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                        {book.genre}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>{book.totalPages} pages</span>
                                    <span>{book.estimatedReadTime}</span>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1">
                                    {book.tags.slice(0, 2).map(tag => (
                                        <Badge key={tag} variant="secondary" className="text-xs px-2 py-0">
                                            {tag}
                                        </Badge>
                                    ))}
                                    {book.tags.length > 2 && (
                                        <Badge variant="secondary" className="text-xs px-2 py-0">
                                            +{book.tags.length - 2}
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Link href={`/books/${book.id}`} className="flex-1">
                                        <Button size="sm" className="w-full text-xs">
                                            <BookOpen className="w-3 h-3 mr-1" />
                                            {book.readingStatus === 'reading' ? 'Continue' : 'Read'}
                                        </Button>
                                    </Link>
                                    <Button variant="outline" size="sm">
                                        <Eye className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </ScaleAnimation>
            </ShineEffect>
        </StaggerItem>
    )

    const BookListItem = ({ book }: { book: Book }) => (
        <StaggerItem>
            <ShineEffect>
                <Card className="group border-0 shadow-sm bg-card/30 backdrop-blur-sm hover:shadow-md transition-all duration-300">
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            <div className="w-16 h-20 relative flex-shrink-0 overflow-hidden rounded-md">
                                <Image
                                    src={book.coverImageUrl}
                                    alt={book.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                                            {book.title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">{book.author}</p>

                                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                <span>{book.rating}</span>
                                            </div>
                                            <span>{book.totalPages} pages</span>
                                            <span>{book.estimatedReadTime}</span>
                                        </div>

                                        {book.readingStatus === 'reading' && book.readingProgress && (
                                            <div className="mt-2">
                                                <div className="flex items-center justify-between text-xs mb-1">
                                                    <span>Progress</span>
                                                    <span>{book.readingProgress}%</span>
                                                </div>
                                                <Progress value={book.readingProgress} className="h-1" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 ml-4">
                                        <Badge
                                            variant={
                                                book.readingStatus === 'completed' ? 'default' :
                                                    book.readingStatus === 'reading' ? 'secondary' : 'outline'
                                            }
                                            className="text-xs"
                                        >
                                            {book.readingStatus === 'want-to-read' ? 'Want to Read' :
                                                book.readingStatus === 'reading' ? 'Reading' : 'Completed'}
                                        </Badge>

                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => toggleBookmark(book.id)}
                                            className={`p-1 rounded transition-colors ${book.isBookmarked
                                                ? 'text-yellow-500'
                                                : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                        >
                                            <Bookmark className="w-4 h-4" />
                                        </motion.button>

                                        <Link href={`/books/${book.id}`}>
                                            <Button size="sm" variant="outline">
                                                <BookOpen className="w-3 h-3 mr-1" />
                                                {book.readingStatus === 'reading' ? 'Continue' : 'Read'}
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </ShineEffect>
        </StaggerItem>
    )

    return (
        <div className="min-h-screen bg-background">
            <ModernNavigation />

            <main className="pt-20 pb-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <FadeInAnimation>
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold">My Library</h1>
                                    <p className="text-muted-foreground mt-1">
                                        Manage your reading collection and track your progress
                                    </p>
                                </div>
                                <Button className="bg-primary hover:bg-primary/90">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Book
                                </Button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                                <Card className="text-center p-4 border-0 bg-card/50 backdrop-blur-sm">
                                    <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                                    <div className="text-xs text-muted-foreground">Total Books</div>
                                </Card>
                                <Card className="text-center p-4 border-0 bg-card/50 backdrop-blur-sm">
                                    <div className="text-2xl font-bold text-green-600">{stats.reading}</div>
                                    <div className="text-xs text-muted-foreground">Currently Reading</div>
                                </Card>
                                <Card className="text-center p-4 border-0 bg-card/50 backdrop-blur-sm">
                                    <div className="text-2xl font-bold text-purple-600">{stats.completed}</div>
                                    <div className="text-xs text-muted-foreground">Completed</div>
                                </Card>
                                <Card className="text-center p-4 border-0 bg-card/50 backdrop-blur-sm">
                                    <div className="text-2xl font-bold text-yellow-600">{stats.bookmarked}</div>
                                    <div className="text-xs text-muted-foreground">Bookmarked</div>
                                </Card>
                                <Card className="text-center p-4 border-0 bg-card/50 backdrop-blur-sm">
                                    <div className="text-2xl font-bold text-orange-600">{stats.averageRating.toFixed(1)}</div>
                                    <div className="text-xs text-muted-foreground">Avg Rating</div>
                                </Card>
                            </div>
                        </div>
                    </FadeInAnimation>

                    {/* Filters and Search */}
                    <FadeInAnimation delay={0.2}>
                        <Card className="mb-6 border-0 bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search books, authors..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-2 flex-wrap">
                                        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                                            <SelectTrigger className="w-32">
                                                <SelectValue placeholder="Genre" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Genres</SelectItem>
                                                {genres.map(genre => (
                                                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                            <SelectTrigger className="w-32">
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Status</SelectItem>
                                                <SelectItem value="want-to-read">Want to Read</SelectItem>
                                                <SelectItem value="reading">Reading</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select value={sortBy} onValueChange={setSortBy}>
                                            <SelectTrigger className="w-32">
                                                <SelectValue placeholder="Sort by" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="title">Title</SelectItem>
                                                <SelectItem value="author">Author</SelectItem>
                                                <SelectItem value="rating">Rating</SelectItem>
                                                <SelectItem value="progress">Progress</SelectItem>
                                                <SelectItem value="date">Date Added</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <div className="flex border rounded-md">
                                            <Button
                                                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                                size="sm"
                                                onClick={() => setViewMode('grid')}
                                                className="rounded-r-none"
                                            >
                                                <Grid className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant={viewMode === 'list' ? 'default' : 'ghost'}
                                                size="sm"
                                                onClick={() => setViewMode('list')}
                                                className="rounded-l-none"
                                            >
                                                <List className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </FadeInAnimation>

                    {/* Tabs */}
                    <FadeInAnimation delay={0.4}>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4 bg-card/50 backdrop-blur-sm">
                                <TabsTrigger value="all">All Books</TabsTrigger>
                                <TabsTrigger value="reading">Reading</TabsTrigger>
                                <TabsTrigger value="completed">Completed</TabsTrigger>
                                <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </FadeInAnimation>

                    {/* Books Grid/List */}
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <Card key={i} className="h-96 animate-pulse bg-card/30" />
                                ))}
                            </div>
                        ) : (
                            <StaggerAnimation key={`${viewMode}-${activeTab}`}>
                                {viewMode === 'grid' ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {filteredAndSortedBooks.map((book) => (
                                            <BookCard key={book.id} book={book} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredAndSortedBooks.map((book) => (
                                            <BookListItem key={book.id} book={book} />
                                        ))}
                                    </div>
                                )}

                                {filteredAndSortedBooks.length === 0 && (
                                    <FadeInAnimation>
                                        <Card className="text-center py-12 border-0 bg-card/30 backdrop-blur-sm">
                                            <Book className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                            <h3 className="text-lg font-semibold mb-2">No books found</h3>
                                            <p className="text-muted-foreground mb-4">
                                                Try adjusting your filters or search terms
                                            </p>
                                            <Button>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Your First Book
                                            </Button>
                                        </Card>
                                    </FadeInAnimation>
                                )}
                            </StaggerAnimation>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    )
}