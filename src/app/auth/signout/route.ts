import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  // Clear any existing cookies
  const response = NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_SITE_URL))
  response.cookies.delete('sb-access-token')
  response.cookies.delete('sb-refresh-token')
  
  return response
} 