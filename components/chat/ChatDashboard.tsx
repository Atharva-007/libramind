'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Send, Bot, User, Book, FileText, File } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast'

interface Message {
    id: string
    content: string
    sender: 'user' | 'ai'
    timestamp: Date
    type: 'text' | 'summary' | 'book-recommendation'
}

interface ChatSession {
    id: string
    title: string
    lastMessage: string
    timestamp: Date
    unreadCount: number
}

type ChatMessageRow = {
    id: string
    content: string | null
    sender: 'user' | 'ai' | null
    created_at: string | null
    message_type: string | null
}

type ChatSessionRow = {
    id: string
    title: string | null
    last_message: string | null
    updated_at: string | null
    unread_count: number | null
}
export default function ChatDashboard() {
    const { user } = useUser()
    const [messages, setMessages] = useState<Message[]>([])
    const [inputMessage, setInputMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
    const [activeChatId, setActiveChatId] = useState<string | null>(null)
    const [pdfs, setPdfs] = useState<{ id: string; filename: string }[]>([])
    const [selectedPdfId, setSelectedPdfId] = useState<string | 'none'>('none')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()
    const { toast } = useToast()
    const didInitContextRef = useRef(false)

    const selectedPdfName = useMemo(() => {
        if (selectedPdfId === 'none') return null
        return pdfs.find(p => p.id === selectedPdfId)?.filename ?? null
    }, [pdfs, selectedPdfId])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const loadMessages = useCallback(async (chatId: string) => {
        try {
            const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('chat_session_id', chatId)
                .order('created_at', { ascending: true })

            if (error) throw error
            const rows = (data ?? []) as ChatMessageRow[]
            const normalized = rows.map((row) => ({
                id: row.id,
                content: row.content ?? '',
                sender: row.sender === 'ai' ? 'ai' : 'user',
                timestamp: row.created_at ? new Date(row.created_at) : new Date(),
                type: (row.message_type as Message['type']) || 'text'
            }))
            setMessages(normalized)
        } catch (error) {
            console.error('Error loading messages:', error)
        }
    }, [supabase])

    const loadChatSessions = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('chat_sessions')
                .select('*')
                .eq('user_id', user?.id)
                .order('updated_at', { ascending: false })

            if (error) throw error
            const rows = (data ?? []) as ChatSessionRow[]
            const normalized = rows.map((row) => ({
                id: row.id,
                title: row.title ?? 'New Chat',
                lastMessage: row.last_message ?? '',
                timestamp: row.updated_at ? new Date(row.updated_at) : new Date(),
                unreadCount: row.unread_count ?? 0
            }))
            setChatSessions(normalized)

            if (normalized.length > 0 && !activeChatId) {
                setActiveChatId(normalized[0].id)
                loadMessages(normalized[0].id)
            }
        } catch (error) {
            console.error('Error loading chat sessions:', error)
        }
    }, [user?.id, activeChatId, loadMessages, supabase])

    useEffect(() => {
        if (user) {
            loadChatSessions()
            loadUserPdfs()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, loadChatSessions])
    const loadUserPdfs = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('user_pdfs')
                .select('id, filename')
                .eq('user_id', user?.id)
                .order('upload_date', { ascending: false })
                .limit(50)

            if (error) throw error
            const list = data || []
            setPdfs(list)
            // Auto-select most recent PDF if none selected yet
            if (selectedPdfId === 'none' && list.length > 0) {
                setSelectedPdfId(list[0].id)
            }
        } catch (error) {
            console.error('Error loading PDFs:', error)
        }
    }, [supabase, user?.id, selectedPdfId])

    useEffect(() => {
        const handler = (e: Event) => {
            // Refresh list and, if a new PDF id is provided, select it
            loadUserPdfs()
            const ce = e as CustomEvent<{ id?: string }>
            if (ce.detail?.id) {
                setSelectedPdfId(ce.detail.id)
            }
        }
        window.addEventListener('pdfs:updated', handler as EventListener)
        return () => window.removeEventListener('pdfs:updated', handler as EventListener)
    }, [loadUserPdfs])

    // Notify user when the chat context changes (after initial mount)
    useEffect(() => {
        if (!didInitContextRef.current) {
            // Skip the first render to avoid noisy toast on initial load
            didInitContextRef.current = true
            return
        }
        if (selectedPdfId === 'none') {
            toast({
                title: 'No PDF context',
                description: 'You are chatting without a PDF context.',
            })
        } else if (selectedPdfName) {
            toast({
                title: 'Context updated',
                description: `Using: ${selectedPdfName}`,
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPdfId, selectedPdfName])

    const sendMessage = async () => {
        if (!inputMessage.trim() || !user || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            content: inputMessage,
            sender: 'user',
            timestamp: new Date(),
            type: 'text'
        }

        setMessages(prev => [...prev, userMessage])
        setInputMessage('')
        setIsLoading(true)

        try {
            let chatIdToUse = activeChatId
            if (!chatIdToUse) {
                const { data: newChat, error: newChatError } = await supabase
                    .from('chat_sessions')
                    .insert({
                        user_id: user.id,
                        title: 'New Chat',
                        last_message: '',
                        unread_count: 0
                    })
                    .select()
                    .single()

                if (newChatError) throw newChatError
                chatIdToUse = newChat.id
                setActiveChatId(chatIdToUse)
            }

            // Save user message to database
            await supabase
                .from('chat_messages')
                .insert({
                    chat_session_id: chatIdToUse,
                    content: inputMessage,
                    sender: 'user',
                    message_type: 'text'
                })

            // Send to AI for response
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: inputMessage,
                    chatId: chatIdToUse,
                    userId: user.id,
                    pdfId: selectedPdfId !== 'none' ? selectedPdfId : undefined
                }),
            })

            if (!response.ok) throw new Error('Failed to get AI response')

            const data = await response.json()

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: data.response,
                sender: 'ai',
                timestamp: new Date(),
                type: data.type || 'text'
            }

            setMessages(prev => [...prev, aiMessage])

            // Save AI response to database
            await supabase
                .from('chat_messages')
                .insert({
                    chat_session_id: chatIdToUse,
                    content: data.response,
                    sender: 'ai',
                    message_type: data.type || 'text'
                })

        } catch (error) {
            console.error('Error sending message:', error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: 'Sorry, I encountered an error. Please try again.',
                sender: 'ai',
                timestamp: new Date(),
                type: 'text'
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const createNewChat = async () => {
        if (!user) return

        try {
            const { data, error } = await supabase
                .from('chat_sessions')
                .insert({
                    user_id: user.id,
                    title: 'New Chat',
                    last_message: '',
                    unread_count: 0
                })
                .select()
                .single()

            if (error) throw error

            setActiveChatId(data.id)
            setMessages([])
            loadChatSessions()
        } catch (error) {
            console.error('Error creating new chat:', error)
        }
    }

    const getMessageIcon = (type: string) => {
        switch (type) {
            case 'summary':
                return <FileText className="w-4 h-4" />
            case 'book-recommendation':
                return <Book className="w-4 h-4" />
            default:
                return <MessageCircle className="w-4 h-4" />
        }
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            {/* Chat Sessions Sidebar */}
            <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col"
            >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <MessageCircle className="w-6 h-6 text-blue-600" />
                            Chat Dashboard
                        </h2>
                        <Button onClick={createNewChat} size="sm" variant="outline">
                            New Chat
                        </Button>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-2">
                        {chatSessions.map((session) => (
                            <motion.div
                                key={session.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    setActiveChatId(session.id)
                                    loadMessages(session.id)
                                }}
                                className={`p-3 rounded-lg cursor-pointer mb-2 transition-colors ${activeChatId === session.id
                                    ? 'bg-blue-100 dark:bg-blue-900 border-blue-300'
                                    : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                                        {session.title}
                                    </h3>
                                    {session.unreadCount > 0 && (
                                        <Badge variant="secondary" className="ml-2">
                                            {session.unreadCount}
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-1">
                                    {session.lastMessage}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                    {new Date(session.timestamp).toLocaleDateString()}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </ScrollArea>
            </motion.div>

            {/* Chat Interface */}
            <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src="/bot-avatar.png" />
                                <AvatarFallback>
                                    <Bot className="w-6 h-6" />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    LibraMind AI Assistant
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Always ready to help with your reading journey
                                </p>
                                <div className="mt-1 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                    <File className="w-3 h-3" />
                                    {selectedPdfName ? (
                                        <span>
                                            Using context: <span className="font-medium text-gray-800 dark:text-gray-200">{selectedPdfName}</span>
                                        </span>
                                    ) : (
                                        <span>No PDF context</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="mt-1 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                    <File className="w-3 h-3" />
                                    {selectedPdfName ? (
                                        <span>
                                            Using context: <span className="font-medium text-gray-800 dark:text-gray-200">{selectedPdfName}</span>
                                        </span>
                                    ) : (
                                        <span>No PDF context</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <File className="w-4 h-4 text-muted-foreground" />
                                <Select value={selectedPdfId} onValueChange={(v) => setSelectedPdfId(v as 'none' | string)}>
                                    <SelectTrigger className="min-w-[220px]">
                                        <SelectValue placeholder="Chat context (optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">No PDF context</SelectItem>
                                        {pdfs.map(p => (
                                            <SelectItem key={p.id} value={p.id}>{p.filename}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Badge variant="outline" className="text-green-600 border-green-300">
                                Online
                            </Badge>
                        </div>
                    </div>
                </motion.div>

                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4">
                    <AnimatePresence>
                        {messages.map((message, index) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                            >
                                <div className={`flex items-start gap-3 max-w-[70%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                                    }`}>
                                    <Avatar className="w-8 h-8">
                                        {message.sender === 'user' ? (
                                            <AvatarFallback>
                                                <User className="w-5 h-5" />
                                            </AvatarFallback>
                                        ) : (
                                            <AvatarFallback>
                                                <Bot className="w-5 h-5" />
                                            </AvatarFallback>
                                        )}
                                    </Avatar>

                                    <div className={`rounded-lg p-3 ${message.sender === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                                        }`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            {message.sender === 'ai' && getMessageIcon(message.type)}
                                            <span className="text-xs opacity-70">
                                                {message.timestamp.toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <p className="text-sm leading-relaxed">{message.content}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start mb-4"
                        >
                            <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8">
                                    <AvatarFallback>
                                        <Bot className="w-5 h-5" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </ScrollArea>

                {/* Message Input */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4"
                >
                    <div className="flex gap-3">
                        <Input
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                            placeholder="Ask me about books, request summaries, or chat about anything..."
                            className="flex-1"
                            disabled={isLoading}
                        />
                        <Button
                            onClick={sendMessage}
                            disabled={!inputMessage.trim() || isLoading}
                            className="px-6"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                        AI can help with book recommendations, PDF summaries, reading progress, and more
                    </p>
                </motion.div>
            </div>
        </div>
    )
}