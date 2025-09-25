"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface ChallengeCardProps {
  challenge: {
    id: string
    name: string
    description: string
    goal: number
    start_date: string
    end_date: string
  }
  userChallenge?: {
    books_read: number
    status: string
  }
  onJoinChallenge: (challengeId: string) => void
  onUpdateProgress: (challengeId: string, booksRead: number) => void
}

export function ChallengeCard({ challenge, userChallenge, onJoinChallenge, onUpdateProgress }: ChallengeCardProps) {
  const [currentProgress, setCurrentProgress] = useState(userChallenge?.books_read || 0)
  const progressPercentage = (currentProgress / challenge.goal) * 100

  const handleJoin = () => {
    onJoinChallenge(challenge.id)
  }

  const handleUpdate = () => {
    // For simplicity, let's assume updating progress means incrementing by 1 book
    const newProgress = currentProgress + 1
    setCurrentProgress(newProgress)
    onUpdateProgress(challenge.id, newProgress)
  }

  const isChallengeActive = new Date(challenge.end_date) >= new Date()
  const isJoined = !!userChallenge

  return (
    <div className="bg-card rounded-lg shadow-md p-6 space-y-4">
      <h3 className="text-xl font-semibold text-foreground text-balance">{challenge.name}</h3>
      <p className="text-muted-foreground text-sm">{challenge.description}</p>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>
          Goal: {challenge.goal} book{challenge.goal !== 1 ? "s" : ""}
        </span>
        <span>
          {new Date(challenge.start_date).toLocaleDateString()} - {new Date(challenge.end_date).toLocaleDateString()}
        </span>
      </div>

      {isJoined ? (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-foreground">
            <span>
              Progress: {currentProgress} / {challenge.goal} books
            </span>
            <span>{progressPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={progressPercentage} className="w-full" />
          {isChallengeActive && userChallenge?.status === "in_progress" && (
            <Button onClick={handleUpdate} className="w-full mt-2">
              Log a book
            </Button>
          )}
          {!isChallengeActive && userChallenge?.status === "completed" && (
            <p className="text-center text-green-500 text-sm">Challenge Completed!</p>
          )}
          {!isChallengeActive && userChallenge?.status === "failed" && (
            <p className="text-center text-red-500 text-sm">Challenge Ended</p>
          )}
        </div>
      ) : (
        <Button onClick={handleJoin} disabled={!isChallengeActive} className="w-full">
          {isChallengeActive ? "Join Challenge" : "Challenge Ended"}
        </Button>
      )}
    </div>
  )
}
