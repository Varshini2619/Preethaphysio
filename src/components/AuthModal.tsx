import React, { useState } from "react";
import { X, Mail, Lock, User, Phone, MapPin, Eye, EyeOff, Activity, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { User as UserType } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (token: string, user: UserType) => void;
  initialMode?: "login" | "register" | "doctor";
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register" | "doctor" | "forgot">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [address, setAddress] = useState("");
  const [medicalInfo, setMedicalInfo] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [showResetCode, setShowResetCode] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError("");
      setSuccess("");
      setEmail("");
      setPassword("");
      setName("");
      setPhone("");
      setAge("");
      setAddress("");
      setMedicalInfo("");
      setShowResetCode(false);
      setResetCode("");
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      if (mode === "forgot") {
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Reset failed");
        
        setSuccess(data.message);
        if (data.code) {
          setResetCode(data.code);
          setShowResetCode(true);
        }
      } else if (mode === "login" || mode === "doctor") {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed");

        // Role verify
        if (mode === "doctor" && data.user.role !== "doctor") {
          throw new Error("Access Denied: Logged in account is not authorized as a Doctor.");
        }
        if (mode === "login" && data.user.role === "doctor") {
          // Auto redirect/switch to doctor login or just allow
          setMode("doctor");
          throw new Error("This is a Doctor account. Please log in using the Doctor Portal.");
        }

        onAuthSuccess(data.token, data.user);
        setSuccess("Login successful!");
        setTimeout(() => onClose(), 1000);
      } else if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            name,
            phone,
            age: age ? Number(age) : undefined,
            gender,
            address,
            medicalInfo
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Registration failed");

        onAuthSuccess(data.token, data.user);
        setSuccess("Registration successful! Welcome email sent.");
        setTimeout(() => onClose(), 1200);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="auth-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        id="auth-modal-content"
        className="w-full max-w-lg overflow-hidden bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800"
      >
        {/* Modal Header */}
        <div className="relative p-6 text-white bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-800">
          <button
            onClick={onClose}
            id="auth-close-btn"
            className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-6 w-6 text-sky-200 animate-pulse" />
            <span className="font-semibold tracking-wider text-xs uppercase text-sky-100">Dr. Preetha Physio</span>
          </div>

          <h2 id="auth-modal-title" className="text-2xl font-bold">
            {mode === "login" && "Patient Sign In"}
            {mode === "doctor" && "Doctor Portal Sign In"}
            {mode === "register" && "Create Patient Account"}
            {mode === "forgot" && "Reset Password"}
          </h2>
          <p className="text-sm text-sky-100 mt-1">
            {mode === "login" && "Access your personalized physiotherapy care plan & book real-time slots."}
            {mode === "doctor" && "Secure clinical portal for appointment management and rehab tracking."}
            {mode === "register" && "Join Vellore's premier clinic to begin your pain-free journey."}
            {mode === "forgot" && "Enter your email to retrieve your password verification code."}
          </p>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[75vh]" id="auth-modal-form">
          {error && (
            <div id="auth-error-alert" className="p-3 mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900/50">
              {error}
            </div>
          )}
          {success && (
            <div id="auth-success-alert" className="p-3 mb-4 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
              {success}
            </div>
          )}

          <div className="space-y-4">
            {/* Full Name (Register Only) */}
            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Full Name *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <User size={18} />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    placeholder="Enter your first & last name"
                  />
                </div>
              </div>
            )}

            {/* Email Field (All) */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Email Address *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  placeholder="e.g. name@example.com"
                />
              </div>
            </div>

            {/* Password Field (Login, Doctor, Register) */}
            {mode !== "forgot" && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Password *</label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    placeholder={mode === "doctor" ? "Doctor security password" : "At least 6 characters"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {/* Registration Additional Fields */}
            {mode === "register" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Contact Phone</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Phone size={16} />
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Age & Gender</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-16 px-2 py-2 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white text-center"
                      />
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="flex-1 px-2 py-2 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Residential Address</label>
                  <div className="relative">
                    <span className="absolute top-2.5 left-3 text-slate-400">
                      <MapPin size={16} />
                    </span>
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                      placeholder="Street, City, Postal Code"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Brief Medical Notes (Reason for treatment)</label>
                  <textarea
                    rows={2}
                    value={medicalInfo}
                    onChange={(e) => setMedicalInfo(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    placeholder="e.g. Back pain after lifting weights, left shoulder stiffness, knee pain post-run"
                  />
                </div>
              </>
            )}

            {/* Email Verification Mock Code Field */}
            {mode === "forgot" && showResetCode && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/50">
                <div className="flex items-center gap-2 mb-2 text-blue-700 dark:text-blue-300">
                  <ShieldCheck size={18} />
                  <span className="text-sm font-semibold">Simulated Verification Inbox Link</span>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  We simulated a secure mail reset code! Check the <strong>Live Clinic Mail Inbox</strong> dock at the bottom of your screen to copy the code, or simply use this auto-generated code to reset:
                </p>
                <div className="mt-2 text-lg font-mono font-bold text-center tracking-wider text-indigo-700 dark:text-indigo-400">
                  {resetCode}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            id="auth-submit-btn"
            className="w-full mt-6 py-3 px-4 font-semibold text-sm text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-lg transition-colors duration-150 flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                {mode === "login" && "Sign In as Patient"}
                {mode === "doctor" && "Access Secure Doctor Portal"}
                {mode === "register" && "Verify Email & Join Clinic"}
                {mode === "forgot" && "Send Verification Request"}
              </>
            )}
          </button>

          {/* Mode Switch Footers */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
            {mode === "login" && (
              <>
                <div>
                  New patient?{" "}
                  <button type="button" onClick={() => setMode("register")} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                    Create a free account
                  </button>
                </div>
                <div>
                  Are you Dr. Preetha?{" "}
                  <button type="button" onClick={() => setMode("doctor")} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                    Access Doctor Portal
                  </button>
                </div>
              </>
            )}

            {mode === "doctor" && (
              <div>
                Are you a patient?{" "}
                <button type="button" onClick={() => setMode("login")} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                  Sign In as Patient
                </button>
              </div>
            )}

            {mode === "register" && (
              <div>
                Already have an account?{" "}
                <button type="button" onClick={() => setMode("login")} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                  Sign In here
                </button>
              </div>
            )}

            {mode === "forgot" && (
              <div>
                Remembered password?{" "}
                <button type="button" onClick={() => setMode("login")} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                  Return to Sign In
                </button>
              </div>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
