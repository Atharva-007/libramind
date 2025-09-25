import { NextResponse } from "next/server"

interface GoogleBooksImageLinks {
  thumbnail?: string
}

interface GoogleBooksVolumeInfo {
  title?: string
  authors?: string[]
  imageLinks?: GoogleBooksImageLinks
}

interface GoogleBooksItem {
  id: string
  volumeInfo?: GoogleBooksVolumeInfo
}

interface GoogleBooksResponse {
  items?: GoogleBooksItem[]
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_BOOKS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "Google Books API key is not configured" }, { status: 500 })
  }

  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}&maxResults=20`)
    const data = (await response.json()) as GoogleBooksResponse

    const books = (Array.isArray(data.items) ? data.items : []).map((item) => {
      const volumeInfo = item.volumeInfo ?? {}
      const authors = Array.isArray(volumeInfo.authors) ? volumeInfo.authors : []

      return {
        id: item.id,
        title: volumeInfo.title ?? "Untitled",
        author: authors.length > 0 ? authors.join(", ") : "Unknown Author",
        coverImageUrl: volumeInfo.imageLinks?.thumbnail || "/abstract-book-cover.png",
      }
    })

    return NextResponse.json(books, { status: 200 })
  } catch (error) {
    console.error("Error fetching books from Google Books API:", error)
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 })
  }
}
