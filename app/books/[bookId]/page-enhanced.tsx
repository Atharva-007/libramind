'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
    FaArrowLeft as ArrowLeft,
    FaBookmark as Bookmark,
    FaStar as Star,
    FaClock as Clock,
    FaBook as Book,
    FaHeart as Heart,
    FaShare as Share,
    FaPlay as Play,
    FaPause as Pause,
    FaPlus as Plus,
    FaBookOpen as BookOpen,
    FaQuoteLeft as Quote,
    FaComment as MessageCircle,
    FaThumbsUp as ThumbsUp,
    FaFlag as Flag,
    FaCalendar as Calendar,
    FaGlobe as Globe,
    FaUser as User,
    FaEdit as Edit,
    FaEye as Eye,
    FaBookReader as BookReader
} from 'react-icons/fa'
import { ModernNavigation } from '@/components/navigation/modern-navigation'
import { FadeInAnimation, SlideInAnimation, ScaleAnimation } from '@/components/animations/layout-animations'
import { ShineEffect, PulseAnimation } from '@/components/animations/micro-animations'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface BookDetails {
    id: string
    title: string
    author: string
    coverImageUrl: string
    description: string
    genre: string
    rating: number
    totalPages: number
    publishedDate: string
    publisher: string
    isbn: string
    language: string
    readingProgress?: number
    isBookmarked?: boolean
    readingStatus: 'want-to-read' | 'reading' | 'completed'
    tags: string[]
    estimatedReadTime: string
    currentPage?: number
    chapters: Chapter[]
}

interface Chapter {
    id: string
    title: string
    pageStart: number
    pageEnd: number
    isCompleted?: boolean
}

interface Review {
    id: string
    userName: string
    userAvatar: string
    rating: number
    comment: string
    date: string
    likes: number
    isHelpful?: boolean
}

interface Note {
    id: string
    content: string
    pageNumber: number
    createdAt: string
    isHighlight?: boolean
    color?: string
}

export default function BookDetailsPage({ params }: { params: { bookId: string } }) {
    const router = useRouter()
    const [book, setBook] = useState<BookDetails | null>(null)
    const [reviews, setReviews] = useState<Review[]>([])
    const [notes, setNotes] = useState<Note[]>([])
    const [loading, setLoading] = useState(true)
    const [isReading, setIsReading] = useState(false)
    const [newNote, setNewNote] = useState('')
    const [showAllReviews, setShowAllReviews] = useState(false)
    const [userRating, setUserRating] = useState(0)
    const [userReview, setUserReview] = useState('')

    // Mock data - in real app, fetch from API
    useEffect(() => {
        const mockBook: BookDetails = {
            id: params.bookId,
            title: 'The Midnight Library',
            author: 'Matt Haig',
            coverImageUrl: '/placeholder.jpg',
            description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets?',
            genre: 'Fiction',
            rating: 4.5,
            totalPages: 288,
            publishedDate: '2020-08-13',
            publisher: 'Canongate Books',
            isbn: '9781786892737',
            language: 'English',
            readingProgress: 65,
            isBookmarked: true,
            readingStatus: 'reading',
            tags: ['Philosophy', 'Life', 'Choices', 'Mental Health', 'Self-Discovery'],
            estimatedReadTime: '4h 30m',
            currentPage: 187,
            chapters: [
                { id: '1', title: 'The Man at the Door', pageStart: 1, pageEnd: 8, isCompleted: true },
                { id: '2', title: 'A Conversation About Rain', pageStart: 9, pageEnd: 16, isCompleted: true },
                { id: '3', title: 'The Midnight Library', pageStart: 17, pageEnd: 32, isCompleted: true },
                { id: '4', title: 'The Book of Regrets', pageStart: 33, pageEnd: 45, isCompleted: true },
                { id: '5', title: 'The Librarian', pageStart: 46, pageEnd: 58, isCompleted: true },
                { id: '6', title: 'The Life Where She Became a Glaciologist', pageStart: 59, pageEnd: 78, isCompleted: true },
                { id: '7', title: 'The Life Where She Became a Rock Star', pageStart: 79, pageEnd: 102, isCompleted: false },
                { id: '8', title: 'The Life Where She Became a Philosophy Professor', pageStart: 103, pageEnd: 125, isCompleted: false },
            ]
        }

        const mockReviews: Review[] = [
            {
                id: '1',
                userName: 'Sarah Johnson',
                userAvatar: '/user1.jpg',
                rating: 5,
                comment: 'This book completely changed my perspective on life choices and regrets. Matt Haig has a beautiful way of exploring philosophical concepts through an engaging narrative.',
                date: '2024-01-15',
                likes: 23,
                isHelpful: true
            },
            {
                id: '2',
                userName: 'Mike Chen',
                userAvatar: '/user2.jpg',
                rating: 4,
                comment: 'A thought-provoking read that makes you reflect on your own life decisions. Some parts felt a bit repetitive, but overall a worthwhile book.',
                date: '2024-01-10',
                likes: 12
            }
        ]

        const mockNotes: Note[] = [
            {
                id: '1',
                content: 'The concept of infinite possibilities is beautifully presented here. Every choice creates a different path.',
                pageNumber: 45,
                createdAt: '2024-01-20',
                isHighlight: true,
                color: 'yellow'
            },
            {
                id: '2',
                content: 'Important reminder: We often regret the things we didn\'t do more than the things we did.',
                pageNumber: 87,
                createdAt: '2024-01-18',
                isHighlight: false
            }
        ]

        setTimeout(() => {
            setBook(mockBook)
            setReviews(mockReviews)
            setNotes(mockNotes)
            setLoading(false)
        }, 1000)
    }, [params.bookId])

    const toggleBookmark = () => {
        if (book) {
            setBook({ ...book, isBookmarked: !book.isBookmarked })
        }
    }

    const startReading = () => {
        setIsReading(true)
        // In real app, navigate to reading view
        router.push(`/reader/${params.bookId}`)
    }

    const addNote = () => {
        if (newNote.trim() && book) {
            const note: Note = {
                id: Date.now().toString(),
                content: newNote,
                pageNumber: book.currentPage || 1,
                createdAt: new Date().toISOString(),
                isHighlight: false
            }
            setNotes([note, ...notes])
            setNewNote('')
        }
    }

    const submitReview = () => {
        if (userReview.trim() && userRating > 0) {
            const review: Review = {
                id: Date.now().toString(),
                userName: 'You',
                userAvatar: '/user-avatar.jpg',
                rating: userRating,
                comment: userReview,
                date: new Date().toISOString().split('T')[0],
                likes: 0
            }
            setReviews([review, ...reviews])
            setUserReview('')
            setUserRating(0)
        }
    }

    if (loading || !book) {
        return (
            <div className="min-h-screen bg-background">
                <ModernNavigation />
                <main className="pt-20 pb-12">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="animate-pulse">
                            <div className="h-8 bg-card/50 rounded w-1/4 mb-8"></div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="h-64 bg-card/50 rounded"></div>
                                    <div className="h-32 bg-card/50 rounded"></div>
                                </div>
                                <div className="space-y-6">
                                    <div className="h-96 bg-card/50 rounded"></div>
                                </div>
                            </div>
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
                    {/* Back Button */}
                    <FadeInAnimation>
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="mb-6 hover:bg-card/50"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Library
                        </Button>
                    </FadeInAnimation>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Book Header */}
                            <FadeInAnimation>
                                <Card className="border-0 bg-card/50 backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="w-48 h-64 mx-auto md:mx-0 relative flex-shrink-0 overflow-hidden rounded-lg shadow-lg">
                                                <Image
                                                    src={book.coverImageUrl}
                                                    alt={book.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            <div className="flex-1 space-y-4">
                                                <div>
                                                    <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                                                    <p className="text-xl text-muted-foreground mb-4">by {book.author}</p>

                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="flex items-center gap-1">
                                                            <div className="flex">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`w-5 h-5 ${i < Math.floor(book.rating)
                                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                                : 'text-gray-300'
                                                                            }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="text-lg font-semibold ml-2">{book.rating}</span>
                                                        </div>

                                                        <Badge variant="secondary" className="text-sm">
                                                            {book.genre}
                                                        </Badge>

                                                        <Badge
                                                            variant={
                                                                book.readingStatus === 'completed' ? 'default' :
                                                                    book.readingStatus === 'reading' ? 'secondary' : 'outline'
                                                            }
                                                        >
                                                            {book.readingStatus === 'want-to-read' ? 'Want to Read' :
                                                                book.readingStatus === 'reading' ? 'Reading' : 'Completed'}
                                                        </Badge>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <Book className="w-4 h-4" />
                                                            <span>{book.totalPages} pages</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4" />
                                                            <span>{book.estimatedReadTime}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>{new Date(book.publishedDate).getFullYear()}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Globe className="w-4 h-4" />
                                                            <span>{book.language}</span>
                                                        </div>
                                                    </div>

                                                    {book.readingStatus === 'reading' && book.readingProgress && (
                                                        <div className="mb-4">
                                                            <div className="flex items-center justify-between text-sm mb-2">
                                                                <span>Reading Progress</span>
                                                                <span>{book.readingProgress}% • Page {book.currentPage}/{book.totalPages}</span>
                                                            </div>
                                                            <Progress value={book.readingProgress} className="h-2" />
                                                        </div>
                                                    )}

                                                    <div className="flex gap-3">
                                                        <Button
                                                            onClick={startReading}
                                                            className="bg-primary hover:bg-primary/90"
                                                        >
                                                            <BookOpen className="w-4 h-4 mr-2" />
                                                            {book.readingStatus === 'reading' ? 'Continue Reading' : 'Start Reading'}
                                                        </Button>

                                                        <Button
                                                            variant="outline"
                                                            onClick={toggleBookmark}
                                                            className={book.isBookmarked ? 'bg-yellow-50 border-yellow-300 text-yellow-700' : ''}
                                                        >
                                                            <Bookmark className="w-4 h-4 mr-2" />
                                                            {book.isBookmarked ? 'Bookmarked' : 'Bookmark'}
                                                        </Button>

                                                        <Button variant="outline">
                                                            <Share className="w-4 h-4 mr-2" />
                                                            Share
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </FadeInAnimation>

                            {/* Description */}
                            <SlideInAnimation direction="left" delay={0.2}>
                                <Card className="border-0 bg-card/50 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle>About This Book</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground leading-relaxed">{book.description}</p>

                                        <div className="mt-4">
                                            <h4 className="font-semibold mb-2">Tags</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {book.tags.map(tag => (
                                                    <Badge key={tag} variant="secondary" className="text-sm">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </SlideInAnimation>

                            {/* Chapters */}
                            <SlideInAnimation direction="left" delay={0.4}>
                                <Card className="border-0 bg-card/50 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle>Chapters</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {book.chapters.map((chapter, index) => (
                                                <div
                                                    key={chapter.id}
                                                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${chapter.isCompleted
                                                            ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800'
                                                            : 'bg-card hover:bg-card/80'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${chapter.isCompleted
                                                                ? 'bg-green-500 text-white'
                                                                : 'bg-muted text-muted-foreground'
                                                            }`}>
                                                            {chapter.isCompleted ? '✓' : index + 1}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-sm">{chapter.title}</h4>
                                                            <p className="text-xs text-muted-foreground">
                                                                Pages {chapter.pageStart}-{chapter.pageEnd}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {!chapter.isCompleted && (
                                                        <Button variant="ghost" size="sm">
                                                            <BookReader className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </SlideInAnimation>

                            {/* Reviews */}
                            <SlideInAnimation direction="left" delay={0.6}>
                                <Card className="border-0 bg-card/50 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle>Reviews & Ratings</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Add Review */}
                                        <div className="border-b pb-6">
                                            <h4 className="font-semibold mb-3">Write a Review</h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-sm font-medium mb-2 block">Your Rating</label>
                                                    <div className="flex gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <button
                                                                key={i}
                                                                onClick={() => setUserRating(i + 1)}
                                                                className="transition-colors"
                                                            >
                                                                <Star
                                                                    className={`w-6 h-6 ${i < userRating
                                                                            ? 'fill-yellow-400 text-yellow-400'
                                                                            : 'text-gray-300 hover:text-yellow-400'
                                                                        }`}
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <Textarea
                                                    placeholder="Share your thoughts about this book..."
                                                    value={userReview}
                                                    onChange={(e) => setUserReview(e.target.value)}
                                                    className="min-h-24"
                                                />
                                                <Button onClick={submitReview} disabled={!userRating || !userReview.trim()}>
                                                    Post Review
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Reviews List */}
                                        <div className="space-y-4">
                                            {reviews.slice(0, showAllReviews ? reviews.length : 2).map(review => (
                                                <div key={review.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                                                    <div className="flex items-start gap-3">
                                                        <Avatar className="w-10 h-10">
                                                            <AvatarImage src={review.userAvatar} />
                                                            <AvatarFallback>{review.userName[0]}</AvatarFallback>
                                                        </Avatar>

                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-semibold text-sm">{review.userName}</span>
                                                                <div className="flex">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <Star
                                                                            key={i}
                                                                            className={`w-4 h-4 ${i < review.rating
                                                                                    ? 'fill-yellow-400 text-yellow-400'
                                                                                    : 'text-gray-300'
                                                                                }`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <span className="text-xs text-muted-foreground">{review.date}</span>
                                                            </div>

                                                            <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>

                                                            <div className="flex items-center gap-4 text-xs">
                                                                <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                                                                    <ThumbsUp className="w-3 h-3" />
                                                                    <span>{review.likes}</span>
                                                                </button>
                                                                <button className="text-muted-foreground hover:text-foreground">
                                                                    Reply
                                                                </button>
                                                                <button className="text-muted-foreground hover:text-foreground">
                                                                    <Flag className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {reviews.length > 2 && (
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => setShowAllReviews(!showAllReviews)}
                                                    className="w-full"
                                                >
                                                    {showAllReviews ? 'Show Less' : `Show All ${reviews.length} Reviews`}
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </SlideInAnimation>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Book Info */}
                            <SlideInAnimation direction="right" delay={0.3}>
                                <Card className="border-0 bg-card/50 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Book Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Publisher</span>
                                            <span>{book.publisher}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">ISBN</span>
                                            <span className="text-xs">{book.isbn}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Language</span>
                                            <span>{book.language}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Pages</span>
                                            <span>{book.totalPages}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Published</span>
                                            <span>{new Date(book.publishedDate).toLocaleDateString()}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </SlideInAnimation>

                            {/* My Notes */}
                            <SlideInAnimation direction="right" delay={0.5}>
                                <Card className="border-0 bg-card/50 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="text-lg">My Notes</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Add Note */}
                                        <div className="space-y-2">
                                            <Textarea
                                                placeholder="Add a note..."
                                                value={newNote}
                                                onChange={(e) => setNewNote(e.target.value)}
                                                className="min-h-20 text-sm"
                                            />
                                            <Button onClick={addNote} size="sm" className="w-full">
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Note
                                            </Button>
                                        </div>

                                        <Separator />

                                        {/* Notes List */}
                                        <div className="space-y-3 max-h-64 overflow-y-auto">
                                            {notes.map(note => (
                                                <div
                                                    key={note.id}
                                                    className={`p-3 rounded-lg border text-sm ${note.isHighlight
                                                            ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800'
                                                            : 'bg-card/50'
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                        <div className="flex items-center gap-2">
                                                            {note.isHighlight && <Quote className="w-3 h-3 text-yellow-600" />}
                                                            <span className="text-xs text-muted-foreground">Page {note.pageNumber}</span>
                                                        </div>
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(note.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm">{note.content}</p>
                                                </div>
                                            ))}

                                            {notes.length === 0 && (
                                                <div className="text-center text-muted-foreground py-4">
                                                    <Quote className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                    <p className="text-sm">No notes yet</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </SlideInAnimation>

                            {/* Reading Stats */}
                            <SlideInAnimation direction="right" delay={0.7}>
                                <Card className="border-0 bg-card/50 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Reading Stats</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-primary">{book.readingProgress || 0}%</div>
                                            <div className="text-sm text-muted-foreground">Completed</div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-center">
                                            <div>
                                                <div className="text-lg font-semibold">{book.currentPage || 0}</div>
                                                <div className="text-xs text-muted-foreground">Current Page</div>
                                            </div>
                                            <div>
                                                <div className="text-lg font-semibold">{book.totalPages - (book.currentPage || 0)}</div>
                                                <div className="text-xs text-muted-foreground">Pages Left</div>
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <div className="text-sm text-muted-foreground">
                                                Estimated time remaining: <span className="font-medium">2h 15m</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </SlideInAnimation>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}