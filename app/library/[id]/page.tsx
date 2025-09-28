"use client"

import Link from 'next/link'
import KindleReader from '@/components/reader/KindleReader'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function LibraryReaderPage({ params }: { params: { id: string } }) {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <Button asChild variant="ghost" size="sm" className="mb-2">
                    <Link href="/library">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Library
                    </Link>
                </Button>
            </div>
            <KindleReader documentId={params.id} />
        </div>
    )
}
