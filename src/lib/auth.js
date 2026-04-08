import { supabase } from "./supabase";

export async function signUp({ email, password, name, role }) {
  // 1. Create auth user
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  const userId = data.user.id;

  // 2. Insert into profiles
  const { error: profileError } = await supabase
    .from("profiles")
    .insert({ id: userId, name, role });
  if (profileError) throw profileError;

  // 3. Insert into students or companies
  if (role === "student") {
    const { error: studentError } = await supabase
      .from("students")
      .insert({ id: userId });
    if (studentError) throw studentError;
  } else {
    const { error: companyError } = await supabase
      .from("companies")
      .insert({ id: userId, company_name: name });
    if (companyError) throw companyError;
  }

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
