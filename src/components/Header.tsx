import React, { useState } from "react";
import { Stethoscope, LogIn, UserPlus, LogOut, Calendar, User, Menu, X, ShieldAlert } from "lucide-react";
import { User as UserType } from "../types";

interface HeaderProps {
  user: UserType | null;
  onLogout: () => void;
  onOpenAuth: (mode: "login" | "register" | "doctor") => void;
  onNavigate: (section: string) => void;
  activeView: string;
}

export default function Header({
  user,
  onLogout,
  onOpenAuth,
  onNavigate,
  activeView
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (section: string) => {
    onNavigate(section);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-slate-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Clinic Brand Logo */}
          <div 
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <img 
              src="/assets/logo.png" 
              alt="Dr. Preetha Physiotherapy Logo"
              className="w-10 h-10 object-contain shrink-0 transition-transform duration-200 group-hover:scale-105"
            />
            <span className="text-xl font-bold tracking-tight text-blue-900">
              Dr. Preetha <span className="font-light text-slate-500">Physio</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => handleNavClick("home")}
              className={`text-sm font-medium transition-colors ${activeView === "home" ? "text-blue-600" : "text-slate-600 hover:text-slate-900"}`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick("services")}
              className={`text-sm font-medium transition-colors ${activeView === "services" ? "text-blue-600" : "text-slate-600 hover:text-slate-900"}`}
            >
              Services
            </button>
            <button
              onClick={() => handleNavClick("about")}
              className={`text-sm font-medium transition-colors ${activeView === "about" ? "text-blue-600" : "text-slate-600 hover:text-slate-900"}`}
            >
              About Doctor
            </button>
            <button
              onClick={() => handleNavClick("blogs")}
              className={`text-sm font-medium transition-colors ${activeView === "blogs" ? "text-blue-600" : "text-slate-600 hover:text-slate-900"}`}
            >
              Health Blog
            </button>
            <button
              onClick={() => handleNavClick("reviews")}
              className={`text-sm font-medium transition-colors ${activeView === "reviews" ? "text-blue-600" : "text-slate-600 hover:text-slate-900"}`}
            >
              Patient Reviews
            </button>
            <button
              onClick={() => handleNavClick("contact")}
              className={`text-sm font-medium transition-colors ${activeView === "contact" ? "text-blue-600" : "text-slate-600 hover:text-slate-900"}`}
            >
              Contact Us
            </button>
          </nav>

          {/* Authentication Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              // After Login Layout
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleNavClick("dashboard")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    activeView === "dashboard"
                      ? "bg-blue-50 border-blue-200 text-blue-700"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
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
                <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 rounded-full border border-slate-150">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 max-w-[100px] truncate">
                    {user.name.split(",")[0]}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <LogIn size={16} />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => onOpenAuth("register")}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                >
                  <UserPlus size={16} />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Navigation Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-4 space-y-1 bg-white border-b border-slate-150">
          <button
            onClick={() => handleNavClick("home")}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeView === "home" ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"}`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick("services")}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeView === "services" ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"}`}
          >
            Services
          </button>
          <button
            onClick={() => handleNavClick("about")}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeView === "about" ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"}`}
          >
            About Doctor
          </button>
          <button
            onClick={() => handleNavClick("blogs")}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeView === "blogs" ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"}`}
          >
            Health Blog
          </button>
          <button
            onClick={() => handleNavClick("reviews")}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeView === "reviews" ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"}`}
          >
            Reviews
          </button>
          <button
            onClick={() => handleNavClick("contact")}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeView === "contact" ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"}`}
          >
            Contact
          </button>

          {user && (
            <button
              onClick={() => handleNavClick("dashboard")}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm font-semibold border ${
                activeView === "dashboard"
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "border-slate-250 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {user.role === "doctor" ? "Doctor Dashboard" : "My Appointments"}
            </button>
          )}

          <div className="pt-3 mt-3 border-t border-slate-100">
            {user ? (
              <div className="space-y-2 px-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800 leading-none">{user.name}</p>
                    <p className="text-slate-500 mt-0.5">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full py-2 flex items-center justify-center gap-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-md transition-colors"
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
                  className="w-full py-2 flex items-center justify-center gap-1 text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <LogIn size={15} />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth("register");
                  }}
                  className="w-full py-2 flex items-center justify-center gap-1 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
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
