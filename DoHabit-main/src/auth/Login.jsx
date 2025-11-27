import { useState } from "react";
import { signIn, signUp } from "./api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already logged in
  if (user) {
    navigate("/");
    return null;
  }

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
    <div className="auth-box">
      <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
      {error && <p style={{ color: error.includes("successful") ? "green" : "red" }}>{error}</p>}
      {isSignUp && (
        <input
          type="text"
          placeholder="Enter Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}
      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Loading..." : (isSignUp ? "Sign Up" : "Login")}
      </button>
      <button 
        onClick={() => {
          setIsSignUp(!isSignUp);
          setError("");
          setName("");
        }}
        style={{ marginTop: "10px" }}
      >
        {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
      </button>
    </div>
  );
}
