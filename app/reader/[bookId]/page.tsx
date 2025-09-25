'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
    FaArrowLeft as ArrowLeft,
    FaChevronLeft as ChevronLeft,
    FaChevronRight as ChevronRight,
    FaCog as Settings,
    FaBookmark as Bookmark,
    FaSun as Sun,
    FaMoon as Moon,
    FaTextHeight as Type,
    FaPalette as Palette,
    FaBookOpen as BookOpen,
    FaPlay as Play,
    FaPause as Pause,
    FaPlus as Plus,
    FaQuoteLeft as Quote,
    FaHighlighter as Highlighter,
    FaTimes as X,
    FaExpand as Maximize,
    FaCompress as Minimize,
    FaVolumeUp as Volume2,
    FaFont as Fonts,
    FaAlignLeft as AlignLeft,
    FaAlignCenter as AlignCenter,
    FaAlignJustify as AlignJustify
} from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'

interface ReadingSettings {
    fontSize: number
    fontFamily: string
    lineHeight: number
    textAlign: 'left' | 'center' | 'justify'
    backgroundColor: string
    textColor: string
    darkMode: boolean
    readAloud: boolean
    autoScroll: boolean
    scrollSpeed: number
}

interface Note {
    id: string
    content: string
    pageNumber: number
    position: { x: number; y: number }
    isHighlight?: boolean
    color?: string
}

export default function ReaderPage({ params }: { params: { bookId: string } }) {
    const router = useRouter()
    const { theme, setTheme } = useTheme()
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages] = useState(288)
    const [showSettings, setShowSettings] = useState(false)
    const [showNotes, setShowNotes] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [selectedText, setSelectedText] = useState('')
    const [showTextActions, setShowTextActions] = useState(false)
    const [textActionPosition, setTextActionPosition] = useState({ x: 0, y: 0 })
    const [notes, setNotes] = useState<Note[]>([])
    const [newNote, setNewNote] = useState('')
    const [isReading, setIsReading] = useState(false)
    const contentRef = useRef<HTMLDivElement>(null)

    const [settings, setSettings] = useState<ReadingSettings>({
        fontSize: 18,
        fontFamily: 'serif',
        lineHeight: 1.6,
        textAlign: 'left',
        backgroundColor: '#ffffff',
        textColor: '#1a1a1a',
        darkMode: false,
        readAloud: false,
        autoScroll: false,
        scrollSpeed: 50
    })

    // Mock book content
    const bookContent = `
    Chapter 1: The Man at the Door

    Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets?

    A life is like a book. A book is like a life. There are so many lives I have not lived, so many books I have not read. Sometimes I wonder if I have made the right choices, if I have taken the right path. But then I remember that every book, every life, is a story. And every story has value.

    The library appeared to her in that moment between life and death, infinite and eternal. Mrs. Elm, the librarian from her school days, stood behind the desk with a knowing smile. "Welcome to the Midnight Library," she said. "This is where all the stories live."

    Nora looked around in wonder. The shelves stretched impossibly high, filled with books of every size and color. Each book represented a different life she could have lived, a different choice she could have made. The weight of infinite possibility pressed down upon her.

    "How do I choose?" Nora asked, her voice barely a whisper.

    "You don't," Mrs. Elm replied. "The book chooses you. Each time you open a book, you'll live that life as if it were your own. You'll remember every moment, every feeling, every choice that led to that particular existence."

    The first book that called to her was bound in deep green leather, its pages whispering promises of adventure and discovery. As she opened it, the library faded away, and she found herself standing in a snowy landscape, breathing crisp Arctic air. In this life, she was a glaciologist, studying the ancient ice that held the secrets of climate change.

    But even as she lived this other life, she carried with her the knowledge of all the paths not taken. The musician she never became, the mother she never was, the traveler who never left home. Each life was beautiful and tragic in its own way, perfect in its imperfection.

    The philosophy professor life showed her the joy of teaching, of watching young minds grapple with eternal questions. The rock star life gave her the rush of performing before thousands, the electricity of music flowing through her veins. Each existence was fully formed, complete with memories, relationships, and consequences.

    Yet in each life, she found herself searching for something more. The perfect life remained elusive, always just beyond reach. She began to understand that the search itself was the meaning, that the question was more important than the answer.

    As she moved between lives, between books, she started to appreciate the beauty of imperfection. The life unlived is not necessarily better than the life lived. Every choice creates ripples, every path has its shadows and its light.

    The library taught her that regret is not about the roads not taken, but about not appreciating the road you are on. Every life has its sorrows and its joys, its failures and its triumphs. The key is not to live without regret, but to live with acceptance.

    In the end, she realized that the most important choice was not which life to live, but how to live the life she had been given. The Midnight Library showed her that every life is a story worth telling, every choice a chapter worth reading.

    And so she closed the book, stepped back into the library, and made her choice. Not to escape her life, but to embrace it. To see the beauty in the ordinary, the miracle in the mundane. To understand that her life, with all its apparent failures and disappointments, was not a rough draft but a complete work of art.

    The shelves began to fade, the books dissolving into golden light. Mrs. Elm smiled one last time before she too became part of the fading dream. "Remember," she whispered, "between life and death, there is always a library. And in that library, every story matters."

    Nora opened her eyes to find herself back in her own life, but now she saw it with new eyes. The same life, but seen through the lens of infinite possibility. She understood now that this was not the only life she could have lived, but it was the life she was living. And that made all the difference.
  `

    const progress = (currentPage / totalPages) * 100

    const handleTextSelection = () => {
        const selection = window.getSelection()
        if (selection && selection.toString().trim()) {
            const range = selection.getRangeAt(0)
            const rect = range.getBoundingClientRect()
            setSelectedText(selection.toString())
            setTextActionPosition({ x: rect.x + rect.width / 2, y: rect.y - 10 })
            setShowTextActions(true)
        } else {
            setShowTextActions(false)
        }
    }

    const addHighlight = (color: string = 'yellow') => {
        if (selectedText) {
            const note: Note = {
                id: Date.now().toString(),
                content: selectedText,
                pageNumber: currentPage,
                position: textActionPosition,
                isHighlight: true,
                color
            }
            setNotes([...notes, note])
            setShowTextActions(false)
        }
    }

    const addNote = () => {
        if (newNote.trim()) {
            const note: Note = {
                id: Date.now().toString(),
                content: newNote,
                pageNumber: currentPage,
                position: { x: 0, y: 0 }
            }
            setNotes([...notes, note])
            setNewNote('')
        }
    }

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const updateSetting = (key: keyof ReadingSettings, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    const presetThemes = [
        { name: 'Classic', bg: '#ffffff', text: '#1a1a1a' },
        { name: 'Sepia', bg: '#f4f3e8', text: '#5c4b37' },
        { name: 'Dark', bg: '#1a1a1a', text: '#e5e5e5' },
        { name: 'Blue Night', bg: '#0f172a', text: '#cbd5e1' },
        { name: 'Green', bg: '#f0fdf4', text: '#166534' }
    ]

    return (
        <div className="min-h-screen bg-background relative">
            {/* Header */}
            <motion.header
                className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={prevPage}
                                disabled={currentPage <= 1}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>

                            <span className="text-sm min-w-20 text-center">
                                {currentPage} / {totalPages}
                            </span>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={nextPage}
                                disabled={currentPage >= totalPages}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowNotes(!showNotes)}
                        >
                            <Quote className="w-4 h-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowSettings(!showSettings)}
                        >
                            <Settings className="w-4 h-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleFullscreen}
                        >
                            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="px-6 pb-2">
                    <Progress value={progress} className="h-1" />
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="pt-24 pb-12">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        ref={contentRef}
                        className="prose prose-lg max-w-none"
                        style={{
                            fontSize: `${settings.fontSize}px`,
                            fontFamily: settings.fontFamily === 'serif' ? 'Georgia, serif' :
                                settings.fontFamily === 'sans' ? 'Inter, sans-serif' :
                                    'Monaco, monospace',
                            lineHeight: settings.lineHeight,
                            textAlign: settings.textAlign,
                            backgroundColor: settings.backgroundColor,
                            color: settings.textColor,
                            padding: '2rem',
                            borderRadius: '0.5rem',
                            minHeight: '80vh'
                        }}
                        onMouseUp={handleTextSelection}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="whitespace-pre-line">
                            {bookContent}
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Text Selection Actions */}
            <AnimatePresence>
                {showTextActions && (
                    <motion.div
                        className="fixed z-50 bg-popover border rounded-lg shadow-lg p-2"
                        style={{
                            left: textActionPosition.x - 100,
                            top: textActionPosition.y - 60
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                    >
                        <div className="flex gap-1">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => addHighlight('yellow')}
                                className="h-8 px-2"
                            >
                                <Highlighter className="w-4 h-4 text-yellow-500" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => addHighlight('blue')}
                                className="h-8 px-2"
                            >
                                <Highlighter className="w-4 h-4 text-blue-500" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => addHighlight('green')}
                                className="h-8 px-2"
                            >
                                <Highlighter className="w-4 h-4 text-green-500" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setShowTextActions(false)}
                                className="h-8 px-2"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Settings Panel */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        className="fixed right-6 top-24 z-40 w-80"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 100, opacity: 0 }}
                    >
                        <Card className="bg-card/95 backdrop-blur-sm">
                            <CardContent className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Reading Settings</h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowSettings(false)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Font Size</label>
                                        <Slider
                                            value={[settings.fontSize]}
                                            onValueChange={([value]) => updateSetting('fontSize', value)}
                                            min={12}
                                            max={32}
                                            step={1}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                            <span>12px</span>
                                            <span>{settings.fontSize}px</span>
                                            <span>32px</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Font Family</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['serif', 'sans', 'mono'].map((font) => (
                                                <Button
                                                    key={font}
                                                    variant={settings.fontFamily === font ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => updateSetting('fontFamily', font)}
                                                    className="text-xs"
                                                >
                                                    {font === 'serif' ? 'Aa' : font === 'sans' ? 'Aa' : 'Aa'}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Line Height</label>
                                        <Slider
                                            value={[settings.lineHeight]}
                                            onValueChange={([value]) => updateSetting('lineHeight', value)}
                                            min={1.2}
                                            max={2.0}
                                            step={0.1}
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Text Alignment</label>
                                        <div className="flex gap-2">
                                            {[
                                                { value: 'left', icon: AlignLeft },
                                                { value: 'center', icon: AlignCenter },
                                                { value: 'justify', icon: AlignJustify }
                                            ].map(({ value, icon: Icon }) => (
                                                <Button
                                                    key={value}
                                                    variant={settings.textAlign === value ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => updateSetting('textAlign', value)}
                                                >
                                                    <Icon className="w-4 h-4" />
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Theme Presets</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {presetThemes.map((preset) => (
                                                <Button
                                                    key={preset.name}
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        updateSetting('backgroundColor', preset.bg)
                                                        updateSetting('textColor', preset.text)
                                                    }}
                                                    className="text-xs h-8"
                                                >
                                                    {preset.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Read Aloud</span>
                                        <Switch
                                            checked={settings.readAloud}
                                            onCheckedChange={(checked) => updateSetting('readAloud', checked)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Auto Scroll</span>
                                        <Switch
                                            checked={settings.autoScroll}
                                            onCheckedChange={(checked) => updateSetting('autoScroll', checked)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Notes Panel */}
            <AnimatePresence>
                {showNotes && (
                    <motion.div
                        className="fixed left-6 top-24 z-40 w-80"
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                    >
                        <Card className="bg-card/95 backdrop-blur-sm">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Notes & Highlights</h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowNotes(false)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    <Textarea
                                        placeholder="Add a note..."
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        className="min-h-20"
                                    />
                                    <Button onClick={addNote} size="sm" className="w-full">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Note
                                    </Button>
                                </div>

                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {notes.map((note) => (
                                        <div
                                            key={note.id}
                                            className={`p-3 rounded-lg border text-sm ${note.isHighlight
                                                    ? `bg-${note.color}-50 border-${note.color}-200`
                                                    : 'bg-card/50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                {note.isHighlight && <Highlighter className="w-3 h-3" />}
                                                <span className="text-xs text-muted-foreground">
                                                    Page {note.pageNumber}
                                                </span>
                                            </div>
                                            <p>{note.content}</p>
                                        </div>
                                    ))}

                                    {notes.length === 0 && (
                                        <div className="text-center text-muted-foreground py-8">
                                            <Quote className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">No notes yet</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
                <Card className="bg-card/95 backdrop-blur-sm">
                    <CardContent className="p-3">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={prevPage}
                                disabled={currentPage <= 1}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>

                            <div className="flex items-center gap-2 min-w-32">
                                <BookOpen className="w-4 h-4" />
                                <span className="text-sm">
                                    {currentPage} of {totalPages}
                                </span>
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={nextPage}
                                disabled={currentPage >= totalPages}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}