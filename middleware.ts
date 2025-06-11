import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define protected routes that require authentication (not necessarily admin)
const isProtectedRoute = createRouteMatcher(['/interviewAgent'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = await auth()
    
    // Only check if user is signed in, let the page handle admin role checking
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url)
      signInUrl.searchParams.set('redirect_url', req.url)
      return NextResponse.redirect(signInUrl)
    }
    
    // User is signed in, let the client-side component handle admin verification
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}