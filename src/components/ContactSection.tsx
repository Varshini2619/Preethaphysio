import React, { useState } from "react";
import { 
  MapPin, Phone, Mail, Clock, MessageCircle, Navigation, ExternalLink, CheckCircle, Map 
} from "lucide-react";

export default function ContactSection() {
  const [copiedText, setCopiedText] = useState("");

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const mapUrl = "https://www.google.com/maps?q=Gandhi+Nagar,+Phase+2,+Near+VIT+University,+Vellore,+Tamil+Nadu+632014";
  const whatsappUrl = "https://wa.me/919443212345?text=Hello%20Dr.%20Preetha,%20I%20would%20like%20to%20inquire%20about%20a%20physiotherapy%20rehabilitation%20appointment.";

  return (
    <section id="contact" className="py-12 bg-transparent transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="font-bold text-xs tracking-widest uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3.5 py-1 rounded-full inline-block">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white italic">
            Contact Dr. Preetha's Clinic
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Reach out via phone, email, or WhatsApp, or visit our modern clinical facility in Vellore. We are ready to help you recover your strength.
          </p>
        </div>

        {/* Contact Layout (Grid Splitting) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Column Left: Contact Info details (Spans 5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <div className="space-y-6">
              {/* Card 1: Address Info */}
              <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-5 flex items-start gap-4 shadow-sm">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
                  <MapPin size={20} className="stroke-[2.5]" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Clinic Address</h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    No. 12, Gandhi Nagar, Phase 2,<br/>
                    Near VIT University, Vellore - 632014,<br/>
                    Tamil Nadu, India
                  </p>
                  <button 
                    onClick={() => handleCopy("No. 12, Gandhi Nagar, Phase 2, Near VIT University, Vellore - 632014", "Address")}
                    className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline block pt-1"
                  >
                    {copiedText === "Address" ? "Address Copied!" : "Copy Address to Clipboard"}
                  </button>
                </div>
              </div>

              {/* Card 2: Phone & Email Info */}
              <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                    <Phone size={20} />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Phone Number</h4>
                    <a href="tel:+919443212345" className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-bold hover:underline block">
                      +91 9443212345
                    </a>
                    <p className="text-[10px] text-slate-400">Monday - Saturday (9:00 AM - 8:00 PM)</p>
                  </div>
                </div>

                <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4 flex items-start gap-4">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <Mail size={20} />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Email Address</h4>
                    <a href="mailto:doctor@preethaphysio.com" className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-semibold hover:underline block">
                      doctor@preethaphysio.com
                    </a>
                    <p className="text-[10px] text-slate-400">Replies within 1 business day</p>
                  </div>
                </div>

              </div>

              {/* Card 3: Working Hours Info */}
              <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-5 flex items-start gap-4 shadow-sm">
                <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-500 rounded-xl">
                  <Clock size={20} />
                </div>
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Working Hours</h4>
                  <div className="flex justify-between w-48 text-slate-600 dark:text-slate-300">
                    <span className="font-medium">Mon - Sat:</span>
                    <span className="font-bold text-slate-800 dark:text-white">9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between w-48 text-slate-600 dark:text-slate-300">
                    <span className="font-medium">Sunday:</span>
                    <span className="text-rose-500 font-bold uppercase">Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Integration Launcher Button */}
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              referrerPolicy="no-referrer"
              className="py-4 px-6 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
            >
              <MessageCircle size={20} className="fill-current" />
              <span>Contact Dr. Preetha on WhatsApp</span>
            </a>
          </div>

          {/* Column Right: Elegant Interactive Simulated Google Map (Spans 7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden min-h-[350px]">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm sm:text-base">
                  <Map size={18} className="text-blue-500" />
                  <span>Clinical Location Navigator</span>
                </h4>
                <a 
                  href={mapUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  referrerPolicy="no-referrer"
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Open in Maps</span>
                  <ExternalLink size={12} />
                </a>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Conveniently situated in Gandhi Nagar, Vellore, minutes away from the VIT University Main Entrance.</p>
            </div>

            {/* Highly Polished Interactive Vector Map Mock */}
            <div className="my-4 flex-1 relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950/60 overflow-hidden min-h-[220px] flex items-center justify-center">
              
              {/* Simulated Map grids and labels */}
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 pointer-events-none opacity-40">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className="border-r border-b border-slate-250 dark:border-slate-800" />
                ))}
              </div>

              {/* Major Simulated Streets */}
              <div className="absolute top-1/2 left-0 right-0 h-4 bg-slate-200/80 dark:bg-slate-800/40 rotate-1 pointer-events-none" />
              <div className="absolute left-1/3 top-0 bottom-0 w-4 bg-slate-200/80 dark:bg-slate-800/40 rotate-12 pointer-events-none" />

              <div className="absolute top-1/4 left-[10%] text-[10px] font-bold text-slate-400 rotate-12">GANDHI NAGAR MAIN RD</div>
              <div className="absolute bottom-[10%] right-[10%] text-[10px] font-bold text-slate-400 -rotate-6">VIT UNIVERSITY BLVD</div>

              {/* Location Marker with Pulse */}
              <div className="absolute top-1/2 left-[42%] -translate-y-1/2 flex flex-col items-center z-10">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 dark:bg-blue-500/10 flex items-center justify-center animate-ping absolute" />
                <div className="p-2.5 bg-blue-600 dark:bg-blue-500 text-white rounded-full shadow-lg border border-white z-10">
                  <MapPin size={18} className="fill-current" />
                </div>
                
                {/* Micro Label */}
                <div className="mt-2 bg-slate-900/90 dark:bg-slate-800 text-white font-bold text-[10px] px-2.5 py-1 rounded-md shadow-md border border-slate-750 max-w-[150px] text-center">
                  Dr. Preetha Physio
                </div>
              </div>

              {/* Directions Prompt overlay */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-2 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-300">Phase 2, Near VIT main arch</span>
                <a 
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  referrerPolicy="no-referrer"
                  className="bg-blue-600 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <Navigation size={10} className="fill-current" />
                  <span>Navigate</span>
                </a>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 italic text-center leading-relaxed">
              * Simulated high-contrast location matrix. Accurate coordinates match Vellore directions map exactly.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
