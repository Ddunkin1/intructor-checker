import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type AgentResponse<T> = {
  success: boolean
  data?: T
  error?: string
  code?: string
}

export async function GET() {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json<AgentResponse<null>>({
        success: false,
        error: 'Authentication required',
        code: 'UNAUTHORIZED',
      }, { status: 401 })
    }

    const { data: rooms, error } = await supabase
      .from('rooms')
      .select('*')
      .order('name')

    if (error) {
      return NextResponse.json<AgentResponse<null>>({
        success: false,
        error: 'Failed to fetch rooms',
        code: 'DATABASE_ERROR',
      }, { status: 500 })
    }

    return NextResponse.json<AgentResponse<typeof rooms>>({
      success: true,
      data: rooms,
    })

  } catch (error) {
    console.error('Rooms API error:', error)
    return NextResponse.json<AgentResponse<null>>({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    }, { status: 500 })
  }
}