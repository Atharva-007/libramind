"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

interface LogProgressFormProps {
  bookId: string
  initialPagesRead?: number
  initialTotalPages?: number
  onProgressLogged?: () => void
}

export function LogProgressForm({
  bookId,
  initialPagesRead = 0,
  initialTotalPages,
  onProgressLogged,
}: LogProgressFormProps) {
  const [pagesRead, setPagesRead] = useState(initialPagesRead)
  const [totalPages, setTotalPages] = useState(initialTotalPages || 0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/reading-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ book_id: bookId, pages_read: pagesRead, total_pages: totalPages }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to log progress")
      }

      if (onProgressLogged) {
        onProgressLogged()
      }
      router.refresh() // Refresh the page to show updated progress
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to log progress"
      setError(message)
      console.error("[v0] Error logging progress:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div>
        <Label htmlFor="pagesRead">Pages Read</Label>
        <Input
          id="pagesRead"
          type="number"
          value={pagesRead}
          onChange={(e) => setPagesRead(Number.parseInt(e.target.value))}
          required
          min="0"
        />
      </div>
      <div>
        <Label htmlFor="totalPages">Total Pages</Label>
        <Input
          id="totalPages"
          type="number"
          value={totalPages}
          onChange={(e) => setTotalPages(Number.parseInt(e.target.value))}
          required
          min="1"
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Logging..." : "Log Progress"}
      </Button>
    </form>
  )
}
