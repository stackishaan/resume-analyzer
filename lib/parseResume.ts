// Server-only: parse PDF and DOCX files to plain text

export async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    // Import from the internal lib path instead of the package root.
    // The root entry point (pdf-parse/index.js) runs a require('./test/data/...')
    // at import time for debug purposes — that path doesn't exist in Vercel's
    // serverless bundle, causing a crash even for valid PDFs.
    // The internal lib path contains the pure parsing logic with no side-effects.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse/lib/pdf-parse.js') as (
      buffer: Buffer,
      options?: Record<string, unknown>
    ) => Promise<{ text: string }>;
    const data = await pdfParse(buffer);
    return data.text || '';
  } catch (err) {
    console.error('PDF parse error:', err);
    throw new Error('Failed to parse PDF. Please ensure the file is a valid, non-encrypted PDF.');
  }
}

export async function parseDOCX(buffer: Buffer): Promise<string> {
  try {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    return result.value || '';
  } catch (err) {
    console.error('DOCX parse error:', err);
    throw new Error('Failed to parse DOCX file. Please ensure the file is a valid Word document.');
  }
}

export async function parseResume(buffer: Buffer, filename: string): Promise<string> {
  const ext = filename.split('.').pop()?.toLowerCase();

  if (ext === 'pdf') {
    return parsePDF(buffer);
  } else if (ext === 'docx' || ext === 'doc') {
    return parseDOCX(buffer);
  } else {
    throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
  }
}
