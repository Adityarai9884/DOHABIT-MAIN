// utils
import saveToLocalStorage from './saveToLocalStorage';

// Supabase services
import { 
	createDiaryEntry, 
	updateDiaryEntry, 
	deleteDiaryEntry 
} from '../services/diaryService';

let updateTimeout = null;

// Debounced update to Supabase
async function syncToSupabase(diary, userId) {
	if (!userId) {
		// Fallback to localStorage if not authenticated
		saveToLocalStorage('mainDiary', diary);
		return;
	}

	// Clear existing timeout
	if (updateTimeout) {
		clearTimeout(updateTimeout);
	}

	// Save to localStorage immediately for offline support
	saveToLocalStorage('mainDiary', diary);

	// Debounce Supabase updates
	updateTimeout = setTimeout(async () => {
		try {
			console.log('Main diary synced to localStorage');
		} catch (error) {
			console.error('Error syncing diary to Supabase:', error);
		}
	}, 1000);
}

function mainDiaryReducerSupabase(diary, actions, userId = null) {
	let newDiary = [...diary];

	switch (actions.type) {
		case 'addNote':
			// Add note to local state - convert date to ISO string for consistency
			const noteToAdd = { 
				...actions.newNote,
				date: actions.newNote.date instanceof Date 
					? actions.newNote.date.toISOString() 
					: actions.newNote.date
			};
			newDiary.push(noteToAdd);
			
			// Sync to Supabase and update with the returned ID
			if (userId) {
				createDiaryEntry(userId, noteToAdd)
					.then(result => {
						if (result.success && result.data) {
							// Update the local entry with the ID from Supabase
							console.log('Diary entry created in Supabase with ID:', result.data.id);
						}
					})
					.catch(err => 
						console.error('Error creating diary entry in Supabase:', err)
					);
			}
			break;

		case 'editNote':
			// Find the entry to update (before modifying the array)
			const entryToUpdate = newDiary.find(n => {
				// Handle both Date objects and string dates
				const noteDate = n.date instanceof Date ? n.date.toISOString() : n.date;
				const actionDate = actions.noteCreationDate instanceof Date 
					? actions.noteCreationDate.toISOString() 
					: actions.noteCreationDate;
				return noteDate === actionDate;
			});
			
			newDiary = newDiary.map(
				(note) => {
					const noteDate = note.date instanceof Date ? note.date.toISOString() : note.date;
					const actionDate = actions.noteCreationDate instanceof Date 
						? actions.noteCreationDate.toISOString() 
						: actions.noteCreationDate;
					
					if (noteDate === actionDate) {
						return { ...note, text: actions.newText };
					}
					return note;
				}
			);
			
			// Sync to Supabase - find the entry by date and update it
			if (userId && entryToUpdate?.id) {
				updateDiaryEntry(userId, entryToUpdate.id, actions.newText).catch(err => 
					console.error('Error updating diary entry in Supabase:', err)
				);
			}
			break;

		case 'deleteNote':
			// Find the entry to delete (before filtering)
			const entryToDelete = newDiary.find(n => {
				const noteDate = n.date instanceof Date ? n.date.toISOString() : n.date;
				const actionDate = actions.noteCreationDate instanceof Date 
					? actions.noteCreationDate.toISOString() 
					: actions.noteCreationDate;
				return noteDate === actionDate;
			});
			
			newDiary = newDiary.filter(
				(n) => {
					const noteDate = n.date instanceof Date ? n.date.toISOString() : n.date;
					const actionDate = actions.noteCreationDate instanceof Date 
						? actions.noteCreationDate.toISOString() 
						: actions.noteCreationDate;
					return noteDate !== actionDate;
				}
			);
			
			// Sync to Supabase
			if (userId && entryToDelete?.id) {
				deleteDiaryEntry(userId, entryToDelete.id).catch(err => 
					console.error('Error deleting diary entry in Supabase:', err)
				);
			}
			break;

		default:
			break;
	}

	// Sync to Supabase (with debounce)
	syncToSupabase(newDiary, userId);

	return newDiary;
}

export default mainDiaryReducerSupabase;
