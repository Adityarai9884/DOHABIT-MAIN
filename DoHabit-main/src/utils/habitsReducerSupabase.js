// utils
import deleteHabit from './deleteHabit';
import editHabit from './editHabit';
import updateHabitProgress from './updateHabitProgress';
import addNote from './addNote';
import deleteNote from './deleteNote';
import editNote from './editNote';
import archiveHabit from './archiveHabit';
import toggleCompleteYeserday from './toggleCompleteYeserday';
import scrollToTop from './scrollToTop';
import saveToLocalStorage from './saveToLocalStorage';

// Supabase services
import { 
	createHabit, 
	updateHabit, 
	deleteHabit as deleteHabitService
} from '../services/habitsService';

let updateTimeout = null;

// Debounced update to Supabase
async function syncToSupabase(habits, userId) {
	if (!userId) {
		// Fallback to localStorage if not authenticated
		saveToLocalStorage('habits', habits);
		return;
	}

	// Clear existing timeout
	if (updateTimeout) {
		clearTimeout(updateTimeout);
	}

	// Save to localStorage immediately for offline support
	saveToLocalStorage('habits', habits);

	// Debounce Supabase updates
	updateTimeout = setTimeout(async () => {
		try {
			// This is a simplified sync - in production, you might want more sophisticated logic
			// For now, we'll let individual operations handle their own updates
			console.log('Habits synced to localStorage');
		} catch (error) {
			console.error('Error syncing to Supabase:', error);
		}
	}, 1000);
}

function habitsReducer(habits, action, userId = null) {
	const {
		data, habitTitle
	} = action;

	const newHabit = data && {
		title: data.title.value,
		colorIndex: Number(data.colorIndex.value),
		iconTitle: data.iconTitle.value,
		frequency: Number(data.frequency.value),
		completedDays: [],
	};

	let updatedHabits = habits;

	switch (action.type) {
		case 'importHabit':
			updatedHabits = [...action.importedData];
			break;

		// habits
		case 'addHabit':
			const habitToAdd = { ...newHabit, creationDate: new Date(), isArchived: false, diary: [] };
			updatedHabits = [habitToAdd, ...habits];
			scrollToTop();
			
			// Sync to Supabase
			if (userId) {
				createHabit(userId, habitToAdd).catch(err => 
					console.error('Error creating habit in Supabase:', err)
				);
			}
			break;

		case 'deleteHabit':
			updatedHabits = deleteHabit(habits, habitTitle);
			
			// Sync to Supabase
			if (userId) {
				const habitToDelete = habits.find(h => h.title === habitTitle);
				if (habitToDelete?.id) {
					deleteHabitService(userId, habitToDelete.id).catch(err => 
						console.error('Error deleting habit in Supabase:', err)
					);
				}
			}
			break;

		case 'archiveHabit':
			updatedHabits = archiveHabit(habits, habitTitle);
			
			// Sync to Supabase
			if (userId) {
				const habitToArchive = updatedHabits.find(h => h.title === habitTitle);
				if (habitToArchive?.id) {
					updateHabit(userId, habitToArchive.id, { isArchived: habitToArchive.isArchived }).catch(err => 
						console.error('Error archiving habit in Supabase:', err)
					);
				}
			}
			break;

		case 'editHabit':
			updatedHabits = editHabit(habits, habitTitle, newHabit, data.order.value - 1);
			
			// Sync to Supabase
			if (userId) {
				const habitToEdit = updatedHabits.find(h => h.title === newHabit.title);
				if (habitToEdit?.id) {
					updateHabit(userId, habitToEdit.id, {
						title: newHabit.title,
						colorIndex: newHabit.colorIndex,
						iconTitle: newHabit.iconTitle,
						frequency: newHabit.frequency,
					}).catch(err => 
						console.error('Error editing habit in Supabase:', err)
					);
				}
			}
			break;

		case 'toggleCompleteYeserday':
			updatedHabits = toggleCompleteYeserday(habits, habitTitle, action.isTodayCompleted, action.isYesterdayCompleted, action.todayProgress, action.frequency);
			
			// Sync to Supabase
			if (userId) {
				const habitToUpdate = updatedHabits.find(h => h.title === habitTitle);
				if (habitToUpdate?.id) {
					updateHabit(userId, habitToUpdate.id, { completedDays: habitToUpdate.completedDays }).catch(err => 
						console.error('Error updating habit progress in Supabase:', err)
					);
				}
			}
			break;

		case 'updateProgress':
			updatedHabits = updateHabitProgress(habits, habitTitle);
			
			// Sync to Supabase
			if (userId) {
				const habitToUpdate = updatedHabits.find(h => h.title === habitTitle);
				if (habitToUpdate?.id) {
					updateHabit(userId, habitToUpdate.id, { completedDays: habitToUpdate.completedDays }).catch(err => 
						console.error('Error updating habit progress in Supabase:', err)
					);
				}
			}
			break;

		// diary
		case 'addNote':
			updatedHabits = addNote(habits, habitTitle, action.newNote);
			
			// Sync to Supabase
			if (userId) {
				const habitToUpdate = updatedHabits.find(h => h.title === habitTitle);
				if (habitToUpdate?.id) {
					updateHabit(userId, habitToUpdate.id, { diary: habitToUpdate.diary }).catch(err => 
						console.error('Error adding note in Supabase:', err)
					);
				}
			}
			break;

		case 'editNote':
			updatedHabits = editNote(habits, action.habitTitle, action.noteCreationDate, action.newText);
			
			// Sync to Supabase
			if (userId) {
				const habitToUpdate = updatedHabits.find(h => h.title === action.habitTitle);
				if (habitToUpdate?.id) {
					updateHabit(userId, habitToUpdate.id, { diary: habitToUpdate.diary }).catch(err => 
						console.error('Error editing note in Supabase:', err)
					);
				}
			}
			break;

		case 'deleteNote':
			updatedHabits = deleteNote(habits, habitTitle, action.noteCreationDate);
			
			// Sync to Supabase
			if (userId) {
				const habitToUpdate = updatedHabits.find(h => h.title === habitTitle);
				if (habitToUpdate?.id) {
					updateHabit(userId, habitToUpdate.id, { diary: habitToUpdate.diary }).catch(err => 
						console.error('Error deleting note in Supabase:', err)
					);
				}
			}
			break;

		default:
			console.error('Unknown action: ' + action.type);
	}

	// Sync to Supabase (with debounce)
	syncToSupabase(updatedHabits, userId);

	return updatedHabits;
}

export default habitsReducer;
