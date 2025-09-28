"use client"

import { motion } from "framer-motion"
import { ModernNavigation } from "@/components/navigation/modern-navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Book, Calendar, Clock, FileText, Trophy } from "lucide-react"

const quickStats = [
  { label: "Total Books", value: 124, icon: Book },
  { label: "Reading Streak", value: "18 days", icon: Clock },
  { label: "PDF Summaries", value: 42, icon: FileText },
  { label: "Challenges Won", value: 7, icon: Trophy },
]

const readingTimeline = [
  { title: "Started LibraMind", subtitle: "Joined in January 2023", icon: Calendar },
  { title: "100 Book Milestone", subtitle: "Reached in June 2024", icon: Book },
  { title: "First Challenge Trophy", subtitle: "Sci-Fi Marathon", icon: Trophy },
]

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/30">
      <ModernNavigation />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="overflow-hidden border-border/40 backdrop-blur">
              <CardContent className="p-6 md:p-10 flex flex-col md:flex-row gap-8 md:gap-12">
                <div className="flex flex-col items-center text-center md:items-start md:text-left max-w-xs">
                  <Avatar className="h-24 w-24 md:h-28 md:w-28 shadow-md">
                    <AvatarImage src="/placeholder-user.jpg" alt="Reader" />
                    <AvatarFallback>RD</AvatarFallback>
                  </Avatar>
                  <div className="mt-4 space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight">Avid Reader</h1>
                    <p className="text-sm text-muted-foreground">Creating meaningful reading habits and exploring new worlds daily.</p>
                    <Badge variant="secondary" className="px-3 py-1 rounded-full">Premium Member</Badge>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                    <Button size="sm" variant="default">Edit Profile</Button>
                    <Button size="sm" variant="outline">Share Progress</Button>
                  </div>
                </div>

                <Separator orientation="vertical" className="hidden md:block h-auto" />

                <div className="flex-1 grid gap-4 sm:grid-cols-2">
                  {quickStats.map((item) => (
                    <Card key={item.label} className="border-border/40 shadow-sm">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-primary/10 text-primary">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
                          <p className="text-xl font-semibold mt-1">{item.value}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          <motion.section
            className="grid gap-6 lg:grid-cols-[2fr,1fr]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="border-border/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Recently Viewed & Bookmarked</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-start gap-4 rounded-xl border border-border/50 p-4 hover:border-primary/40 transition-colors">
                    <div className="h-14 w-10 rounded-md bg-gradient-to-br from-primary/30 to-primary/5" />
                    <div className="flex-1 space-y-1">
                      <h3 className="text-sm font-semibold">Exploring Future Tech #{item}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">AI, robotics, and quantum leap through the latest research papers curated in your library.</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Last opened 2 days ago</span>
                        <span className="h-1 w-1 bg-muted-foreground rounded-full" />
                        <span>Progress 65%</span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">Resume</Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Reading Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {readingTimeline.map((event) => (
                  <div key={event.title} className="flex gap-3 rounded-lg border border-border/40 p-3">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      <event.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.subtitle}</p>
                    </div>
                  </div>
                ))}
                <Button size="sm" variant="outline" className="w-full">View full reading journey</Button>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </main>
    </div>
  )
}
