import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import {
  FaLeaf,
  FaEnvelope,
  FaCheckCircle,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";

import { loginUser } from "../services/authService";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

      navigate("/");

    } catch (error) {
      console.error(error.response?.data || error.message);
      setError("Invalid email or password.");
    }
  };
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-100 flex items-center justify-center px-6">

      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">

        {/* Left Section */}

        <div className="hidden md:block">

          <div className="flex items-center gap-3 mb-6">

            <FaLeaf className="text-5xl text-emerald-600" />

            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-800">
              AI Food Label Analyzer
            </h1>

          </div>

          <p className="text-xl text-gray-600 mb-10 leading-relaxed">

            Understand what you eat with AI-powered food label
            analysis.

          </p>

          <div className="space-y-6">

            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-emerald-600" />
              <span>Analyze ingredients instantly</span>
            </div>

            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-emerald-600" />
              <span>Detect allergens and additives</span>
            </div>

            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-emerald-600" />
              <span>Understand nutritional information</span>
            </div>

            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-emerald-600" />
              <span>AI-powered food insights</span>
            </div>

          </div>

        </div>

        {/* Right Section */}

        <Card>

          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Welcome Back 👋
          </h2>

          <p className="text-center text-gray-500 mb-8">
            Sign in to analyze food labels with AI.
          </p>

          <div className="space-y-5">

            <div className="relative">

              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

            </div>

            <div className="relative">

              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />

              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-gray-400
            hover:text-gray-600
        "
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>

            </div>

            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <Button onClick={handleLogin}>
              Login
            </Button>

            <p className="text-center text-gray-500">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="text-emerald-600 hover:underline font-semibold"
              >
                Register
              </Link>

            </p>

          </div>

        </Card>

      </div>

    </div>
  );
}

export default Login;