"use client"

import { useState, useEffect, useMemo } from "react"
import { ChallengeCard } from "@/components/challenge-card"
import { SocialShare } from "@/components/social-share"
import { ModernNavigation } from "@/components/navigation/modern-navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

interface Challenge {
  id: string
  name: string
  description: string
  goal: number
  start_date: string
  end_date: string
}

interface UserChallenge {
  id: string
  user_id: string
  challenge_id: string
  books_read: number
  status: string
  reading_challenges: Challenge // Joined relation
}

export default function ChallengesPage() {
  const [allChallenges, setAllChallenges] = useState<Challenge[]>([])
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const shareUrl = useMemo(() => {
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    if (baseUrl) {
      return `${baseUrl.replace(/\/$/, "")}/challenges`
    }

    if (typeof window !== "undefined") {
      return `${window.location.origin}/challenges`
    }

    return "/challenges"
  }, [])

  useEffect(() => {
    fetchChallenges()
    fetchUserChallenges()
  }, [])

  const fetchChallenges = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/challenges")
      if (!response.ok) {
        throw new Error("Failed to fetch challenges")
      }
      const data: Challenge[] = await response.json()
      setAllChallenges(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserChallenges = async () => {
    try {
      const response = await fetch("/api/user-challenges")
      if (!response.ok) {
        throw new Error("Failed to fetch user challenges")
      }
      const data: UserChallenge[] = await response.json()
      setUserChallenges(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(message)
    }
  }

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      const response = await fetch(`/api/challenges/${challengeId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      if (!response.ok) {
        throw new Error("Failed to join challenge")
      }
      fetchUserChallenges() // Refresh user challenges
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(message)
    }
  }

  const handleUpdateProgress = async (challengeId: string, booksRead: number) => {
    try {
      const response = await fetch(`/api/challenges/${challengeId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ books_read: booksRead }),
      })
      if (!response.ok) {
        throw new Error("Failed to update progress")
      }
      fetchUserChallenges() // Refresh user challenges
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(message)
    }
  }

  const availableChallenges = allChallenges.filter(
    (challenge) => !userChallenges.some((uc) => uc.challenge_id === challenge.id),
  )

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

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <ModernNavigation />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">❌</div>
                <h2 className="text-2xl font-bold mb-4">Error Loading Challenges</h2>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  🔄 Try Again
                </Button>
              </CardContent>
            </Card>
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
            <motion.h1
              className="text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              🏆 Reading Challenges
            </motion.h1>
            <motion.p
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Push your reading limits and achieve your literary goals
            </motion.p>
          </div>

          {/* Challenge Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary">{userChallenges.length}</div>
                <div className="text-sm text-muted-foreground">Active Challenges</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary">
                  {userChallenges.reduce((sum, uc) => sum + uc.books_read, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Books Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary">{availableChallenges.length}</div>
                <div className="text-sm text-muted-foreground">Available Challenges</div>
              </CardContent>
            </Card>
          </motion.div>

          {userChallenges.length > 0 && (
            <motion.section
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">🌟 Your Active Challenges</h2>
                <Badge variant="secondary">
                  {userChallenges.length} Active
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userChallenges.map((uc, index) => (
                  <motion.div
                    key={uc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  >
                    <ChallengeCard
                      challenge={uc.reading_challenges}
                      userChallenge={uc}
                      onJoinChallenge={handleJoinChallenge}
                      onUpdateProgress={handleUpdateProgress}
                    />
                  </motion.div>
                ))}
              </div>
              <motion.div
                className="mt-8 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <SocialShare
                  title="I'm participating in reading challenges on LibraMind Pro!"
                  url={shareUrl}
                />
              </motion.div>
            </motion.section>
          )}

          {availableChallenges.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">🚀 Discover New Challenges</h2>
                <Badge variant="outline">
                  {availableChallenges.length} Available
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableChallenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  >
                    <ChallengeCard
                      challenge={challenge}
                      onJoinChallenge={handleJoinChallenge}
                      onUpdateProgress={handleUpdateProgress}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {userChallenges.length === 0 && availableChallenges.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h2 className="text-2xl font-bold mb-4">No Challenges Available</h2>
                <p className="text-muted-foreground">
                  No reading challenges available at the moment. Check back soon!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
