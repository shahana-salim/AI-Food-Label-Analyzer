import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";

function Register() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const handleRegister = async () => {

  setError("");
  setSuccess("");

  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  try {
    await registerUser({
      email,
      password,
      confirm_password: confirmPassword,
    });

    setSuccess("Registration successful!");

    setTimeout(() => {
      navigate("/login");
    }, 1500);

  } catch (error) {

    console.error(error.response?.data || error.message);

    setError("Registration failed.");
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card>

        <h1 className="text-3xl font-bold text-center mb-2">
          AI Food Label Analyzer
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Create an Account
        </p>

        <div className="space-y-4">

          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && (
            <p className="text-red-600 text-sm">
              {error}
            </p>
          )}

          {success && (
            <p className="text-green-600 text-sm">
              {success}
            </p>
          )}

          <Button onClick={handleRegister}>
            Register
          </Button>

        </div>

      </Card>
    </div>
  );
}

export default Register;