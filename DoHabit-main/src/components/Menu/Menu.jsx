import styles from '../../css/Menu.module.css';
import packageJson from '../../../package.json';

// components
import MenuItemList from './MenuItemList';
import MenuItem from './MenuItem';

// icons
import { BsFillDatabaseFill } from "react-icons/bs";
import { FaGithub, FaPaintBrush, FaBrain } from "react-icons/fa";
import { HiArchiveBox } from "react-icons/hi2";

const PUBLIC_URL = process.env.PUBLIC_URL;

function Menu() {
	return (
		<section className={styles.menu}>
			<MenuItemList title="App">
				<MenuItem
					icon={<FaBrain />}
					iconColor="#a78bfa"
					title="AI Settings"
					desc="Configure AI-powered insights"
					to={`${PUBLIC_URL}/modal/aiSettings`}
					state={{ modalTitle: 'AI Settings' }}
					arrow
				/>

				<MenuItem
					icon={<HiArchiveBox />}
					iconColor="#7b68ee"
					title="Archive"
					desc="View or manage archived habits"
					to={`${PUBLIC_URL}/modal/archive`}
					state={{ modalTitle: 'Archive' }}
					arrow
				/>

				<MenuItem
					icon={<FaPaintBrush />}
					iconColor="#ffa420"
					title="Appearance"
					desc="Customize the app's look"
					to={`${PUBLIC_URL}/modal/appearance`}
					state={{ modalTitle: 'Appearance' }}
					arrow
				/>

				<MenuItem
					icon={<BsFillDatabaseFill />}
					iconColor="#77dd77"
					title="Export / Import Data"
					desc="Backup or restore your data"
					to={`${PUBLIC_URL}/modal/dataTransfer`}
					state={{ modalTitle: 'Export/Import Data' }}
					arrow
				/>
			</MenuItemList>

		<MenuItemList title="Other">
			<MenuItem
				icon={<FaGithub />}
				iconColor="#7fc7ff"
				title="GitHub Repository"
				desc="View or contribute to the project"
				onClick={() => window.open('https://github.com/Adityarai9884', '_blank')}
				link
			/>
			</MenuItemList>

			<div className={`${styles.category} ${styles.footer}`}>
				<small>Version: {packageJson.version}</small>
			</div>
		</section>
	);
}

export default Menu;