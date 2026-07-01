import React, { useState, useEffect } from "react";
import { 
  Star, MessageSquare, Plus, Edit2, AlertCircle, Sparkles, Check, CheckCircle 
} from "lucide-react";
import { Review, User } from "../types";
import { API_BASE_URL } from "../config";

interface ReviewsSectionProps {
  user: User | null;
  onOpenAuth: (mode: "login") => void;
}

export default function ReviewsSection({ user, onOpenAuth }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<any>({ average: 5.0, total: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews`);
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews || []);
        setStats(data.stats || { average: 5.0, total: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
      }
    } catch (err) {
      console.error("Failed to load reviews.", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleStarClick = (num: number) => {
    setRating(num);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth("login");
      return;
    }
    if (!comment.trim()) {
      setError("Please write a small message for your review.");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("physio_clinic_token");
      const res = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          rating,
          comment,
          id: editingId || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit review");

      setMessage(data.message || "Review submitted successfully!");
      setComment("");
      setRating(5);
      setEditingId(null);
      setShowForm(false);
      fetchReviews();
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (review: Review) => {
    setEditingId(review.id);
    setRating(review.rating);
    setComment(review.comment);
    setShowForm(true);
    // Scroll to form nicely
    document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setComment("");
    setRating(5);
    setShowForm(false);
  };

  const renderStars = (count: number, interactive = false, clickHandler?: (n: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((num) => {
          const filled = num <= count;
          return (
            <Star
              key={num}
              size={interactive ? 24 : 16}
              onClick={() => interactive && clickHandler && clickHandler(num)}
              className={`${
                filled 
                  ? "text-yellow-400 fill-yellow-400" 
                  : "text-slate-250 dark:text-slate-700"
              } ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <section id="reviews" className="py-12 bg-transparent transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="font-bold text-xs tracking-widest uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3.5 py-1 rounded-full inline-block">
            Patient Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white italic">
            Reviews & Rehabilitation Success
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Read authentic testimonials and recovery reports from our patients in Vellore. We strive to offer top-tier physical rehabilitation.
          </p>
        </div>

        {/* Aggregate Ratings Overview & Review Builder (Bento Grid Split) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-12">
          
          {/* Rating Summary Block (Spans 5 Cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 space-y-6 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Patient Satisfaction Rating</h3>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-5xl font-extrabold text-slate-900 dark:text-white leading-none">
                  {stats.average}
                </p>
                <div className="mt-2.5 flex justify-center">
                  {renderStars(Math.round(stats.average))}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-semibold">
                  Based on {stats.total} patient reviews
                </p>
              </div>

              {/* Progress Distribution Bars */}
              <div className="flex-1 space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats.distribution[star] || 0;
                  const percent = stats.total > 0 ? (count / stats.total) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <span className="w-3 text-right">{star}★</span>
                      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-400 rounded-full" 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="w-6 text-right text-slate-400">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Write a Review Button Hook */}
            {!showForm && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                {user ? (
                  user.role === "patient" ? (
                    <button
                      onClick={() => setShowForm(true)}
                      className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus size={16} />
                      <span>Write Clinical Review</span>
                    </button>
                  ) : (
                    <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 rounded-xl text-xs font-semibold text-center border border-indigo-100 dark:border-indigo-900/40">
                      Doctor account is active. Reviews are written by verified patients.
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => onOpenAuth("login")}
                    className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-700"
                  >
                    <span>Sign In to Leave Feedback</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Collapsible/Active Review Form Block (Spans 7 Cols) */}
          <div className="lg:col-span-7">
            {showForm && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 space-y-4 shadow-sm">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {editingId ? "Edit Your Feedback" : "Share Your Recovery Story"}
                  </h3>
                  <button onClick={cancelEdit} className="text-xs text-slate-400 hover:text-slate-600 font-semibold">
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {error && (
                    <p className="text-xs text-red-500 font-semibold bg-red-50 p-2 rounded border border-red-100 flex items-center gap-1">
                      <AlertCircle size={14} /> {error}
                    </p>
                  )}
                  {message && (
                    <p className="text-xs text-emerald-600 font-semibold bg-emerald-50 p-2 rounded border border-emerald-100 flex items-center gap-1">
                      <CheckCircle size={14} /> {message}
                    </p>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Rate Clinical Experience *</label>
                    <div className="flex items-center gap-3">
                      {renderStars(rating, true, handleStarClick)}
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        ({rating} of 5 Stars)
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Your Review Message *</label>
                    <textarea
                      rows={4}
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                      placeholder="Share details about your condition, the sessions with Dr. Preetha, and how your pain has recovered..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Submit Review</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
            
            {/* Elegant Callout when Form Closed */}
            {!showForm && (
              <div className="p-8 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm rounded-3xl flex items-start gap-4 h-full justify-center flex-col">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Sparkles size={20} className="animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-150">Transparency matters to us</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    All reviews are written by registered patients who have completed active physiotherapy sessions at our Vellore clinic or via online consultation.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Latest Testimonial Feed List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => {
            const isAuthor = user && user.role === "patient" && rev.patientName.toLowerCase() === user.name.toLowerCase();
            const initials = rev.patientName.split(" ").map(n => n.charAt(0)).join("").toUpperCase();

            return (
              <div 
                key={rev.id}
                id={`review-card-${rev.id}`}
                className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 p-6 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md hover:border-blue-150 dark:hover:border-blue-900/40 transition-all duration-200"
              >
                <div className="space-y-3.5">
                  {/* Testimonial Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-600 dark:text-indigo-400 uppercase">
                        {initials}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                          {rev.patientName}
                        </h4>
                        <span className="text-[10px] text-slate-400 block">
                          {new Date(rev.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    {/* Star Rating Display */}
                    <div className="flex gap-0.5 text-yellow-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} size={13} className="fill-current" />
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Edit Controls */}
                {isAuthor && (
                  <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-800 flex justify-end">
                    <button
                      onClick={() => startEdit(rev)}
                      className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <Edit2 size={11} />
                      <span>Edit My Review</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
