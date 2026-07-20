import React, { useState } from "react";
import { Calendar, Clock, ArrowRight, User, X } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "5 Simple Exercises to Relieve Back Pain at Home",
    excerpt: "Learn easy-to-do stretches and strengthening exercises that can help alleviate chronic back pain and improve your daily comfort.",
    content: "Back pain is one of the most common complaints that brings patients to physiotherapy clinics. Fortunately, there are several simple exercises you can do at home to help alleviate back pain and prevent future episodes.\n\n1. **Knee-to-Chest Stretch**: Lie on your back with your knees bent and feet flat on the floor. Bring one knee to your chest, holding it with both hands for 15-30 seconds. Repeat with the other leg.\n\n2. **Cat-Cow Stretch**: Start on your hands and knees. Arch your back like a cat, then slowly lower your back while lifting your head. Repeat 10-15 times.\n\n3. **Bird Dog**: On hands and knees, extend one arm forward and the opposite leg backward. Hold for 5 seconds, then switch sides. Repeat 10 times.\n\n4. **Pelvic Tilt**: Lie on your back with knees bent. Tighten your abdominal muscles and tilt your pelvis upward. Hold for 5-10 seconds.\n\n5. **Bridge Exercise**: Lie on your back with knees bent. Lift your hips toward the ceiling, squeezing your glutes. Hold for 5 seconds, then lower.\n\nPerform these exercises daily for best results. If pain persists or worsens, consult with Dr. Preetha for a personalized treatment plan.",
    author: "Dr. Preetha BPT",
    date: "June 15, 2024",
    readTime: "5 min read",
    category: "Back Pain"
  },
  {
    id: "2",
    title: "Understanding Neck Pain: Causes and Prevention",
    excerpt: "Discover the common causes of neck pain, including poor posture and tech neck, and learn preventive measures to keep your neck healthy.",
    content: "Neck pain has become increasingly common in our digital age, often referred to as 'tech neck' due to prolonged smartphone and computer use. Understanding the causes and implementing preventive measures can significantly reduce neck discomfort.\n\n**Common Causes:**\n- Poor posture while working at computers\n- Prolonged smartphone use looking downward\n- Sleeping in awkward positions\n- Stress and muscle tension\n- Lack of regular neck exercises\n\n**Prevention Strategies:**\n\n1. **Ergonomic Setup**: Ensure your computer monitor is at eye level and your chair provides proper neck support.\n\n2. **Regular Breaks**: Take frequent breaks from screens every 20-30 minutes to stretch and move.\n\n3. **Neck Exercises**: Perform gentle neck rotations and side stretches daily.\n\n4. **Sleep Position**: Use a supportive pillow that keeps your neck aligned with your spine.\n\n5. **Stress Management**: Practice relaxation techniques to reduce muscle tension.\n\nIf you experience persistent neck pain, early intervention through physiotherapy can prevent chronic issues and restore proper neck function.",
    author: "Dr. Preetha BPT",
    date: "June 10, 2024",
    readTime: "4 min read",
    category: "Neck Pain"
  },
  {
    id: "3",
    title: "Post-Surgery Rehabilitation: What to Expect",
    excerpt: "A comprehensive guide to post-surgical rehabilitation, including timeline, exercises, and tips for a smooth recovery journey.",
    content: "Post-surgery rehabilitation is a crucial phase of your recovery journey. Understanding what to expect can help you prepare mentally and physically for the road ahead.\n\n**Recovery Timeline:**\n\n**Weeks 1-2**: Focus on pain management, gentle movements, and wound healing. Your physiotherapist will guide you through basic range-of-motion exercises.\n\n**Weeks 3-6**: Progress to strengthening exercises and functional movements. You'll work on regaining muscle strength around the surgical area.\n\n**Weeks 7-12**: Advanced rehabilitation focusing on sport-specific or daily activity movements. Balance and coordination exercises become important.\n\n**Key Rehabilitation Components:**\n\n1. **Pain Management**: Learning to manage pain through proper movement patterns and modalities.\n\n2. **Range of Motion**: Gradually restoring normal movement in the affected area.\n\n3. **Strengthening**: Building muscle strength to support the surgical site.\n\n4. **Functional Training**: Practicing movements needed for daily activities.\n\n**Tips for Success:**\n- Follow your physiotherapist's exercise plan consistently\n- Communicate any concerns or pain increases immediately\n- Stay positive and patient with your progress\n- Maintain proper nutrition for healing\n- Get adequate rest between exercise sessions\n\nEvery surgery and recovery is unique. Dr. Preetha will create a personalized rehabilitation plan based on your specific procedure and needs.",
    author: "Dr. Preetha BPT",
    date: "June 5, 2024",
    readTime: "6 min read",
    category: "Rehabilitation"
  },
  {
    id: "4",
    title: "Sports Injury Prevention for Athletes",
    excerpt: "Essential tips and exercises to prevent common sports injuries and keep performing at your best level.",
    content: "Sports injuries can derail athletic progress and cause long-term damage if not properly addressed. Prevention is always better than treatment, and implementing these strategies can keep you performing at your best.\n\n**Common Sports Injuries:**\n- Ankle sprains\n- Knee injuries (ACL, meniscus)\n- Shoulder injuries\n- Tennis elbow\n- Hamstring strains\n\n**Prevention Strategies:**\n\n1. **Proper Warm-Up**: Always spend 10-15 minutes warming up before any physical activity. Include dynamic stretches and light cardio.\n\n2. **Strength Training**: Build balanced strength across all muscle groups to prevent imbalances that lead to injury.\n\n3. **Flexibility Work**: Regular stretching improves range of motion and reduces injury risk.\n\n4. **Proper Technique**: Learn and maintain correct form for your sport or exercise.\n\n5. **Gradual Progression**: Increase intensity, duration, and weight gradually to allow your body to adapt.\n\n6. **Rest and Recovery**: Allow adequate rest days between intense training sessions.\n\n7. **Proper Equipment**: Use appropriate footwear and protective gear for your sport.\n\n8. **Listen to Your Body**: Pay attention to warning signs and don't push through pain.\n\n**Injury Management:**\nIf you do get injured, follow the R.I.C.E. protocol (Rest, Ice, Compression, Elevation) initially and seek professional physiotherapy assessment. Early intervention can significantly speed recovery and prevent re-injury.\n\nDr. Preetha specializes in sports injury rehabilitation and can create sport-specific prevention and treatment programs tailored to your athletic goals.",
    author: "Dr. Preetha BPT",
    date: "May 28, 2024",
    readTime: "5 min read",
    category: "Sports"
  },
  {
    id: "5",
    title: "Arthritis Management Through Physiotherapy",
    excerpt: "How physiotherapy can help manage arthritis symptoms, improve joint mobility, and enhance quality of life.",
    content: "Arthritis affects millions of people worldwide, causing pain, stiffness, and reduced mobility. While there's no cure, physiotherapy plays a crucial role in managing symptoms and improving quality of life.\n\n**Types of Arthritis:**\n- Osteoarthritis (wear and tear)\n- Rheumatoid arthritis (autoimmune)\n- Psoriatic arthritis\n- Gout\n\n**How Physiotherapy Helps:**\n\n1. **Pain Management**: Through various modalities including heat/cold therapy, TENS, and manual techniques.\n\n2. **Joint Mobility**: Gentle exercises and manual therapy help maintain and improve range of motion.\n\n3. **Muscle Strengthening**: Building strength around affected joints provides better support and reduces stress on the joint.\n\n4. **Balance Training**: Improves stability and reduces fall risk, especially important for older adults.\n\n5. **Education**: Teaching proper body mechanics and movement patterns to protect joints.\n\n**Exercise Recommendations:**\n\n- **Low-impact activities**: Swimming, cycling, and walking are excellent for arthritis\n- **Range of motion exercises**: Daily gentle movements to maintain flexibility\n- **Strengthening exercises**: Focus on supporting muscles around affected joints\n- **Stretching**: Regular stretching to maintain flexibility\n\n**Lifestyle Modifications:**\n- Maintain healthy weight to reduce joint stress\n- Use assistive devices when needed\n- Pace activities to avoid overexertion\n- Apply heat before exercise and cold after activity\n\nDr. Preetha develops personalized arthritis management programs that address your specific type of arthritis, affected joints, and lifestyle goals. With proper physiotherapy intervention, many patients experience significant improvement in pain levels and daily function.",
    author: "Dr. Preetha BPT",
    date: "May 20, 2024",
    readTime: "4 min read",
    category: "Arthritis"
  },
  {
    id: "6",
    title: "The Importance of Posture in Daily Life",
    excerpt: "Learn how maintaining good posture can prevent pain, improve energy levels, and boost overall well-being.",
    content: "Posture affects much more than just how you look - it impacts your overall health, energy levels, and even your mood. Poor posture is a leading cause of chronic pain and can affect your quality of life significantly.\n\n**What is Good Posture?**\nGood posture means maintaining the natural curves of your spine while sitting, standing, or moving. This includes:\n- A slight inward curve at the neck\n- A slight outward curve at the upper back\n- A slight inward curve at the lower back\n\n**Benefits of Good Posture:**\n\n1. **Reduced Pain**: Proper alignment reduces stress on muscles, ligaments, and joints\n\n2. **Improved Breathing**: Good posture allows lungs to expand fully\n\n3. **Better Digestion**: Proper alignment helps organs function optimally\n\n4. **Increased Energy**: Less energy is wasted supporting poor alignment\n\n5. **Enhanced Confidence**: Good posture projects confidence and affects mood positively\n\n**Common Posture Problems:**\n- Forward head posture (tech neck)\n- Rounded shoulders\n- Anterior pelvic tilt\n- Slouching while sitting\n\n**Improving Your Posture:**\n\n1. **Awareness**: Regularly check your posture throughout the day\n\n2. **Ergonomic Setup**: Ensure your workspace promotes good posture\n\n3. **Strengthening Exercises**: Focus on core, back, and shoulder muscles\n\n4. **Stretching**: Regularly stretch tight muscles (chest, hip flexors)\n\n5. **Movement**: Take frequent breaks from static positions\n\n**Simple Posture Exercises:**\n- Chin tucks to correct forward head posture\n- Shoulder blade squeezes\n- Wall angels for upper back alignment\n- Core strengthening exercises\n- Hip flexor stretches\n\nDr. Preetha can assess your posture and create a customized exercise program to address specific alignment issues. Small, consistent changes in posture habits can lead to significant improvements in comfort and overall well-being.",
    author: "Dr. Preetha BPT",
    date: "May 15, 2024",
    readTime: "3 min read",
    category: "Wellness"
  }
];

export default function Blogs() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  return (
    <section id="blogs" className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="font-bold text-xs tracking-widest uppercase text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full inline-block">
            Health Blog
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 italic">
            Latest Health Tips & Insights
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Stay informed with expert advice on physiotherapy, injury prevention, and wellness tips from Dr. Preetha.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article 
              key={post.id}
              onClick={() => handlePostClick(post)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
            >
              {/* Blog Content */}
              <div className="p-6">
                {/* Category & Meta */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock size={12} />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Author & Date */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User size={14} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{post.author}</p>
                      <p className="text-xs text-slate-500">{post.date}</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md">
            <span>View All Articles</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>

      {/* Blog Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={handleCloseModal}>
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  {selectedPost.category}
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">{selectedPost.title}</h2>
              </div>
              <button 
                onClick={handleCloseModal}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-slate-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Author & Date */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{selectedPost.author}</p>
                  <p className="text-xs text-slate-500">{selectedPost.date} • {selectedPost.readTime}</p>
                </div>
              </div>

              {/* Blog Content */}
              <div className="prose prose-slate max-w-none">
                {selectedPost.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <h3 key={index} className="text-lg font-bold text-slate-900 mt-6 mb-3">
                        {paragraph.replace(/\*\*/g, '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('- ')) {
                    return (
                      <ul key={index} className="list-disc pl-6 space-y-2 my-4">
                        {paragraph.split('\n').map((item, i) => (
                          <li key={i} className="text-slate-700">{item.replace('- ', '')}</li>
                        ))}
                      </ul>
                    );
                  }
                  if (paragraph.match(/^\d+\./)) {
                    return (
                      <ol key={index} className="list-decimal pl-6 space-y-2 my-4">
                        {paragraph.split('\n').map((item, i) => (
                          <li key={i} className="text-slate-700">{item.replace(/^\d+\.\s*/, '')}</li>
                        ))}
                      </ol>
                    );
                  }
                  if (paragraph.includes('**')) {
                    const parts = paragraph.split(/\*\*/);
                    return (
                      <p key={index} className="text-slate-700 leading-relaxed my-4">
                        {parts.map((part, i) => (
                          <span key={i} className={i % 2 === 1 ? 'font-bold text-slate-900' : ''}>
                            {part}
                          </span>
                        ))}
                      </p>
                    );
                  }
                  return (
                    <p key={index} className="text-slate-700 leading-relaxed my-4">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
