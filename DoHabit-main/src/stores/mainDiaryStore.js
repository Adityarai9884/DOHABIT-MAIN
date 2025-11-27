import { create } from "zustand";

import initMainDiary from "../utils/initMainDiary";
import mainDiaryReducerSupabase from "../utils/mainDiaryReducerSupabase";
import { fetchDiary } from '../services/diaryService';

export const useMainDiaryStore = create(
	(set, get) => ({
		mainDiary: initMainDiary(),
		loading: false,
		userId: null,

		// Set user ID
		setUserId: (userId) => set({ userId }),

		// Load diary from Supabase
		loadDiary: async (userId) => {
			if (!userId) return;
			
			set({ loading: true, userId });
			
			const result = await fetchDiary(userId);
			
			if (result.success) {
				set({ mainDiary: result.data, loading: false });
			} else {
				set({ loading: false });
			}
		},

		// Set diary directly
		setDiary: (mainDiary) => set({ mainDiary }),

		mainDiaryDispatch: (actions) => set(
			(s) => ({ mainDiary: mainDiaryReducerSupabase(s.mainDiary, actions, s.userId) })
		)
	})
);