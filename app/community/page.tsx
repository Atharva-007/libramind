'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ModernNavigation } from '@/components/navigation/modern-navigation'
import { motion } from 'framer-motion'

interface CommunityPost {
    id: string
    user: {
        name: string
        avatar: string
        level: string
    }
    book: {
        title: string
        author: string
    }
    content: string
    type: 'review' | 'discussion' | 'recommendation'
    likes: number
    comments: number
    timestamp: string
}

export default function CommunityPage() {
    const [posts, setPosts] = useState<CommunityPost[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Simulate loading community posts
        setTimeout(() => {
            setPosts([
                {
                    id: '1',
                    user: {
                        name: 'Emma Thompson',
                        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
                        level: 'Book Enthusiast'
                    },
                    book: {
                        title: 'The Midnight Library',
                        author: 'Matt Haig'
                    },
                    content: 'Just finished this incredible journey through infinite possibilities! The concept of exploring different life paths through a magical library really resonated with me. Has anyone else read this? Would love to discuss the philosophical themes.',
                    type: 'review',
                    likes: 24,
                    comments: 8,
                    timestamp: '2 hours ago'
                },
                {
                    id: '2',
                    user: {
                        name: 'Alex Rivera',
                        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
                        level: 'Reading Champion'
                    },
                    book: {
                        title: 'Atomic Habits',
                        author: 'James Clear'
                    },
                    content: 'Looking for my next productivity read after finishing Atomic Habits. Any recommendations for books that changed how you approach daily routines?',
                    type: 'recommendation',
                    likes: 18,
                    comments: 12,
                    timestamp: '4 hours ago'
                },
                {
                    id: '3',
                    user: {
                        name: 'Sarah Chen',
                        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
                        level: 'Literary Explorer'
                    },
                    book: {
                        title: 'Klara and the Sun',
                        author: 'Kazuo Ishiguro'
                    },
                    content: 'Starting a discussion about AI consciousness in literature. Ishiguro\'s latest work raises fascinating questions about what it means to be human. Who wants to join the conversation?',
                    type: 'discussion',
                    likes: 31,
                    comments: 15,
                    timestamp: '6 hours ago'
                }
            ])
            setLoading(false)
        }, 1000)
    }, [])

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'review': return '⭐'
            case 'discussion': return '💬'
            case 'recommendation': return '💡'
            default: return '📖'
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'review': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'discussion': return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'recommendation': return 'bg-green-100 text-green-800 border-green-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

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
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-4">🌟 Community</h1>
                        <p className="text-xl text-muted-foreground">
                            Connect with fellow readers, share insights, and discover new perspectives
                        </p>
                    </div>

                    {/* Community Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="text-2xl font-bold text-primary">1,247</div>
                                <div className="text-sm text-muted-foreground">Active Readers</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="text-2xl font-bold text-primary">523</div>
                                <div className="text-sm text-muted-foreground">Book Reviews</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="text-2xl font-bold text-primary">89</div>
                                <div className="text-sm text-muted-foreground">Active Discussions</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="text-2xl font-bold text-primary">2,156</div>
                                <div className="text-sm text-muted-foreground">Recommendations</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Create Post Button */}
                    <Card className="mb-8">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" />
                                    <AvatarFallback>You</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <Button variant="outline" className="w-full justify-start text-muted-foreground">
                                        💭 Share your thoughts about a book...
                                    </Button>
                                </div>
                                <Button>
                                    📝 Post
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Community Posts */}
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Card className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        {/* Post Header */}
                                        <div className="flex items-start gap-4 mb-4">
                                            <Avatar>
                                                <AvatarImage src={post.user.avatar} />
                                                <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold">{post.user.name}</h3>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {post.user.level}
                                                    </Badge>
                                                    <Badge className={`text-xs ${getTypeColor(post.type)}`}>
                                                        {getTypeIcon(post.type)} {post.type}
                                                    </Badge>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    📚 <strong>{post.book.title}</strong> by {post.book.author}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {post.timestamp}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Post Content */}
                                        <div className="mb-4">
                                            <p className="text-sm leading-relaxed">{post.content}</p>
                                        </div>

                                        {/* Post Actions */}
                                        <div className="flex items-center gap-6 pt-4 border-t">
                                            <Button variant="ghost" size="sm" className="gap-2">
                                                ❤️ {post.likes}
                                            </Button>
                                            <Button variant="ghost" size="sm" className="gap-2">
                                                💬 {post.comments}
                                            </Button>
                                            <Button variant="ghost" size="sm" className="gap-2">
                                                📤 Share
                                            </Button>
                                            <Button variant="ghost" size="sm" className="gap-2">
                                                🔖 Save
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Load More */}
                    <div className="text-center mt-8">
                        <Button variant="outline" size="lg">
                            📚 Load More Posts
                        </Button>
                    </div>

                    {/* Sidebar Content */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Trending Books */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    🔥 Trending in Community
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {['Project Hail Mary', 'The Seven Husbands of Evelyn Hugo', 'Educated'].map((book, index) => (
                                        <div key={book} className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-bold text-primary">#{index + 1}</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-sm">{book}</div>
                                                <div className="text-xs text-muted-foreground">{Math.floor(Math.random() * 100) + 50} discussions</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reading Groups */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    👥 Active Reading Groups
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        { name: 'Sci-Fi Explorers', members: 234, reading: 'Dune' },
                                        { name: 'Mystery Lovers', members: 189, reading: 'Gone Girl' },
                                        { name: 'Non-Fiction Club', members: 156, reading: 'Sapiens' }
                                    ].map((group) => (
                                        <div key={group.name} className="p-4 border rounded-lg">
                                            <div className="font-medium text-sm mb-1">{group.name}</div>
                                            <div className="text-xs text-muted-foreground mb-2">
                                                {group.members} members • Currently reading: {group.reading}
                                            </div>
                                            <Button size="sm" variant="outline" className="w-full">
                                                Join Group
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}