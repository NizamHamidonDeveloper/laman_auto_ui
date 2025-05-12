import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => {
          const cookies: { name: string; value: string }[] = []
          request.cookies.getAll().forEach((cookie) => {
            cookies.push({ name: cookie.name, value: cookie.value })
          })
          return cookies
        },
        setAll: (cookies) => {
          cookies.forEach(({ name, value, ...options }) => {
            response.cookies.set({
              name,
              value,
              ...options,
            })
          })
        },
      },
    }
  )
  await supabase.auth.getUser()
  return response
} 