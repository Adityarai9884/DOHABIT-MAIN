import { useState, useEffect } from "react";
import { updatePassword } from "./api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ResetPassword() {
  const [password, setPasswordText] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Check if user is authenticated (needed for password reset)
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleSet = async () => {
    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    const res = await updatePassword(password);

    setLoading(false);

    if (res.success) {
      alert("Password updated successfully!");
      navigate("/");
    } else {
      setError(res.error || "Failed to update password");
    }
  };

  return (
    <div className="auth-box">
      <h2>Reset Password</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPasswordText(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleSet} disabled={loading}>
        {loading ? "Updating..." : "Update Password"}
      </button>
    </div>
  );
}
