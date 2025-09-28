import { NextRequest, NextResponse } from "next/server"
<<<<<<< HEAD
import { getS3Client } from '@/lib/s3'
import { PutObjectCommand } from '@aws-sdk/client-s3'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
=======
>>>>>>> 0333f2e2cb2fb723e26e52b6fa545f3fcf439a49
import { createServerClient } from "@/lib/supabase/server"
import { GoogleGenerativeAI } from '@google/generative-ai'
// import pdf from "pdf-parse" // Temporarily disabled for build

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

// In a production environment, you would use proper file upload handling
// For this demo, we'll simulate PDF processing



export async function POST(request: NextRequest) {
    try {
        const supabase = createServerClient()

        if (!supabase) {
            return NextResponse.json({ error: "Database not configured" }, { status: 500 })
        }

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get('pdf') as File

        if (!file) {
            return NextResponse.json({ error: "No PDF file provided" }, { status: 400 })
        }

        // Convert file to buffer for processing
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

<<<<<<< HEAD
        // Extract text from PDF using pdf-parse
        let extractedText = ''
        let pdfData: { numpages: number } = { numpages: 1 }
        try {
            // Import the core parser directly to avoid debug-mode file reads in the package entry point
            const pdfParseModule = await import('pdf-parse/lib/pdf-parse')
            const pdfParseFn = (pdfParseModule as { default?: unknown }).default || pdfParseModule

            if (typeof pdfParseFn === 'function') {
                const parsed = await pdfParseFn(buffer) as { text?: string; numpages?: number }
                extractedText = parsed?.text || ''
                pdfData = { numpages: parsed?.numpages || 1 }
            } else {
                throw new Error('pdf-parse import did not return a function')
            }
        } catch (err) {
            console.warn('PDF text extraction failed, using filename as fallback:', err)
            // Fallback: use filename and basic info
            extractedText = `PDF file: ${file.name}. Text extraction not available in development mode.`
=======
        // Dynamically import pdf-parse at runtime to avoid build-time bundling
        // which can cause attempts to read package test files during build.
        let extractedText = ''
        let pdfData: { numpages: number } = { numpages: 1 }
        try {
            const pdfParse = await import('pdf-parse')
            const parsed = await pdfParse.default(buffer) as { text?: string; numpages?: number }
            extractedText = parsed?.text || ''
            pdfData = { numpages: parsed?.numpages || 1 }
        } catch (err) {
            console.warn('pdf-parse unavailable or failed, falling back to basic storage', err)
            // Fallback: store a placeholder and continue
            extractedText = 'Text extraction failed or is unavailable. PDF stored for later processing.'
>>>>>>> 0333f2e2cb2fb723e26e52b6fa545f3fcf439a49
            pdfData = { numpages: 1 }
        }

        // Generate a unique ID for the PDF
        const pdfId = `pdf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

<<<<<<< HEAD
        // Optionally upload the binary to S3-compatible storage (Supabase Storage S3 gateway)
        let storagePath: string | null = null
        const s3 = getS3Client()
        const bucket = process.env.S3_BUCKET
        if (s3 && bucket) {
            try {
                const objectKey = `${user.id}/${pdfId}.pdf`
                await s3.send(new PutObjectCommand({
                    Bucket: bucket,
                    Key: objectKey,
                    Body: buffer,
                    ContentType: 'application/pdf'
                }))
                storagePath = objectKey
            } catch (e) {
                console.warn('S3 upload failed, continuing without storage_path', e)
            }
        }

=======
>>>>>>> 0333f2e2cb2fb723e26e52b6fa545f3fcf439a49
        // Store PDF info in database
        const { error } = await supabase
            .from('user_pdfs')
            .insert([
                {
                    id: pdfId,
                    user_id: user.id,
                    filename: file.name,
                    content: extractedText,
                    upload_date: new Date().toISOString(),
                    file_size: file.size,
<<<<<<< HEAD
                    total_pages: pdfData.numpages || 1,
                    // Include storage_path only if it exists and the column is available
                    ...(storagePath ? { storage_path: storagePath } : {})
=======
                    total_pages: pdfData.numpages || 1
>>>>>>> 0333f2e2cb2fb723e26e52b6fa545f3fcf439a49
                }
            ])
            .select()
            .single()

        if (error) {
            console.error('Database error:', error)
            return NextResponse.json({ error: "Failed to save PDF" }, { status: 500 })
        }

        // Generate AI summary using Gemini (if enabled)
        const summary = await generateAISummary(extractedText)

        // Update the record with AI summary
        await supabase
            .from('user_pdfs')
            .update({ ai_summary: summary })
            .eq('id', pdfId)

        return NextResponse.json({
            id: pdfId,
            filename: file.name,
            pages: pdfData.numpages || 1,
            content: extractedText.substring(0, 1000), // First 1000 chars for preview
            summary: summary,
<<<<<<< HEAD
            uploadDate: new Date().toISOString(),
            storagePath
=======
            uploadDate: new Date().toISOString()
>>>>>>> 0333f2e2cb2fb723e26e52b6fa545f3fcf439a49
        })

    } catch (error) {
        console.error('PDF processing error:', error)
        return NextResponse.json({ error: "Failed to process PDF" }, { status: 500 })
    }
}

export async function GET() {
    try {
        const supabase = createServerClient()

        if (!supabase) {
            return NextResponse.json({ error: "Database not configured" }, { status: 500 })
        }

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { data: pdfs, error } = await supabase
            .from('user_pdfs')
            .select('*')
            .eq('user_id', user.id)
            .order('upload_date', { ascending: false })

        if (error) {
            return NextResponse.json({ error: "Failed to fetch PDFs" }, { status: 500 })
        }

        return NextResponse.json(pdfs || [])

    } catch (error) {
        console.error('Error fetching PDFs:', error)
        return NextResponse.json({ error: "Failed to fetch PDFs" }, { status: 500 })
    }
}

async function generateAISummary(text: string): Promise<string> {
    try {
<<<<<<< HEAD
        const model = genAI.getGenerativeModel({ model: "gemini-pro" })
=======
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
>>>>>>> 0333f2e2cb2fb723e26e52b6fa545f3fcf439a49

        const prompt = `Please provide a comprehensive summary of this document. Focus on the main topics, key points, and important insights. Keep the summary informative but concise (200-300 words):

${text.substring(0, 5000)}` // Limit text to avoid token limits

        const result = await model.generateContent(prompt)
        const response = await result.response
        return response.text() || 'Unable to generate summary'

    } catch (error) {
        console.error('AI Summary generation error:', error)
        // Fallback to simple summary
        const sentences = text.split('.').filter(s => s.trim().length > 10)
        const keyPoints = sentences.slice(0, 3).map(s => s.trim()).join('. ')
        return `Summary: ${keyPoints.substring(0, 200)}${keyPoints.length > 200 ? '...' : ''}`
    }
}