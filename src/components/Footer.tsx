import React from "react";
import { Stethoscope, Facebook, Twitter, Instagram, Linkedin, ArrowUp } from "lucide-react";

interface FooterProps {
  onNavigate: (section: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Column 1: Brand & Vision (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate("home")}>
              <div className="text-xl tracking-tight text-white font-serif italic font-extrabold flex items-center gap-1.5">
                <span className="text-blue-500 font-sans">✦</span> Dr. Preetha
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              "Relieving Pain, Restoring Movement, Enhancing Life." We specialize in customized clinical assessments, target exercises, and expert manual rehabilitation programs.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 text-slate-400">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-colors">
                <Facebook size={16} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-sky-400 transition-colors">
                <Twitter size={16} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-500 transition-colors">
                <Instagram size={16} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (2 cols) */}
          <div className="md:col-span-2 space-y-3 text-xs sm:text-sm">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Quick Links</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => onNavigate("home")} className="hover:text-white transition-colors">Home</button>
              </li>
              <li>
                <button onClick={() => onNavigate("services")} className="hover:text-white transition-colors">Services</button>
              </li>
              <li>
                <button onClick={() => onNavigate("about")} className="hover:text-white transition-colors">About Doctor</button>
              </li>
              <li>
                <button onClick={() => onNavigate("reviews")} className="hover:text-white transition-colors">Reviews</button>
              </li>
              <li>
                <button onClick={() => onNavigate("contact")} className="hover:text-white transition-colors">Contact Us</button>
              </li>
            </ul>
          </div>

          {/* Column 3: Services Summary (3 cols) */}
          <div className="md:col-span-3 space-y-3 text-xs sm:text-sm">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Clinical Focus</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Back Pain & Sciatica</li>
              <li>Neck & Cervical Care</li>
              <li>Knee & Joint Rehab</li>
              <li>ACL & Post-Surgery Recovery</li>
              <li>Arthritis Pain Management</li>
              <li>Online Physiotherapy</li>
            </ul>
          </div>

          {/* Column 4: Contact & Hours (3 cols) */}
          <div className="md:col-span-3 space-y-3 text-xs sm:text-sm">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Working Hours</h4>
            <div className="space-y-2 text-slate-400">
              <p>
                <strong className="text-white block">Mon - Sat:</strong>
                9:00 AM - 8:00 PM
              </p>
              <p>
                <strong className="text-white block">Sunday:</strong>
                <span className="text-rose-400 font-semibold uppercase">Closed (Holiday)</span>
              </p>
              <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-800">
                Vellore Clinic visits & online telehealth schedules.
              </p>
            </div>
          </div>

        </div>

        {/* Footer Base bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Dr. Preetha Physiotherapy Clinic. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-300">Terms of Use</a>
            <button 
              onClick={handleScrollTop}
              className="flex items-center gap-1 hover:text-slate-300"
            >
              <span>Back to Top</span>
              <ArrowUp size={12} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
