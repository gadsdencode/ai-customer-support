// /utils/supabase/client.ts

import { createClient } from '@supabase/supabase-js';

interface SupabaseConfig {
    url: string;
    key: string;
}

const supabaseConfig: SupabaseConfig = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
} as SupabaseConfig;

if (!supabaseConfig.url || !supabaseConfig.key) {
    throw new Error('Supabase configuration is incomplete. Check your environment variables.');
}

export const supabase = createClient(supabaseConfig.url, supabaseConfig.key, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
    global: {
        headers: {
            Accept: 'application/json',
        }
    }
});

export const setSupabaseToken = (access_token: string) => {
    supabase.auth.setSession({ access_token, refresh_token: '' });
};

export const refreshSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) {
        console.error('Error refreshing session:', error)
        return null
      }
      return data.session
    }
    return null
}

export const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}