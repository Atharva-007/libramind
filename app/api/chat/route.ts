import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
    try {
<<<<<<< HEAD
        const { message, chatId, userId, pdfId } = await request.json()
=======
    const { message, chatId, userId, pdfId } = await request.json()
>>>>>>> 0333f2e2cb2fb723e26e52b6fa545f3fcf439a49

        if (!message || !userId) {
            return NextResponse.json(
                { error: 'Message and userId are required' },
                { status: 400 }
            )
        }

        const supabase = createServerClient()

        if (!supabase) {
            return NextResponse.json(
                { error: 'Database configuration error' },
                { status: 500 }
            )
        }

        // Verify user authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user || user.id !== userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Get conversation context if chatId exists
<<<<<<< HEAD
        let conversationContext: { role: 'user' | 'assistant'; content: string }[] = []
=======
    let conversationContext: { role: 'user' | 'assistant'; content: string }[] = []
>>>>>>> 0333f2e2cb2fb723e26e52b6fa545f3fcf439a49
        if (chatId) {
            const { data: messages } = await supabase
                .from('chat_messages')
                .select('content, sender')
                .eq('chat_session_id', chatId)
                .order('created_at', { ascending: true })
                .limit(20) // Get last 20 messages for context

            if (messages) {
                conversationContext = messages.map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'assistant',
                    content: msg.content
                }))
            }
        }

        // Get user's reading data for personalized responses
        const { data: userBooks } = await supabase
            .from('bookmarks')
            .select('title, author, genre')
            .eq('user_id', userId)
            .limit(5)

        const { data: userPdfs } = await supabase
            .from('user_pdfs')
            .select('filename, ai_summary')
            .eq('user_id', userId)
            .limit(3)

        // If a specific pdfId was chosen, fetch its content to ground the response
        let selectedPdf: { filename: string; ai_summary: string | null; content: string | null } | null = null
        if (pdfId) {
            const { data: pdf, error: pdfErr } = await supabase
                .from('user_pdfs')
                .select('filename, ai_summary, content')
                .eq('id', pdfId)
                .eq('user_id', userId)
                .single()
            if (!pdfErr && pdf) {
                selectedPdf = {
                    filename: pdf.filename,
                    ai_summary: pdf.ai_summary || null,
                    content: pdf.content || null
                }
            }
        }

        // Create system prompt with user context
        let systemPrompt = `You are LibraMind AI, a helpful reading assistant. You help users with:
    - Book recommendations based on their preferences
    - PDF document summaries and analysis
    - Reading progress tracking and motivation
    - Literature discussions and insights
    - Study tips and reading strategies

    Keep responses conversational, helpful, and encouraging. Focus on reading, learning, and personal growth.`

        if (userBooks && userBooks.length > 0) {
            systemPrompt += `\n\nUser's recent books: ${userBooks.map(book => `"${book.title}" by ${book.author} (${book.genre})`).join(', ')}`
        }

        if (userPdfs && userPdfs.length > 0) {
            systemPrompt += `\n\nUser's recent PDFs: ${userPdfs.map(pdf => pdf.filename).join(', ')}`
        }

        if (selectedPdf) {
            systemPrompt += `\n\nFocus PDF Context -> Title: ${selectedPdf.filename}\n` +
                `AI Summary: ${selectedPdf.ai_summary ? selectedPdf.ai_summary.substring(0, 1200) : 'N/A'}\n` +
                `Extracted Content (truncated): ${(selectedPdf.content || '').substring(0, 4000)}`
        }

        // Get Gemini AI response
<<<<<<< HEAD
        const model = genAI.getGenerativeModel({ model: "gemini-pro" })
=======
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
>>>>>>> 0333f2e2cb2fb723e26e52b6fa545f3fcf439a49

        // Build conversation context for Gemini
        let conversationText = systemPrompt + '\n\n'

        if (conversationContext.length > 0) {
            conversationText += 'Previous conversation:\n'
            conversationContext.forEach((msg: { role: 'user' | 'assistant'; content: string }) => {
                conversationText += `${msg.role}: ${msg.content}\n`
            })
            conversationText += '\n'
        }

        conversationText += `User: ${message}\nAssistant:`

        const result = await model.generateContent(conversationText)
        const response = await result.response
        const aiResponse = response.text() || 'I apologize, but I could not generate a response. Please try again.'

        // Determine response type based on content
        let responseType = 'text'
        if (aiResponse.toLowerCase().includes('summary') || aiResponse.toLowerCase().includes('pdf')) {
            responseType = 'summary'
        } else if (aiResponse.toLowerCase().includes('recommend') || aiResponse.toLowerCase().includes('book')) {
            responseType = 'book-recommendation'
        }

        // Update chat session if it exists
        if (chatId) {
            await supabase
                .from('chat_sessions')
                .update({
                    last_message: aiResponse.substring(0, 100) + (aiResponse.length > 100 ? '...' : ''),
                    updated_at: new Date().toISOString()
                })
                .eq('id', chatId)
        }

        return NextResponse.json({
            response: aiResponse,
            type: responseType,
            timestamp: new Date().toISOString()
        })

    } catch (error) {
        console.error('Chat API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}