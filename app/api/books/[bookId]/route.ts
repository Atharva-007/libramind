import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { bookId: string } }) {
    const { bookId } = params

    // Mock book details for demonstration
    const mockBookDetails = {
        "1": {
            id: "1",
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            coverImageUrl: "/the-great-gatsby-cover.jpg",
            description: "A classic American novel about the Jazz Age and the American Dream. Set in the summer of 1922, it tells the story of Jay Gatsby's pursuit of the American Dream and his obsession with Daisy Buchanan.",
            totalPages: 180,
            genre: "Fiction",
            publishedDate: "1925-04-10",
            isbn: "9780743273565",
            publisher: "Scribner",
            averageRating: 4.2,
            content: "Chapter 1: In my younger and more vulnerable years my father gave me some advice..."
        },
        "2": {
            id: "2",
            title: "To Kill a Mockingbird",
            author: "Harper Lee",
            coverImageUrl: "/to-kill-a-mockingbird-cover.jpg",
            description: "A gripping tale of racial injustice and childhood innocence in the American South during the 1930s.",
            totalPages: 324,
            genre: "Fiction",
            publishedDate: "1960-07-11",
            isbn: "9780446310789",
            publisher: "J.B. Lippincott & Co.",
            averageRating: 4.5,
            content: "Chapter 1: When I was almost six and Jem was nearly ten..."
        }
    }

    const book = mockBookDetails[bookId as keyof typeof mockBookDetails]

    if (!book) {
        return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json(book, { status: 200 })
}