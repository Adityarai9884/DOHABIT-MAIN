import { supabase } from '../utils/supabase';

/**
 * Fetch main diary entries
 */
export async function fetchDiary(userId) {
  try {
    const { data, error } = await supabase
      .from('main_diary')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;

    return { success: true, data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching diary:', error);
    return { success: false, data: [], error: error.message };
  }
}

/**
 * Create a diary entry
 */
export async function createDiaryEntry(userId, entry) {
  try {
    const { data, error } = await supabase
      .from('main_diary')
      .insert([{
        user_id: userId,
        date: entry.date,
        text: entry.text,
      }])
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (error) {
    console.error('Error creating diary entry:', error);
    return { success: false, data: null, error: error.message };
  }
}

/**
 * Update a diary entry
 */
export async function updateDiaryEntry(userId, entryId, text) {
  try {
    const { data, error } = await supabase
      .from('main_diary')
      .update({
        text: text,
        updated_at: new Date().toISOString(),
      })
      .eq('id', entryId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (error) {
    console.error('Error updating diary entry:', error);
    return { success: false, data: null, error: error.message };
  }
}

/**
 * Delete a diary entry
 */
export async function deleteDiaryEntry(userId, entryId) {
  try {
    const { error } = await supabase
      .from('main_diary')
      .delete()
      .eq('id', entryId)
      .eq('user_id', userId);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting diary entry:', error);
    return { success: false, error: error.message };
  }
}
