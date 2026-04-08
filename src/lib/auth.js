import { supabase } from "./supabase";

export async function signUp({ email, password, name, role }) {
  // Pass name and role as metadata — the DB trigger handles profile creation
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role },
    },
  });
  if (error) throw error;
  return data.user;
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*, students(*), companies(*)")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}

export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
