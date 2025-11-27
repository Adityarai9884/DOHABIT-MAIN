import { useState } from "react";
import { sendOtp } from "./api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    const res = await sendOtp(email);
    if (res.success) {
      localStorage.setItem("email", email);
      navigate("/otp");
    }
  };

  return (
    <div className="auth-box">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSendOtp}>Send OTP</button>
    </div>
  );
}
