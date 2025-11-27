import styles from '../css/MainPage.module.css';

// framer
import { motion } from 'framer-motion';

// components
import Header from './Header';
import HabitList from './HabitList';
import Placeholder from './Placeholder';

// icons
import { ReactComponent as Calendar } from '../img/calendar.svg';
import { MdAddToPhotos } from 'react-icons/md';
import { useHabitsStore } from '../stores/habitsStore';

// import login functions
import { useState } from "react";
import { sendOtp, verifyOtp, setPassword } from "../auth/api";

const mainVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: .3, ease: 'easeOut' }
};

function MainPage() {

  const habits = useHabitsStore((s) => s.habits);
  const filteredHabits = habits.filter((h) => !h.isArchived);

  // LOGIN STATES
  const [step, setStep] = useState("email"); // email → otp → password → done
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPasswordText] = useState("");

  const handleSendOtp = async () => {
    const res = await sendOtp(email);
    if (res.success) {
      setStep("otp");
    }
  };

  const handleVerifyOtp = async () => {
    const res = await verifyOtp(otp);
    if (res.success) {
      setStep("password");
    } else {
      alert("Incorrect OTP");
    }
  };

  const handleSetPassword = async () => {
    await setPassword(password);
    localStorage.setItem("isLoggedIn", "true");
    setStep("done");
  };

  // IF USER NOT LOGGED IN → SHOW LOGIN UI
  if (!localStorage.getItem("isLoggedIn")) {
    return (
      <div className="auth-box">

        {step === "email" && (
          <>
            <h2>Login</h2>
            <input 
              type="email" 
              placeholder="Enter Email" 
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
            <button onClick={handleSendOtp}>Send OTP</button>
          </>
        )}

        {step === "otp" && (
          <>
            <h2>Enter OTP</h2>
            <input 
              type="text" 
              placeholder="Enter OTP"
              value={otp}
              onChange={(e)=>setOtp(e.target.value)}
            />
            <button onClick={handleVerifyOtp}>Verify</button>
          </>
        )}

        {step === "password" && (
          <>
            <h2>Create Password</h2>
            <input 
              type="password" 
              placeholder="Set Password"
              value={password}
              onChange={(e)=>setPasswordText(e.target.value)}
            />
            <button onClick={handleSetPassword}>Save Password</button>
          </>
        )}

      </div>
    );
  }

  // IF LOGGED IN → SHOW HABIT DASHBOARD
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
