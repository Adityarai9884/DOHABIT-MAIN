import { supabase } from '../utils/supabase';

/**
 * Fetch user settings
 */
export async function fetchSettings(userId) {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      throw error;
    }

    return { success: true, data: data?.settings || {}, error: null };
  } catch (error) {
    console.error('Error fetching settings:', error);
    return { success: false, data: {}, error: error.message };
  }
}

/**
 * Update user settings
 */
export async function updateSettings(userId, settings) {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        settings: settings,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: data?.settings || {}, error: null };
  } catch (error) {
    console.error('Error updating settings:', error);
    return { success: false, data: null, error: error.message };
  }
}
