"use client"

import { useState } from "react"
import { ModernNavigation } from "@/components/navigation/modern-navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    productUpdates: true,
    readingReminders: true,
    aiInsights: false,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/85 to-muted/30">
      <ModernNavigation />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <motion.header
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
            <p className="text-muted-foreground max-w-2xl">Personalize LibraMind to match your reading style, control notifications, and manage connected services.</p>
          </motion.header>

          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <motion.section
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                  <CardDescription>Update the basics that help us tailor recommendations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Display name</Label>
                      <Input id="name" placeholder="Reader Name" defaultValue="Avid Reader" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input id="email" type="email" placeholder="you@example.com" defaultValue="reader@libramind.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Short bio</Label>
                    <Textarea id="bio" rows={3} placeholder="Tell others about your reading goals or favourite genres." defaultValue="Curious mind exploring sci-fi, strategy, and human psychology." />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button>Save changes</Button>
                    <Button variant="outline">Reset</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Choose what emails and push alerts you want to receive.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between rounded-xl border border-border/50 p-4">
                    <div>
                      <p className="font-medium">Product updates</p>
                      <p className="text-sm text-muted-foreground">Be the first to know about new features and reading tools.</p>
                    </div>
                    <Switch checked={notifications.productUpdates} onCheckedChange={(value) => setNotifications((prev) => ({ ...prev, productUpdates: value }))} />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border/50 p-4">
                    <div>
                      <p className="font-medium">Reading reminders</p>
                      <p className="text-sm text-muted-foreground">Stay on track with gentle nudges based on your goals.</p>
                    </div>
                    <Switch checked={notifications.readingReminders} onCheckedChange={(value) => setNotifications((prev) => ({ ...prev, readingReminders: value }))} />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border/50 p-4">
                    <div>
                      <p className="font-medium">AI insights</p>
                      <p className="text-sm text-muted-foreground">Receive summaries and insights generated from your uploaded PDFs.</p>
                    </div>
                    <Switch checked={notifications.aiInsights} onCheckedChange={(value) => setNotifications((prev) => ({ ...prev, aiInsights: value }))} />
                  </div>
                  <Button variant="outline" className="w-full">Pause all notifications</Button>
                </CardContent>
              </Card>

              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle>Connected accounts</CardTitle>
                  <CardDescription>Link services for syncing highlights and notes across devices.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-border/40 p-4">
                    <div>
                      <p className="font-medium">Kindle Highlights</p>
                      <p className="text-xs text-muted-foreground">Import annotations and reading progress from Kindle.</p>
                    </div>
                    <Button size="sm" variant="outline">Connect</Button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border/40 p-4">
                    <div>
                      <p className="font-medium">Goodreads</p>
                      <p className="text-xs text-muted-foreground">Sync shelves and ratings to keep recommendations fresh.</p>
                    </div>
                    <Button size="sm" variant="outline">Disconnect</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle>Reading focus mode</CardTitle>
                  <CardDescription>Fine-tune how LibraMind behaves when you want distraction-free reading sessions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="session-length">Default session length (minutes)</Label>
                    <Input id="session-length" type="number" defaultValue={45} min={15} max={120} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="focus-message">Motivation message</Label>
                    <Textarea id="focus-message" rows={3} placeholder="Words that get you in the zone." defaultValue="Deep work time — let's uncover something new." />
                  </div>
                  <Button className="w-full">Update focus mode</Button>
                </CardContent>
              </Card>

              <Card className="border-border/40 mt-6">
                <CardHeader>
                  <CardTitle>Weekly digest</CardTitle>
                  <CardDescription>Your personalised summary arrives every Sunday.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">Highlights include reading streak, challenge momentum, and AI generated PDF insights tailored to your interests.</p>
                  <Separator />
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="secondary">Reading insights</Badge>
                    <Badge variant="secondary">Challenge tips</Badge>
                    <Badge variant="secondary">New library drops</Badge>
                  </div>
                  <Button variant="ghost" className="w-full">Preview latest digest</Button>
                </CardContent>
              </Card>
            </motion.aside>
          </div>
        </div>
      </main>
    </div>
  )
}
