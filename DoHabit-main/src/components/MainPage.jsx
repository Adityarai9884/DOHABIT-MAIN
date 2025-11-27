import styles from '../css/MainPage.module.css';

// react
import { useEffect } from 'react';

// framer
import { motion } from 'framer-motion';

// components
import Header from './Header';
import HabitList from './HabitList';
import Placeholder from './Placeholder';

// icons
import { ReactComponent as Calendar } from '../img/calendar.svg';
import { MdAddToPhotos } from 'react-icons/md';

// stores
import { useHabitsStore } from '../stores/habitsStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useAchievementsStore } from '../stores/achievementsStore';
import { useMainDiaryStore } from '../stores/mainDiaryStore';

// auth
import { useAuth } from '../contexts/AuthContext';

const mainVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: .3, ease: 'easeOut' }
};

function MainPage() {
  const { user } = useAuth();
  
  const habits = useHabitsStore((s) => s.habits);
  const loadHabits = useHabitsStore((s) => s.loadHabits);
  const setUserId = useHabitsStore((s) => s.setUserId);
  
  const loadSettings = useSettingsStore((s) => s.loadSettings);
  const setSettingsUserId = useSettingsStore((s) => s.setUserId);
  
  const loadAchievements = useAchievementsStore((s) => s.loadAchievements);
  const setAchievementsUserId = useAchievementsStore((s) => s.setUserId);
  
  const loadDiary = useMainDiaryStore((s) => s.loadDiary);
  const setDiaryUserId = useMainDiaryStore((s) => s.setUserId);
  
  const filteredHabits = habits.filter((h) => !h.isArchived);

  // Load data from Supabase when user is authenticated
  useEffect(() => {
    if (user?.id) {
      // Set user IDs in all stores
      setUserId(user.id);
      setSettingsUserId(user.id);
      setAchievementsUserId(user.id);
      setDiaryUserId(user.id);
      
      // Load data from Supabase
      loadHabits(user.id);
      loadSettings(user.id);
      loadAchievements(user.id);
      loadDiary(user.id);
    }
  }, [user, loadHabits, loadSettings, loadAchievements, loadDiary, setUserId, setSettingsUserId, setAchievementsUserId, setDiaryUserId]);

  return (
    <motion.div className={styles.mainPage} {...mainVariants}>
      <Header />

      <HabitList habits={filteredHabits} />

      {filteredHabits.length === 0 && (
        <Placeholder
          image={<Calendar />}
          title="No active habits found"
          desc="Why not create one now?"
          textOnButton="Create First Habit"
          buttonIcon={<MdAddToPhotos />}
          to={`${process.env.PUBLIC_URL}/modal/habitEditor`}
          state={{ modalTitle: 'Create new habit' }}
        />
      )}
    </motion.div>
  );
}

export default MainPage;
