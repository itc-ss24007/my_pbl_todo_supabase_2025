import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
export async function createSupabaseServerClient() {
  const cookieStore = await cookies(); // awaitを追加
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  }
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseServiceKey,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            console.warn('setAll error:', error);
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    }
  );
}