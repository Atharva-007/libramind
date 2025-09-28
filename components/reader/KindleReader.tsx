'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    ChevronLeft,
    ChevronRight,
    Settings,
    Search,
    Bookmark,
    BookmarkCheck,
    Moon,
    Sun,
    Palette,
    MessageCircle,
    FileText,
} from "lucide-react"
import { motion } from "framer-motion"
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'

interface PDFDocument {
    id: string
    filename: string
    content: string
    ai_summary: string
    total_pages: number
    reading_progress: {
        currentPage: number
        lastRead: string | null
    }
}

interface ReadingSettings {
    fontSize: number
    fontFamily: string
    lineHeight: number
    theme: 'light' | 'dark' | 'sepia'
    columnWidth: 'narrow' | 'medium' | 'wide'
}

interface Bookmark {
    id: string
    page: number
    text: string
    note: string
    timestamp: Date
}

type KindleReaderProps = {
    documentId?: string
    document?: PDFDocument
    onClose?: () => void
}

export default function KindleReader({ documentId, document: incomingDocument, onClose }: KindleReaderProps) {
    const { user } = useUser()
    const [document, setDocument] = useState<PDFDocument | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
    const [settings, setSettings] = useState<ReadingSettings>({
        fontSize: 16,
        fontFamily: 'Georgia',
        lineHeight: 1.6,
        theme: 'light',
        columnWidth: 'medium'
    })
    const [showSettings, setShowSettings] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    interface SearchResult { snippet: string; position: number; page: number }
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [isBookmarked, setIsBookmarked] = useState(false)

    const contentRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    // Resolve the effective document id
    const resolvedId = incomingDocument?.id || documentId

    useEffect(() => {
        if (!user) return

        const init = async () => {
            try {
                if (incomingDocument) {
                    setDocument(incomingDocument)
                    setCurrentPage(incomingDocument.reading_progress?.currentPage || 1)
                    setLoading(false)
                } else if (resolvedId) {
                    await loadDocument(resolvedId)
                }
                if (resolvedId) {
                    await loadBookmarks(resolvedId)
                }
            } catch (e) {
                console.error(e)
            }
        }
        init()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, resolvedId])

    const loadDocument = async (id: string) => {
        try {
            const { data, error } = await supabase
                .from('user_pdfs')
                .select('*')
                .eq('id', id)
                .eq('user_id', user?.id)
                .single()

            if (error) throw error

            setDocument(data)
            setCurrentPage(data.reading_progress?.currentPage || 1)
            setLoading(false)
        } catch (error) {
            console.error('Error loading document:', error)
            setLoading(false)
        }
    }

    const loadBookmarks = async (id: string) => {
        try {
            const { data, error } = await supabase
                .from('pdf_bookmarks')
                .select('*')
                .eq('pdf_id', id)
                .eq('user_id', user?.id)
                .order('page', { ascending: true })

            if (error) throw error
            setBookmarks(data || [])
        } catch (error) {
            console.error('Error loading bookmarks:', error)
        }
    }

    const updateReadingProgress = async (page: number) => {
        if (!document || !user) return

        try {
            await supabase
                .from('user_pdfs')
                .update({
                    reading_progress: {
                        currentPage: page,
                        lastRead: new Date().toISOString()
                    }
                })
                .eq('id', resolvedId)
                .eq('user_id', user.id)
        } catch (error) {
            console.error('Error updating reading progress:', error)
        }
    }

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || !document || newPage > document.total_pages) return

        setCurrentPage(newPage)
        updateReadingProgress(newPage)
    }

    const toggleBookmark = async () => {
        if (!user || !document) return

        try {
            if (isBookmarked) {
                // Remove bookmark
                await supabase
                    .from('pdf_bookmarks')
                    .delete()
                    .eq('pdf_id', resolvedId)
                    .eq('page', currentPage)
                    .eq('user_id', user.id)

                setIsBookmarked(false)
            } else {
                // Add bookmark
                const selectedText = window.getSelection()?.toString().substring(0, 200) || ''

                await supabase
                    .from('pdf_bookmarks')
                    .insert({
                        pdf_id: resolvedId,
                        user_id: user.id,
                        page: currentPage,
                        text: selectedText,
                        note: ''
                    })

                setIsBookmarked(true)
            }

            if (resolvedId) {
                loadBookmarks(resolvedId)
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error)
        }
    }

    const searchInDocument = () => {
        if (!searchQuery.trim() || !document) return

        const content = document.content.toLowerCase()
        const query = searchQuery.toLowerCase()
        const results = []

        let index = content.indexOf(query)
        while (index !== -1 && results.length < 20) {
            const start = Math.max(0, index - 50)
            const end = Math.min(content.length, index + query.length + 50)
            const snippet = content.substring(start, end)

            results.push({
                snippet,
                position: index,
                page: Math.ceil(index / (content.length / document.total_pages))
            })

            index = content.indexOf(query, index + 1)
        }

        setSearchResults(results)
    }

    // Reflect bookmark state for current page
    useEffect(() => {
        setIsBookmarked(bookmarks.some(b => b.page === currentPage))
    }, [bookmarks, currentPage])

    const getThemeClasses = () => {
        switch (settings.theme) {
            case 'dark':
                return 'bg-gray-900 text-gray-100'
            case 'sepia':
                return 'bg-amber-50 text-amber-900'
            default:
                return 'bg-white text-gray-900'
        }
    }

    const getColumnWidthClass = () => {
        switch (settings.columnWidth) {
            case 'narrow':
                return 'max-w-2xl'
            case 'wide':
                return 'max-w-6xl'
            default:
                return 'max-w-4xl'
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
                />
            </div>
        )
    }

    if (!document) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Document Not Found
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        The requested document could not be loaded.
                    </p>
                </div>
            </div>
        )
    }

    const pages = document.content.split('\n\n').filter(p => p.trim())
    const currentPageContent = pages[currentPage - 1] || ''

    return (
        <div className={`min-h-screen transition-colors duration-300 ${getThemeClasses()}`}>
            {/* Header */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
            >
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <ChevronLeft className="w-4 h-4" />
                            Back to Library
                        </Button>
                        <div>
                            <h1 className="font-semibold text-gray-900 dark:text-white">
                                {document.filename}
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Page {currentPage} of {document.total_pages}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <Search className="w-4 h-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Search in Document</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Search for text..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && searchInDocument()}
                                        />
                                        <Button onClick={searchInDocument}>Search</Button>
                                    </div>

                                    {searchResults.length > 0 && (
                                        <div className="max-h-60 overflow-y-auto space-y-2">
                                            {searchResults.map((result, index) => (
                                                <Card key={index} className="p-3">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <Badge variant="outline">Page {result.page}</Badge>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handlePageChange(result.page)}
                                                        >
                                                            Go to page
                                                        </Button>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        ...{result.snippet}...
                                                    </p>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>

                        {/* Bookmark */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleBookmark}
                            className={isBookmarked ? 'text-yellow-600' : ''}
                        >
                            {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </Button>

                        {/* Settings */}
                        <Dialog open={showSettings} onOpenChange={setShowSettings}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <Settings className="w-4 h-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Reading Settings</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6">
                                    {/* Font Size */}
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Font Size: {settings.fontSize}px
                                        </label>
                                        <Slider
                                            value={[settings.fontSize]}
                                            onValueChange={([value]) => setSettings(prev => ({ ...prev, fontSize: value }))}
                                            min={12}
                                            max={24}
                                            step={1}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Line Height */}
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Line Height: {settings.lineHeight}
                                        </label>
                                        <Slider
                                            value={[settings.lineHeight]}
                                            onValueChange={([value]) => setSettings(prev => ({ ...prev, lineHeight: value }))}
                                            min={1.2}
                                            max={2.0}
                                            step={0.1}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Theme */}
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Theme</label>
                                        <div className="flex gap-2">
                                            {(['light', 'dark', 'sepia'] as const).map((theme) => (
                                                <Button
                                                    key={theme}
                                                    variant={settings.theme === theme ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => setSettings(prev => ({ ...prev, theme }))}
                                                    className="capitalize"
                                                >
                                                    {theme === 'light' && <Sun className="w-4 h-4 mr-1" />}
                                                    {theme === 'dark' && <Moon className="w-4 h-4 mr-1" />}
                                                    {theme === 'sepia' && <Palette className="w-4 h-4 mr-1" />}
                                                    {theme}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        {/* AI Chat */}
                        <Button variant="ghost" size="sm">
                            <MessageCircle className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </motion.header>

            {/* Content */}
            <main className="container mx-auto px-4 py-8">
                <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`mx-auto ${getColumnWidthClass()}`}
                >
                    {/* Apply font size and line height using utility classes */}
                    <div className={
                        [
                            settings.lineHeight >= 1.9 ? 'leading-9' : settings.lineHeight >= 1.7 ? 'leading-8' : settings.lineHeight >= 1.5 ? 'leading-7' : 'leading-6',
                            settings.fontSize >= 22 ? 'text-2xl' : settings.fontSize >= 20 ? 'text-xl' : settings.fontSize >= 18 ? 'text-lg' : settings.fontSize >= 16 ? 'text-base' : 'text-sm'
                        ].join(' ')
                    }>
                        <div
                            ref={contentRef}
                            className={[
                                'prose max-w-none',
                                settings.fontFamily === 'Georgia' ? 'font-serif' : 'font-sans',
                            ].join(' ')}
                        >
                            <div className="whitespace-pre-wrap leading-relaxed">
                                {currentPageContent}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Navigation */}
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="fixed bottom-6 left-1/2 transform -translate-x-1/2"
                >
                    <Card className="flex items-center gap-4 p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>

                        <div className="flex items-center gap-4 min-w-[200px]">
                            <span className="text-sm font-medium whitespace-nowrap">
                                {currentPage} / {document.total_pages}
                            </span>
                            <Slider
                                value={[currentPage]}
                                onValueChange={([value]) => handlePageChange(value)}
                                min={1}
                                max={document.total_pages}
                                step={1}
                                className="flex-1"
                            />
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= document.total_pages}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </Card>
                </motion.div>

                {/* Progress Indicator */}
                <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 z-50">
                    <motion.div
                        className="h-full bg-blue-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentPage / document.total_pages) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </main>

            {/* AI Summary Sidebar */}
            {document.ai_summary && (
                <motion.div
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="fixed right-0 top-20 bottom-20 w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto"
                >
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <h3 className="font-semibold">AI Summary</h3>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {document.ai_summary}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    )
}