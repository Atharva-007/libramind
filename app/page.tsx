"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen, Settings, Search, Users, List, Star } from "lucide-react" // Added new icons
import { ReadingList } from "@/components/reading-list" // New component for reading list
import { Recommendations } from "@/components/recommendations" // New component for recommendations
import { CommunityForum } from "@/components/community-forum" // New component for community forum

export default function HomePage() {
  const [currentView, setCurrentView] = useState<"reading-list" | "recommendations" | "community">("reading-list") // Updated view states

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Reading Enthusiast App</h1>{" "}
                {/* Updated app title */}
                <p className="text-sm text-muted-foreground">Your ultimate companion for books</p>{" "}
                {/* Updated app description */}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="flex gap-4 mb-8">
          <Button
            variant={currentView === "reading-list" ? "default" : "ghost"}
            onClick={() => setCurrentView("reading-list")}
          >
            <List className="w-4 h-4 mr-2" />
            Reading List
          </Button>
          <Button
            variant={currentView === "recommendations" ? "default" : "ghost"}
            onClick={() => setCurrentView("recommendations")}
          >
            <Star className="w-4 h-4 mr-2" />
            Recommendations
          </Button>
          <Button
            variant={currentView === "community" ? "default" : "ghost"}
            onClick={() => setCurrentView("community")}
          >
            <Users className="w-4 h-4 mr-2" />
            Community
          </Button>
        </div>

        {currentView === "reading-list" && <ReadingList />}
        {currentView === "recommendations" && <Recommendations />}
        {currentView === "community" && <CommunityForum />}
      </main>
    </div>
  )
}
