import React from "react";
import { 
  Dumbbell, Activity, GitCommit, Zap, HeartPulse, Sparkles, Brain, Baby, Milestone, Video, Clock, CheckCircle2, ArrowRight
} from "lucide-react";
import { ServiceDetail } from "../types";

interface ServicesProps {
  onServiceSelect: (serviceName: string) => void;
}

export const servicesData: ServiceDetail[] = [
  {
    id: "back-pain",
    title: "Back Pain Treatment",
    description: "Targeted decompression therapy, lumbar alignment exercises, and spinal mobilization designed to eliminate acute & chronic back pain.",
    benefits: ["Relieves sciatic nerve compression", "Improves spinal core strength", "Restores lumbar range of motion"],
    duration: "45 - 60 Mins",
    iconName: "back",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&h=300&fit=crop"
  },
  {
    id: "neck-pain",
    title: "Neck & Cervical Pain Treatment",
    description: "Expert neck traction, manual cervical adjustments, and posture re-education to alleviate stiffness, cervical spondylosis, and headaches.",
    benefits: ["Reduces muscle spasm in upper back", "Aleviates tension headaches", "Corrects text-neck alignment issues"],
    duration: "40 - 50 Mins",
    iconName: "neck",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500&h=300&fit=crop"
  },
  {
    id: "joint-rehab",
    title: "Joint Pain Rehabilitation",
    description: "Specialized rehabilitation for shoulder impingements, frozen shoulder, hip stiffness, and elbow dysfunction using advanced manual therapy.",
    benefits: ["Restores full joint articulation", "Reduces articular inflammation", "Strengthens surrounding stabilizer muscles"],
    duration: "45 Mins",
    iconName: "joint",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&h=300&fit=crop"
  },
  {
    id: "sports-injury",
    title: "Sports Injury Recovery",
    description: "Rapid return-to-play programs for ligament sprains, muscle strains, ACL tears, tennis elbow, and rotator cuff injuries with kinesio-taping.",
    benefits: ["Accelerates tissue repair cycles", "Prevents muscle atrophy during rest", "Restores sports-specific joint proprioception"],
    duration: "60 Mins",
    iconName: "sports",
    image: "https://images.unsplash.com/photo-1552674605-46d536f20f2c?w=500&h=300&fit=crop"
  },
  {
    id: "post-surgery",
    title: "Post-Surgery Rehabilitation",
    description: "Guided recovery protocols following knee replacements (TKR), hip replacements (THR), fracture fixations, and ligament reconstructions.",
    benefits: ["Manages post-operative scar tissue", "Safely rebuilds full weight-bearing capacity", "Minimizes post-surgical stiffness"],
    duration: "50 - 60 Mins",
    iconName: "surgery",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=500&h=300&fit=crop"
  },
  {
    id: "arthritis",
    title: "Arthritis & Osteoarthritis Management",
    description: "Gentle mobilizations, low-impact muscle activation, and pain-mitigation therapies to improve quality of life for Osteoarthritis & RA patients.",
    benefits: ["Reduces joint friction and pain", "Maintains bone density and cartilage health", "Boosts daily functional independence"],
    duration: "40 Mins",
    iconName: "arthritis",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop"
  },
  {
    id: "neuro-physio",
    title: "Neurological Physiotherapy",
    description: "Neuro-muscular re-education and gait training for stroke rehabilitation, Parkinson's disease, multiple sclerosis, and nerve injuries.",
    benefits: ["Re-establishes balance and coordination", "Manages muscle spasticity", "Enhances neural plasticity & motor control"],
    duration: "60 - 75 Mins",
    iconName: "neuro",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=500&h=300&fit=crop"
  },
  {
    id: "pediatric-physio",
    title: "Pediatric Physiotherapy",
    description: "Specialized pediatric rehab for developmental delays, cerebral palsy, and juvenile orthopedics in a comforting child-friendly format.",
    benefits: ["Promotes timely milestone achievement", "Improves muscle tone and gait", "Enhances motor integration"],
    duration: "45 Mins",
    iconName: "pediatric",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&h=300&fit=crop"
  },
  {
    id: "geriatric-physio",
    title: "Geriatric Physiotherapy",
    description: "Focused exercises for seniors to improve balance, prevent falls, manage age-related stiff joints, and improve daily endurance.",
    benefits: ["Substantially reduces fall risks", "Lubricates aging joints naturally", "Improves cardiovascular physical health"],
    duration: "45 Mins",
    iconName: "geriatric",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&h=300&fit=crop"
  },
  {
    id: "online-consult",
    title: "Online Physiotherapy Consultation",
    description: "Full virtual checkup, ergonomic workspace analysis, guided posture corrections, and personalized interactive home exercise video plans.",
    benefits: ["Consult comfortably from anywhere", "Custom tailored ergonomic assessment", "High-definition video-guided exercises"],
    duration: "30 - 45 Mins",
    iconName: "online",
    image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500&h=300&fit=crop"
  }
];

export default function Services({ onServiceSelect }: ServicesProps) {
  
  const getIcon = (name: string) => {
    switch (name) {
      case "back": return <Dumbbell className="h-6 w-6" />;
      case "neck": return <Activity className="h-6 w-6" />;
      case "joint": return <GitCommit className="h-6 w-6" />;
      case "sports": return <Zap className="h-6 w-6" />;
      case "surgery": return <HeartPulse className="h-6 w-6" />;
      case "arthritis": return <Sparkles className="h-6 w-6" />;
      case "neuro": return <Brain className="h-6 w-6" />;
      case "pediatric": return <Baby className="h-6 w-6" />;
      case "geriatric": return <Milestone className="h-6 w-6" />;
      case "online": return <Video className="h-6 w-6" />;
      default: return <Activity className="h-6 w-6" />;
    }
  };

  return (
    <section id="services" className="py-12 bg-transparent transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="font-bold text-xs tracking-widest uppercase text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full inline-block">
            Clinic Services
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 italic">
            Specialized Physiotherapy Programs
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Whether you are recovering from sports trauma, managing spinal back conditions, or seeking post-operative care, Dr. Preetha provides highly specialized manual clinical treatments.
          </p>
        </div>

        {/* Services Grid (Bento Style layout with generous rounding) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service) => (
            <div 
              key={service.id}
              id={`service-card-${service.id}`}
              className="bg-white rounded-3xl border border-gray-100 overflow-hidden flex flex-col shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
            >
              <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                {/* Header Row */}
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition-transform duration-200">
                    {getIcon(service.iconName)}
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-500 text-xs font-semibold rounded-full">
                    <Clock size={12} />
                    <span>{service.duration}</span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Benefit Points */}
                <div className="space-y-2 pt-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Clinical Benefits</p>
                  <ul className="space-y-1.5">
                    {service.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Consultation CTA */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <button
                    onClick={() => onServiceSelect(service.title)}
                    className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-900 text-slate-800 hover:text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <span>Book Consultation</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
