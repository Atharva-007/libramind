import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ReadingList() {
  const books = [
    { id: 1, title: "The Hitchhiker's Guide to the Galaxy", author: "Douglas Adams" },
    { id: 2, title: "Pride and Prejudice", author: "Jane Austen" },
    { id: 3, title: "1984", author: "George Orwell" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Reading List</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {books.map((book) => (
            <li key={book.id} className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{book.title}</h3>
                <p className="text-muted-foreground text-sm">{book.author}</p>
              </div>
              <Button variant="outline" size="sm">
                Read
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
