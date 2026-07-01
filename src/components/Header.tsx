import React, { useState } from "react";
import { Stethoscope, LogIn, UserPlus, LogOut, Calendar, User, Sun, Moon, Menu, X, ShieldAlert } from "lucide-react";
import { User as UserType } from "../types";

interface HeaderProps {
  user: UserType | null;
  onLogout: () => void;
  onOpenAuth: (mode: "login" | "register" | "doctor") => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onNavigate: (section: string) => void;
  activeView: string;
}

export default function Header({
  user,
  onLogout,
  onOpenAuth,
  theme,
  onToggleTheme,
  onNavigate,
  activeView
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (section: string) => {
    onNavigate(section);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Clinic Brand Logo */}
          <div 
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold tracking-tight text-blue-900 dark:text-white">
              Dr. Preetha <span className="font-light text-slate-500 dark:text-slate-400">Physio</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => handleNavClick("home")}
              className={`text-sm font-medium transition-colors ${activeView === "home" ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"}`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick("services")}
              className={`text-sm font-medium transition-colors ${activeView === "services" ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"}`}
            >
              Services
            </button>
            <button
              onClick={() => handleNavClick("about")}
              className={`text-sm font-medium transition-colors ${activeView === "about" ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"}`}
            >
              About Doctor
            </button>
            <button
              onClick={() => handleNavClick("reviews")}
              className={`text-sm font-medium transition-colors ${activeView === "reviews" ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"}`}
            >
              Patient Reviews
            </button>
            <button
              onClick={() => handleNavClick("contact")}
              className={`text-sm font-medium transition-colors ${activeView === "contact" ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"}`}
            >
              Contact Us
            </button>
          </nav>

          {/* Theme & Authentication Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle (Available to all, but required specifically in header) */}
            <button
              onClick={onToggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {user ? (
              // After Login Layout
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleNavClick("dashboard")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    activeView === "dashboard"
                      ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/30 dark:border-blue-900/50 dark:text-blue-400"
                      : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {user.role === "doctor" ? (
                    <>
                      <ShieldAlert size={16} className="text-indigo-500" />
                      <span>Doctor Portal</span>
                    </>
                  ) : (
                    <>
                      <Calendar size={16} className="text-blue-500" />
                      <span>My Appointments</span>
                    </>
                  )}
                </button>

                {/* Profile Display */}
                <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 dark:bg-slate-800/60 rounded-full border border-slate-150 dark:border-slate-700/80">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
                    {user.name.split(",")[0]}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              // Before Login Layout
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth("login")}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LogIn size={16} />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => onOpenAuth("register")}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg shadow-sm transition-colors"
                >
                  <UserPlus size={16} />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={onToggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Navigation Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-4 space-y-1 bg-white dark:bg-slate-900 border-b border-slate-150 dark:border-slate-800">
          <button
            onClick={() => handleNavClick("home")}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeView === "home" ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick("services")}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeView === "services" ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
          >
            Services
          </button>
          <button
            onClick={() => handleNavClick("about")}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeView === "about" ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
          >
            About Doctor
          </button>
          <button
            onClick={() => handleNavClick("reviews")}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeView === "reviews" ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
          >
            Reviews
          </button>
          <button
            onClick={() => handleNavClick("contact")}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeView === "contact" ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
          >
            Contact
          </button>

          {user && (
            <button
              onClick={() => handleNavClick("dashboard")}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm font-semibold border ${
                activeView === "dashboard"
                  ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/30 dark:border-blue-900/50 dark:text-blue-400"
                  : "border-slate-250 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {user.role === "doctor" ? "Doctor Dashboard" : "My Appointments"}
            </button>
          )}

          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
            {user ? (
              <div className="space-y-2 px-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 leading-none">{user.name}</p>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full py-2 flex items-center justify-center gap-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 rounded-md transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 px-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth("login");
                  }}
                  className="w-full py-2 flex items-center justify-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LogIn size={15} />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth("register");
                  }}
                  className="w-full py-2 flex items-center justify-center gap-1 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg shadow-sm transition-colors"
                >
                  <UserPlus size={15} />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
