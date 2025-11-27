import { create } from "zustand";

import initSettings from "../utils/initSettings";
import settingsReducer from "../utils/settingsReducer";
import { fetchSettings, updateSettings as updateSettingsService } from '../services/settingsService';

export const useSettingsStore = create(
	(set, get) => ({
		settings: initSettings(),
		loading: false,
		userId: null,

		// Set user ID
		setUserId: (userId) => set({ userId }),

		// Load settings from Supabase
		loadSettings: async (userId) => {
			if (!userId) return;
			
			set({ loading: true, userId });
			
			const result = await fetchSettings(userId);
			
			if (result.success) {
				set({ settings: result.data, loading: false });
			} else {
				set({ loading: false });
			}
		},

		settingsDispatch: async (actions) => {
			const newSettings = settingsReducer(get().settings, actions);
			set({ settings: newSettings });
			
			// Sync to Supabase
			const userId = get().userId;
			if (userId) {
				updateSettingsService(userId, newSettings).catch(err =>
					console.error('Error updating settings in Supabase:', err)
				);
			}
		}
	})
);