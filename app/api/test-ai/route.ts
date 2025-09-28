import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

export async function GET() {
    try {
        if (!process.env.GOOGLE_GEMINI_API_KEY) {
            return NextResponse.json({
                error: 'GOOGLE_GEMINI_API_KEY not configured',
                configured: false
            })
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" })
        const result = await model.generateContent("Say hello and confirm you're working!")
        const response = await result.response

        return NextResponse.json({
            success: true,
            configured: true,
            response: response.text(),
            message: 'Gemini AI is working correctly!'
        })
    } catch (error) {
        console.error('Gemini API test error:', error)
        return NextResponse.json({
            error: 'Gemini API test failed',
            configured: !!process.env.GOOGLE_GEMINI_API_KEY,
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}