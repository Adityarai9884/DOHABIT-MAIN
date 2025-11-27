import { useState } from "react";
import { resetPassword } from "./api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    setLoading(true);
    setMessage("");

    const res = await resetPassword(email);

    setLoading(false);

    if (res.success) {
      setMessage("Password reset email sent! Please check your inbox.");
      setTimeout(() => navigate("/login"), 3000);
    } else {
      setMessage(res.error || "Failed to send reset email");
    }
  };

  return (
    <div className="auth-box">
      <h2>Reset Password</h2>
      {message && <p style={{ color: message.includes("sent") ? "green" : "red" }}>{message}</p>}
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleResetPassword} disabled={loading}>
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
      <button onClick={() => navigate("/login")} style={{ marginTop: "10px" }}>
        Back to Login
      </button>
    </div>
  );
}
