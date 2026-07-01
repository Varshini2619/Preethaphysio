import React from "react";
import { 
  Award, Shield, FileText, Heart, Activity, CheckCircle, GraduationCap, Clock 
} from "lucide-react";

export default function AboutDoctor() {
  return (
    <section id="about" className="py-12 bg-transparent transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="font-bold text-xs tracking-widest uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3.5 py-1 rounded-full inline-block">
            Chief Consultant
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white italic">
            Meet Dr. Preetha, BPT
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Introducing our Lead Physiotherapist, combining a highly patient-centered clinical approach with advanced academic credentials in orthopedic rehabilitation.
          </p>
        </div>

        {/* Doctor Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Card Left: Elegant Image & Vision (Spans 5 Columns) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-750 dark:to-indigo-900 rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
            {/* Background vector decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-48 h-48 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />

            <div className="space-y-6 relative z-10">
              {/* Doctor Avatar Badge */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-3xl shadow-inner border border-white/25">
                  DP
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight">Dr. Preetha</h3>
                  <p className="text-xs text-sky-200 font-semibold tracking-wide uppercase">BPT (Physiotherapy)</p>
                  <p className="text-[11px] text-white/80 mt-1">Reg No: PT-22831/TN</p>
                </div>
              </div>

              {/* Clinic Vision Statement */}
              <div className="pt-6 border-t border-white/15 space-y-3">
                <p className="text-[10px] font-bold tracking-widest text-sky-200 uppercase">Clinic Vision</p>
                <p className="text-lg italic font-medium leading-relaxed">
                  "Relieving Pain, Restoring Movement, Enhancing Life"
                </p>
                <p className="text-xs text-white/80 leading-relaxed">
                  My vision is to empower the Vellore community to live free from mechanical physical pain through precise clinical alignments, target movement rehabilitation, and custom home compliance guides.
                </p>
              </div>
            </div>

            {/* Treatment Philosophy Badge */}
            <div className="mt-8 pt-6 border-t border-white/15 space-y-3 relative z-10">
              <p className="text-[10px] font-bold tracking-widest text-sky-200 uppercase">Treatment Philosophy</p>
              <p className="text-xs text-white/90 leading-relaxed">
                Rehabilitation is not just about passive treatments like heat packs; it is a collaborative effort. We identify the structural root-cause of your mechanical dysfunction and build a custom physical framework to restore and protect your movement patterns long-term.
              </p>
            </div>
          </div>

          {/* Card Right: Qualifications & Experience Detail Bento Cards (Spans 7 Columns) */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Bento Card 1: Education & Qualifications */}
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
                  <GraduationCap size={20} />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">Qualifications</h4>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li className="flex gap-2">
                  <CheckCircle size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">BPT (Physiotherapy)</span>
                    <p className="text-xs text-slate-500 mt-0.5">Bachelor of Physiotherapy - Comprehensive training in anatomy, biomechanics, and exercise physiology.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Bento Card 2: Professional Credentials / Certifications */}
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Award size={20} />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">Certifications</h4>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Certified Dry Needling Practitioner (CDNP)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Mulligan Manual Therapy Concept Specialist</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Certified Kinesio Taping Therapist (CKTT)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Myofascial Release Therapy (MFR) Specialist</span>
                </li>
              </ul>
            </div>

            {/* Bento Card 3: Experience & Track Record */}
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 space-y-3.5 shadow-sm hover:shadow-md transition-shadow md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
                    <Clock size={16} />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Experience Metrics</h4>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Continuous dedication to clinical recovery and academic excellence in rehabilitative treatments.</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-750 text-center space-y-1 shadow-sm">
                <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">3+ Years</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Practice</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-750 text-center space-y-1 shadow-sm">
                <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">100+</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Happy Patients</p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
