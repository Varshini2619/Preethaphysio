import React, { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, Clock, Video, MapPin, CheckCircle, RefreshCw, AlertCircle, Info, ShieldCheck 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SlotAvailability, Appointment, User } from "../types";

interface BookingCalendarProps {
  user: User | null;
  onOpenAuth: (mode: "login") => void;
  initialServiceFocus?: string;
}

export default function BookingCalendar({ user, onOpenAuth, initialServiceFocus = "" }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [slots, setSlots] = useState<SlotAvailability[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [consultationType, setConsultationType] = useState<"online" | "offline">("offline");
  const [medicalNotes, setMedicalNotes] = useState("");
  const [availableCount, setAvailableCount] = useState<number>(0);
  const [isClosed, setIsClosed] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<Appointment | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [autoRefreshActive, setAutoRefreshActive] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Set default date to today or tomorrow if Sunday
  useEffect(() => {
    const today = new Date();
    if (today.getDay() === 0) {
      // If Sunday, default to Monday
      today.setDate(today.getDate() + 1);
    }
    const formatted = today.toISOString().split("T")[0];
    setSelectedDate(formatted);
    if (initialServiceFocus) {
      setMedicalNotes(`Booking for: ${initialServiceFocus}`);
    }
  }, [initialServiceFocus]);

  // Fetch slot availability when selected date changes
  const fetchAvailability = async (dateStr: string) => {
    if (!dateStr) return;
    setIsLoadingSlots(true);
    setErrorMessage("");
    try {
      const res = await fetch(`/api/slots?date=${dateStr}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load slots");
      
      setSlots(data.slots || []);
      setAvailableCount(data.availableCount || 0);
      setIsClosed(data.isClosed || false);
      setLastRefreshed(new Date());
    } catch (err: any) {
      setErrorMessage(err.message || "Could not retrieve slot coordinates.");
    } finally {
      setIsLoadingSlots(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability(selectedDate);
      setSelectedSlot("");
    }
  }, [selectedDate]);

  // Simulated live-update poller (real-time interval)
  useEffect(() => {
    if (!autoRefreshActive || !selectedDate || bookingSuccess) return;

    const interval = setInterval(() => {
      fetchAvailability(selectedDate);
    }, 8000); // Poll every 8 seconds for live sync!

    return () => clearInterval(interval);
  }, [selectedDate, autoRefreshActive, bookingSuccess]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth("login");
      return;
    }
    if (!selectedSlot) {
      setErrorMessage("Please select an available time slot before submitting.");
      return;
    }

    setIsBooking(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("physio_clinic_token");
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          date: selectedDate,
          timeSlot: selectedSlot,
          consultationType,
          medicalNotes
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");

      setBookingSuccess(data.appointment);
      // Trigger full database update on next poll/load
      fetchAvailability(selectedDate);
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while scheduling.");
    } finally {
      setIsBooking(false);
    }
  };

  const resetBookingForm = () => {
    setBookingSuccess(null);
    setSelectedSlot("");
    setMedicalNotes("");
    setConsultationType("offline");
  };

  // Helper to generate next 14 booking days list
  const getBookingDays = () => {
    const list = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      const isSunday = d.getDay() === 0;
      const dayName = d.toLocaleDateString("en-IN", { weekday: "short" });
      const dayNum = d.getDate();
      list.push({ dateStr, dayName, dayNum, isSunday });
    }
    return list;
  };

  const daysList = getBookingDays();

  return (
    <section id="book-appointment" className="py-12 bg-transparent transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="font-bold text-xs tracking-widest uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3.5 py-1 rounded-full inline-block">
            Appointment Center
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white italic">
            Smart Appointment Booking
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Book offline clinical sessions or real-time online video physiotherapy checkups with Dr. Preetha. Our calendar prevents double booking instantly.
          </p>
        </div>

        {bookingSuccess ? (
          /* Successful Confirmation View */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 p-6 sm:p-8 shadow-xl text-center space-y-6"
          >
            <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full">
              <CheckCircle size={40} className="stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Appointment Confirmed!</h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                Your session is verified. A confirmation email was sent to your inbox.
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/80 text-left space-y-3 shadow-sm text-sm">
              <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-700/50 pb-2">
                <span className="text-slate-400">Appointment ID:</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{bookingSuccess.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Patient Name:</span>
                <span className="font-semibold text-slate-800 dark:text-white">{bookingSuccess.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Doctor:</span>
                <span className="font-semibold text-slate-800 dark:text-white">Dr. Preetha</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Consultation:</span>
                <span className="font-semibold text-slate-800 dark:text-white capitalize bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs">
                  {bookingSuccess.consultationType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Scheduled Date:</span>
                <span className="font-semibold text-slate-800 dark:text-white">
                  {new Date(bookingSuccess.date).toLocaleDateString("en-IN", {
                    weekday: "long", year: "numeric", month: "long", day: "numeric"
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Time Slot:</span>
                <span className="font-semibold text-slate-800 dark:text-white">{bookingSuccess.timeSlot}</span>
              </div>

              {bookingSuccess.consultationType === "online" ? (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-xs text-blue-500 font-semibold block mb-1.5">Online Video Link:</span>
                  <a 
                    href={bookingSuccess.meetingLink} 
                    target="_blank" 
                    rel="noreferrer"
                    referrerPolicy="no-referrer"
                    className="flex items-center justify-center gap-2 p-2.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Video size={14} />
                    <span>Join Live Consultation</span>
                  </a>
                </div>
              ) : (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-xs text-slate-400 font-semibold block mb-1">Clinic Location:</span>
                  <div className="flex gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <MapPin size={14} className="text-red-500 shrink-0" />
                    <span>No. 12, Gandhi Nagar, Phase 2, Near VIT, Vellore - 632014</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={resetBookingForm}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-sm"
              >
                Book Another Appointment
              </button>
            </div>
          </motion.div>
        ) : (
          /* Calendar Booking Split View */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Date / Slot Selector Calendar Panel */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm">
              
              {/* Date Header & Poller */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CalendarIcon size={18} className="text-blue-500" />
                    <span>Select Clinic Date</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Available bookings open up to 2 weeks ahead.</p>
                </div>

                {/* Real-time sync status */}
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Live Slots Synced</span>
                  </div>
                  <button 
                    onClick={() => selectedDate && fetchAvailability(selectedDate)}
                    disabled={isLoadingSlots}
                    className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    title="Manual Refresh"
                  >
                    <RefreshCw size={14} className={isLoadingSlots ? "animate-spin" : ""} />
                  </button>
                </div>
              </div>

              {/* Multi-Day Selection Slide */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-3" id="calendar-days-grid">
                {daysList.map((day) => {
                  const isActive = selectedDate === day.dateStr;
                  const dayObj = new Date(day.dateStr);
                  const monthName = dayObj.toLocaleDateString("en-IN", { month: "short" });

                  let dayColorClass = "bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200";
                  if (day.isSunday) {
                    dayColorClass = "bg-yellow-50/70 dark:bg-yellow-950/15 border-yellow-200/50 dark:border-yellow-900/30 text-yellow-700 dark:text-yellow-500 hover:bg-yellow-100/50";
                  }
                  if (isActive) {
                    dayColorClass = "bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500 text-white hover:bg-blue-700";
                  }

                  return (
                    <button
                      key={day.dateStr}
                      type="button"
                      onClick={() => setSelectedDate(day.dateStr)}
                      className={`py-3 px-2 border rounded-xl flex flex-col items-center justify-center transition-all ${dayColorClass} cursor-pointer`}
                    >
                      <span className={`text-[10px] uppercase font-bold tracking-wider ${isActive ? "text-blue-100" : day.isSunday ? "text-yellow-600 dark:text-yellow-400" : "text-slate-400"}`}>
                        {day.dayName}
                      </span>
                      <span className="text-lg font-extrabold leading-none my-1">{day.dayNum}</span>
                      <span className={`text-[9px] font-semibold ${isActive ? "text-blue-100" : "text-slate-400"}`}>
                        {monthName}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Sunday Clinic Closed Card */}
              {isClosed ? (
                <div className="p-8 text-center bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/50 rounded-2xl space-y-2">
                  <AlertCircle size={32} className="mx-auto text-yellow-600 dark:text-yellow-500" />
                  <h4 className="text-lg font-bold text-yellow-800 dark:text-yellow-400">Sunday - Clinic Holiday</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-500 max-w-md mx-auto">
                    Dr. Preetha Physiotherapy Clinic remains closed on Sundays. Please select a Monday to Saturday date above to view available clinical slots.
                  </p>
                </div>
              ) : (
                /* Time Slots Section */
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Clock size={16} className="text-blue-500" />
                      <span>Select Available Time Slot</span>
                    </h4>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {isLoadingSlots ? "Checking..." : `${availableCount} slots free`}
                    </span>
                  </div>

                  {isLoadingSlots ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="py-3 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl h-12" />
                      ))}
                    </div>
                  ) : (
                    /* Color Coded Slot Buttons */
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" id="clinic-time-slots">
                      {slots.map((item) => {
                        const isBooked = item.status === "booked";
                        const isSelected = selectedSlot === item.slot;

                        let styleClass = "border-emerald-200/70 bg-emerald-50/50 hover:bg-emerald-100/50 text-emerald-800 dark:border-emerald-950/40 dark:bg-emerald-950/15 dark:text-emerald-400";
                        if (isBooked) {
                          styleClass = "border-red-200 bg-red-50/50 text-red-500 dark:border-red-950/50 dark:bg-red-950/10 dark:text-red-400 cursor-not-allowed";
                        }
                        if (isSelected) {
                          styleClass = "border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500";
                        }

                        return (
                          <button
                            key={item.slot}
                            type="button"
                            disabled={isBooked}
                            onClick={() => setSelectedSlot(item.slot)}
                            className={`py-3 px-3 border rounded-xl text-center text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${styleClass}`}
                          >
                            <span className="truncate">{item.slot}</span>
                            <div className="flex items-center gap-1">
                              <span className={`w-1.5 h-1.5 rounded-full ${isBooked ? "bg-red-500" : isSelected ? "bg-white" : "bg-emerald-500"}`} />
                              <span className="text-[9px] uppercase font-semibold">
                                {isBooked ? "Booked" : isSelected ? "Selected" : "Available"}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Smart Calendar Legend */}
                  <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-150 dark:border-slate-800">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                      🟢 Available Slot
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
                      🔴 Already Booked
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-yellow-500 shrink-0" />
                      🟡 Sunday/Closed
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Booking Form & Confirmation Panel */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
                <Info size={18} className="text-blue-500" />
                <span>Consultation Details</span>
              </h3>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                {/* Consultation Type Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Consultation Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setConsultationType("offline")}
                      className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        consultationType === "offline"
                          ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/30 dark:text-blue-400"
                          : "border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      <MapPin size={14} />
                      <span>Offline Clinic</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsultationType("online")}
                      className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        consultationType === "online"
                          ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/30 dark:text-blue-400"
                          : "border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      <Video size={14} />
                      <span>Online Video</span>
                    </button>
                  </div>
                </div>

                {/* Patient medical summary text area */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Symptoms / Treatment Reason</label>
                  <textarea
                    rows={3}
                    value={medicalNotes}
                    onChange={(e) => setMedicalNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    placeholder="e.g. Sharp lower back spasm, frozen shoulder rehabilitation, knee tendonitis..."
                  />
                </div>

                {/* Selected Summary Details Card */}
                {selectedSlot && !isClosed && (
                  <div className="p-3 bg-blue-50/70 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/40 text-xs space-y-1.5">
                    <p className="font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wide text-[10px]">Your Selections</p>
                    <p className="text-slate-700 dark:text-slate-200">
                      <strong>Date:</strong> {new Date(selectedDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-slate-700 dark:text-slate-200">
                      <strong>Time:</strong> {selectedSlot}
                    </p>
                    <p className="text-slate-700 dark:text-slate-200">
                      <strong>Type:</strong> <span className="capitalize">{consultationType} Consultation</span>
                    </p>
                  </div>
                )}

                {errorMessage && (
                  <p className="text-xs text-red-500 dark:text-red-400 font-semibold bg-red-50 dark:bg-red-950/20 p-2 rounded-lg border border-red-200 dark:border-red-900/30 flex items-center gap-1">
                    <AlertCircle size={14} />
                    <span>{errorMessage}</span>
                  </p>
                )}

                {/* Submit Action Button */}
                {user ? (
                  <button
                    type="submit"
                    disabled={isBooking || isClosed || !selectedSlot}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/10 dark:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isBooking ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck size={16} />
                        <span>Confirm Appointment</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={() => onOpenAuth("login")}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Sign In to Book</span>
                    </button>
                    <p className="text-[10px] text-center text-slate-500 dark:text-slate-400 font-medium">
                      An authenticated patient profile is required to generate real-time appointment IDs and receive notifications.
                    </p>
                  </div>
                )}
              </form>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
