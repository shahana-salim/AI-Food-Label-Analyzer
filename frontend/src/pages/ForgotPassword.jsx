import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaLeaf,
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaArrowLeft,
} from "react-icons/fa";

import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import api from "../services/api";

function ForgotPassword() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [step, setStep] = useState(1);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();


    // -------------------------
    // VERIFY EMAIL
    // -------------------------

    const handleContinue = async () => {

        setError("");
        setMessage("");

        if (!email.trim()) {
            setError("Email is required.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setError("Please enter a valid email address.");
            return;
        }

        try {

            const response = await api.post(
                "forgot-password/",
                {
                    email: email.trim(),
                }
            );

            setMessage(response.data.message);

            setStep(2);

        } catch (error) {

            console.error(
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.error ||
                "Something went wrong. Please try again."
            );
        }
    };


    // -------------------------
    // RESET PASSWORD
    // -------------------------

    const handleResetPassword = async () => {

        setError("");
        setMessage("");

        if (!password) {
            setError("New password is required.");
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

        if (!confirmPassword) {
            setError("Please confirm your password.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {

            const response = await api.post(
                "reset-password/",
                {
                    password: password,
                    confirm_password: confirmPassword,
                }
            );

            setMessage(response.data.message);

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {

            console.error(
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.error ||
                "Unable to reset password. Please try again."
            );
        }
    };


    return (

        <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-100 flex items-center justify-center px-6">

            <div className="w-full max-w-md">


                {/* Logo */}

                <div className="flex items-center justify-center gap-3 mb-8">

                    <FaLeaf className="text-4xl text-emerald-600" />

                    <h1 className="text-2xl font-extrabold text-gray-800">
                        AI Food Label Analyzer
                    </h1>

                </div>


                <Card>

                    {/* STEP 1 */}

                    {step === 1 && (

                        <>

                            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
                                Forgot Password?
                            </h2>

                            <p className="text-center text-gray-500 mb-8">
                                Enter your registered email address to continue.
                            </p>


                            <div className="space-y-5">

                                <div className="relative">

                                    <FaEnvelope
                                        className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                                    />

                                    <Input
                                        type="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />

                                </div>


                                {error && (

                                    <div className="
                    bg-red-100
                    border
                    border-red-300
                    text-red-700
                    rounded-lg
                    p-3
                    text-sm
                  ">
                                        {error}
                                    </div>

                                )}


                                <Button onClick={handleContinue}>
                                    Continue
                                </Button>


                                <div className="text-center">

                                    <Link
                                        to="/login"
                                        className="
                      inline-flex
                      items-center
                      gap-2
                      text-emerald-600
                      hover:underline
                      font-semibold
                    "
                                    >
                                        <FaArrowLeft />
                                        Back to Login
                                    </Link>

                                </div>

                            </div>

                        </>

                    )}


                    {/* STEP 2 */}

                    {step === 2 && (

                        <>

                            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
                                Reset Password
                            </h2>

                            <p className="text-center text-gray-500 mb-8">
                                Create a new password for your account.
                            </p>


                            <div className="space-y-5">


                                {/* New Password */}

                                <div className="relative">

                                    <FaLock
                                        className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                      z-10
                    "
                                    />

                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="New Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                      hover:text-gray-600
                    "
                                    >
                                        {showPassword
                                            ? <FaEyeSlash />
                                            : <FaEye />
                                        }
                                    </button>

                                </div>


                                {/* Confirm Password */}

                                <div className="relative">

                                    <FaLock
                                        className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                      z-10
                    "
                                    />

                                    <Input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                      hover:text-gray-600
                    "
                                    >
                                        {showConfirmPassword
                                            ? <FaEyeSlash />
                                            : <FaEye />
                                        }
                                    </button>

                                </div>


                                {error && (

                                    <div className="
                    bg-red-100
                    border
                    border-red-300
                    text-red-700
                    rounded-lg
                    p-3
                    text-sm
                  ">
                                        {error}
                                    </div>

                                )}


                                {message && (

                                    <div className="
                    bg-green-100
                    border
                    border-green-300
                    text-green-700
                    rounded-lg
                    p-3
                    text-sm
                  ">
                                        {message}
                                    </div>

                                )}


                                <Button onClick={handleResetPassword}>
                                    Reset Password
                                </Button>


                                <div className="text-center">

                                    <Link
                                        to="/login"
                                        className="
                      inline-flex
                      items-center
                      gap-2
                      text-emerald-600
                      hover:underline
                      font-semibold
                    "
                                    >
                                        <FaArrowLeft />
                                        Back to Login
                                    </Link>

                                </div>

                            </div>

                        </>

                    )}

                </Card>

            </div>

        </div>

    );
}

export default ForgotPassword;