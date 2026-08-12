
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaLeaf,
  FaEnvelope,
  FaLock,
  FaCheckCircle,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const navigate = useNavigate();
  const handleRegister = async () => {

    setError("");
    setSuccess("");

    // First Name validation
    if (!firstName.trim()) {
      setError("First name is required.");
      return;
    }

    if (firstName.trim().length < 2) {
      setError("First name must be at least 2 characters long.");
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(firstName.trim())) {
      setError("First name can contain only letters and spaces.");
      return;
    }

    // Last Name validation
    if (!lastName.trim()) {
      setError("Last name is required.");
      return;
    }

    if (lastName.trim().length < 2) {
      setError("Last name must be at least 2 characters long.");
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(lastName.trim())) {
      setError("Last name can contain only letters and spaces.");
      return;
    }

    // Email validation
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password validation
    if (!password) {
      setError("Password is required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter.");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number.");
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setError("Password must contain at least one special character.");
      return;
    }

    // Confirm Password validation
    if (!confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {

      await registerUser({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        password,
        confirm_password: confirmPassword,
      });

      setSuccess("Registration successful!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {

      console.error(error.response?.data || error.message);

      const backendError = error.response?.data;

      if (backendError?.email) {
        setError(
          Array.isArray(backendError.email)
            ? backendError.email[0]
            : backendError.email
        );
      } else if (backendError?.password) {
        setError(
          Array.isArray(backendError.password)
            ? backendError.password[0]
            : backendError.password
        );
      } else if (backendError?.detail) {
        setError(backendError.detail);
      } else {
        setError("Registration failed. Please try again.");
      }
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
            Understand what you eat with AI-powered food label analysis.
          </p>

          <div className="space-y-6">

            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-emerald-600" />
              <span>AI-powered ingredient analysis</span>
            </div>

            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-emerald-600" />
              <span>Detect allergens & food additives</span>
            </div>

            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-emerald-600" />
              <span>Understand nutrition labels</span>
            </div>

            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-emerald-600" />
              <span>Get healthier food insights</span>
            </div>

          </div>

        </div>

        {/* Right Section */}
        <div className="max-w-md w-full mx-auto">

          <Card>

            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Create Account 🌿
            </h2>

            <p className="text-center text-gray-500 mb-6">
              Join and start analyzing food labels with AI.
            </p>

            <div className="space-y-4">
              <div className="relative">

                <Input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />

              </div>

              <div className="relative">

                <Input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />

              </div>

              <div className="relative">

                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />

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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>

              </div>

              <div className="relative">

                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />

                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>

              </div>

              {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-3 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-100 border border-green-300 text-green-700 rounded-lg p-3 text-sm">
                  {success}
                </div>
              )}

              <Button onClick={handleRegister}>
                Register
              </Button>

              <p className="text-center text-gray-500">

                Already have an account?{" "}

                <Link
                  to="/login"
                  className="text-emerald-600 font-semibold hover:underline"
                >
                  Login
                </Link>

              </p>

            </div>

          </Card>
        </div>
      </div>

    </div>
  );
}

export default Register;