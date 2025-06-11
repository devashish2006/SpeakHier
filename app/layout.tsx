import { type Metadata } from 'next'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'SpeakHier - AI Interview Platform',
  description: 'Advanced AI-powered interview platform with role-based access control',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0f0f0f]`}>
          <header className="sticky top-0 z-40 bg-black/20 backdrop-blur-lg border-b border-white/10">
            <nav className="flex justify-between items-center p-4 max-w-7xl mx-auto">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SH</span>
                </div>
                <h1 className="text-xl font-bold text-white">SpeakHier</h1>
              </div>
              
              {/* Auth Buttons */}
              <div className="flex items-center gap-4">
                <SignedOut>
                  <SignInButton>
                    <button className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
                      Sign Up
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8"
                      }
                    }}
                  />
                </SignedIn>
              </div>
            </nav>
          </header>
          
          <main className="min-h-[calc(100vh-64px)]">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}