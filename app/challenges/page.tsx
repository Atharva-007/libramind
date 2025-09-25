"use client"

import { useState, useEffect, useMemo } from "react"
import { ChallengeCard } from "@/components/challenge-card"
import { SocialShare } from "@/components/social-share" // Import SocialShare component

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

  if (loading) return <div className="text-center text-foreground">Loading challenges...</div>
  if (error) return <div className="text-center text-red-500">Error: {error}</div>

  const availableChallenges = allChallenges.filter(
    (challenge) => !userChallenges.some((uc) => uc.challenge_id === challenge.id),
  )

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8 text-center">Reading Challenges</h1>

      {userChallenges.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Your Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userChallenges.map((uc) => (
              <ChallengeCard
                key={uc.id}
                challenge={uc.reading_challenges}
                userChallenge={uc}
                onJoinChallenge={handleJoinChallenge}
                onUpdateProgress={handleUpdateProgress}
              />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <SocialShare
              title="I'm participating in reading challenges on my reading app!"
              url={shareUrl}
            />
          </div>
        </section>
      )}

      {availableChallenges.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-6">Available Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onJoinChallenge={handleJoinChallenge}
                onUpdateProgress={handleUpdateProgress}
              />
            ))}
          </div>
        </section>
      )}

      {userChallenges.length === 0 && availableChallenges.length === 0 && (
        <p className="text-center text-muted-foreground">No reading challenges available at the moment.</p>
      )}
    </main>
  )
}
