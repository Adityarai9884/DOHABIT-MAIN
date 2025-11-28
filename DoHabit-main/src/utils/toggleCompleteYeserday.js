import getFormattedDate from './getFormattedDate';

function toggleCompleteYeserday(habits, habitTitle, isTodayCompleted, isYesterdayCompleted, todayProgress, frequency) {

	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(today.getDate() - 1);
	
	// Check if we're still on the same day as yesterday (i.e., it's not past midnight)
	// Disable this function completely - cannot change past dates
	// Only return habits unchanged
	return habits;
}

export default toggleCompleteYeserday;