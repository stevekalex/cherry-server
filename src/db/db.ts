import { createClient } from '@supabase/supabase-js'

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL as string
const SUPABASE_KEY = process.env.SUPABASE_KEY as string

if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_KEY in environment');
}
  
const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY,
    {   
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
)

export default supabase
