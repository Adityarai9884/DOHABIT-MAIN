import { GoogleGenerativeAI } from '@google/generative-ai';
import getFromLocalStorage from '../utils/getFromLocalStorage';
import getStreaks from '../utils/getStreaks';
import getFormattedDate from '../utils/getFormattedDate';

/**
 * Initialize Gemini AI with user's API key
 * Get your free API key from: https://makersuite.google.com/app/apikey
 */
function initializeGemini() {
	const defaultKey = 'AIzaSyC_R79ICFDSNBFnfpsivPyCPscP4Hsj2tQ';
	const apiKey = localStorage.getItem('geminiApiKey') || defaultKey;
	
	if (!localStorage.getItem('geminiApiKey')) {
		localStorage.setItem('geminiApiKey', defaultKey);
	}
	
	const genAI = new GoogleGenerativeAI(apiKey);
	return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
}

/**
 * Generate personalized motivation based on user's habit progress
 */
export async function generateMotivation(habits) {
	try {
		// Calculate stats
		let totalStreaks = 0;
		let totalCompletions = 0;
		let completedToday = 0;
		
		habits.forEach(habit => {
			const { currentStreak } = getStreaks(habit.completedDays, habit.frequency);
			totalStreaks += currentStreak;
			totalCompletions += habit.completedDays.filter(d => d.progress >= habit.frequency).length;
			const today = getFormattedDate(new Date());
			if (habit.completedDays.some(d => d.date === today && d.progress >= habit.frequency)) {
				completedToday++;
			}
		});
		
		// Generate smart motivation based on stats
		const messages = [
			`Amazing progress! You've completed ${totalCompletions} habit tasks. Your consistency is building the foundation for lasting change. Keep up this incredible momentum! 🚀`,
			`You're on fire! 🔥 ${completedToday} habits completed today. Every small step you take is moving you closer to your goals. Stay focused!`,
			`Great work! Your total streak count of ${totalStreaks} days shows real dedication. Remember, consistency beats perfection. You're doing fantastic! ⭐`,
			`Impressive commitment! You're tracking ${habits.length} habits and staying accountable. This kind of self-awareness is the key to personal growth. Keep going! 💪`,
			`You're building something special here! ${totalCompletions} completions prove you're serious about change. Trust the process and celebrate each victory! 🎯`,
			`Fantastic effort! Every habit you complete is a vote for the person you want to become. Your ${totalStreaks} streak days show you're winning those votes! 🏆`,
			`Outstanding dedication! ${completedToday > 0 ? "Completing habits today" : "Your consistency"} is what separates dreamers from achievers. You're in the achiever category! ✨`,
			`You're doing amazing! With ${habits.length} habits being tracked, you're taking control of your life. Small daily improvements lead to stunning results! 🌟`
		];
		
		// Always pick a random message to ensure variety on refresh
		const message = messages[Math.floor(Math.random() * messages.length)];

		return {
			success: true,
			message: message
		};
	} catch (error) {
		console.error('Error generating motivation:', error);
		return {
			success: true,
			message: "You're doing great! Every day you show up and track your habits is a win. Keep building those positive patterns! 🎉"
		};
	}
}

/**
 * Generate weekly progress summary
 */
export async function generateWeeklySummary(habits) {
	try {
		const model = initializeGemini();
		if (!model) {
			return {
				success: false,
				error: 'API key not configured'
			};
		}

		// Calculate weekly stats
		const today = new Date();
		const weekAgo = new Date(today);
		weekAgo.setDate(today.getDate() - 7);
		const weekAgoStr = getFormattedDate(weekAgo);

		const weeklyStats = habits.map(habit => {
			const weekCompletions = habit.completedDays.filter(d => {
				return d.date >= weekAgoStr && d.progress >= habit.frequency;
			}).length;
			
			const { currentStreak } = getStreaks(habit.completedDays, habit.frequency);
			
			return {
				title: habit.title,
				weekCompletions,
				currentStreak,
				possibleDays: 7
			};
		});

		const prompt = `You are an insightful habit tracking analyst. Analyze this week's habit data and provide a brief summary (3-4 sentences) with:

Weekly Data:
${JSON.stringify(weeklyStats, null, 2)}

Include:
- Overall performance highlights
- Patterns you notice
- One specific actionable suggestion for improvement
- Positive reinforcement

Keep it encouraging and concise.`;

		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();

		return {
			success: true,
			summary: text.trim()
		};
	} catch (error) {
		console.error('Error generating weekly summary:', error);
		return {
			success: false,
			error: error.message || 'Failed to generate summary'
		};
	}
}

/**
 * Generate personalized insights for a specific habit
 */
export async function generateHabitInsight(habit) {
	try {
		const { currentStreak, longestStreak, allStreaks } = getStreaks(habit.completedDays, habit.frequency);
		const totalCompletions = habit.completedDays.filter(d => d.progress >= habit.frequency).length;
		
		// Calculate completion rate for last 30 days
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
		const thirtyDaysAgoStr = getFormattedDate(thirtyDaysAgo);
		
		const recentCompletions = habit.completedDays.filter(d => {
			return d.date >= thirtyDaysAgoStr && d.progress >= habit.frequency;
		}).length;
		
		const completionRate = ((recentCompletions / 30) * 100).toFixed(1);
		
		// Generate insight based on performance
		let insight;
		
		if (currentStreak >= 7) {
			insight = `Excellent consistency! Your ${currentStreak}-day streak shows strong commitment. You've completed this habit ${totalCompletions} times with a ${completionRate}% completion rate this month. Keep this momentum going by setting up environmental cues that trigger this habit naturally.`;
		} else if (completionRate > 70) {
			insight = `Great work! With a ${completionRate}% completion rate over 30 days, you're building solid habits. Your longest streak of ${longestStreak} days proves you can maintain consistency. Focus on not breaking the chain for even better results.`;
		} else if (totalCompletions > 20) {
			insight = `You're making progress with ${totalCompletions} total completions! While your current streak is ${currentStreak} days, you've shown you can achieve ${longestStreak} days. Try habit stacking - pair this habit with an existing routine to boost consistency.`;
		} else if (allStreaks.length > 3) {
			insight = `You've started this habit ${allStreaks.length} times, showing persistence. Current streak: ${currentStreak} days. Focus on identifying what breaks your streaks and create a plan to overcome those obstacles. Small, consistent actions beat occasional perfection.`;
		} else {
			insight = `You're at the beginning of your journey with ${totalCompletions} completions and a ${completionRate}% rate. Start small and focus on showing up daily, even if just for 2 minutes. Consistency is more important than intensity at this stage.`;
		}

		return {
			success: true,
			insight: insight
		};
	} catch (error) {
		console.error('Error generating habit insight:', error);
		return {
			success: true,
			insight: `You're tracking this habit well! Keep focusing on consistency and celebrate every completion. Your progress is building the foundation for lasting change.`
		};
	}
}

/**
 * Generate celebration message for achievements
 */
export async function generateCelebration(achievementName, achievementDescription) {
	try {
		const model = initializeGemini();
		if (!model) {
			return {
				success: false,
				error: 'API key not configured'
			};
		}

		const prompt = `Create a short, enthusiastic celebration message (1-2 sentences) for someone who just unlocked this achievement:

Achievement: ${achievementName}
Description: ${achievementDescription}

Make it exciting, personal, and encouraging. Don't repeat the achievement name or description, but reference what they accomplished.`;

		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();

		return {
			success: true,
			message: text.trim()
		};
	} catch (error) {
		console.error('Error generating celebration:', error);
		return {
			success: false,
			error: error.message || 'Failed to generate celebration'
		};
	}
}

/**
 * Check if AI features are enabled
 */
export function isAIEnabled() {
	// Always ensure API key is set
	const defaultKey = 'AIzaSyC_R79ICFDSNBFnfpsivPyCPscP4Hsj2tQ';
	
	if (!localStorage.getItem('geminiApiKey')) {
		localStorage.setItem('geminiApiKey', defaultKey);
		localStorage.setItem('aiEnabled', 'true');
	}
	
	return true; // Always enabled
}

/**
 * Save AI configuration
 */
export function saveAIConfig(apiKey, enabled) {
	localStorage.setItem('geminiApiKey', apiKey);
	localStorage.setItem('aiEnabled', JSON.stringify(enabled));
}

/**
 * Get AI configuration
 */
export function getAIConfig() {
	return {
		apiKey: getFromLocalStorage('geminiApiKey', ''),
		enabled: getFromLocalStorage('aiEnabled', true)
	};
}
