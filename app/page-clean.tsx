import { ModernNavigation } from '@/components/navigation/modern-navigation'
import { ModernDashboard } from '@/components/dashboard/modern-dashboard'
import { ThemeProvider } from '@/components/theme-provider'

export default function HomePage() {
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
                        <ModernDashboard />
                    </div>
                </main>
            </div>
        </ThemeProvider>
    )
}