'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
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
    FaEye as Eye
} from 'react-icons/fa'
import { FadeInAnimation, StaggerAnimation, StaggerItem, ScaleAnimation } from '@/components/animations/layout-animations'
import { ShineEffect, FloatingAnimation } from '@/components/animations/micro-animations'

interface DashboardStats {
    booksRead: number
    pagesRead: number
    readingStreak: number
    currentGoal: number
    goalProgress: number
    averageRating: number
}

interface TrendingBook {
    id: string
    title: string
    author: string
    cover: string
    rating: number
    category: string
    trending: boolean
}

interface RecentActivity {
    id: string
    type: 'reading' | 'finished' | 'goal' | 'review'
    book: string
    action: string
    time: string
    avatar?: string
}

export function ModernDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        booksRead: 24,
        pagesRead: 8432,
        readingStreak: 12,
        currentGoal: 50,
        goalProgress: 48,
        averageRating: 4.2
    })

    const [trendingBooks] = useState<TrendingBook[]>([
        {
            id: '1',
            title: 'The Midnight Library',
            author: 'Matt Haig',
            cover: '/placeholder.jpg',
            rating: 4.5,
            category: 'Fiction',
            trending: true
        },
        {
            id: '2',
            title: 'Atomic Habits',
            author: 'James Clear',
            cover: '/placeholder.jpg',
            rating: 4.8,
            category: 'Self-Help',
            trending: true
        },
        {
            id: '3',
            title: 'Dune',
            author: 'Frank Herbert',
            cover: '/dune-cover.jpg',
            rating: 4.6,
            category: 'Sci-Fi',
            trending: false
        }
    ])

    const [recentActivity] = useState<RecentActivity[]>([
        {
            id: '1',
            type: 'finished',
            book: 'The Psychology of Money',
            action: 'finished reading',
            time: '2 hours ago',
            avatar: '/placeholder-user.jpg'
        },
        {
            id: '2',
            type: 'reading',
            book: 'Atomic Habits',
            action: 'read 25 pages of',
            time: '5 hours ago'
        },
        {
            id: '3',
            type: 'goal',
            book: 'Reading Challenge 2024',
            action: 'reached 80% of',
            time: '1 day ago'
        }
    ])

    const statCards = [
        {
            title: 'Books Read',
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
            title: 'Avg Rating',
            value: stats.averageRating,
            change: '+0.2 this month',
            icon: Star,
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
        }
    ]

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <FadeInAnimation>
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/90 via-primary to-primary/80 p-8 text-primary-foreground">
                    <div className="relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                Welcome back, Reader! 👋
                            </h1>
                            <p className="text-lg text-primary-foreground/90 mb-6">
                                You're on a {stats.readingStreak}-day reading streak. Keep the momentum going!
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    Continue Reading
                                </Button>
                                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                                    <Target className="w-4 h-4 mr-2" />
                                    View Goals
                                </Button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Floating Elements */}
                    <FloatingAnimation className="absolute top-4 right-4 opacity-20">
                        <Book className="w-16 h-16" />
                    </FloatingAnimation>
                    <FloatingAnimation className="absolute bottom-4 right-20 opacity-10">
                        <Star className="w-12 h-12" />
                    </FloatingAnimation>
                </div>
            </FadeInAnimation>

            {/* Stats Grid */}
            <StaggerAnimation>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                        <StaggerItem key={stat.title}>
                            <ShineEffect>
                                <ScaleAnimation>
                                    <Card className="relative overflow-hidden border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">
                                                        {stat.title}
                                                    </p>
                                                    <p className="text-2xl font-bold">
                                                        {stat.value}
                                                    </p>
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
                            </ShineEffect>
                        </StaggerItem>
                    ))}
                </div>
            </StaggerAnimation>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Reading Goal Progress */}
                <FadeInAnimation delay={0.4} className="lg:col-span-2">
                    <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-yellow-500" />
                                    2024 Reading Challenge
                                </CardTitle>
                                <Badge variant="secondary" className="bg-primary/10 text-primary">
                                    {stats.goalProgress}/{stats.currentGoal} books
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span>Progress</span>
                                    <span>{Math.round((stats.goalProgress / stats.currentGoal) * 100)}%</span>
                                </div>
                                <Progress
                                    value={(stats.goalProgress / stats.currentGoal) * 100}
                                    className="h-3"
                                />
                                <div className="flex items-center justify-between pt-2">
                                    <p className="text-sm text-muted-foreground">
                                        {stats.currentGoal - stats.goalProgress} books to go
                                    </p>
                                    <Button variant="outline" size="sm">
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </FadeInAnimation>

                {/* Quick Actions */}
                <FadeInAnimation delay={0.6}>
                    <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-blue-500" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="outline" className="w-full justify-start">
                                <BookOpen className="w-4 h-4 mr-2" />
                                Add New Book
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <Clock className="w-4 h-4 mr-2" />
                                Log Reading Time
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <Users className="w-4 h-4 mr-2" />
                                Join Discussion
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <Award className="w-4 h-4 mr-2" />
                                View Achievements
                            </Button>
                        </CardContent>
                    </Card>
                </FadeInAnimation>
            </div>

            {/* Trending Books & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Trending Books */}
                <FadeInAnimation delay={0.8}>
                    <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-500" />
                                Trending Books
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {trendingBooks.map((book, index) => (
                                <motion.div
                                    key={book.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.9 + index * 0.1 }}
                                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                                >
                                    <div className="w-12 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-md flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-medium truncate">{book.title}</h4>
                                            {book.trending && (
                                                <Badge variant="secondary" className="text-xs bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300">
                                                    Hot
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            <span className="text-xs">{book.rating}</span>
                                            <Badge variant="outline" className="text-xs ml-2">
                                                {book.category}
                                            </Badge>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                </motion.div>
                            ))}
                        </CardContent>
                    </Card>
                </FadeInAnimation>

                {/* Recent Activity */}
                <FadeInAnimation delay={1.0}>
                    <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-purple-500" />
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.1 + index * 0.1 }}
                                    className="flex items-start space-x-3"
                                >
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={activity.avatar} />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm">
                                            You <span className="font-medium">{activity.action}</span>{' '}
                                            <span className="font-medium text-primary">{activity.book}</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${activity.type === 'finished' ? 'bg-green-500' :
                                            activity.type === 'reading' ? 'bg-blue-500' :
                                                activity.type === 'goal' ? 'bg-yellow-500' : 'bg-purple-500'
                                        }`} />
                                </motion.div>
                            ))}
                        </CardContent>
                    </Card>
                </FadeInAnimation>
            </div>
        </div>
    )
}