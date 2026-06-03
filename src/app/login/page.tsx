"use client";

import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Shield, Key, Eye, HelpCircle, Activity, Globe, CheckCircle2, AlertCircle, Mail, Lock, User, Sparkles, ChevronDown, ChevronUp, ArrowLeft, Send } from "lucide-react";

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

  if (status === "loading") {
    return (
      <div className="w-screen h-screen bg-[#070b13] flex items-center justify-center flex-col gap-4 font-sans text-white">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-teal-500/20 rounded-full animate-spin border-t-teal-500"></div>
          <Shield className="w-6 h-6 text-teal-400 animate-pulse" />
        </div>
        <p className="text-xs font-semibold text-slate-400 tracking-widest uppercase">
          Verifying secure session...
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen bg-[#090d16] flex items-center justify-center overflow-y-auto py-12 px-4 font-sans text-white">
      {/* Dynamic Glowing Mesh Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse duration-5000 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse duration-7000 pointer-events-none"></div>
      
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.007)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.007)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>

      <div className="w-full max-w-[460px] z-10 my-auto animate-fadeIn">
        
        {/* Logo and System Status */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500/20 to-emerald-500/20 border border-teal-500/30 flex items-center justify-center shadow-lg shadow-teal-500/10 mb-3 hover:scale-105 transition-transform duration-300">
            <Shield className="w-6 h-6 text-teal-400" />
          </div>
          
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-teal-300 via-emerald-300 to-indigo-300 bg-clip-text text-transparent">
            RescuEdge
          </h1>
          <p className="text-slate-500 text-[10px] mt-0.5 font-bold tracking-widest uppercase">
            Intelligent Control Center
          </p>
        </div>

        {/* Central Glassmorphic Portal Card */}
        <div className="bg-slate-900/50 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl p-6 relative overflow-hidden">
          {/* Subtle top light bar */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-teal-500/30 to-transparent"></div>

          {/* Tab Switcher - only visible on signin and signup stages */}
          {activeTab !== "verify" && (
            <div className="flex bg-slate-950/60 p-1 rounded-2xl border border-slate-800/80 mb-6">
              <button
                onClick={() => handleTabChange("signin")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === "signin"
                    ? "bg-slate-800 text-teal-400 shadow-md border border-slate-700/50"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                Sign In
              </button>
              <button
                onClick={() => handleTabChange("signup")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === "signup"
                    ? "bg-slate-800 text-teal-400 shadow-md border border-slate-700/50"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Register
              </button>
            </div>
          )}

          {/* Feedback Alerts Banners */}
          {errorMessage && (
            <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-5 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-400 font-medium leading-relaxed">{errorMessage}</p>
            </div>
          )}
          
          {successMessage && (
            <div className="flex items-start gap-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-400 font-medium leading-relaxed">{successMessage}</p>
            </div>
          )}

          {/* Forms Routing */}
          {activeTab === "signin" && (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email e.g. officer@rescuedge.com"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950/40 border border-slate-800 text-xs text-white placeholder-slate-600 rounded-xl focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950/40 border border-slate-800 text-xs text-white placeholder-slate-600 rounded-xl focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-all shadow-xl shadow-teal-500/10 hover:shadow-teal-500/25 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:pointer-events-none mt-6"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>Authorize Access</span>
                  </>
                )}
              </button>
            </form>
          )}

          {activeTab === "signup" && (
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Officer Edward"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950/40 border border-slate-800 text-xs text-white placeholder-slate-600 rounded-xl focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950/40 border border-slate-800 text-xs text-white placeholder-slate-600 rounded-xl focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950/40 border border-slate-800 text-xs text-white placeholder-slate-600 rounded-xl focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950/40 border border-slate-800 text-xs text-white placeholder-slate-600 rounded-xl focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-all shadow-xl shadow-teal-500/10 hover:shadow-teal-500/25 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:pointer-events-none mt-6"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Create Control Account</span>
                  </>
                )}
              </button>
            </form>
          )}

          {activeTab === "verify" && (
            <form onSubmit={handleVerifySubmit} className="space-y-5 animate-fadeIn">
              <div className="text-center pb-2">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-5 h-5 text-indigo-400 animate-pulse" />
                </div>
                <h3 className="text-sm font-bold text-white">Enter Email OTP Code</h3>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  We've sent a 6-digit confirmation key to: <br/>
                  <span className="text-teal-400 font-semibold">{verifyingEmail}</span>
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Verification OTP Code</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 6-digit code"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950/40 border border-slate-800 text-xs font-mono text-center tracking-[0.4em] text-teal-400 placeholder-slate-700 placeholder:tracking-normal rounded-xl focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => handleTabChange("signin")}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-slate-950/60 border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-[2] flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-all shadow-xl shadow-teal-500/10 hover:shadow-teal-500/25 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify Account</span>
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isLoading}
                className="w-full text-center text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer underline underline-offset-2 flex items-center justify-center gap-1 mt-2 hover:scale-[1.01] transition-transform"
              >
                <Send className="w-2.5 h-2.5" />
                Resend Code to Mailbox
              </button>
            </form>
          )}
        </div>

        {/* Collapsible Developer Helper Panel */}
        <div className="mt-4 animate-fadeIn">
          <button
            onClick={() => setShowDevHelp(!showDevHelp)}
            className="w-full flex items-center justify-center gap-1 text-slate-600 hover:text-slate-400 text-[10px] font-semibold transition-colors cursor-pointer bg-slate-950/10 py-2 rounded-xl border border-slate-800/20"
          >
            <HelpCircle className="w-3 h-3" />
            <span>AWS Cognito Client Flow Status</span>
            {showDevHelp ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
          </button>

          {showDevHelp && (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 mt-2.5 space-y-3.5 text-xs shadow-xl animate-fadeIn duration-200">
              <div className="border-b border-slate-800/60 pb-1.5 flex items-center justify-between">
                <span className="font-semibold text-slate-400 text-[11px]">Direct SDK Settings</span>
                <span className="text-[8px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded px-1 font-bold uppercase">SDK Mode</span>
              </div>
              <p className="text-slate-400 text-[10px] leading-relaxed">
                Auth is now fully client-secret hashed and flows securely from your local server side directly to AWS endpoints. Redirection mismatch issues are completely avoided!
              </p>
              <div className="space-y-1">
                <h5 className="font-semibold text-[10px] text-slate-300">Target Active Credentials:</h5>
                <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-slate-500 font-mono">
                  <li>Client ID: <span className="text-slate-400">4epahff...</span></li>
                  <li>Pool Region: <span className="text-slate-400">us-east-1</span></li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-[9px] text-slate-600 flex items-center justify-center gap-1 pointer-events-none">
          <Globe className="w-2.5 h-2.5" />
          <span>RescuEdge Surveillance Network Control.</span>
        </div>

      </div>
    </div>
  );
}
