import { useState } from "react";
import { setPassword } from "./api";
import { useNavigate } from "react-router-dom";

export default function SetPassword() {
  const [password, setPasswordText] = useState("");
  const navigate = useNavigate();

  const handleSet = async () => {
    await setPassword(password);
    navigate("/login");
  };

  return (
    <div className="auth-box">
      <h2>Set Password</h2>
      <input
        type="password"
        placeholder="Create Password"
        value={password}
        onChange={(e) => setPasswordText(e.target.value)}
      />
      <button onClick={handleSet}>Save Password</button>
    </div>
  );
}
