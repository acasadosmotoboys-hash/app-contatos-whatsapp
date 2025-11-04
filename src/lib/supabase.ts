import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Contact {
  id: string
  name: string
  phone: string
  last_message: string
  timestamp: string
  user_email: string
  created_at: string
}

export interface License {
  id: string
  email: string
  status: 'active' | 'expired' | 'pending'
  purchase_date: string
  expiry_date: string
  amount: number
  created_at: string
}