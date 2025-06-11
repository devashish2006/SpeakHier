'use client'

import { useUser } from '@clerk/nextjs'
import { AlertCircle, ArrowLeft, Shield } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function UnauthorizedPage() {
  const { user, isLoaded } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md w-full text-center">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
          <Shield className="w-8 h-8 text-red-400" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Access Restricted
        </h1>

        {/* Message */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertCircle size={20} />
            <span className="font-medium">Admin Access Required</span>
          </div>
          <p className="text-gray-300 text-sm">
            You need administrator privileges to access the AI Interview Agent. 
            {user?.emailAddresses?.[0]?.emailAddress && (
              <>
                <br />
                <span className="text-gray-400">
                  Current account: {user.emailAddresses[0].emailAddress}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link 
            href="/"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
          
          <p className="text-sm text-gray-400">
            Contact your administrator to request access to this feature.
          </p>
        </div>
      </div>
    </div>
  )
}