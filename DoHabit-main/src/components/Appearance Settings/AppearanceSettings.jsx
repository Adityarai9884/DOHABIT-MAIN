import styles from '../../css/appearanceSettings.module.css';

// stores
import { useSettingsStore } from '../../stores/settingsStore';

// components
import MenuItemList from '../Menu/MenuItemList';
import MenuItem from '../Menu/MenuItem';
import Switch from '../Selection/Switch';

function AppearanceSettings() {

	const settings = useSettingsStore((s) => s.settings);
	const settingsDispatch = useSettingsStore((s) => s.settingsDispatch);

	const currentTheme = settings.theme || 'auto';
	const themeLabels = {
		light: 'Light',
		dark: 'Dark',
		auto: 'Auto (System)'
	};

	const handleThemeChange = () => {
		const themes = ['light', 'dark', 'auto'];
		const currentIndex = themes.indexOf(currentTheme);
		const nextTheme = themes[(currentIndex + 1) % themes.length];
		settingsDispatch({ theme: nextTheme });
	};

	return (
		<section className={styles.appearance}>
			<MenuItemList title="Color Theme">
				<MenuItem
					title="Theme"
					desc={`Current: ${themeLabels[currentTheme]}`}
					other={
						<button
							className={styles.themeToggleBtn}
							onClick={handleThemeChange}
						>
							{currentTheme === 'light' && '☀️'}
							{currentTheme === 'dark' && '🌙'}
							{currentTheme === 'auto' && '🔄'}
						</button>
					}
				/>
			</MenuItemList>			<MenuItemList title="Calendar">
				<MenuItem
					title="Compact Calendar View"
					desc={`Current: ${settings.calendarView === 'compact' ? 'Compact' : 'Default'}`}
					other={
						<Switch
							isActive={settings.calendarView === 'compact'}
							onClick={() => settingsDispatch({
								calendarView: settings.calendarView === 'compact'
									? 'default'
									: 'compact'
							})}
						/>
					}
				/>

				<MenuItem
					title="Highlight Today's Date"
					desc={(settings.calendarHighlightToday ?? true)
						? 'Today is highlighted'
						: 'Today is not highlighted'}
					other={
						<Switch
							isActive={settings.calendarHighlightToday ?? true}
							onClick={() => settingsDispatch({
								calendarHighlightToday: !(settings.calendarHighlightToday ?? true)
							})}
						/>
					}
				/>
			</MenuItemList>
		</section>
	);
}

export default AppearanceSettings;