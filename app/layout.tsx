import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Law\'s Voyage Estimator',
  description: 'Estimate shipping voyage TCE, fuel costs, and revenue for any vessel and route. Fast, transparent, and interactive—built for shipping professionals.',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon_io (6)/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon_io (6)/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon_io (6)/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon_io (6)/favicon-16x16.png" />
        <link rel="manifest" href="/favicon_io (6)/site.webmanifest" />
      </head>
      <body>{children}</body>
    </html>
  )
}
