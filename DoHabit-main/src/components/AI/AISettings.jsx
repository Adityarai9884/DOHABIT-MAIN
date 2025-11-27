import styles from '../../css/AISettings.module.css';
import { useState, useEffect } from 'react';
import { saveAIConfig } from '../../services/aiService';
import { FaBrain, FaKey, FaExternalLinkAlt, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

function AISettings() {
	const [apiKey, setApiKey] = useState('');
	const [enabled, setEnabled] = useState(true);
	const [showKey, setShowKey] = useState(false);
	const [saved, setSaved] = useState(false);

	useEffect(() => {
		const defaultKey = 'AIzaSyC_R79ICFDSNBFnfpsivPyCPscP4Hsj2tQ';
		
		// Force set the API key
		if (!localStorage.getItem('geminiApiKey')) {
			localStorage.setItem('geminiApiKey', defaultKey);
			localStorage.setItem('aiEnabled', 'true');
		}
		
		const savedKey = localStorage.getItem('geminiApiKey') || defaultKey;
		setApiKey(savedKey);
		setEnabled(true);
	}, []);

	const handleSave = () => {
		saveAIConfig(apiKey, enabled);
		setSaved(true);
		setTimeout(() => setSaved(false), 2000);
	};

	const maskApiKey = (key) => {
		if (!key || key.length < 8) return key;
		return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4);
	};

	return (
		<div className={styles.aiSettings}>
			<div className={styles.header}>
				<FaBrain className={styles.icon} />
				<h2>AI Settings</h2>
			</div>

			<div className={styles.infoSection}>
				<FaInfoCircle className={styles.infoIcon} />
				<div className={styles.infoText}>
					<p>
						Enable AI-powered insights to receive personalized motivation, 
						progress analysis, and weekly summaries powered by Google's Gemini AI.
					</p>
					<p className={styles.privacy}>
						<strong>Privacy:</strong> Your API key is stored locally on your device. 
						Habit data is only sent to Google's Gemini API when generating insights.
					</p>
				</div>
			</div>

			<div className={styles.section}>
				<label className={styles.switchContainer}>
					<span>Enable AI Features</span>
					<input
						type="checkbox"
						checked={enabled}
						onChange={(e) => setEnabled(e.target.checked)}
						className={styles.switch}
					/>
				</label>
			</div>

			<div className={styles.section}>
				<label className={styles.label}>
					<FaKey className={styles.keyIcon} />
					Gemini API Key
				</label>
				<div className={styles.inputGroup}>
					<input
						type={showKey ? 'text' : 'password'}
						value={apiKey}
						onChange={(e) => setApiKey(e.target.value)}
						placeholder="Enter your Gemini API key"
						className={styles.input}
						disabled={!enabled}
					/>
					<button
						className={styles.toggleButton}
						onClick={() => setShowKey(!showKey)}
						disabled={!enabled}
					>
						{showKey ? 'Hide' : 'Show'}
					</button>
				</div>
				{apiKey && !showKey && (
					<p className={styles.maskedKey}>
						Current key: {maskApiKey(apiKey)}
					</p>
				)}
			</div>

			<div className={styles.getKeySection}>
				<h3>How to get your free API key:</h3>
				<ol className={styles.steps}>
					<li>
						Visit{' '}
						<a
							href="https://makersuite.google.com/app/apikey"
							target="_blank"
							rel="noopener noreferrer"
							className={styles.link}
						>
							Google AI Studio <FaExternalLinkAlt />
						</a>
					</li>
					<li>Sign in with your Google account</li>
					<li>Click "Get API Key" or "Create API Key"</li>
					<li>Copy your API key and paste it above</li>
					<li>Click "Save Settings" below</li>
				</ol>
			</div>

			<div className={styles.features}>
				<h3>AI Features:</h3>
				<ul>
					<li>📊 Personalized daily motivation messages</li>
					<li>📈 Weekly progress summaries and insights</li>
					<li>💡 Smart habit recommendations</li>
					<li>🎯 Progress pattern analysis</li>
					<li>🎉 Achievement celebrations</li>
				</ul>
			</div>

			<div className={styles.actions}>
				<button
					onClick={handleSave}
					disabled={!enabled || !apiKey.trim()}
					className={styles.saveButton}
					style={{
						backgroundColor: saved ? '#57a639' : '#a78bfa'
					}}
				>
					{saved ? (
						<>
							<FaCheckCircle /> Saved!
						</>
					) : (
						'Save Settings'
					)}
				</button>
			</div>

			<div className={styles.note}>
				<p>
					<strong>Note:</strong> The free Gemini API has generous rate limits. 
					For best results, AI insights update when you refresh or when significant changes occur.
				</p>
			</div>
		</div>
	);
}

export default AISettings;
