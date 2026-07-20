import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import TreatmentGallery from "./components/TreatmentGallery";
import AboutDoctor from "./components/AboutDoctor";
import BookingCalendar from "./components/BookingCalendar";
import ReviewsSection from "./components/ReviewsSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import SimulatedEmailInbox from "./components/SimulatedEmailInbox";
import PatientDashboard from "./components/PatientDashboard";
import DoctorDashboard from "./components/DoctorDashboard";
import Blogs from "./components/Blogs";
import { User } from "./types";
import { API_BASE_URL } from "./config";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<"home" | "dashboard">("home");
  
  // Auth Modal States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register" | "doctor">("login");

  // Booking details focus
  const [selectedServiceFocus, setSelectedServiceFocus] = useState("");

  // Check login on startup
  const checkProfile = async () => {
    const token = localStorage.getItem("physio_clinic_token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/profile`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
      } else {
        localStorage.removeItem("physio_clinic_token");
        setUser(null);
      }
    } catch (e) {
      console.error("Startup auth check failed.", e);
    }
  };

  useEffect(() => {
    checkProfile();
  }, []);

  const handleLoginSuccess = (token: string, loggedInUser: User) => {
    localStorage.setItem("physio_clinic_token", token);
    setUser(loggedInUser);
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("physio_clinic_token");
    setUser(null);
    setActiveView("home");
  };

  // Trigger modal open
  const handleOpenAuth = (mode: "login" | "register" | "doctor" = "login") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  // Scroll or redirect navigation helper
  const handleNavigation = (sectionId: string) => {
    if (sectionId === "dashboard") {
      if (user) {
        setActiveView("dashboard");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        handleOpenAuth("login");
      }
      return;
    }

    // Go to home view first
    setActiveView("home");
    
    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Small delay to allow home view to render before scrolling
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // Triggers booking calendar with a selected service category
  const handleBookService = (serviceTitle: string) => {
    setSelectedServiceFocus(serviceTitle);
    handleNavigation("book-appointment");
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 transition-colors duration-200 selection:bg-blue-600 selection:text-white font-sans">
      
      {/* Clinic Header Navigation */}
      <Header 
        user={user} 
        activeView={activeView}
        onNavigate={handleNavigation}
        onLogout={handleLogout}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Content Render */}
      <main className="pt-16">
        {activeView === "dashboard" && user ? (
          /* Conditional Dashboard (Doctor vs Patient) */
          user.role === "doctor" ? (
            <DoctorDashboard doctorUser={user} />
          ) : (
            <PatientDashboard 
              user={user} 
              onProfileUpdate={setUser} 
              onNavigateToBooking={() => handleNavigation("book-appointment")}
            />
          )
        ) : (
          /* Multi-Section Home Presentation */
          <>
            <Hero 
              onBookClick={() => handleNavigation("book-appointment")} 
              onConsultationClick={() => handleNavigation("book-appointment")} 
            />
            <Services onServiceSelect={handleBookService} />
            <TreatmentGallery />
            <AboutDoctor />
            <Blogs />
            <BookingCalendar 
              user={user} 
              onOpenAuth={handleOpenAuth} 
              initialServiceFocus={selectedServiceFocus}
            />
            <ReviewsSection user={user} onOpenAuth={handleOpenAuth} />
            <ContactSection />
          </>
        )}
      </main>

      {/* Footer Branding Links */}
      <Footer onNavigate={handleNavigation} />

      {/* Interactive Floating Email intercept console */}
      <SimulatedEmailInbox />

      {/* Authentic Verification Modals */}
      <AuthModal 
        isOpen={isAuthOpen} 
        initialMode={authMode} 
        onClose={() => setIsAuthOpen(false)} 
        onAuthSuccess={handleLoginSuccess}
      />

    </div>
  );
}
