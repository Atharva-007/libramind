export interface LibraryBook {
    id: number
    title: string
    author: string
    progress: number
    totalPages: number
    currentPage: number
    uploadDate: string
    tags: string[]
    summary: string
    readingTime: string
    highlights: number
    notes: number
    coverImageUrl?: string
}
