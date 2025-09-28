'use client'

<<<<<<< HEAD
import { useState, useCallback, useEffect } from 'react'
=======
import { useState, useCallback } from 'react'
>>>>>>> 0333f2e2cb2fb723e26e52b6fa545f3fcf439a49
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, FileText, Eye, Loader2, BookOpen, Brain, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from 'react-i18next'
import KindleReader from '../reader/KindleReader'

interface UploadedPDF {
    id: string
    filename: string
    pages: number
    content: string
    summary: string
    uploadDate: string
}

<<<<<<< HEAD
interface ApiPdfRow {
    id: string
    filename: string
    total_pages?: number
    pages?: number
    content?: string
    ai_summary?: string
    upload_date?: string
    created_at?: string
}

=======
>>>>>>> 0333f2e2cb2fb723e26e52b6fa545f3fcf439a49
export function PDFUploader() {
    const { t } = useTranslation()
    const [uploadedPDFs, setUploadedPDFs] = useState<UploadedPDF[]>([])
    const [selectedPDF, setSelectedPDF] = useState<UploadedPDF | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [showReader, setShowReader] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
<<<<<<< HEAD
    // Load existing PDFs from DB on mount
    const fetchPdfs = useCallback(async () => {
        try {
            const res = await fetch('/api/pdf/upload', { method: 'GET' })
            if (!res.ok) {
                console.error('Failed to fetch PDFs:', await res.text())
                return
            }
            const data: ApiPdfRow[] = await res.json()
            const mapped: UploadedPDF[] = (data || []).map((row: ApiPdfRow) => ({
                id: row.id,
                filename: row.filename,
                pages: row.total_pages ?? row.pages ?? 1,
                content: (row.content || '').slice(0, 1000),
                summary: row.ai_summary || '',
                uploadDate: row.upload_date || row.created_at || new Date().toISOString()
            }))
            setUploadedPDFs(mapped)
        } catch (e) {
            console.error('Error loading PDFs:', e)
        }
    }, [])

    useEffect(() => {
        fetchPdfs()
    }, [fetchPdfs])

=======
>>>>>>> 0333f2e2cb2fb723e26e52b6fa545f3fcf439a49



    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (!file || file.type !== 'application/pdf') {
            return
        }

        setIsUploading(true)
        setUploadProgress(0)

        try {
            const formData = new FormData()
            formData.append('pdf', file)

            // Simulate progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90))
            }, 200)

            const response = await fetch('/api/pdf/upload', {
                method: 'POST',
                body: formData,
            })

            clearInterval(progressInterval)
            setUploadProgress(100)

            if (response.ok) {
                const result = await response.json()
                const newPDF: UploadedPDF = {
                    id: result.id,
                    filename: result.filename,
                    pages: result.pages,
                    content: result.content,
                    summary: result.summary,
                    uploadDate: result.uploadDate
                }
                setUploadedPDFs(prev => [newPDF, ...prev])
<<<<<<< HEAD
                // notify other parts of the app (e.g., ChatDashboard) to refresh their PDF lists
                window.dispatchEvent(new CustomEvent('pdfs:updated', { detail: { id: result.id } }))
=======
>>>>>>> 0333f2e2cb2fb723e26e52b6fa545f3fcf439a49
            } else {
                throw new Error('Upload failed')
            }
        } catch (error) {
            console.error('Error uploading PDF:', error)
        } finally {
            setIsUploading(false)
            setUploadProgress(0)
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf']
        },
        maxFiles: 1
    })

    const openReader = (pdf: UploadedPDF) => {
        setSelectedPDF(pdf)
        setShowReader(true)
    }

    return (
        <div className="space-y-6">
            {/* Upload Zone */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        {t('pdf.upload.title', 'Upload PDF Documents')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
                            ? 'border-primary bg-primary/5'
                            : 'border-muted-foreground/25 hover:border-primary/50'
                            }`}
                    >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center gap-4">
                            <Upload className="h-12 w-12 text-muted-foreground" />
                            <div>
                                <p className="text-lg font-medium">
                                    {isDragActive
                                        ? t('pdf.upload.drop', 'Drop PDF here')
                                        : t('pdf.upload.dragDrop', 'Drag & drop PDF or click to browse')
                                    }
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {t('pdf.upload.supported', 'PDF files only, max 50MB')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {isUploading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-4 bg-primary/5 rounded-lg"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm font-medium">
                                    {t('pdf.upload.processing', 'Processing PDF and generating AI summary...')}
                                </span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                        </motion.div>
                    )}
                </CardContent>
            </Card>

            {/* PDF Library */}
            {uploadedPDFs.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            {t('pdf.library.title', 'My PDF Library')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
<<<<<<< HEAD
                        <div className="flex justify-end mb-3">
                            <Button size="sm" variant="outline" onClick={fetchPdfs}>
                                {t('pdf.library.refresh', 'Refresh')}
                            </Button>
                        </div>
=======
>>>>>>> 0333f2e2cb2fb723e26e52b6fa545f3fcf439a49
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <AnimatePresence>
                                {uploadedPDFs.map((pdf, index) => (
                                    <motion.div
                                        key={pdf.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                                            <CardContent className="p-4">
                                                <div className="flex items-start gap-3 mb-3">
                                                    <div className="p-2 bg-primary/10 rounded-lg">
                                                        <FileText className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-medium text-sm truncate">
                                                            {pdf.filename}
                                                        </h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge variant="secondary" className="text-xs">
                                                                {pdf.pages} pages
                                                            </Badge>
                                                            <Badge variant="outline" className="text-xs">
                                                                <Clock className="h-3 w-3 mr-1" />
                                                                {new Date(pdf.uploadDate).toLocaleDateString()}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* AI Summary Preview */}
                                                <div className="mb-4">
                                                    <div className="flex items-center gap-1 mb-2">
                                                        <Brain className="h-4 w-4 text-primary" />
                                                        <span className="text-xs font-medium text-primary">
                                                            {t('pdf.aiSummary', 'AI Summary')}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground line-clamp-3">
                                                        {pdf.summary}
                                                    </p>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => openReader(pdf)}
                                                        className="flex-1"
                                                    >
                                                        <BookOpen className="h-4 w-4 mr-1" />
                                                        {t('pdf.read', 'Read')}
                                                    </Button>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button size="sm" variant="outline">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-4xl max-h-[80vh]">
                                                            <DialogHeader>
                                                                <DialogTitle>{pdf.filename}</DialogTitle>
                                                            </DialogHeader>
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <h4 className="font-medium flex items-center gap-2 mb-2">
                                                                        <Brain className="h-4 w-4" />
                                                                        {t('pdf.fullSummary', 'Full AI Summary')}
                                                                    </h4>
                                                                    <Card>
                                                                        <CardContent className="p-4">
                                                                            <p className="text-sm leading-relaxed">
                                                                                {pdf.summary}
                                                                            </p>
                                                                        </CardContent>
                                                                    </Card>
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium mb-2">
                                                                        {t('pdf.content', 'Content Preview')}
                                                                    </h4>
                                                                    <ScrollArea className="h-64 rounded-md border p-4">
                                                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                                                            {pdf.content}
                                                                        </p>
                                                                    </ScrollArea>
                                                                </div>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Kindle Reader Modal */}
            {showReader && selectedPDF && (
                <Dialog open={showReader} onOpenChange={setShowReader}>
                    <DialogContent className="max-w-7xl max-h-[95vh] p-0 overflow-hidden">
                        <KindleReader
                            documentId={selectedPDF.id}
                            onClose={() => setShowReader(false)}
                        />
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}