import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to SpeakHier</h1>
          <p className="text-gray-300">Sign in to access the AI Interview Agent</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700',
              card: 'bg-transparent shadow-none',
              headerTitle: 'text-white',
              headerSubtitle: 'text-gray-300',
              socialButtonsBlockButton: 'border-white/20 text-white hover:bg-white/10',
              formFieldInput: 'bg-black/20 border-white/20 text-white',
              formFieldLabel: 'text-white',
              identityPreviewText: 'text-white',
              identityPreviewEditButton: 'text-purple-400',
            }
          }}
        />
      </div>
    </div>
  )
}