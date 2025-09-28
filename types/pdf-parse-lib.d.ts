declare module 'pdf-parse/lib/pdf-parse' {
    import { PDFDataParser } from 'pdf-parse'

    type PdfParseResult = { text?: string; numpages?: number }

    const pdfParse: (data: Buffer, options?: Parameters<PDFDataParser['parseBuffer']>[1]) => Promise<PdfParseResult>

    export default pdfParse
}
