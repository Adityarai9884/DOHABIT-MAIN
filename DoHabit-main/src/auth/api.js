import { supabase } from '../utils/supabase';

/**
 * Sign up a new user with email and password
 */
export async function signUp(email, password) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    
    return { success: true, data, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, data: null, error: error.message };
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    return { success: true, data, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, data: null, error: error.message };
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email) {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
    
    return { success: true, data, error: null };
  } catch (error) {
    console.error('Reset password error:', error);
    return { success: false, data: null, error: error.message };
  }
}

/**
 * Update user password
 */
export async function updatePassword(newPassword) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) throw error;
    
    return { success: true, data, error: null };
  } catch (error) {
    console.error('Update password error:', error);
    return { success: false, data: null, error: error.message };
  }
}

/**
 * Get current user session
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    
    return { success: true, user, error: null };
  } catch (error) {
    console.error('Get current user error:', error);
    return { success: false, user: null, error: error.message };
  }
}
