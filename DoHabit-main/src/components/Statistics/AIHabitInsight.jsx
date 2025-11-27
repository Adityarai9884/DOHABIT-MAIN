import styles from '../../css/AIHabitInsight.module.css';
import { useState, useEffect } from 'react';
import { generateHabitInsight, isAIEnabled } from '../../services/aiService';
import { FaBrain, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';

function AIHabitInsight({ habit }) {
	const [insight, setInsight] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		const loadInsight = async () => {
			if (!isAIEnabled() || !habit) {
				return;
			}

			setLoading(true);
			setError('');

			const result = await generateHabitInsight(habit);
			
			if (result.success) {
				setInsight(result.insight);
			} else {
				setError(result.error);
			}

			setLoading(false);
		};

		loadInsight();
	}, [habit]);

	if (!isAIEnabled()) {
		return null;
	}

	return (
		<motion.div 
			className={styles.aiHabitInsight}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
		>
			<div className={styles.header}>
				<FaBrain className={styles.icon} />
				<h4>AI Analysis</h4>
			</div>

			{loading ? (
				<div className={styles.loadingContainer}>
					<FaSpinner className={styles.spinner} />
					<p>Analyzing your progress...</p>
				</div>
			) : error ? (
				<p className={styles.error}>{error}</p>
			) : insight ? (
				<p className={styles.insight}>{insight}</p>
			) : null}
		</motion.div>
	);
}

export default AIHabitInsight;
