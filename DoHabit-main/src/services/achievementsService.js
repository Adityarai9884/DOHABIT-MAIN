import { supabase } from '../utils/supabase';

/**
 * Fetch user achievements
 */
export async function fetchAchievements(userId) {
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      throw error;
    }

    return { success: true, data: data?.achievements || [], error: null };
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return { success: false, data: [], error: error.message };
  }
}

/**
 * Update user achievements
 */
export async function updateAchievements(userId, achievements) {
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .upsert({
        user_id: userId,
        achievements: achievements,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: data?.achievements || [], error: null };
  } catch (error) {
    console.error('Error updating achievements:', error);
    return { success: false, data: null, error: error.message };
  }
}
