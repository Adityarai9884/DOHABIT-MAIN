import styles from '../../css/DataTransfer.module.css';

// components
import Placeholder from '../Placeholder';

// utils
import { exportAllDataFromSupabase, importAllDataToSupabase } from '../../utils/supabaseDataTransfer';

// auth
import { useAuth } from '../../contexts/AuthContext';

// icons
import { ReactComponent as Export } from '../../img/upload.svg'
import { ReactComponent as Import } from '../../img/import.svg'
import { BsDatabaseFillUp } from "react-icons/bs";
import { BsDatabaseFillDown } from "react-icons/bs";

function DataTransfer() {
	const { user } = useAuth();

	const handleExport = async () => {
		const result = await exportAllDataFromSupabase();
		if (!result.success) {
			alert('Error exporting data: ' + result.error);
		}
	};

	const handleImport = async () => {
		if (!user?.id) {
			alert('You must be logged in to import data');
			return;
		}
		await importAllDataToSupabase(user.id);
	};

	return (
		<div className={styles.dataTransfer}>
			<div className={styles.placeholderWrapper}>
				<Placeholder
					image={<Export />}
					title="Export"
					desc="Save a backup of your habits data to your device."
					textOnButton="Export Now"
					buttonIcon={<BsDatabaseFillUp />}
					onClick={handleExport}
					accentColor="#57a639"
				/>
			</div>

			<div className={styles.placeholderWrapper}>
				<Placeholder
					image={<Import />}
					title="Import"
					desc="Upload your habits data from a backup file and sync to Supabase."
					textOnButton="Import Now"
					buttonIcon={<BsDatabaseFillDown />}
					onClick={handleImport}
				/>
			</div>
		</div>
	);
}

export default DataTransfer;