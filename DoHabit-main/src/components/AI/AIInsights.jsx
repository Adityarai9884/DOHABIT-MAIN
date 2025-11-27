import styles from '../../css/AIInsights.module.css';
import { useState, useEffect } from 'react';
import { useHabitsStore } from '../../stores/habitsStore';
import { generateMotivation, generateWeeklySummary, isAIEnabled } from '../../services/aiService';
import { FaBrain, FaSpinner, FaRedo, FaChartLine } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function AIInsights({ showWeeklySummary = false }) {
	const habits = useHabitsStore((s) => s.habits);
	const [motivation, setMotivation] = useState('');
	const [weeklySummary, setWeeklySummary] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [lastUpdated, setLastUpdated] = useState(null);

	useEffect(() => {
		const loadMotivation = async () => {
			if (habits.length === 0) {
				return;
			}

			isAIEnabled(); // Initialize API key if needed
			setLoading(true);
			setError('');

			const result = await generateMotivation(habits);
			
			if (result.success) {
				setMotivation(result.message);
				setLastUpdated(new Date());
			} else {
				setError(result.error);
			}

			setLoading(false);
		};

		const loadWeeklySummary = async () => {
			if (habits.length === 0) {
				return;
			}

			isAIEnabled(); // Initialize API key if needed
			setLoading(true);
			setError('');

			const result = await generateWeeklySummary(habits);
			
			if (result.success) {
				setWeeklySummary(result.summary);
			} else {
				setError(result.error);
			}

			setLoading(false);
		};

		if (habits.length > 0) {
			loadMotivation();
			if (showWeeklySummary) {
				loadWeeklySummary();
			}
		}
	}, [habits, showWeeklySummary]);

	const handleRefresh = async () => {
		if (showWeeklySummary) {
			setLoading(true);
			setError('');
			const result = await generateWeeklySummary(habits);
			if (result.success) {
				setWeeklySummary(result.summary);
			} else {
				setError(result.error);
			}
			setLoading(false);
		} else {
			setLoading(true);
			setError('');
			const result = await generateMotivation(habits);
			if (result.success) {
				setMotivation(result.message);
				setLastUpdated(new Date());
			} else {
				setError(result.error);
			}
			setLoading(false);
		}
	};

	if (habits.length === 0) {
		return (
			<motion.div 
				className={styles.aiInsights}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<div className={styles.header}>
					<FaBrain className={styles.icon} />
					<h3>AI Insights</h3>
				</div>
				<p className={styles.emptyMessage}>
					Create habits and mark them complete to get AI-powered insights! 🚀
				</p>
			</motion.div>
		);
	}

	return (
		<motion.div 
			className={styles.aiInsights}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
		>
			<div className={styles.header}>
				<FaBrain className={styles.icon} />
				<h3>AI Insights</h3>
				{!loading && (
					<button 
						className={styles.refreshButton}
						onClick={handleRefresh}
						title="Refresh insights"
					>
						<FaRedo />
					</button>
				)}
			</div>

			<AnimatePresence mode="wait">
				{loading ? (
					<motion.div 
						key="loading"
						className={styles.loadingContainer}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<FaSpinner className={styles.spinner} />
						<p>Analyzing your progress...</p>
					</motion.div>
				) : error ? (
					<motion.div 
						key="error"
						className={styles.errorContainer}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<p className={styles.error}>{error}</p>
						<button 
							className={styles.retryButton}
							onClick={handleRefresh}
						>
							Try Again
						</button>
					</motion.div>
				) : (
					<motion.div
						key="content"
						className={styles.content}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						{!showWeeklySummary && motivation && (
							<>
								<p className={styles.motivation}>{motivation}</p>
								{lastUpdated && (
									<p className={styles.timestamp}>
										Updated {lastUpdated.toLocaleTimeString()}
									</p>
								)}
							</>
						)}
						
						{showWeeklySummary && weeklySummary && (
							<>
								<div className={styles.summaryHeader}>
									<FaChartLine className={styles.summaryIcon} />
									<h4>Weekly Summary</h4>
								</div>
								<p className={styles.summary}>{weeklySummary}</p>
							</>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}

export default AIInsights;
