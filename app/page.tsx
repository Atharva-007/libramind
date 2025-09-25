'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ModernNavigation } from '@/components/navigation/modern-navigation'
import { ModernDashboard } from '@/components/dashboard/modern-dashboard'
import { UserDashboard } from '@/components/dashboard/user-dashboard'
import { ThemeProvider } from '@/components/theme-provider'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    setLoading(false)
  }

  if (loading) {
    return (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-background">
        <ModernNavigation />

        {/* Main Content */}
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {user ? <UserDashboard /> : <ModernDashboard />}
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}