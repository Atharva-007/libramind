"use client"

import { Button } from "@/components/ui/button"
import { FaTwitter, FaFacebook } from "react-icons/fa" // Assuming react-icons is installed

interface SocialShareProps {
  title: string
  url: string
}

export function SocialShare({ title, url }: SocialShareProps) {
  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, "_blank")
  }

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`
    window.open(facebookUrl, "_blank")
  }

  return (
    <div className="flex gap-2">
      <Button onClick={shareOnTwitter} variant="outline" className="flex items-center gap-2 bg-transparent">
        <FaTwitter /> Share on Twitter
      </Button>
      <Button onClick={shareOnFacebook} variant="outline" className="flex items-center gap-2 bg-transparent">
        <FaFacebook /> Share on Facebook
      </Button>
    </div>
  )
}
