'use client'

import { useUser } from '@clerk/nextjs'
import { Shield, Mic, ArrowRight, Users, Clock, Brain, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const { user } = useUser()
  const isAdmin = user?.publicMetadata?.role === 'admin'

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Subtle background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.03)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.02)_0%,transparent_50%)]"></div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-zinc-800/50 border border-zinc-700/50 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
            <Sparkles size={16} className="text-zinc-400" />
            <span className="text-zinc-400 text-sm font-medium tracking-wide">PREMIUM AI PLATFORM</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight">
            <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
              SpeakHier
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Next-generation AI interview platform with personalized, role-based assessments designed for the modern workplace
          </p>
          
          {/* Admin Access Status */}
          {user && (
            <div className="mb-12">
              {isAdmin ? (
                <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-6 py-3 backdrop-blur-xl">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <Shield size={18} className="text-emerald-400" />
                  <span className="text-emerald-400 font-semibold tracking-wide">ADMIN ACCESS</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl px-6 py-3 backdrop-blur-xl">
                  <Users size={18} className="text-amber-400" />
                  <span className="text-amber-400 font-semibold tracking-wide">STANDARD USER</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="group bg-zinc-900/50 backdrop-blur-xl rounded-3xl p-8 border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300 hover:bg-zinc-900/70">
            <div className="w-14 h-14 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-zinc-700/50 transition-colors duration-300">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">AI-Powered Interviews</h3>
            <p className="text-zinc-400 leading-relaxed">
              Sophisticated AI interviewer that adapts to your role and experience level with unprecedented accuracy
            </p>
          </div>

          <div className="group bg-zinc-900/50 backdrop-blur-xl rounded-3xl p-8 border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300 hover:bg-zinc-900/70">
            <div className="w-14 h-14 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-zinc-700/50 transition-colors duration-300">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">2.5 Minute Sessions</h3>
            <p className="text-zinc-400 leading-relaxed">
              Focused, efficient interviews that respect your time while delivering comprehensive insights
            </p>
          </div>

          <div className="group bg-zinc-900/50 backdrop-blur-xl rounded-3xl p-8 border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300 hover:bg-zinc-900/70">
            <div className="w-14 h-14 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-zinc-700/50 transition-colors duration-300">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Resume Analysis</h3>
            <p className="text-zinc-400 leading-relaxed">
              Upload your resume for personalized questions based on your unique experience and background
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          {user ? (
            isAdmin ? (
              <Link 
                href="/InterviewAgent"
                className="group inline-flex items-center gap-4 bg-white hover:bg-zinc-100 text-black px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl border border-zinc-200"
              >
                <Mic size={24} />
                Start AI Interview
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            ) : (
              <div className="max-w-lg mx-auto">
                <div className="bg-zinc-900/70 border border-zinc-800/50 rounded-3xl p-10 mb-8 backdrop-blur-xl">
                  <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-amber-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Admin Access Required</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    The AI Interview Agent is currently restricted to administrators. 
                    Contact your admin to request access to this premium feature.
                  </p>
                </div>
                <p className="text-zinc-500 text-sm">
                  Signed in as: {user.emailAddresses?.[0]?.emailAddress}
                </p>
              </div>
            )
          ) : (
            <div className="space-y-8">
              <p className="text-zinc-400 text-lg mb-8">
                Sign in to access the premium AI interview platform
              </p>
              <Link
                href="/sign-in"
                className="group inline-flex items-center gap-4 bg-white hover:bg-zinc-100 text-black px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl border border-zinc-200"
              >
                Get Started
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}