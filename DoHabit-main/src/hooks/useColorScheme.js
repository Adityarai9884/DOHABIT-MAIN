import { useLayoutEffect } from "react";
import { useSettingsStore } from "../stores/settingsStore";

function useColorScheme() {
	const settings = useSettingsStore((s) => s.settings);

	useLayoutEffect(
		() => {
			const theme = settings.theme || 'auto';
			
			if (theme === 'light') {
				document.documentElement.style.colorScheme = 'light';
				document.documentElement.setAttribute('data-theme', 'light');
			} else if (theme === 'dark') {
				document.documentElement.style.colorScheme = 'dark';
				document.documentElement.setAttribute('data-theme', 'dark');
			} else {
				// Auto mode - follow system preference
				document.documentElement.style.colorScheme = 'light dark';
				document.documentElement.removeAttribute('data-theme');
			}
		},
		[settings]
	);
}

export default useColorScheme;