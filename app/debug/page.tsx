'use client'

import { useUser } from '@clerk/nextjs'
import { Shield, User, AlertCircle } from 'lucide-react'

export default function DebugPage() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading user data...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Not signed in</div>
      </div>
    )
  }

  const userRole = user?.publicMetadata?.role || user?.public_metadata?.role
  const isAdmin = userRole === 'admin'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">User Debug Information</h1>
          </div>

          {/* Role Status */}
          <div className="mb-8">
            {isAdmin ? (
              <div className="bg-green-500/20 border border-green-500/40 rounded-xl p-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-green-400" />
                <div>
                  <h3 className="text-green-400 font-semibold">Admin Access Granted</h3>
                  <p className="text-green-300 text-sm">You have access to the Interview Agent</p>
                </div>
              </div>
            ) : (
              <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <div>
                  <h3 className="text-red-400 font-semibold">No Admin Access</h3>
                  <p className="text-red-300 text-sm">You need admin role to access Interview Agent</p>
                </div>
              </div>
            )}
          </div>

          {/* User Details */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="bg-black/20 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Basic Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-400">User ID:</span>
                  <span className="text-white ml-2">{user.id}</span>
                </div>
                <div>
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white ml-2">{user.emailAddresses[0]?.emailAddress}</span>
                </div>
                <div>
                  <span className="text-gray-400">First Name:</span>
                  <span className="text-white ml-2">{user.firstName || 'Not set'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Last Name:</span>
                  <span className="text-white ml-2">{user.lastName || 'Not set'}</span>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-black/20 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Metadata & Roles</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-400">Current Role:</span>
                  <span className="text-white ml-2">{userRole || 'No role assigned'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Public Metadata:</span>
                  <pre className="text-white ml-2 mt-1 bg-black/30 p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(user.publicMetadata, null, 2)}
                  </pre>
                </div>
                <div>
                  <span className="text-gray-400">Private Metadata:</span>
                  <pre className="text-white ml-2 mt-1 bg-black/30 p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(user.privateMetadata, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
            <h3 className="text-blue-400 font-semibold mb-3">How to Set Admin Role</h3>
            <div className="text-gray-300 text-sm space-y-2">
              <p>1. Go to your Clerk Dashboard</p>
              <p>2. Navigate to Users and select your user</p>
              <p>3. In the "Public metadata" section, add:</p>
              <pre className="bg-black/30 p-3 rounded mt-2 text-xs">
{`{
  "role": "admin"
}`}
              </pre>
              <p>4. Save the changes and refresh this page</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}