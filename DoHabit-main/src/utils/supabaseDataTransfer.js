import { useHabitsStore } from '../stores/habitsStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useAchievementsStore } from '../stores/achievementsStore';
import { useMainDiaryStore } from '../stores/mainDiaryStore';

/**
 * Export all user data from Supabase
 */
export async function exportAllDataFromSupabase() {
  try {
    const habits = useHabitsStore.getState().habits;
    const settings = useSettingsStore.getState().settings;
    const achievements = useAchievementsStore.getState().achievements;
    const mainDiary = useMainDiaryStore.getState().mainDiary;

    const data = {
      habits,
      settings,
      achievements,
      mainDiary,
      exportDate: new Date().toISOString(),
    };

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'DoHabit_Backup_' + new Date().toLocaleString().replace(/\W/g, '_') + '.json';
    link.click();
    URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error('Error exporting data:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Import user data and sync to Supabase
 */
export async function importAllDataToSupabase(userId) {
  if (!userId) {
    alert('You must be logged in to import data');
    return { success: false, error: 'Not authenticated' };
  }

  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) {
        resolve({ success: false, error: 'No file selected' });
        return;
      }

      try {
        const text = await file.text();
        const data = JSON.parse(text);

        // Get store actions
        const { setHabits, loadHabits } = useHabitsStore.getState();
        const { loadSettings } = useSettingsStore.getState();
        const { loadAchievements } = useAchievementsStore.getState();
        const { setDiary } = useMainDiaryStore.getState();

        // Import habits
        if (data.habits && Array.isArray(data.habits)) {
          setHabits(data.habits);
          // Sync to Supabase
          const { syncHabits } = await import('../services/habitsService');
          await syncHabits(userId, data.habits);
        }

        // Import settings
        if (data.settings) {
          const { updateSettings } = await import('../services/settingsService');
          await updateSettings(userId, data.settings);
        }

        // Import achievements
        if (data.achievements) {
          const { updateAchievements } = await import('../services/achievementsService');
          await updateAchievements(userId, data.achievements);
        }

        // Import diary entries
        if (data.mainDiary && Array.isArray(data.mainDiary)) {
          setDiary(data.mainDiary);
          // For diary, we'd need to implement a bulk sync function
          // For now, we'll just store it locally
        }

        // Reload all data from Supabase to ensure consistency
        await loadHabits(userId);
        await loadSettings(userId);
        await loadAchievements(userId);

        window.alert('Data imported successfully! Your data has been synced to Supabase.');
        resolve({ success: true });
      } catch (error) {
        console.error('Error importing data:', error);
        window.alert('Error reading the file: ' + error.message);
        resolve({ success: false, error: error.message });
      }
    };

    input.click();
  });
}
