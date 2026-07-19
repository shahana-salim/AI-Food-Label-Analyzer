import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";

import { loginUser } from "../services/authService";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    try {
      const response = await loginUser({
        email,
        password,
      });

      localStorage.setItem(
        "access_token",
        response.data.access
      );

      localStorage.setItem(
        "refresh_token",
        response.data.refresh
      );

      console.log("Tokens saved successfully");

      navigate("/dashboard");

     } catch (error) {
       console.error(error.response?.data || error.message);
       setError("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card>

        <h1 className="text-3xl font-bold text-center mb-2">
          AI Food Label Analyzer
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Welcome Back
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
          {error && (
            <p className="text-red-600 text-sm">
              {error}
            </p>
          )}
          <Button onClick={handleLogin}>
            Login
          </Button>

        </div>

      </Card>
    </div>
  );
}

export default Login;