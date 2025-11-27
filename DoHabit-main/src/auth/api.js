export async function sendOtp(email) {
  console.log("OTP sent to:", email);
  localStorage.setItem("dummyOtp", "1234");
  return { success: true };
}

export async function verifyOtp(otp) {
  const original = localStorage.getItem("dummyOtp");
  return { success: otp === original };
}

export async function setPassword(password) {
  localStorage.setItem("userPassword", password);
  return { success: true };
}
