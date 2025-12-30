import { createClient } from '@supabase/supabase-js'

// URL del proyecto (copiada de Settings -> API)
const supabaseUrl = 'https://nfmwddssxvndxdmrspxj.supabase.co'

// 2. Clave "anon public" (copiala completa de Settings -> API)
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mbXdkZHNzeHZuZHhkbXJzcHhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MTAwNDEsImV4cCI6MjA4MTQ4NjA0MX0.rcFGft0X1g27tvQaAbnJWsk7JJ3l9tEqMLl56TSo4Dw' 

export const supabase = createClient(supabaseUrl, supabaseKey)