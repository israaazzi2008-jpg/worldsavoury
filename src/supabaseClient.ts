import { createClient } from '@supabase/supabase-js';

// Retrieve values from Vite's environment variables, defaulting to placeholder values if not defined yet
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
