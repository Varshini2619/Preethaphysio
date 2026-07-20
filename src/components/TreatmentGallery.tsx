import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

interface TreatmentImage {
  id: string;
  title: string;
  image: string;
  description: string;
}

const treatmentImages: TreatmentImage[] = [
  {
    id: "1",
    title: "Manual Therapy",
    image: "/assets/images/manual-therapy.jpg",
    description: "Expert hands-on treatment for pain relief"
  },
  {
    id: "2", 
    title: "Exercise Rehabilitation",
    image: "/assets/images/exercise-rehab.jpg",
    description: "Customized exercise programs for recovery"
  },
  {
    id: "3",
    title: "Electrotherapy",
    image: "/assets/images/electrotherapy.jpg",
    description: "Advanced electrical stimulation treatments"
  },
  {
    id: "4",
    title: "Joint Mobilization",
    image: "/assets/images/joint-mobilization.jpg",
    description: "Gentle joint manipulation techniques"
  },
  {
    id: "5",
    title: "Posture Correction",
    image: "/assets/images/posture-correction.jpg",
    description: "Ergonomic assessment and correction"
  },
  {
    id: "6",
    title: "Gait Training",
    image: "/assets/images/gait-training.jpg",
    description: "Walking pattern improvement therapy"
  }
];

export default function TreatmentGallery() {
  const [scrollPosition, setScrollPosition] = useState(0);

  // Auto-scroll animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition((prev) => {
        const newPosition = prev + 1;
        return newPosition > 100 ? 0 : newPosition;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="treatment-gallery" className="py-16 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="font-bold text-xs tracking-widest uppercase text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full inline-block">
            Our Treatment Approach
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 italic">
            See How We Treat
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Experience our comprehensive treatment methods through smooth, animated visuals of our therapy sessions.
          </p>
        </div>

        {/* Horizontal Motion Gallery */}
        <div className="relative">
          <motion.div
            animate={{ x: `-${scrollPosition}%` }}
            transition={{ type: "tween", duration: 0.05 }}
            className="flex gap-6"
            style={{ width: "200%" }}
          >
            {/* First set of images */}
            {treatmentImages.map((item, index) => (
              <motion.div
                key={`first-${item.id}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 w-[calc(20%-10px)] relative group rounded-2xl overflow-hidden shadow-lg cursor-pointer"
              >
                <div className="aspect-[4/3] bg-slate-200 relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Hover Overlay */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6"
                  >
                    <motion.h3 
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      className="text-xl font-bold text-white mb-2"
                    >
                      {item.title}
                    </motion.h3>
                    <motion.p 
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-sm text-gray-200"
                    >
                      {item.description}
                    </motion.p>
                  </motion.div>
                </div>
              </motion.div>
            ))}

            {/* Duplicate set for seamless loop */}
            {treatmentImages.map((item, index) => (
              <motion.div
                key={`second-${item.id}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 w-[calc(20%-10px)] relative group rounded-2xl overflow-hidden shadow-lg cursor-pointer"
              >
                <div className="aspect-[4/3] bg-slate-200 relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Hover Overlay */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6"
                  >
                    <motion.h3 
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      className="text-xl font-bold text-white mb-2"
                    >
                      {item.title}
                    </motion.h3>
                    <motion.p 
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-sm text-gray-200"
                    >
                      {item.description}
                    </motion.p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>


      </div>
    </section>
  );
}
