"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User } from "lucide-react"
import type { LibraryBook } from "@/types/books"

interface ChatMessage {
  id: number
  type: "bot" | "user"
  content: string
  timestamp: string
  citations?: string[]
}

interface ChatPanelProps {
  book: LibraryBook
}

export function ChatPanel({ book }: ChatPanelProps) {
  const [messages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: "bot",
      content:
        'Hello! I\'m your AI reading companion. I can help you understand concepts from "The Lean Startup" and answer questions about the content. What would you like to know?',
      timestamp: "2024-01-15T10:00:00Z",
    },
    {
      id: 2,
      type: "user",
      content: "What is the main difference between a traditional startup approach and the Lean Startup method?",
      timestamp: "2024-01-15T10:01:00Z",
    },
    {
      id: 3,
      type: "bot",
      content:
        "Great question! The main difference is in the approach to product development:\n\n**Traditional Startup:**\n- Build a complete product based on assumptions\n- Launch with a big reveal\n- Hope customers will want it\n\n**Lean Startup Method:**\n- Build a Minimum Viable Product (MVP) quickly\n- Test with real customers early\n- Learn and iterate based on feedback\n\nAs mentioned on page 23, the Lean Startup method focuses on validated learning through the Build-Measure-Learn cycle, reducing waste and increasing the chances of success.",
      timestamp: "2024-01-15T10:02:00Z",
      citations: ["Page 23", "Chapter 1"],
    },
  ])

  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to an AI service
      setNewMessage("")
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Chat with {book.title}</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Ask questions about the book content. All answers include page references.
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : ""}`}>
              {message.type === "bot" && (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              <Card className={`max-w-[85%] ${message.type === "user" ? "bg-primary text-primary-foreground" : ""}`}>
                <CardContent className="p-3">
                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                  {message.citations && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {message.citations.map((citation, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {citation}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-xs opacity-70 mt-2">{new Date(message.timestamp).toLocaleTimeString()}</p>
                </CardContent>
              </Card>
              {message.type === "user" && (
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            placeholder="Ask a question about the book..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button size="sm" onClick={handleSendMessage}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Try asking: &quot;What are the key metrics mentioned in Chapter 3?&quot;
        </p>
      </div>
    </div>
  )
}
