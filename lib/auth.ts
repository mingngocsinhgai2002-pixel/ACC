import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

export async function signUp(email: string, password: string, name?: string): Promise<User | null> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user');

    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name: name || null,
      })
      .select()
      .maybeSingle();

    if (userError) throw userError;
    return userData;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

export async function signIn(email: string, password: string): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Failed to sign in');

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select()
      .eq('id', data.user.id)
      .maybeSingle();

    if (userError) throw userError;
    return userData;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signOut(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!authData.user) return null;

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select()
      .eq('id', authData.user.id)
      .maybeSingle();

    if (userError) throw userError;
    return userData;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

export async function updateUserProfile(userId: string, name: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ name })
      .eq('id', userId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
}

export function onAuthStateChange(callback: (user: any) => void) {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });

  return data.subscription;
}
