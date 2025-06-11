import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Replace with your actual user ID
    const userId = 'user_2yF2OjrE0B654YgkDbfzFvwWHee'
    
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: 'admin'
      }
    })
    
    return NextResponse.json({ success: true, message: 'Admin role set successfully' })
  } catch (error) {
    console.error('Error setting admin role:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}