import { supabase } from '../utils/supabase';

/**
 * Fetch all habits for the current user
 */
export async function fetchHabits(userId) {
  try {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching habits:', error);
    return { success: false, data: [], error: error.message };
  }
}

/**
 * Create a new habit
 */
export async function createHabit(userId, habit) {
  try {
    const habitData = {
      user_id: userId,
      title: habit.title,
      color_index: habit.colorIndex,
      icon_title: habit.iconTitle,
      frequency: habit.frequency,
      completed_days: habit.completedDays || [],
      is_archived: habit.isArchived || false,
      creation_date: habit.creationDate || new Date().toISOString(),
      diary: habit.diary || [],
    };

    const { data, error } = await supabase
      .from('habits')
      .insert([habitData])
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (error) {
    console.error('Error creating habit:', error);
    return { success: false, data: null, error: error.message };
  }
}

/**
 * Update an existing habit
 */
export async function updateHabit(userId, habitId, updates) {
  try {
    const updateData = {
      ...(updates.title !== undefined && { title: updates.title }),
      ...(updates.colorIndex !== undefined && { color_index: updates.colorIndex }),
      ...(updates.iconTitle !== undefined && { icon_title: updates.iconTitle }),
      ...(updates.frequency !== undefined && { frequency: updates.frequency }),
      ...(updates.completedDays !== undefined && { completed_days: updates.completedDays }),
      ...(updates.isArchived !== undefined && { is_archived: updates.isArchived }),
      ...(updates.diary !== undefined && { diary: updates.diary }),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('habits')
      .update(updateData)
      .eq('id', habitId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (error) {
    console.error('Error updating habit:', error);
    return { success: false, data: null, error: error.message };
  }
}

/**
 * Delete a habit
 */
export async function deleteHabit(userId, habitId) {
  try {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', habitId)
      .eq('user_id', userId);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting habit:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sync all habits (bulk update)
 */
export async function syncHabits(userId, habits) {
  try {
    // This will replace all existing habits with the new ones
    // First, delete all existing habits
    await supabase
      .from('habits')
      .delete()
      .eq('user_id', userId);

    // Then insert all new habits
    if (habits.length > 0) {
      const habitsData = habits.map(habit => ({
        user_id: userId,
        title: habit.title,
        color_index: habit.colorIndex,
        icon_title: habit.iconTitle,
        frequency: habit.frequency,
        completed_days: habit.completedDays || [],
        is_archived: habit.isArchived || false,
        creation_date: habit.creationDate || new Date().toISOString(),
        diary: habit.diary || [],
      }));

      const { data, error } = await supabase
        .from('habits')
        .insert(habitsData)
        .select();

      if (error) throw error;

      return { success: true, data, error: null };
    }

    return { success: true, data: [], error: null };
  } catch (error) {
    console.error('Error syncing habits:', error);
    return { success: false, data: [], error: error.message };
  }
}

/**
 * Transform Supabase habit to app format
 */
export function transformHabitFromDB(dbHabit) {
  return {
    id: dbHabit.id,
    title: dbHabit.title,
    colorIndex: dbHabit.color_index,
    iconTitle: dbHabit.icon_title,
    frequency: dbHabit.frequency,
    completedDays: dbHabit.completed_days || [],
    isArchived: dbHabit.is_archived || false,
    creationDate: dbHabit.creation_date,
    diary: dbHabit.diary || [],
  };
}

/**
 * Transform app habit to Supabase format
 */
export function transformHabitToDB(habit, userId) {
  return {
    user_id: userId,
    title: habit.title,
    color_index: habit.colorIndex,
    icon_title: habit.iconTitle,
    frequency: habit.frequency,
    completed_days: habit.completedDays || [],
    is_archived: habit.isArchived || false,
    creation_date: habit.creationDate || new Date().toISOString(),
    diary: habit.diary || [],
  };
}
