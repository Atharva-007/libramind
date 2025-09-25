'use client'

import { useState, useEffect } from "react"
import Image from "next/image" 
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReadingList } from '@/components/reading-list'
import { Recommendations } from '@/components/recommendations'
import { CommunityForum } from '@/components/community-forum'
import { 
  BookOpen, 
  Users, 
  Star, 
  TrendingUp, 
  Search,
  Sparkles,
  Brain,
  Target,
  Zap,
  Play,
  ArrowRight,
  BookMarked,
  Award,
  Globe,
  Clock,
  MessageSquare,
  Trophy,
  Calendar,
  Settings,
  List
} from "lucide-react"

const featuredBooks = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: "/the-great-gatsby-cover.jpg",
    genre: "Classic Literature",
    rating: 4.2,
    description: "A timeless tale of love, ambition, and the American Dream set in the Jazz Age.",
    readers: "2.3M",
    isNew: false,
    isTrending: true
  },
  {
    id: "2",
    title: "To Kill a Mockingbird", 
    author: "Harper Lee",
    cover: "/to-kill-a-mockingbird-cover.jpg",
    genre: "Classic Literature",
    rating: 4.5,
    description: "A powerful story of racial injustice and childhood innocence in the American South.",
    readers: "1.8M",
    isNew: false,
    isTrending: false
  },
  {
    id: "3",
    title: "Pride and Prejudice",
    author: "Jane Austen", 
    cover: "/pride-and-prejudice-cover.jpg",
    genre: "Romance",
    rating: 4.3,
    description: "A witty exploration of love, class, and society in Regency England.",
    readers: "1.5M",
    isNew: true,
    isTrending: true
  },
  {
    id: "4",
    title: "Dune",
    author: "Frank Herbert",
    cover: "/dune-cover.jpg", 
    genre: "Science Fiction",
    rating: 4.6,
    description: "Epic space opera about politics, religion, and ecology on the desert planet Arrakis.",
    readers: "2.1M",
    isNew: true,
    isTrending: true
  }
]

const stats = [
  { icon: BookOpen, label: "Books Available", value: "50K+", color: "text-blue-500", bgColor: "bg-blue-50 dark:bg-blue-950" },
  { icon: Users, label: "Active Readers", value: "100K+", color: "text-green-500", bgColor: "bg-green-50 dark:bg-green-950" },
  { icon: Trophy, label: "Achievements", value: "10K+", color: "text-purple-500", bgColor: "bg-purple-50 dark:bg-purple-950" },
  { icon: MessageSquare, label: "Discussions", value: "500K+", color: "text-orange-500", bgColor: "bg-orange-50 dark:bg-orange-950" }
]

const features = [
  {
    icon: Brain,
    title: "AI-Powered Recommendations",
    description: "Get personalized book suggestions based on your reading history and preferences",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Target,
    title: "Smart Reading Goals",
    description: "Set and track reading challenges that adapt to your progress and schedule",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Zap,
    title: "Interactive Reading",
    description: "Immersive reading experience with highlights, notes, and social features",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Globe,
    title: "Global Community",
    description: "Connect with readers worldwide, join book clubs, and share your journey",
    gradient: "from-orange-500 to-red-500"
  }
]

const recentActivity = [
  { type: "reading", user: "Sarah M.", book: "The Midnight Library", action: "started reading", time: "2 hours ago" },
  { type: "review", user: "John D.", book: "Atomic Habits", action: "left a 5-star review", time: "4 hours ago" },
  { type: "goal", user: "Emma L.", book: "Dune", action: "completed reading goal", time: "6 hours ago" },
  { type: "discussion", user: "Mike R.", book: "1984", action: "joined discussion", time: "8 hours ago" }
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("discover")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentView, setCurrentView] = useState<"reading-list" | "recommendations" | "community">("reading-list")

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Enhanced Header */}
      <header className="border-b border-border bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  LibraMind
                </h1>
                <p className="text-sm text-muted-foreground">Your ultimate reading companion</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Quick search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 w-64 rounded-xl border-slate-200 focus:border-blue-400 dark:border-slate-700"
                />
              </div>
              <Button variant="ghost" size="sm" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                <Search className="w-4 h-4 mr-2 md:hidden" />
                <span className="hidden md:inline">Search</span>
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-slate-50 dark:hover:bg-slate-800">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-green-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="container mx-auto px-6 py-16 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6">
              <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-4 py-2 animate-bounce">
                <Sparkles className="w-4 h-4 mr-2" />
                Welcome to the Future of Reading
              </Badge>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Discover Your Next
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Great Read</span>
            </h2>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Your personal digital library where stories come to life. Join millions of readers discovering, 
              sharing, and celebrating the joy of reading together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 px-8 py-4 text-lg group transform transition-all duration-200 hover:scale-105 shadow-lg">
                  Start Reading Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="border-2 px-8 py-4 text-lg group hover:bg-slate-50 dark:hover:bg-slate-800 transform transition-all duration-200 hover:scale-105">
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-16 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center group cursor-pointer transform transition-all duration-300 hover:scale-110"
              >
                <div className={`mx-auto w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-xl transition-all duration-300`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
                  {stat.value}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content with Tabs */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-slate-200 dark:border-slate-700">
              <TabsTrigger value="discover" className="rounded-xl transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                <BookOpen className="w-4 h-4 mr-2" />
                Discover
              </TabsTrigger>
              <TabsTrigger value="library" className="rounded-xl transition-all duration-200 hover:bg-green-50 dark:hover:bg-green-900/20">
                <BookMarked className="w-4 h-4 mr-2" />
                My Library
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="rounded-xl transition-all duration-200 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                <Target className="w-4 h-4 mr-2" />
                For You
              </TabsTrigger>
              <TabsTrigger value="community" className="rounded-xl transition-all duration-200 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                <Users className="w-4 h-4 mr-2" />
                Community
              </TabsTrigger>
            </TabsList>

            <TabsContent value="discover" className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Featured Books</h2>
                  <Button variant="outline" className="group hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredBooks.map((book) => (
                    <Card 
                      key={book.id} 
                      className="overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 hover:border-blue-300 dark:hover:border-blue-700 group"
                    >
                      <div className="aspect-[3/4] relative overflow-hidden">
                        <Image
                          src={book.cover}
                          alt={book.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        {book.isNew && (
                          <Badge className="absolute top-3 left-3 bg-green-500 text-white shadow-lg animate-pulse">
                            New
                          </Badge>
                        )}
                        {book.isTrending && (
                          <Badge className="absolute top-3 right-3 bg-red-500 text-white shadow-lg">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg hover:text-blue-500 transition-colors duration-200 line-clamp-2">
                              {book.title}
                            </CardTitle>
                            <CardDescription className="text-slate-500 mt-1">{book.author}</CardDescription>
                          </div>
                          <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full ml-2">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-medium">{book.rating}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors">
                            {book.genre}
                          </Badge>
                          <span className="text-xs text-slate-500 flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {book.readers}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{book.description}</p>
                        <Link href={`/books/${book.id}`}>
                          <Button variant="outline" className="w-full group hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200">
                            <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                            Start Reading
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="library">
              <div className="flex gap-4 mb-8">
                <Button
                  variant={currentView === "reading-list" ? "default" : "ghost"}
                  onClick={() => setCurrentView("reading-list")}
                  className="transition-all duration-200"
                >
                  <List className="w-4 h-4 mr-2" />
                  Reading List
                </Button>
                <Button
                  variant={currentView === "recommendations" ? "default" : "ghost"}
                  onClick={() => setCurrentView("recommendations")}
                  className="transition-all duration-200"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Recommendations
                </Button>
                <Button
                  variant={currentView === "community" ? "default" : "ghost"}
                  onClick={() => setCurrentView("community")}
                  className="transition-all duration-200"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Community
                </Button>
              </div>

              {currentView === "reading-list" && <ReadingList />}
              {currentView === "recommendations" && <Recommendations />}
              {currentView === "community" && <CommunityForum />}
            </TabsContent>

            <TabsContent value="recommendations">
              <Recommendations />
            </TabsContent>

            <TabsContent value="community">
              <CommunityForum />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Powerful Features for
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"> Modern Readers</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Experience reading like never before with our cutting-edge features designed to enhance your literary journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group transform transition-all duration-500 hover:scale-105"
              >
                <Card className="p-8 h-full border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-2xl group-hover:bg-white dark:group-hover:bg-slate-800">
                  <CardContent className="p-0">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 group-hover:bg-clip-text transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="py-16 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Recent Activity</h2>
            <div className="flex items-center text-sm text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-full">
              <Clock className="w-4 h-4 mr-2" />
              Updated {currentTime.toLocaleTimeString()}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {recentActivity.map((activity, index) => (
              <Card key={index} className="p-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-blue-300 dark:hover:border-blue-700 group">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                    activity.type === 'reading' ? 'bg-blue-100 dark:bg-blue-900/20 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/30' :
                    activity.type === 'review' ? 'bg-yellow-100 dark:bg-yellow-900/20 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-900/30' :
                    activity.type === 'goal' ? 'bg-green-100 dark:bg-green-900/20 group-hover:bg-green-200 dark:group-hover:bg-green-900/30' :
                    'bg-purple-100 dark:bg-purple-900/20 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/30'
                  }`}>
                    {activity.type === 'reading' && <BookOpen className="w-5 h-5 text-blue-500" />}
                    {activity.type === 'review' && <Star className="w-5 h-5 text-yellow-500" />}
                    {activity.type === 'goal' && <Trophy className="w-5 h-5 text-green-500" />}
                    {activity.type === 'discussion' && <MessageSquare className="w-5 h-5 text-purple-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">{activity.user}</span>
                      <span className="text-slate-600 dark:text-slate-400"> {activity.action} </span>
                      <span className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer">{activity.book}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Reading?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of readers who have already discovered their next favorite book with LibraMind.
          </p>
          <Link href="/signup">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 border-0 px-8 py-6 text-lg font-semibold group shadow-2xl transform transition-all duration-200 hover:scale-105"
            >
              <BookMarked className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}