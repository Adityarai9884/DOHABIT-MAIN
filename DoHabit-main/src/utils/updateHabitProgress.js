// utils
import getFormattedDate from './getFormattedDate';
import checkHabitCompletion from './checkHabitCompletion';

function updateHabitProgress(habits, title) {
	const today = getFormattedDate(new Date());

	return habits.map((habit) => {
		habit = { ...habit };

		if (habit.title === title) {
			const isCompleted = checkHabitCompletion(habit.completedDays, habit.frequency, new Date());
			
			// Prevent changes if already 100% complete for today
			if (isCompleted) {
				return habit;
			}
			
			let completedDays = [...habit.completedDays];

			const todayIndex = completedDays.findIndex(
				(day) => day.date === today
			);

			todayIndex !== -1
				? completedDays[todayIndex] = {
					...completedDays[todayIndex],
					progress: completedDays[todayIndex].progress + 1
				}
				: completedDays.unshift({ date: today, progress: 1, });

			habit = {
				...habit,
				completedDays
			};
		};

		return habit;
	});
}

export default updateHabitProgress;