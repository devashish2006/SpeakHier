'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { Shield, Loader2, Lock, AlertTriangle } from 'lucide-react'
import InterviewAgent from './InterviewAgent' // Your existing component

export default function InterviewAgentPage() {
  const { user, isLoaded, isSignedIn } = useUser()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [debugInfo, setDebugInfo] = useState(null)

  useEffect(() => {
    if (isLoaded) {
      // Enhanced debug logging
      const debugData = {
        isSignedIn,
        userId: user?.id,
        publicMetadata: user?.publicMetadata,
        privateMetadata: user?.privateMetadata,
        unsafeMetadata: user?.unsafeMetadata,
        organizationMemberships: user?.organizationMemberships,
        // Check all possible role locations
        roleInPublicMetadata: user?.publicMetadata?.role,
        roleInPrivateMetadata: user?.privateMetadata?.role,
        roleInUnsafeMetadata: user?.unsafeMetadata?.role,
        orgRole: user?.organizationMemberships?.[0]?.role
      }
      
      console.log('=== CLIENT-SIDE AUTH DEBUG ===')
      console.log(JSON.stringify(debugData, null, 2))
      setDebugInfo(debugData)
      
      if (!isSignedIn) {
        setIsChecking(false)
        return
      }

      // Check for admin role in multiple locations with case-insensitive matching
      const possibleRoles = [
        user?.publicMetadata?.role,
        user?.privateMetadata?.role,
        user?.unsafeMetadata?.role,
        user?.organizationMemberships?.[0]?.role
      ].filter(Boolean) // Remove null/undefined values
      
      console.log('Possible roles found:', possibleRoles)
      
      // Case-insensitive admin check
      const isAdmin = possibleRoles.some(role => 
        typeof role === 'string' && role.toLowerCase() === 'admin'
      )
      
      console.log('Is admin?', isAdmin)
      
      if (isAdmin) {
        setIsAuthorized(true)
      }
      
      setIsChecking(false)
    }
  }, [isLoaded, user, isSignedIn])

  // Show sign-in prompt if not signed in
  if (isLoaded && !isSignedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-zinc-900/90 backdrop-blur-xl rounded-2xl p-10 shadow-2xl border border-zinc-800/50 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-700/50">
            <Lock className="w-8 h-8 text-blue-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-3">Sign In Required</h2>
          <p className="text-zinc-400 mb-6">Please sign in to access the Interview Agent.</p>
          
          <button
            onClick={() => window.location.href = '/sign-in'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  // Loading state
  if (isChecking || !isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-zinc-800 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-t-zinc-400 rounded-full animate-spin mx-auto opacity-30"></div>
          </div>
          <p className="text-zinc-400 font-medium">Verifying access...</p>
        </div>
      </div>
    )
  }

  // If not authorized, show detailed error message
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-zinc-900/90 backdrop-blur-xl rounded-2xl p-10 shadow-2xl border border-zinc-800/50 max-w-lg w-full text-center relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-red-500/5 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-700/50">
              <Lock className="w-8 h-8 text-red-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">Access Restricted</h2>
            <p className="text-zinc-400 leading-relaxed mb-6">Administrator privileges required to access this feature.</p>
            
            {/* Debug info for development (remove in production) */}
            {process.env.NODE_ENV === 'development' && debugInfo && (
              <details className="text-left bg-zinc-800/30 rounded-lg p-4 mb-6 border border-zinc-700/50">
                <summary className="text-yellow-400 cursor-pointer font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  Debug Info (Dev Only)
                </summary>
                <pre className="text-xs text-zinc-300 overflow-auto">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </details>
            )}
            
            <div className="space-y-3 text-sm text-zinc-500">
              <p>If you believe this is an error:</p>
              <ul className="text-left space-y-1">
                <li>• Ensure your account has admin role in public metadata</li>
                <li>• Try signing out and signing back in</li>
                <li>• Contact your administrator</li>
              </ul>
            </div>
            
            <div className="mt-8 pt-6 border-t border-zinc-800/50">
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Premium Feature</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render the interview agent for authorized users
  return (
    <div className="min-h-screen bg-black">
      {/* Premium Admin Badge */}
      <div className="fixed top-6 right-6 z-50">
        <div className="bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-xl px-4 py-2 flex items-center gap-2.5 shadow-2xl">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <Shield size={16} className="text-emerald-400" />
          <span className="text-emerald-400 text-sm font-semibold tracking-wide">ADMIN</span>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none"></div>
        
        <InterviewAgent />
      </div>
    </div>
  )
}