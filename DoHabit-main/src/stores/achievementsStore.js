import { create } from "zustand";

import initAchievements from "../utils/initAchievements";
import achievementsReducer from "../utils/achievementsReducer";
import { fetchAchievements, updateAchievements as updateAchievementsService } from '../services/achievementsService';

export const useAchievementsStore = create(
	(set, get) => ({
		achievements: initAchievements(),
		loading: false,
		userId: null,

		// Set user ID
		setUserId: (userId) => set({ userId }),

		// Load achievements from Supabase
		loadAchievements: async (userId) => {
			if (!userId) return;
			
			set({ loading: true, userId });
			
			const result = await fetchAchievements(userId);
			
			if (result.success && result.data.length > 0) {
				set({ achievements: result.data, loading: false });
			} else {
				// Initialize with defaults if no data
				set({ loading: false });
			}
		},

		achievementsDispatch: async (actions) => {
			const newAchievements = achievementsReducer(get().achievements, actions);
			set({ achievements: newAchievements });
			
			// Sync to Supabase
			const userId = get().userId;
			if (userId) {
				updateAchievementsService(userId, newAchievements).catch(err =>
					console.error('Error updating achievements in Supabase:', err)
				);
			}
		}
	})
);