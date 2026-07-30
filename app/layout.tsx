import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Resume Analyzer — ATS Score & Career Insights',
  description:
    'Upload your resume and instantly get an ATS compatibility score, company-specific keyword analysis, strengths & weaknesses, and AI-powered improvement suggestions for TCS, Infosys, Google, Amazon, Microsoft, and Accenture.',
  keywords: ['ATS score', 'resume analyzer', 'AI resume', 'job application', 'resume checker'],
  openGraph: {
    title: 'AI Resume Analyzer',
    description: 'Get your ATS score and AI-powered resume feedback in seconds.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
