"use client"

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { FileText, BookOpen, Brain, Clock, RefreshCcw, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ModernNavigation } from '@/components/navigation/modern-navigation'

type ApiPdfRow = {
    id: string
    filename: string
    total_pages?: number
    pages?: number
    content?: string
    ai_summary?: string
    upload_date?: string
    created_at?: string
}

type LibraryPDF = {
    id: string
    filename: string
    pages: number
    summary: string
    uploadedAt: string
}

export default function LibraryPage() {
    const router = useRouter()
    const [pdfs, setPdfs] = useState<LibraryPDF[]>([])
    const [loading, setLoading] = useState(true)
    const [query, setQuery] = useState('')

    const fetchPdfs = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/pdf/upload', { method: 'GET' })
            if (!res.ok) {
                console.error('Failed to fetch PDFs:', await res.text())
                setPdfs([])
                return
            }
            const rows: ApiPdfRow[] = await res.json()
            const mapped: LibraryPDF[] = (rows || []).map(r => ({
                id: r.id,
                filename: r.filename,
                pages: r.total_pages ?? r.pages ?? 1,
                summary: r.ai_summary || '',
                uploadedAt: r.upload_date || r.created_at || new Date().toISOString(),
            }))
            setPdfs(mapped)
        } catch (e) {
            console.error('Error loading PDFs:', e)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchPdfs()
    }, [fetchPdfs])

    const filtered = pdfs.filter(p =>
        p.filename.toLowerCase().includes(query.toLowerCase()) ||
        p.summary.toLowerCase().includes(query.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-background">
            <ModernNavigation />
            <main className="pt-20 pb-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <h1 className="text-3xl font-bold">My PDF Library</h1>
                            <p className="text-muted-foreground">
                                Your uploaded documents, ready to read and search
                            </p>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search PDFs..."
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Button variant="outline" onClick={fetchPdfs} title="Refresh">
                                <RefreshCcw className="h-4 w-4" />
                            </Button>
                            <Button asChild>
                                <Link href="/reader">Upload</Link>
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
                            />
                        </div>
                    ) : filtered.length === 0 ? (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                                <h3 className="text-lg font-semibold mb-1">No PDFs found</h3>
                                <p className="text-muted-foreground mb-4">Try uploading a PDF or adjusting your search</p>
                                <Button asChild>
                                    <Link href="/reader">Upload a PDF</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            <AnimatePresence>
                                {filtered.map((pdf, idx) => (
                                    <motion.div
                                        key={pdf.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                    >
                                        <Card className="h-full hover:shadow-lg transition-shadow">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-base line-clamp-2 flex items-start gap-2">
                                                    <FileText className="h-4 w-4 mt-0.5 text-primary" />
                                                    <span title={pdf.filename}>{pdf.filename}</span>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {pdf.pages} pages
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs">
                                                        <Clock className="h-3 w-3 mr-1" />
                                                        {new Date(pdf.uploadedAt).toLocaleDateString()}
                                                    </Badge>
                                                </div>
                                                {pdf.summary && (
                                                    <div>
                                                        <div className="flex items-center gap-1 text-xs font-medium text-primary mb-1">
                                                            <Brain className="h-3 w-3" /> AI Summary
                                                        </div>
                                                        <p className="text-sm text-muted-foreground line-clamp-3">{pdf.summary}</p>
                                                    </div>
                                                )}
                                                <div className="flex gap-2 pt-1">
                                                    <Button asChild className="flex-1">
                                                        <Link href={`/library/${pdf.id}`}>
                                                            <BookOpen className="h-4 w-4 mr-1" /> Read
                                                        </Link>
                                                    </Button>
                                                    <Button variant="outline" className="flex-1" onClick={() => router.push(`/library/${pdf.id}`)}>
                                                        Details
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
