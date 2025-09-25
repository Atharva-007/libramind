"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, Users, Clock, TrendingUp } from "lucide-react"

interface ForumPost {
  id: string
  title: string
  author: string
  authorInitials: string
  category: string
  replies: number
  likes: number
  timeAgo: string
  excerpt: string
}

export function CommunityForum() {
  const [activeTab, setActiveTab] = useState<"trending" | "recent">("trending")

  const forumPosts: ForumPost[] = [
    {
      id: "1",
      title: "Best Science Fiction Books of 2024",
      author: "BookWorm42",
      authorInitials: "BW",
      category: "Science Fiction",
      replies: 23,
      likes: 45,
      timeAgo: "2 hours ago",
      excerpt: "I've compiled a list of the must-read sci-fi books that came out this year..."
    },
    {
      id: "2",
      title: "Reading Challenge: 50 Books in 2024",
      author: "ReadingMaster",
      authorInitials: "RM",
      category: "Challenges",
      replies: 67,
      likes: 89,
      timeAgo: "4 hours ago",
      excerpt: "Who's up for the challenge? Let's share our progress and book recommendations..."
    },
    {
      id: "3",
      title: "Classic Literature Discussion: Pride and Prejudice",
      author: "LiteraryLover",
      authorInitials: "LL",
      category: "Classics",
      replies: 34,
      likes: 56,
      timeAgo: "6 hours ago",
      excerpt: "Jane Austen's masterpiece never gets old. What are your thoughts on..."
    },
    {
      id: "4",
      title: "Book Club Recommendations for Mystery Genre",
      author: "MysteryFan",
      authorInitials: "MF",
      category: "Mystery",
      replies: 19,
      likes: 32,
      timeAgo: "8 hours ago",
      excerpt: "Our book club is looking for our next mystery read. Any suggestions?"
    },
    {
      id: "5",
      title: "Digital vs Physical Books: What's Your Preference?",
      author: "BookDebater",
      authorInitials: "BD",
      category: "Discussion",
      replies: 156,
      likes: 203,
      timeAgo: "1 day ago",
      excerpt: "The eternal debate continues. Let's discuss the pros and cons of each format..."
    }
  ]

  const trendingPosts = forumPosts.sort((a, b) => b.likes - a.likes)
  const recentPosts = forumPosts.sort((a, b) => parseInt(a.timeAgo) - parseInt(b.timeAgo))
  const displayPosts = activeTab === "trending" ? trendingPosts : recentPosts

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Community Forum
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Connect with fellow book enthusiasts and join the conversation
        </p>
        <div className="flex gap-2 mt-4">
          <Button
            variant={activeTab === "trending" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("trending")}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Trending
          </Button>
          <Button
            variant={activeTab === "recent" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("recent")}
          >
            <Clock className="w-4 h-4 mr-2" />
            Recent
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayPosts.map((post) => (
            <div key={post.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="text-xs">{post.authorInitials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm truncate hover:text-primary">
                      {post.title}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                    <span>by {post.author}</span>
                    <span>{post.timeAgo}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {post.replies} replies
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {post.likes} likes
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Button variant="outline">
            View All Discussions
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
