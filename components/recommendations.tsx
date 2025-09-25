import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function Recommendations() {
  const recommendedBooks = [
    { id: 1, title: "Dune", author: "Frank Herbert" },
    { id: 2, title: "The Lord of the Rings", author: "J.R.R. Tolkien" },
    { id: 3, title: "Foundation", author: "Isaac Asimov" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended for You</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {recommendedBooks.map((book) => (
            <li key={book.id} className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{book.title}</h3>
                <p className="text-muted-foreground text-sm">{book.author}</p>
              </div>
              <Button variant="outline" size="sm">
                Add to List
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
