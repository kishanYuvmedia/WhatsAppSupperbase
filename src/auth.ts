import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Get the current authenticated user session on the server.
 * Compatible with the old NextAuth `auth()` return shape.
 */
export async function auth() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  return {
    user: {
      id: user.id,
      email: user.email ?? "",
      name: (user.user_metadata?.full_name as string) ?? user.email ?? "",
      image: (user.user_metadata?.avatar_url as string) ?? null,
    },
  };
}

/**
 * Sign in via email magic link (or OTP).
 */
export async function signIn(_email: string, _options?: { redirectTo?: string }) {
  throw new Error("Not implemented — use signInWithPassword instead");
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  const supabase = await createClient();
  return supabase.auth.signOut();
}

/**
 * Sign up a new user.
 */
export async function signUp(email: string, password: string, metadata?: Record<string, unknown>) {
  const supabase = await createClient();
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });
}

/**
 * Update the authenticated user's password.
 */
export async function updatePassword(password: string) {
  const supabase = await createClient();
  return supabase.auth.updateUser({ password });
}

/**
 * Admin-level user lookup (uses service_role key).
 */
export async function adminGetUser(userId: string) {
  const admin = createAdminClient();
  return admin.auth.admin.getUserById(userId);
}
