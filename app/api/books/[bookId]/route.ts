import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { bookId: string } }) {
    const { bookId } = params

    // Enhanced mock book details
    const mockBookDetails: { [key: string]: any } = {
        "1": {
            id: "1",
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            coverImageUrl: "/the-great-gatsby-cover.jpg",
            description: "A classic American novel set in the Jazz Age that explores themes of decadence, idealism, resistance to change, social upheaval, and excess, creating a portrait of the Roaring Twenties that has been described as a cautionary tale regarding the American Dream.",
            totalPages: 180,
            genre: "Fiction",
            publishedDate: "1925-04-10",
            isbn: "978-0-7432-7356-5",
            publisher: "Scribner",
            averageRating: 4.2,
            content: "In my younger and more vulnerable years my father gave me some advice that I've carried with me ever since. 'Whenever you feel like criticizing anyone,' he told me, 'just remember that all the people in this world haven't had the advantages that you've had.'"
        },
        "2": {
            id: "2",
            title: "To Kill a Mockingbird",
            author: "Harper Lee",
            coverImageUrl: "/to-kill-a-mockingbird-cover.jpg",
            description: "A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice, viewed through the eyes of a young girl.",
            totalPages: 324,
            genre: "Fiction",
            publishedDate: "1960-07-11",
            isbn: "978-0-06-112008-4",
            publisher: "J.B. Lippincott & Co.",
            averageRating: 4.5,
            content: "When I was almost six and Jem was nearly ten, our summertime boundaries (within calling distance of Calpurnia) were Mrs. Henry Lafayette Dubose's house two doors to the north of us, and the Radley Place three doors to the south."
        },
        "3": {
            id: "3",
            title: "1984",
            author: "George Orwell",
            coverImageUrl: "/placeholder.jpg",
            description: "A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism, mass surveillance, and repressive regimentation of all persons and behaviors within society.",
            totalPages: 328,
            genre: "Science Fiction",
            publishedDate: "1949-06-08",
            isbn: "978-0-452-28423-4",
            publisher: "Secker & Warburg",
            averageRating: 4.6,
            content: "It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions, though not quickly enough to prevent a swirl of gritty dust from entering along with him."
        },
        "4": {
            id: "4",
            title: "Pride and Prejudice",
            author: "Jane Austen",
            coverImageUrl: "/pride-and-prejudice-cover.jpg",
            description: "A romantic novel of manners that follows the character development of Elizabeth Bennet, the protagonist of the book, who learns about the repercussions of hasty judgments and comes to appreciate the difference between superficial goodness and actual goodness.",
            totalPages: 432,
            genre: "Romance",
            publishedDate: "1813-01-28",
            isbn: "978-0-14-143951-8",
            publisher: "T. Egerton",
            averageRating: 4.3,
            content: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife."
        },
        "5": {
            id: "5",
            title: "The Hobbit",
            author: "J.R.R. Tolkien",
            coverImageUrl: "/the-hobbit-cover.jpg",
            description: "A fantasy adventure novel that follows the quest of home-loving Bilbo Baggins, a hobbit, to win treasure guarded by the dragon Smaug.",
            totalPages: 310,
            genre: "Fantasy",
            publishedDate: "1937-09-21",
            isbn: "978-0-547-92822-7",
            publisher: "George Allen & Unwin",
            averageRating: 4.4,
            content: "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a hobbit-hole, and that means comfort."
        },
        "6": {
            id: "6",
            title: "Dune",
            author: "Frank Herbert",
            coverImageUrl: "/dune-cover.jpg",
            description: "A science fiction epic set in the distant future amidst a feudal interstellar society in which various noble houses control planetary fiefs.",
            totalPages: 688,
            genre: "Science Fiction",
            publishedDate: "1965-08-01",
            isbn: "978-0-441-17271-9",
            publisher: "Chilton Books",
            averageRating: 4.7,
            content: "A beginning is the time for taking the most delicate care that the balances are correct. This every sister of the Bene Gesserit knows."
        }
    }

    const book = mockBookDetails[bookId]

    if (!book) {
        return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    // Get user-specific data if authenticated
    const supabase = createServerClient()
    let userBookData = {}

    if (supabase) {
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            // Check if bookmarked
            const { data: bookmarkData } = await supabase
                .from("bookmarks")
                .select("*")
                .eq("user_id", user.id)
                .eq("book_id", bookId)
                .single()

            // Get reading progress
            const { data: progressData } = await supabase
                .from("reading_progress")
                .select("*")
                .eq("user_id", user.id)
                .eq("book_id", bookId)
                .single()

            userBookData = {
                isBookmarked: !!bookmarkData,
                readingProgress: progressData ? {
                    pagesRead: progressData.pages_read,
                    totalPages: progressData.total_pages,
                    lastReadDate: progressData.last_read_date,
                    progressPercentage: Math.round((progressData.pages_read / progressData.total_pages) * 100)
                } : null
            }
        }
    }

    return NextResponse.json({
        ...book,
        ...userBookData
    })
}