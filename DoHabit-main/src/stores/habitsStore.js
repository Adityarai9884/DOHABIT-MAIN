import { create } from 'zustand';

import initHabits from '../utils/initHabits';
import habitsReducerSupabase from '../utils/habitsReducerSupabase';
import { fetchHabits, transformHabitFromDB } from '../services/habitsService';

export const useHabitsStore = create(
	(set, get) => ({
		habits: initHabits(),
		loading: false,
		error: null,
		userId: null,

		// Set user ID (called after authentication)
		setUserId: (userId) => set({ userId }),

		// Load habits from Supabase
		loadHabits: async (userId) => {
			if (!userId) return;
			
			set({ loading: true, error: null, userId });
			
			const result = await fetchHabits(userId);
			
			if (result.success) {
				const habits = result.data.map(transformHabitFromDB);
				set({ habits, loading: false });
			} else {
				set({ error: result.error, loading: false });
			}
		},

		// Set habits directly (used during sync)
		setHabits: (habits) => set({ habits }),

		habitsDispatch: (actions) => set(
			(s) => ({ habits: habitsReducerSupabase(s.habits, actions, s.userId) })
		)
	})
);