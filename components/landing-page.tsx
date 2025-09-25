'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Star, 
  ArrowRight, 
  Search,
  Sparkles,
  Brain,
  Target,
  Zap,
  Play,
  ChevronDown,
  Award,
  BookMarked,
  Clock,
  Globe
} from 'lucide-react'
import { useInView } from 'react-intersection-observer'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
}

const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    rotate: [-2, 2, -2],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const featuredBooks = [
  {
    id: "1",
    title: "The Midnight Library",
    author: "Matt Haig",
    cover: "/the-great-gatsby-cover.jpg",
    genre: "Fiction",
    rating: 4.8,
    readers: "2.3M"
  },
  {
    id: "2", 
    title: "Atomic Habits",
    author: "James Clear",
    cover: "/foundation-cover.jpg",
    genre: "Self-Help",
    rating: 4.9,
    readers: "1.8M"
  },
  {
    id: "3",
    title: "Dune",
    author: "Frank Herbert", 
    cover: "/dune-cover.jpg",
    genre: "Sci-Fi",
    rating: 4.7,
    readers: "1.2M"
  }
]

const stats = [
  { icon: BookOpen, label: "Books Available", value: "50K+", color: "text-blue-500" },
  { icon: Users, label: "Active Readers", value: "100K+", color: "text-green-500" },
  { icon: TrendingUp, label: "Reading Sessions", value: "1M+", color: "text-purple-500" },
  { icon: Award, label: "Achievements", value: "10K+", color: "text-orange-500" }
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

export default function LandingPage() {
  const [currentBookIndex, setCurrentBookIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const heroRef = useRef(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, -150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  const [heroInView, heroInViewRef] = useInView({ threshold: 0.1, triggerOnce: true })
  const [featuresInView, featuresInViewRef] = useInView({ threshold: 0.1, triggerOnce: true })
  const [statsInView, statsInViewRef] = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBookIndex((prev) => (prev + 1) % featuredBooks.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ y, opacity }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-green-500/20 to-cyan-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div ref={heroInViewRef} className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Welcome to the Future of Reading
              </Badge>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight dark:from-white dark:via-blue-400 dark:to-purple-400"
            >
              LibraMind
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed"
            >
              Discover, read, and connect with millions of books and readers worldwide. 
              Your personalized reading journey starts here.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 px-8 py-6 text-lg group">
                  Start Reading Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="border-2 px-8 py-6 text-lg group hover:bg-slate-50 dark:hover:bg-slate-800">
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </Link>
            </motion.div>

            {/* Search Bar */}
            <motion.div variants={itemVariants} className="max-w-md mx-auto mb-16">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder="Search for books, authors, genres..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-6 text-lg rounded-2xl border-2 border-slate-200 focus:border-blue-500 dark:border-slate-700 dark:focus:border-blue-400"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Floating Books Animation */}
          <motion.div 
            className="absolute right-10 top-1/2 transform -translate-y-1/2 hidden lg:block"
            variants={floatingVariants}
            animate="animate"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBookIndex}
                initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: 30 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 max-w-xs">
                  <Image
                    src={featuredBooks[currentBookIndex].cover}
                    alt={featuredBooks[currentBookIndex].title}
                    width={150}
                    height={220}
                    className="rounded-lg mx-auto mb-4 shadow-lg"
                  />
                  <h3 className="font-semibold text-lg mb-2">{featuredBooks[currentBookIndex].title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-3">{featuredBooks[currentBookIndex].author}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span>{featuredBooks[currentBookIndex].rating}</span>
                    </div>
                    <Badge variant="secondary">{featuredBooks[currentBookIndex].genre}</Badge>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-6 h-6 text-slate-400" />
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        ref={statsInViewRef}
        className="py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
      >
        <div className="container mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center group cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300"
                >
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </motion.div>
                <motion.h3 
                  className="text-3xl font-bold text-slate-900 dark:text-white mb-2"
                  initial={{ opacity: 0 }}
                  animate={statsInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  {stat.value}
                </motion.h3>
                <p className="text-slate-600 dark:text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section ref={featuresInViewRef} className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6"
            >
              Powerful Features for
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"> Modern Readers</span>
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
            >
              Experience reading like never before with our cutting-edge features designed to enhance your literary journey.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            className="grid md:grid-cols-2 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group"
              >
                <Card className="p-8 h-full border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <motion.div
                      className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-2xl transition-all duration-300`}
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 group-hover:bg-clip-text transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-24 bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden"
        whileInView={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-[url('/api/placeholder/1920/800')] opacity-10"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Ready to Transform Your Reading?
          </motion.h2>
          <motion.p 
            className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join thousands of readers who have already discovered their next favorite book with LibraMind.
          </motion.p>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/signup">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 border-0 px-8 py-6 text-lg font-semibold group shadow-2xl"
              >
                <BookMarked className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}