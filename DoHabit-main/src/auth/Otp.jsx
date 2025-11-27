import { useState } from "react";
import { verifyOtp } from "./api";
import { useNavigate } from "react-router-dom";

export default function Otp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = async () => {
    const res = await verifyOtp(otp);
    if (res.success) {
      navigate("/set-password");
    } else {
      alert("Wrong OTP");
    }
  };

  return (
    <div className="auth-box">
      <h2>Verify OTP</h2>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerify}>Verify</button>
    </div>
  );
}
