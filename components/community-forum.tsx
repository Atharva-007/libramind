import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function CommunityForum() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Forum</CardTitle>
      </CardHeader>
      <CardContent className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          Join discussions, share insights, and connect with other reading enthusiasts!
        </p>
        <Button>Explore Forum</Button>
      </CardContent>
    </Card>
  )
}
