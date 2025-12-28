import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/ui/toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'The Political Path',
  description: 'A real-time multiplayer political strategy game where 3-5 players race through a government term by negotiating policy decisions.',
  keywords: ['politics', 'game', 'multiplayer', 'strategy', 'education'],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/*
        CSS custom properties for motion preferences.
        Framer Motion respects prefers-reduced-motion automatically.
        We also set CSS variables for any custom animations.
      */}
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @media (prefers-reduced-motion: reduce) {
                *, *::before, *::after {
                  animation-duration: 0.01ms !important;
                  animation-iteration-count: 1 !important;
                  transition-duration: 0.01ms !important;
                  scroll-behavior: auto !important;
                }
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ToastProvider>
          <main className="min-h-screen bg-background">
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  )
}
