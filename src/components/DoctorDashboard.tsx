import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, Users, Calendar, Activity, CheckSquare, Search, Filter, Phone, Video, MapPin, 
  Trash2, Edit, Save, X, ChevronRight, CheckCircle, AlertCircle, FileText, ClipboardList
} from "lucide-react";
import { Appointment } from "../types";

interface DoctorDashboardProps {
  doctorUser: any;
}

export default function DoctorDashboard({ doctorUser }: DoctorDashboardProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"queue" | "archive">("queue");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  // Complete session modal/inline form
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [doctorNotes, setDoctorNotes] = useState("");
  const [recoveryProgress, setRecoveryProgress] = useState("");

  // Reschedule inline state
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newSlot, setNewSlot] = useState("");
  const [rescheduleError, setRescheduleError] = useState("");

  const fetchDoctorAppointments = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("physio_clinic_token");
      const res = await fetch("/api/appointments", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setAppointments(data || []);
      }
    } catch (e) {
      console.error("Failed to load doctor appointments.", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorAppointments();
  }, []);

  // Action: Approve
  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem("physio_clinic_token");
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: "confirmed" })
      });
      if (res.ok) {
        fetchDoctorAppointments();
      }
    } catch (err) {
      console.error("Approve failed", err);
    }
  };

  // Action: Cancel
  const handleCancel = async (id: string) => {
    if (!window.confirm("Cancel this appointment? An email notification will be dispatched.")) return;
    try {
      const token = localStorage.getItem("physio_clinic_token");
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: "cancelled" })
      });
      if (res.ok) {
        fetchDoctorAppointments();
      }
    } catch (err) {
      console.error("Cancel failed", err);
    }
  };

  // Action: Complete Session
  const handleCompleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingId) return;

    try {
      const token = localStorage.getItem("physio_clinic_token");
      const res = await fetch(`/api/appointments/${completingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          status: "completed",
          medicalNotes: doctorNotes,
          recoveryStatus: recoveryProgress
        })
      });

      if (res.ok) {
        setCompletingId(null);
        setDoctorNotes("");
        setRecoveryProgress("");
        fetchDoctorAppointments();
      }
    } catch (err) {
      console.error("Completion write failed", err);
    }
  };

  // Action: Reschedule
  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingId || !newDate || !newSlot) return;
    setRescheduleError("");

    try {
      const token = localStorage.getItem("physio_clinic_token");
      const res = await fetch(`/api/appointments/${reschedulingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          date: newDate,
          timeSlot: newSlot
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reschedule failed");

      setReschedulingId(null);
      setNewDate("");
      setNewSlot("");
      fetchDoctorAppointments();
    } catch (err: any) {
      setRescheduleError(err.message || "Failed to update date coordinate.");
    }
  };

  // Compute stats metrics dynamically
  const todayStr = new Date().toISOString().split("T")[0];
  const totalCount = appointments.length;
  const todayCount = appointments.filter(a => a.date === todayStr && a.status !== "cancelled").length;
  const upcomingCount = appointments.filter(a => {
    const isFuture = new Date(a.date).getTime() >= new Date(todayStr).getTime();
    return isFuture && (a.status === "confirmed" || a.status === "pending");
  }).length;
  const completedCount = appointments.filter(a => a.status === "completed").length;
  const onlineCount = appointments.filter(a => a.consultationType === "online" && a.status !== "cancelled").length;
  const offlineCount = appointments.filter(a => a.consultationType === "offline" && a.status !== "cancelled").length;

  // Filter lists
  const filteredQueue = appointments.filter(apt => {
    const isQueueStatus = apt.status === "pending" || apt.status === "confirmed";
    const matchesSearch = apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || apt.id.includes(searchQuery);
    const matchesDate = filterDate ? apt.date === filterDate : true;
    return isQueueStatus && matchesSearch && matchesDate;
  });

  const filteredArchive = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || apt.id.includes(searchQuery);
    const matchesDate = filterDate ? apt.date === filterDate : true;
    const matchesStatus = filterStatus !== "all" ? apt.status === filterStatus : true;
    return matchesSearch && matchesDate && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-150">Pending Approved</span>;
      case "confirmed":
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-150">Confirmed</span>;
      case "completed":
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-150">Completed</span>;
      case "cancelled":
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-50 text-red-700 border border-red-150">Cancelled</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-bold bg-slate-50 text-slate-500">{status}</span>;
    }
  };

  const slotsList = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
    "05:00 PM - 06:00 PM",
    "06:00 PM - 07:00 PM",
    "07:00 PM - 08:00 PM"
  ];

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 transition-colors duration-200 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Doctor clinical header */}
        <div className="bg-gradient-to-r from-indigo-700 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-sky-200 animate-pulse" />
              <span className="font-bold tracking-wider text-xs uppercase text-sky-100">Secure Clinical Portal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Dr. Preetha Physiotherapy Clinic</h2>
            <p className="text-xs sm:text-sm text-sky-100">Manage patient treatments, edit rehabilitation notes, and coordinate real-time calendars.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Active Doctor Session • Dr. Preetha</span>
          </div>
        </div>

        {/* Dynamic Statistics Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-4 rounded-2xl shadow-sm text-center space-y-1">
            <Users size={20} className="mx-auto text-blue-500" />
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalCount}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total bookings</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-4 rounded-2xl shadow-sm text-center space-y-1">
            <Calendar size={20} className="mx-auto text-emerald-500 animate-pulse" />
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{todayCount}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Today's Slots</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-4 rounded-2xl shadow-sm text-center space-y-1">
            <Activity size={20} className="mx-auto text-indigo-500" />
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{upcomingCount}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Upcoming sessions</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-4 rounded-2xl shadow-sm text-center space-y-1">
            <CheckSquare size={20} className="mx-auto text-amber-500" />
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{completedCount}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Completed Cases</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-4 rounded-2xl shadow-sm text-center space-y-1">
            <Video size={20} className="mx-auto text-teal-500" />
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{onlineCount}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Online Virtual</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-4 rounded-2xl shadow-sm text-center space-y-1">
            <MapPin size={20} className="mx-auto text-rose-500" />
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{offlineCount}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Offline Clinic</p>
          </div>

        </div>

        {/* Dashboard Sections Filter Box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm">
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            
            {/* Tab Toggles */}
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl w-fit text-xs">
              <button
                onClick={() => setActiveTab("queue")}
                className={`px-4 py-2 font-bold rounded-lg transition-all ${
                  activeTab === "queue"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
                }`}
              >
                Active Appointment Queue
              </button>
              <button
                onClick={() => setActiveTab("archive")}
                className={`px-4 py-2 font-bold rounded-lg transition-all ${
                  activeTab === "archive"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
                }`}
              >
                Historical Treatment Archive
              </button>
            </div>

            {/* Dynamic Search Input */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative text-xs sm:text-sm">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Search size={14} />
                </span>
                <input
                  type="text"
                  placeholder="Patient Name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 pl-9 pr-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs"
                />
              </div>

              {/* Date selection filter */}
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-2 py-1.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300"
              />

              {activeTab === "archive" && (
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-2 py-1.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="confirmed">Confirmed</option>
                </select>
              )}
            </div>

          </div>

          {activeTab === "queue" ? (
            /* Queue active view */
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-center text-xs text-slate-400 py-6">Loading database logs...</p>
              ) : filteredQueue.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-10">No pending or confirmed appointments match your filters.</p>
              ) : (
                <div className="space-y-4">
                  {filteredQueue.map((apt) => {
                    const isCompleting = completingId === apt.id;
                    const isRescheduling = reschedulingId === apt.id;

                    return (
                      <div 
                        key={apt.id}
                        id={`queue-item-${apt.id}`}
                        className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 hover:border-blue-100 transition-colors space-y-4"
                      >
                        {/* Header metadata */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div>
                            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 font-mono tracking-wider bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded">
                              {apt.id}
                            </span>
                            <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                              {apt.patientName}
                            </h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="capitalize px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {apt.consultationType} Consultation
                            </span>
                            {getStatusBadge(apt.status)}
                          </div>
                        </div>

                        {/* Patient Coordinates */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                          <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Date & Slot</p>
                            <p className="font-bold text-slate-800 dark:text-slate-150 mt-0.5">{apt.date}</p>
                            <p className="text-xs text-slate-500 mt-0.5 font-medium">{apt.timeSlot}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Patient Phone</p>
                            <a href={`tel:${apt.patientPhone}`} className="font-bold text-slate-800 dark:text-slate-150 hover:underline block mt-0.5">
                              {apt.patientPhone}
                            </a>
                          </div>
                          <div className="col-span-2">
                            <p className="text-[10px] uppercase font-bold text-slate-400">Reason / Symptoms</p>
                            <p className="font-medium text-slate-600 dark:text-slate-300 italic mt-0.5">
                              "{apt.medicalNotes || "Regular mechanical checkup."}"
                            </p>
                          </div>
                        </div>

                        {/* Inline Rescheduling panel */}
                        {isRescheduling && (
                          <form onSubmit={handleRescheduleSubmit} className="p-4 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl space-y-3">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Reschedule Patient Session</span>
                              <button type="button" onClick={() => setReschedulingId(null)} className="text-slate-400 hover:text-slate-600">
                                <X size={14} />
                              </button>
                            </div>
                            {rescheduleError && <p className="text-xs text-red-500 font-semibold">{rescheduleError}</p>}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <input
                                type="date"
                                required
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                                className="px-3 py-2 border rounded-lg text-xs"
                              />
                              <select
                                required
                                value={newSlot}
                                onChange={(e) => setNewSlot(e.target.value)}
                                className="px-3 py-2 border rounded-lg text-xs bg-white text-slate-900"
                              >
                                <option value="">Select Target Slot</option>
                                {slotsList.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </div>
                            <button
                              type="submit"
                              className="py-2 px-4 bg-indigo-600 text-white font-bold text-xs rounded-lg"
                            >
                              Update Slot Coordinate
                            </button>
                          </form>
                        )}

                        {/* Inline Treatment Completion panel */}
                        {isCompleting && (
                          <form onSubmit={handleCompleteSubmit} className="p-4 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Log Clinical Treatment Progress</span>
                              <button type="button" onClick={() => setCompletingId(null)} className="text-slate-400 hover:text-slate-600">
                                <X size={14} />
                              </button>
                            </div>

                            <div className="space-y-3 text-xs sm:text-sm">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Clinical Session Treatment Notes</label>
                                <textarea
                                  rows={2}
                                  required
                                  value={doctorNotes}
                                  onChange={(e) => setDoctorNotes(e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-900 dark:text-white"
                                  placeholder="e.g. Applied lumbar mechanical traction. Instructed target Core level 1 stabilizing exercises."
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Patient Recovery / Movement status</label>
                                <input
                                  type="text"
                                  required
                                  value={recoveryProgress}
                                  onChange={(e) => setRecoveryProgress(e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-900 dark:text-white"
                                  placeholder="e.g. Pain reduced by 25%. Flexion range improved by 10 degrees."
                                />
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg"
                            >
                              Finalize Treatment & Mark Completed
                            </button>
                          </form>
                        )}

                        {/* Action buttons row */}
                        {!isCompleting && !isRescheduling && (
                          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                            {apt.status === "pending" && (
                              <button
                                onClick={() => handleApprove(apt.id)}
                                className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                              >
                                <CheckCircle size={13} />
                                <span>Approve Appointment</span>
                              </button>
                            )}

                            {apt.status === "confirmed" && (
                              <button
                                onClick={() => setCompletingId(apt.id)}
                                className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                              >
                                <CheckSquare size={13} />
                                <span>Complete Session</span>
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setReschedulingId(apt.id);
                                setNewDate(apt.date);
                                setNewSlot(apt.timeSlot);
                              }}
                              className="py-2 px-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                            >
                              <Edit size={13} />
                              <span>Reschedule</span>
                            </button>

                            <button
                              onClick={() => handleCancel(apt.id)}
                              className="py-2 px-3 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 font-bold rounded-lg flex items-center gap-1 ml-auto cursor-pointer"
                            >
                              <X size={13} />
                              <span>Cancel Session</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Historical Archive Tab */
            <div className="space-y-4">
              {filteredArchive.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-10">No completed or historical cases found matching your queries.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-150 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-900">
                        <th className="py-3 px-4">Patient Details</th>
                        <th className="py-3 px-4">Date & Slot</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Treatment Log & Progress Notes</th>
                        <th className="py-3 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                      {filteredArchive.map((apt) => (
                        <tr key={apt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                          <td className="py-4 px-4">
                            <span className="font-mono text-[9px] text-slate-400">#{apt.id}</span>
                            <p className="font-bold text-slate-900 dark:text-white mt-0.5">{apt.patientName}</p>
                            <p className="text-slate-500 mt-0.5">{apt.patientPhone}</p>
                          </td>
                          <td className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">
                            <p>{apt.date}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{apt.timeSlot}</p>
                          </td>
                          <td className="py-4 px-4 capitalize font-semibold text-slate-600 dark:text-slate-300">
                            {apt.consultationType}
                          </td>
                          <td className="py-4 px-4 max-w-sm space-y-1.5 leading-relaxed">
                            {apt.status === "completed" ? (
                              <>
                                <p className="text-slate-700 dark:text-slate-300">
                                  <strong className="text-[9px] uppercase tracking-wide text-slate-400 block">Clinical Therapy:</strong>
                                  "{apt.medicalNotes || "Routine mechanical alignment checks."}"
                                </p>
                                <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                                  <strong className="text-[9px] uppercase tracking-wide text-slate-400 block">Recovery Status:</strong>
                                  "{apt.recoveryStatus || "No progress registered."}"
                                </p>
                              </>
                            ) : (
                              <p className="text-slate-400 italic">
                                {apt.status === "cancelled" ? "Appointment cancelled prior to clinical consultation." : "Consultation not yet finalized."}
                              </p>
                            )}
                          </td>
                          <td className="py-4 px-4 text-center">
                            {getStatusBadge(apt.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
