import React from "react";
import { Sparkles, Calendar, Video, Activity, Heart, Shield, Award } from "lucide-react";
import { motion } from "motion/react";

interface HeroProps {
  onBookClick: () => void;
  onConsultationClick: () => void;
}

export default function Hero({ onBookClick, onConsultationClick }: HeroProps) {
  return (
    <section className="relative overflow-hidden py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Banner Bento Box */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 dark:from-blue-700 dark:to-slate-900 p-8 sm:p-12 text-white shadow-xl">
          {/* Background Vector Art decoration representing editorial layout */}
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none hidden md:block">
            <svg width="240" height="240" viewBox="0 0 200 200" fill="currentColor">
              <path d="M100 0C44.8 0 0 44.8 0 100s44.8 100 100 100 100-44.8 100-100S155.2 0 100 0zm0 180c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"/>
              <circle cx="100" cy="100" r="30"/>
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Hero Left: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              {/* Promo Tag */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-widest"
              >
                <Sparkles size={13} className="text-blue-200 animate-spin" />
                <span>Expert Care • Vellore's Trusted Clinic</span>
              </motion.div>
  
              {/* Main Headline */}
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight italic"
              >
                Expert Physiotherapy Care for a Pain-Free Life
              </motion.h2>
  
              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-lg text-blue-50 opacity-90 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed"
              >
                Personalized treatment plans designed to reduce pain, improve mobility, and help you live comfortably. Experience dedicated physical restoration.
              </motion.p>
  
              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <button
                  onClick={onBookClick}
                  className="w-full sm:w-auto px-7 py-3 bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-xl shadow-lg transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar size={18} />
                  <span>Book Appointment</span>
                </button>
                
                <button
                  onClick={onConsultationClick}
                  className="w-full sm:w-auto px-7 py-3 bg-blue-500/30 backdrop-blur-md border border-white/30 text-white hover:bg-blue-500/50 font-bold rounded-xl transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Video size={18} />
                  <span>Online Consultation</span>
                </button>
              </motion.div>
  
              {/* Quick Badges / Trust Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-3 gap-4 pt-6 sm:pt-8 border-t border-white/10"
              >
                <div className="flex flex-col sm:flex-row items-center lg:items-start gap-2 text-center lg:text-left">
                  <div className="p-1.5 bg-white/10 rounded-lg text-white">
                    <Award size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">3+ Years</p>
                    <p className="text-[10px] text-blue-100 opacity-85 font-medium uppercase tracking-wider">Experience</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center lg:items-start gap-2 text-center lg:text-left">
                  <div className="p-1.5 bg-white/10 rounded-lg text-white">
                    <Activity size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">100+</p>
                    <p className="text-[10px] text-blue-100 opacity-85 font-medium uppercase tracking-wider">Patients</p>
                  </div>
                </div>
  
                <div className="flex flex-col sm:flex-row items-center lg:items-start gap-2 text-center lg:text-left">
                  <div className="p-1.5 bg-white/10 rounded-lg text-white">
                    <Heart size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">99.2%</p>
                    <p className="text-[10px] text-blue-100 opacity-85 font-medium uppercase tracking-wider">Success Rate</p>
                  </div>
                </div>
              </motion.div>
            </div>
  
            {/* Hero Right: Interactive Health Graphics & Treatment Cards */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center">
              
              {/* Clinical Concept Art / Modern Medical Graphic Card Grid */}
              <div className="relative w-full max-w-[360px] aspect-square rounded-3xl bg-white/5 dark:bg-slate-950/20 p-4 border border-white/10 dark:border-slate-800/30 shadow-inner flex items-center justify-center">
                
                {/* Spinning/pulsing radar/rehab circle */}
                <div className="absolute inset-4 rounded-full border border-dashed border-white/10 animate-[spin_50s_linear_infinite]" />
                <div className="absolute inset-16 rounded-full border border-dashed border-white/5 animate-[spin_30s_linear_infinite_reverse]" />
                
                {/* Doctor Bio Card (Glassmorphism Effect) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative z-10 w-[90%] bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-2xl space-y-4 text-white"
                >
                  <div className="flex items-center gap-4">
                    {/* Photo Placeholder representing doctor */}
                    <div className="w-12 h-12 rounded-full bg-white p-0.5 shadow-md shrink-0">
                      <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                        DP
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">Dr. Preetha, BPT</h3>
                      <p className="text-[11px] text-blue-100 font-medium">Chief Physiotherapist</p>
                    </div>
                  </div>
  
                  <div className="space-y-2 pt-3 border-t border-white/10 text-xs">
                    <div className="flex items-center justify-between opacity-90">
                      <span className="font-light">Clinic:</span>
                      <span className="font-semibold text-white">9:00 AM - 8:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between opacity-90">
                      <span className="font-light">Sunday:</span>
                      <span className="text-rose-300 font-semibold uppercase">Closed</span>
                    </div>
                  </div>
  
                  {/* Floating Micro-Metric */}
                  <div className="p-2 bg-white/10 rounded-xl flex items-center gap-2 border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <p className="text-[10px] font-semibold text-white">
                      Live Booking Active • 12 Openings
                    </p>
                  </div>
                </motion.div>
  
                {/* Floating element 1: Joint rehabilitation sticker */}
                <motion.div
                  initial={{ x: -20, y: -20, opacity: 0 }}
                  animate={{ x: -25, y: -45, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute top-1/4 left-0 z-20 bg-white text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 shadow-md flex items-center gap-1.5 scale-90"
                >
                  <Activity size={12} className="text-blue-600" />
                  <span className="text-[9px] font-bold">Joint Mobilization</span>
                </motion.div>
  
                {/* Floating element 2: Laser / ultrasound sticker */}
                <motion.div
                  initial={{ x: 20, y: 20, opacity: 0 }}
                  animate={{ x: 35, y: 55, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute bottom-1/4 right-0 z-20 bg-white text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 shadow-md flex items-center gap-1.5 scale-90"
                >
                  <Shield size={12} className="text-indigo-600" />
                  <span className="text-[9px] font-bold">Pain Mitigation</span>
                </motion.div>
              </div>
  
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
