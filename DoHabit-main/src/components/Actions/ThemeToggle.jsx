import styles from '../../css/ThemeToggle.module.css';
import { useSettingsStore } from '../../stores/settingsStore';

function ThemeToggle() {
  const settings = useSettingsStore((s) => s.settings);
  const settingsDispatch = useSettingsStore((s) => s.settingsDispatch);
  
  const currentTheme = settings.theme || 'auto';

  const handleThemeChange = () => {
    const themes = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    settingsDispatch({ theme: nextTheme });
  };

  const getIcon = () => {
    switch (currentTheme) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'auto':
        return '🔄';
      default:
        return '🔄';
    }
  };

  const getLabel = () => {
    switch (currentTheme) {
      case 'light':
        return 'Light Mode';
      case 'dark':
        return 'Dark Mode';
      case 'auto':
        return 'Auto Mode';
      default:
        return 'Auto Mode';
    }
  };

  return (
    <button
      className={styles.themeToggle}
      onClick={handleThemeChange}
      title={getLabel()}
      aria-label={getLabel()}
    >
      <span className={styles.icon}>{getIcon()}</span>
    </button>
  );
}

export default ThemeToggle;
