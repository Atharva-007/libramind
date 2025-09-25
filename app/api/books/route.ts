import { NextResponse } from "next/server"

// Mock book data for demonstration
const mockBooks = [
    {
        id: "1",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        coverImageUrl: "/the-great-gatsby-cover.jpg",
        description: "A classic American novel about the Jazz Age and the American Dream.",
        totalPages: 180,
        genre: "Fiction"
    },
    {
        id: "2",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        coverImageUrl: "/to-kill-a-mockingbird-cover.jpg",
        description: "A gripping tale of racial injustice and childhood innocence.",
        totalPages: 324,
        genre: "Fiction"
    },
    {
        id: "3",
        title: "1984",
        author: "George Orwell",
        coverImageUrl: "/placeholder.jpg",
        description: "A dystopian social science fiction novel about totalitarian control.",
        totalPages: 328,
        genre: "Science Fiction"
    },
    {
        id: "4",
        title: "Pride and Prejudice",
        author: "Jane Austen",
        coverImageUrl: "/pride-and-prejudice-cover.jpg",
        description: "A romantic novel about manners, upbringing, morality, and marriage.",
        totalPages: 432,
        genre: "Romance"
    },
    {
        id: "5",
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        coverImageUrl: "/the-hobbit-cover.jpg",
        description: "A fantasy adventure about a hobbit's unexpected journey.",
        totalPages: 310,
        genre: "Fantasy"
    },
    {
        id: "6",
        title: "Dune",
        author: "Frank Herbert",
        coverImageUrl: "/dune-cover.jpg",
        description: "A science fiction epic set on the desert planet Arrakis.",
        totalPages: 688,
        genre: "Science Fiction"
    },
    {
        id: "7",
        title: "Foundation",
        author: "Isaac Asimov",
        coverImageUrl: "/foundation-cover.jpg",
        description: "The first novel in the Foundation series about galactic empire.",
        totalPages: 244,
        genre: "Science Fiction"
    },
    {
        id: "8",
        title: "Neuromancer",
        author: "William Gibson",
        coverImageUrl: "/neuromancer-cover.jpg",
        description: "A pioneering cyberpunk novel about hackers and artificial intelligence.",
        totalPages: 271,
        genre: "Science Fiction"
    }
]

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")
    const category = searchParams.get("category")

    let filteredBooks = mockBooks

    // Filter by search query
    if (query) {
        const searchTerm = query.toLowerCase()
        filteredBooks = filteredBooks.filter(book =>
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.genre.toLowerCase().includes(searchTerm)
        )
    }

    // Filter by category/genre
    if (category && category !== "all") {
        filteredBooks = filteredBooks.filter(book =>
            book.genre.toLowerCase() === category.toLowerCase()
        )
    }

    return NextResponse.json(filteredBooks, { status: 200 })
}