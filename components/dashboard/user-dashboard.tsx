'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
// import { User } from '@supabase/supabase-js'

interface User {
    id: string
    email?: string
    user_metadata?: any
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    FaBook as Book,
    FaChartLine as TrendingUp,
    FaTrophy as Trophy,
    FaClock as Clock,
    FaBullseye as Target,
    FaUsers as Users,
    FaBookmark as Bookmark,
    FaStar as Star,
    FaChevronRight as ChevronRight,
    FaFire as Flame,
    FaBolt as Zap,
    FaAward as Award,
    FaCalendar as Calendar,
    FaBookOpen as BookOpen,
    FaEye as Eye,
    FaSignOutAlt as LogOut
} from 'react-icons/fa'
import { FadeInAnimation, StaggerAnimation, StaggerItem, ScaleAnimation } from '@/components/animations/layout-animations'
import { ShineEffect, FloatingAnimation } from '@/components/animations/micro-animations'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface UserStats {
    booksRead: number
    booksInProgress: number
    pagesRead: number
    bookmarked: number
    readingStreak: number
    totalBooks: number
    averageRating: number
    user: {
        id: string
        email?: string
        name: string
    }
}

interface RecentBook {
    id: string
    title: string
    author: string
    coverImageUrl: string
    progress: number
    totalPages: number
}

export function UserDashboard() {
    const [user, setUser] = useState<User | null>(null)
    const [stats, setStats] = useState<UserStats | null>(null)
    const [recentBooks, setRecentBooks] = useState<RecentBook[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        checkUser()
        loadUserStats()
        loadRecentBooks()
    }, [])

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        if (!user) {
            router.push('/login')
        }
    }

    const loadUserStats = async () => {
        try {
            const response = await fetch('/api/user/stats')
            if (response.ok) {
                const data = await response.json()
                setStats(data)
            }
        } catch (error) {
            console.error('Error loading user stats:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadRecentBooks = async () => {
        try {
            const response = await fetch('/api/books?limit=4')
            if (response.ok) {
                const books = await response.json()
                setRecentBooks(books.slice(0, 4).map((book: any) => ({
                    ...book,
                    progress: Math.floor(Math.random() * 100),
                    totalPages: book.totalPages || 300
                })))
            }
        } catch (error) {
            console.error('Error loading recent books:', error)
        }
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!user || !stats) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="p-6">
                        <p className="text-center text-muted-foreground mb-4">Please log in to continue</p>
                        <Button asChild className="w-full">
                            <Link href="/login">Go to Login</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const statCards = [
        {
            title: 'Books Completed',
            value: stats.booksRead,
            change: '+3 this month',
            icon: Book,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            title: 'Pages Read',
            value: stats.pagesRead.toLocaleString(),
            change: '+234 this week',
            icon: BookOpen,
            color: 'text-green-500',
            bgColor: 'bg-green-50 dark:bg-green-900/20'
        },
        {
            title: 'Reading Streak',
            value: `${stats.readingStreak} days`,
            change: 'Keep it up!',
            icon: Flame,
            color: 'text-orange-500',
            bgColor: 'bg-orange-50 dark:bg-orange-900/20'
        },
        {
            title: 'Bookmarked',
            value: stats.bookmarked,
            change: `${stats.booksInProgress} in progress`,
            icon: Bookmark,
            color: 'text-purple-500',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20'
        }
    ]

    return (
        <div className="space-y-8">
            {/* User Header */}
            <FadeInAnimation>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src="/placeholder-user.jpg" alt={stats.user.name} />
                            <AvatarFallback className="text-lg">
                                {stats.user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-3xl font-bold">Welcome back, {stats.user.name}! 👋</h1>
                            <p className="text-muted-foreground">Ready to continue your reading journey?</p>
                        </div>
                    </div>
                    <Button variant="ghost" onClick={handleSignOut} className="text-muted-foreground hover:text-foreground">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </Button>
                </div>
            </FadeInAnimation>

            {/* Stats Grid */}
            <StaggerAnimation>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                        <StaggerItem key={stat.title}>
                            <ScaleAnimation>
                                <Card className="relative overflow-hidden">
                                    <ShineEffect><div></div></ShineEffect>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    {stat.title}
                                                </p>
                                                <p className="text-2xl font-bold">{stat.value}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {stat.change}
                                                </p>
                                            </div>
                                            <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </ScaleAnimation>
                        </StaggerItem>
                    ))}
                </div>
            </StaggerAnimation>

            {/* Current Reading Progress */}
            {stats.booksInProgress > 0 && (
                <FadeInAnimation delay={0.3}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <BookOpen className="w-5 h-5 mr-2" />
                                Currently Reading ({stats.booksInProgress})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {recentBooks.map((book) => (
                                    <motion.div
                                        key={book.id}
                                        whileHover={{ scale: 1.02 }}
                                        className="group cursor-pointer"
                                    >
                                        <Link href={`/books/${book.id}`}>
                                            <Card className="h-full">
                                                <CardContent className="p-4">
                                                    <div className="aspect-[3/4] mb-3 relative overflow-hidden rounded-md">
                                                        <img
                                                            src={book.coverImageUrl}
                                                            alt={book.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    </div>
                                                    <h3 className="font-semibold text-sm truncate">{book.title}</h3>
                                                    <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                                                    <div className="mt-2">
                                                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                                            <span>Progress</span>
                                                            <span>{book.progress}%</span>
                                                        </div>
                                                        <Progress value={book.progress} className="h-2" />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </FadeInAnimation>
            )}

            {/* Quick Actions */}
            <FadeInAnimation delay={0.4}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Zap className="w-5 h-5 mr-2" />
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Button asChild className="h-auto p-4 justify-start">
                                <Link href="/reading-list">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                            <Book className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold">Browse Books</p>
                                            <p className="text-sm text-muted-foreground">Discover new reads</p>
                                        </div>
                                    </div>
                                </Link>
                            </Button>

                            <Button asChild variant="outline" className="h-auto p-4 justify-start">
                                <Link href="/challenges">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                                            <Trophy className="w-5 h-5 text-orange-500" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold">Reading Goals</p>
                                            <p className="text-sm text-muted-foreground">Set new challenges</p>
                                        </div>
                                    </div>
                                </Link>
                            </Button>

                            <Button asChild variant="outline" className="h-auto p-4 justify-start">
                                <Link href="/community">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                            <Users className="w-5 h-5 text-green-500" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold">Community</p>
                                            <p className="text-sm text-muted-foreground">Join discussions</p>
                                        </div>
                                    </div>
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </FadeInAnimation>

            {/* Reading Goal Progress */}
            <FadeInAnimation delay={0.5}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Target className="w-5 h-5 mr-2" />
                                2024 Reading Goal
                            </div>
                            <Badge variant="secondary">{stats.booksRead}/50 books</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Progress value={(stats.booksRead / 50) * 100} className="h-3" />
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Progress: {Math.round((stats.booksRead / 50) * 100)}%</span>
                                <span>{50 - stats.booksRead} books remaining</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </FadeInAnimation>
        </div>
    )
}