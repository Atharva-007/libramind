import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import Image from "next/image"
import { LogProgressForm } from "@/components/log-progress-form"
import { SocialShare } from "@/components/social-share"
import { Progress } from "@/components/ui/progress"

interface BookDetailPageProps {
  params: {
    bookId: string
  }
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { bookId } = params
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <p>Please log in to view book details.</p>
  }

  // Fetch book details from Google Books API
  const bookResponse = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/books/search?q=id:${bookId}`)
  const bookData = await bookResponse.json()
  const book = bookData.items?.[0]?.volumeInfo

  if (!book) {
    return <p>Book not found.</p>
  }

  // Fetch user's reading progress for this book
  const progressResponse = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/reading-progress/${bookId}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  })
  const progressData = await progressResponse.json()
  const readingProgress = progressData

  const pagesRead = readingProgress?.pages_read || 0
  const totalPages = readingProgress?.total_pages || book.pageCount || 0
  const progressPercentage = totalPages > 0 ? (pagesRead / totalPages) * 100 : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <Image
            src={book.imageLinks?.thumbnail || "/abstract-book-cover.png"}
            alt={book.title}
            width={200}
            height={300}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-2/3 space-y-4">
          <h1 className="text-4xl font-bold text-primary">{book.title}</h1>
          <h2 className="text-xl text-muted-foreground">by {book.authors?.join(", ")}</h2>
          <p className="text-lg">{book.description}</p>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Progress:</span>
            <Progress value={progressPercentage} className="w-full max-w-xs" />
            <span className="text-sm">{`${pagesRead} / ${totalPages} pages (${progressPercentage.toFixed(0)}%)`}</span>
          </div>
          <LogProgressForm bookId={bookId} initialPagesRead={pagesRead} initialTotalPages={totalPages} />
          <SocialShare
            title={`I'm reading "${book.title}" by ${book.authors?.join(", ")}!`}
            url={`${process.env.NEXT_PUBLIC_VERCEL_URL}/books/${bookId}`}
          />
        </div>
      </div>
    </div>
  )
}
