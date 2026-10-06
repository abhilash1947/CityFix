

import { createClient } from '@supabase/supabase-js'

// Use Vite env variables (they are injected during build/runtime).
// Local .env shows VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY — use those.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase