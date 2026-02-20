import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WizKlub - STEM Programs for Kids',
  description: 'Empowering kids with STEM skills and critical thinking',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
