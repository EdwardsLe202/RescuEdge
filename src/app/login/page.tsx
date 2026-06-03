"use client";

import RescueRadar from "@/components/RescueRadar";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Navigation Tabs & Stage State: "signin" | "signup" | "verify"
  const [activeTab, setActiveTab] = useState<"signin" | "signup" | "verify">("signin");
  
  // Form Fields States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [verifyingEmail, setVerifyingEmail] = useState("");
  
  // UI Feedback States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showDevHelp, setShowDevHelp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Reset errors and successes when switching tabs
  const handleTabChange = (tab: "signin" | "signup" | "verify") => {
    setActiveTab(tab);
    setErrorMessage("");
    setSuccessMessage("");
    setOtpCode("");
    if (tab !== "verify") {
      setEmail("");
      setPassword("");
      setName("");
      setConfirmPassword("");
    }
  };

  // Sign In submit handler
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/",
      });

      if (response?.error) {
        // Handle AWS Cognito specific error messages and format them nicely
        const cleanError = response.error.includes("UserNotConfirmedException")
          ? "CONFIRM_REQUIRED"
          : response.error.includes("NotAuthorizedException")
          ? "Incorrect email or password. Please try again."
          : response.error.includes("UserNotFoundException")
          ? "No account found with this email. Please sign up."
          : response.error;

        if (cleanError === "CONFIRM_REQUIRED") {
          // If user exists but is unconfirmed, route them to verify stage automatically
          setVerifyingEmail(email);
          setSuccessMessage("Your account requires verification. Please enter the OTP sent to your email.");
          setTimeout(() => {
            setActiveTab("verify");
            setErrorMessage("");
            setSuccessMessage("");
            setIsLoading(false);
          }, 1500);
        } else {
          setErrorMessage(cleanError);
          setIsLoading(false);
        }
      } else {
        setSuccessMessage("Authentication successful! Redirecting...");
        router.push("/");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  // Sign Up submit handler
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create account.");
      }

      setVerifyingEmail(email);
      setSuccessMessage("Account created successfully! An OTP has been sent to your email.");
      
      // Shift tab state to verify OTP screen
      setTimeout(() => {
        setActiveTab("verify");
        setConfirmPassword("");
        setErrorMessage("");
        setSuccessMessage("");
        setIsLoading(false);
      }, 2000);

    } catch (err: any) {
      setErrorMessage(err.message || "Registration failed.");
      setIsLoading(false);
    }
  };

  // OTP Verification submit handler
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpCode) {
      setErrorMessage("Please enter the 6-digit confirmation code.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/auth/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: verifyingEmail, code: otpCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Verification failed. Check the code.");
      }

      setSuccessMessage("Email verified successfully! You can now log in.");
      
      // Route back to Sign In
      setTimeout(() => {
        setActiveTab("signin");
        setEmail(verifyingEmail);
        setOtpCode("");
        setErrorMessage("");
        setSuccessMessage("");
        setIsLoading(false);
      }, 2000);

    } catch (err: any) {
      setErrorMessage(err.message || "Failed to verify account.");
      setIsLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/auth/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: verifyingEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to resend code.");
      }

      setSuccessMessage("A fresh verification code has been dispatched to your inbox.");
      setIsLoading(false);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to resend verification code.");
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen relative flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Background: dark slate on left, white on right */}
      <div className="absolute inset-0">
        <div className="hidden md:flex h-full">
          <div className="w-1/2 bg-[#090d16]" />
          <div className="w-1/2 bg-white" />
        </div>
        <div className="md:hidden h-full bg-white" />
      </div>

      {/* Left Side - Code-based Rescue Animation (hidden on mobile, sticky) */}
      <div className="hidden md:flex w-1/2 h-full items-center justify-center relative z-10 bg-[#090d16]">
        <RescueRadar />
      </div>

      {/* Right Side - Forms */}
      <div className="w-full md:w-1/2 h-full overflow-y-auto flex items-center justify-center p-6 md:p-8 relative z-10 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
              {activeTab === "signin" ? "Login" : activeTab === "signup" ? "Create account" : "Verify Email"}
            </h1>
            <p className="text-slate-500 text-sm">
              {activeTab === "signin"
                ? "Sign in to access your control panel"
                : activeTab === "signup"
                ? "Start your rescue coordination session"
                : `Enter the verification code sent to ${verifyingEmail}`}
            </p>
          </div>

          <div className="space-y-6">
            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-red-600 text-xs font-semibold">{errorMessage}</p>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                <p className="text-emerald-700 text-xs font-semibold">{successMessage}</p>
              </div>
            )}

            {activeTab === "signin" && (
              <form onSubmit={handleSignInSubmit} className="space-y-6">
                <div>
                  <label className="block text-slate-700 text-sm font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
                    placeholder="Enter email"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-slate-700 text-sm font-semibold mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 pr-12 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
                      placeholder="Enter password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setSuccessMessage("Please contact the administrator to reset your password.");
                      setTimeout(() => setSuccessMessage(""), 4000);
                    }}
                    className="text-emerald-600 text-sm hover:underline font-semibold"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-500/10 cursor-pointer"
                >
                  {isLoading ? "Signing In..." : "Login"}
                </button>

                <div className="text-center">
                  <p className="text-slate-500 text-sm">
                    {"Don't have an account? "}
                    <button
                      type="button"
                      onClick={() => handleTabChange("signup")}
                      className="text-emerald-600 hover:underline font-semibold cursor-pointer"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </form>
            )}

            {activeTab === "signup" && (
              <form onSubmit={handleSignUpSubmit} className="space-y-6">
                <div>
                  <label className="block text-slate-700 text-sm font-semibold mb-2">
                    Full name <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
                    placeholder="Your full name"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-slate-700 text-sm font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
                    placeholder="you@example.com"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-slate-700 text-sm font-semibold mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 pr-12 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
                      placeholder="Create a password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Password requirement indicators */}
                  {(() => {
                    const pwd = password || "";
                    const checks = [
                      { label: "1 lowercase letter", ok: /[a-z]/.test(pwd) },
                      { label: "1 uppercase letter", ok: /[A-Z]/.test(pwd) },
                      { label: "1 number", ok: /\d/.test(pwd) },
                      { label: "1 special character", ok: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(pwd) },
                    ];
                    return (
                      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                        {checks.map(({ label, ok }) => (
                          <div key={label} className="flex items-center gap-2">
                            <span
                              className={`flex-shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                                ok
                                  ? "border-emerald-500 bg-emerald-50"
                                  : "border-slate-200 bg-transparent"
                              }`}
                            >
                              {ok && (
                                <svg
                                  className="w-3 h-3 text-emerald-600"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M2 6l3 3 5-5"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </span>
                            <span
                              className={`text-xs transition-colors duration-300 ${
                                ok ? "text-emerald-600" : "text-slate-400"
                              }`}
                            >
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                <div>
                  <label className="block text-slate-700 text-sm font-semibold mb-2">
                    Retype password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 pr-12 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
                      placeholder="Retype your password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-500/10 cursor-pointer"
                >
                  {isLoading ? "Creating account..." : "Sign up"}
                </button>

                <div className="text-center">
                  <p className="text-slate-500 text-sm">
                    {"Already have an account? "}
                    <button
                      type="button"
                      onClick={() => handleTabChange("signin")}
                      className="text-emerald-600 hover:underline font-semibold cursor-pointer"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </form>
            )}

            {activeTab === "verify" && (
              <form onSubmit={handleVerifySubmit} className="space-y-6">
                <div>
                  <label className="block text-slate-700 text-sm font-semibold mb-2">
                    Verification OTP Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-center tracking-[0.4em] font-mono text-lg text-emerald-600 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    placeholder="000000"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleTabChange("signin")}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    disabled={isLoading}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-500/10 cursor-pointer"
                  >
                    {isLoading ? "Verifying..." : "Verify Code"}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="w-full text-center text-xs text-emerald-600 hover:underline font-semibold cursor-pointer"
                >
                  Resend Code to Mailbox
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

