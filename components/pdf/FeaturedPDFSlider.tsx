"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Sparkles, ArrowLeft, ArrowRight, BookOpen, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

interface ApiPdfRow {
    id: string
    filename: string
    ai_summary?: string | null
    summary?: string | null
    upload_date?: string | null
    created_at?: string | null
    total_pages?: number | null
    pages?: number | null
}

interface FeaturedPdf {
    id: string
    title: string
    summary: string
    uploadDate: string
    pages: number
}

const ANIMATION_DURATION = 0.5
const ROTATION_INTERVAL = 6000

function formatDate(date: string) {
    try {
        return new Date(date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric"
        })
    } catch {
        return date
    }
}

export function FeaturedPDFSlider() {
    const [featuredPdfs, setFeaturedPdfs] = useState<FeaturedPdf[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        let isMounted = true

        async function fetchFeaturedPdfs() {
            setIsLoading(true)
            try {
                const res = await fetch("/api/pdf/upload", { cache: "no-store" })
                if (!res.ok) {
                    throw new Error(`Failed to fetch PDFs: ${res.status}`)
                }
                const raw: ApiPdfRow[] = await res.json()
                if (!isMounted) return

                const mapped: FeaturedPdf[] = (raw || [])
                    .sort((a, b) => new Date(b.upload_date || b.created_at || 0).getTime() - new Date(a.upload_date || a.created_at || 0).getTime())
                    .slice(0, 6)
                    .map((pdf) => ({
                        id: pdf.id,
                        title: pdf.filename,
                        summary: (pdf.ai_summary || pdf.summary || "No AI summary available yet.").trim(),
                        uploadDate: pdf.upload_date || pdf.created_at || new Date().toISOString(),
                        pages: pdf.total_pages || pdf.pages || 1
                    }))

                setFeaturedPdfs(mapped)
                setCurrentIndex(0)
            } catch (error) {
                console.error(error)
                if (isMounted) {
                    setFeaturedPdfs([])
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        fetchFeaturedPdfs()

        const handlePdfUpdate: EventListener = () => {
            void fetchFeaturedPdfs()
        }

        window.addEventListener("pdfs:updated", handlePdfUpdate)

        return () => {
            isMounted = false
            window.removeEventListener("pdfs:updated", handlePdfUpdate)
        }
    }, [])

    useEffect(() => {
        if (featuredPdfs.length <= 1 || isPaused) return

        const timer = window.setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % featuredPdfs.length)
        }, ROTATION_INTERVAL)

        return () => window.clearInterval(timer)
    }, [featuredPdfs.length, isPaused])

    const currentPdf = useMemo(() => featuredPdfs[currentIndex], [featuredPdfs, currentIndex])

    const showControls = featuredPdfs.length > 1

    const goTo = (direction: -1 | 1) => {
        if (!featuredPdfs.length) return
        setCurrentIndex((prev) => {
            const next = (prev + direction + featuredPdfs.length) % featuredPdfs.length
            return next
        })
    }

    const handleReadNow = () => {
        if (!currentPdf) return
        router.push(`/library/${currentPdf.id}`)
    }

    return (
        <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-background via-background/80 to-muted/40 p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Featured PDFs</p>
                        <h2 className="text-2xl font-semibold text-foreground">What readers are exploring right now</h2>
                    </div>
                </div>
                {featuredPdfs.length > 0 && (
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/library">View Library</Link>
                    </Button>
                )}
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <Card key={index} className="border-0 bg-card/40 backdrop-blur">
                            <CardContent className="space-y-4 p-6">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-9 w-28" />
                                    <Skeleton className="h-9 w-24" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : featuredPdfs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/60 bg-background/60 p-10 text-center">
                    <p className="text-lg font-medium text-foreground">Upload a PDF to see it featured here.</p>
                    <p className="mt-2 text-sm text-muted-foreground">Your latest uploads will appear with AI-powered highlights.</p>
                </div>
            ) : (
                <div
                    className="relative"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <AnimatePresence initial={false} mode="wait">
                        {currentPdf && (
                            <motion.div
                                key={currentPdf.id}
                                initial={{ opacity: 0, scale: 0.98, x: 20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.98, x: -20 }}
                                transition={{ duration: ANIMATION_DURATION, ease: "easeInOut" }}
                            >
                                <Card className="border-none bg-card/70 backdrop-blur-lg">
                                    <CardContent className="grid gap-6 p-6 sm:grid-cols-[1fr,280px]">
                                        <div className="space-y-5">
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                                                        Latest upload
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs">
                                                        <Clock className="mr-1 h-3 w-3" />
                                                        {formatDate(currentPdf.uploadDate)}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs">
                                                        {currentPdf.pages} pages
                                                    </Badge>
                                                </div>
                                                <h3 className="text-xl font-semibold leading-tight text-foreground sm:text-2xl">
                                                    {currentPdf.title}
                                                </h3>
                                            </div>
                                            <p className="text-sm leading-relaxed text-muted-foreground">
                                                {currentPdf.summary.length > 420
                                                    ? `${currentPdf.summary.slice(0, 420)}…`
                                                    : currentPdf.summary}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <Button size="sm" onClick={handleReadNow}>
                                                    <BookOpen className="mr-2 h-4 w-4" />
                                                    Read now
                                                </Button>
                                                <Button size="sm" variant="outline" asChild>
                                                    <Link href={`/library/${currentPdf.id}`}>View details</Link>
                                                </Button>
                                            </div>
                                        </div>

                                        {featuredPdfs.length > 1 && (
                                            <div className="relative hidden sm:block">
                                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
                                                <div className="relative flex h-full flex-col justify-between rounded-2xl border border-border/60 bg-background/80 p-6">
                                                    <div>
                                                        <p className="text-xs uppercase tracking-widest text-muted-foreground/80">
                                                            Up next
                                                        </p>
                                                        <ul className="mt-4 space-y-3 text-sm">
                                                            {featuredPdfs.map((pdf, idx) => (
                                                                <li
                                                                    key={pdf.id}
                                                                    className={`cursor-pointer rounded-lg border px-3 py-2 transition-all ${idx === currentIndex
                                                                            ? "border-primary bg-primary/5 text-primary"
                                                                            : "border-transparent bg-background/60 hover:border-border"
                                                                        }`}
                                                                    onClick={() => setCurrentIndex(idx)}
                                                                >
                                                                    <p className="font-medium line-clamp-1">{pdf.title}</p>
                                                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                                                        {formatDate(pdf.uploadDate)}
                                                                    </p>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <span>{currentIndex + 1}</span>
                                                        <span className="h-px flex-1 bg-border" />
                                                        <span>{featuredPdfs.length}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {showControls && (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2">
                            <Button
                                size="icon"
                                variant="outline"
                                className="pointer-events-auto rounded-full bg-background/80 shadow-md backdrop-blur"
                                onClick={() => goTo(-1)}
                                aria-label="Previous featured PDF"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant="outline"
                                className="pointer-events-auto rounded-full bg-background/80 shadow-md backdrop-blur"
                                onClick={() => goTo(1)}
                                aria-label="Next featured PDF"
                            >
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </section>
    )
}

export default FeaturedPDFSlider
