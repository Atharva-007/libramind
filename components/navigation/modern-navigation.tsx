'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Book,
    Search,
    Menu,
    Home,
    Library,
    Trophy,
    MessageSquare,
    Settings,
    User,
    LogOut,
    Bell,
    Bookmark,
    TrendingUp,

} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

const navigationItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/library', label: 'Library', icon: Library },
    { href: '/challenges', label: 'Challenges', icon: Trophy },
    { href: '/community', label: 'Community', icon: MessageSquare },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
]

export function ModernNavigation() {
    const [scrolled, setScrolled] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [notifications] = useState(3) // Mock notification count
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg'
                : 'bg-transparent'
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link href="/" className="flex items-center space-x-2">
                            <motion.div
                                className="relative"
                                whileHover={{ rotate: 180 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                                    <Book className="w-5 h-5 text-primary-foreground" />
                                </div>
                                <motion.div
                                    className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.7, 1, 0.7]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: 'easeInOut'
                                    }}
                                />
                            </motion.div>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                LibraMind
                            </span>
                            <Badge variant="secondary" className="text-xs">Pro</Badge>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navigationItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <motion.div key={item.href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden ${isActive
                                            ? 'text-primary bg-primary/10'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                                            }`}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                        {isActive && (
                                            <motion.div
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: 1 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        )}
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </nav>

                    {/* Search */}
                    <div className="hidden md:flex items-center space-x-4">
                        <motion.div
                            className="relative"
                            animate={{ width: searchOpen ? 300 : 240 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search books, authors, topics..."
                                className="pl-10 pr-4 py-2 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:bg-background/80 transition-all duration-200"
                                onFocus={() => setSearchOpen(true)}
                                onBlur={() => setSearchOpen(false)}
                            />
                            <motion.div
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                whileHover={{ scale: 1.1 }}
                            >
                                <Badge variant="outline" className="text-xs px-2 py-0.5">
                                    ⌘K
                                </Badge>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-3">
                        {/* Notifications */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative"
                        >
                            <Button variant="ghost" size="sm" className="relative">
                                <Bell className="w-4 h-4" />
                                {notifications > 0 && (
                                    <motion.div
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    >
                                        {notifications}
                                    </motion.div>
                                )}
                            </Button>
                        </motion.div>

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* User Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src="/placeholder-user.jpg" alt="User" />
                                            <AvatarFallback>U</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </motion.div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-56 backdrop-blur-xl bg-background/90 border-border/50"
                                align="end"
                                forceMount
                            >
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">Reader</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            reader@libramind.com
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile" className="flex items-center">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Bookmark className="mr-2 h-4 w-4" />
                                    <span>Bookmarks</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <TrendingUp className="mr-2 h-4 w-4" />
                                    <span>Reading Stats</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/settings" className="flex items-center">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Mobile Menu */}
                        <div className="md:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button variant="ghost" size="sm">
                                            <Menu className="w-5 h-5" />
                                        </Button>
                                    </motion.div>
                                </SheetTrigger>
                                <SheetContent className="w-80 backdrop-blur-xl bg-background/95">
                                    <SheetHeader>
                                        <SheetTitle className="flex items-center space-x-2">
                                            <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/60 rounded-md flex items-center justify-center">
                                                <Book className="w-4 h-4 text-primary-foreground" />
                                            </div>
                                            <span>LibraMind</span>
                                        </SheetTitle>
                                        <SheetDescription>
                                            Your personal reading companion
                                        </SheetDescription>
                                    </SheetHeader>

                                    <div className="mt-8 space-y-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search books..."
                                                className="pl-10"
                                            />
                                        </div>

                                        <nav className="space-y-2">
                                            {navigationItems.map((item) => {
                                                const isActive = pathname === item.href
                                                return (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                                            ? 'text-primary bg-primary/10'
                                                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                                                            }`}
                                                    >
                                                        <item.icon className="w-5 h-5" />
                                                        <span>{item.label}</span>
                                                    </Link>
                                                )
                                            })}
                                        </nav>

                                        <div className="pt-4 border-t border-border/50">
                                            <div className="flex items-center space-x-3 px-3 py-2">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                                                    <AvatarFallback>U</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium">Reader</p>
                                                    <p className="text-xs text-muted-foreground">reader@libramind.com</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: scrolled ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ originX: 0 }}
            />
        </motion.header>
    )
}