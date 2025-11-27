import { useState, useEffect } from "react";
import { signIn, signUp } from "./api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "../css/Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (isSignUp && !name) {
      setError("Please enter your name");
      return;
    }

    setLoading(true);
    setError("");

    const res = isSignUp 
      ? await signUp(email, password, name)
      : await signIn(email, password);

    setLoading(false);

    if (res.success) {
      if (isSignUp) {
        setError("Sign up successful! Please check your email to verify your account.");
      } else {
        navigate("/");
      }
    } else {
      setError(res.error || "An error occurred");
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Marauder's Map Background */}
      <div className={styles.maraudersMapBg}></div>
      
      {/* Magical Particles */}
      <div className={styles.magicParticles}>
        {['⚡', '✨', '🌟', '⭐', '🔮', '🪄', '📜', '🦉', '⚗️', '✨'].map((emoji, i) => (
          <div 
            key={i}
            className={styles.particle}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          >
            {emoji}
          </div>
        ))}
      </div>
      
      {/* Sorting Hat */}
      <div className={styles.sortingHat}>🎩</div>
      
      {/* Hogwarts House Banners */}
      <div className={`${styles.houseBanner} ${styles.gryffindor}`}>
        <span className={styles.houseCrest}>🦁</span>
        GRYFFINDOR
      </div>
      <div className={`${styles.houseBanner} ${styles.hufflepuff}`}>
        <span className={styles.houseCrest}>🦡</span>
        HUFFLEPUFF
      </div>
      <div className={`${styles.houseBanner} ${styles.ravenclaw}`}>
        <span className={styles.houseCrest}>🦅</span>
        RAVENCLAW
      </div>
      <div className={`${styles.houseBanner} ${styles.slytherin}`}>
        <span className={styles.houseCrest}>🐍</span>
        SLYTHERIN
      </div>
      
      {/* Floating House Crests */}
      <div className={`${styles.floatingCrest} ${styles.crest1}`}>🦁</div>
      <div className={`${styles.floatingCrest} ${styles.crest2}`}>🦡</div>
      <div className={`${styles.floatingCrest} ${styles.crest3}`}>🦅</div>
      <div className={`${styles.floatingCrest} ${styles.crest4}`}>🐍</div>
      
      {/* Golden Snitch */}
      <div className={styles.goldenSnitch}>🏐</div>
      
      {/* Wands */}
      <div className={`${styles.wand} ${styles.wand1}`}>🪄</div>
      <div className={`${styles.wand} ${styles.wand2}`}>🪄</div>
      
      {/* Auth Box */}
      <div className={styles.authBox}>
        <div className={`${styles.spellGlow} ${styles.spellGlow1}`}></div>
        <div className={`${styles.spellGlow} ${styles.spellGlow2}`}></div>
        
        <h2>{isSignUp ? "✨ Sign Up ✨" : "⚡ Login ⚡"}</h2>
        
        {error && (
          <p className={`${styles.errorText} ${error.includes("successful") ? styles.errorGreen : styles.errorRed}`}>
            {error}
          </p>
        )}
        
        {isSignUp && (
          <input
            type="text"
            placeholder="🧙‍♂️ Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        
        <input
          type="email"
          placeholder="📧 Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <input
          type="password"
          placeholder="🔐 Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "🔮 Casting..." : (isSignUp ? "🪄 Create Account" : "⚡ Enter Hogwarts")}
        </button>
        
        <button 
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError("");
            setName("");
          }}
        >
          {isSignUp ? "Already a wizard? Login" : "New to magic? Sign Up"}
        </button>
      </div>
    </div>
  );
}
