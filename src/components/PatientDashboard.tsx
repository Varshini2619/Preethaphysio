import React, { useState, useEffect } from "react";
import { 
  User as UserIcon, Calendar, History, Edit, Save, X, Phone, Mail, MapPin, ClipboardList, Video, CheckCircle, Clock, AlertCircle 
} from "lucide-react";
import { User, Appointment } from "../types";
import { API_BASE_URL } from "../config";

interface PatientDashboardProps {
  user: User;
  onProfileUpdate: (updatedUser: User) => void;
  onNavigateToBooking: () => void;
}

export default function PatientDashboard({ user, onProfileUpdate, onNavigateToBooking }: PatientDashboardProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  
  // Profile edit fields
  const [editName, setEditName] = useState(user.name);
  const [editAge, setEditAge] = useState(user.age || "");
  const [editGender, setEditGender] = useState(user.gender || "Male");
  const [editPhone, setEditPhone] = useState(user.phone || "");
  const [editAddress, setEditAddress] = useState(user.address || "");
  const [editMedicalInfo, setEditMedicalInfo] = useState(user.medicalInfo || "");

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("physio_clinic_token");
      const res = await fetch(`${API_BASE_URL}/api/appointments`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setAppointments(data || []);
      }
    } catch (e) {
      console.error("Failed to load patient appointments.", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("physio_clinic_token");
      const res = await fetch(`${API_BASE_URL}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editName,
          age: editAge ? Number(editAge) : undefined,
          gender: editGender,
          phone: editPhone,
          address: editAddress,
          medicalInfo: editMedicalInfo
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Profile update failed");

      onProfileUpdate(data.user);
      setIsEditing(false);
      setSuccessMessage("Your clinical profile has been updated successfully.");
      // Auto-dismiss success message
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this scheduled appointment? This cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem("physio_clinic_token");
      const res = await fetch(`${API_BASE_URL}/api/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          status: "cancelled"
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Cancellation failed");

      setSuccessMessage(`Appointment ${id} has been cancelled successfully.`);
      fetchAppointments();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: any) {
      alert(err.message || "Failed to cancel.");
    }
  };

  const activeAppointments = appointments.filter(a => a.status === "confirmed" || a.status === "pending");
  const pastAppointments = appointments.filter(a => a.status === "completed" || a.status === "cancelled");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-150">Pending Approval</span>;
      case "confirmed":
        return <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-150">Confirmed</span>;
      case "completed":
        return <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-150">Completed</span>;
      case "cancelled":
        return <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-red-50 text-red-700 border border-red-150">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-50 text-slate-500">{status}</span>;
    }
  };

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 transition-colors duration-200 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Dashboard Header Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Patient Dashboard</h2>
            <p className="text-xs sm:text-sm text-sky-100">Welcome back, {user.name}. Manage your appointments, therapy notes, and medical metrics.</p>
          </div>
          <button 
            onClick={onNavigateToBooking}
            className="px-5 py-3 bg-white text-blue-700 font-bold rounded-xl shadow-sm hover:shadow-md transition-all text-sm shrink-0 cursor-pointer"
          >
            Schedule New Treatment
          </button>
        </div>

        {/* Global Notification Banners */}
        {successMessage && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 text-sm font-semibold flex items-center gap-2">
            <CheckCircle size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column Left: Patient Profile (Spans 4 columns) */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-150 dark:border-slate-800 p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
                <UserIcon size={18} className="text-blue-500" />
                <span>My Clinical Profile</span>
              </h3>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                  title="Edit Profile"
                >
                  <Edit size={16} />
                </button>
              )}
            </div>

            {isEditing ? (
              /* Profile Edit Form */
              <form onSubmit={handleProfileSave} className="space-y-4 text-xs sm:text-sm">
                {errorMessage && <p className="text-red-500 text-xs font-semibold">{errorMessage}</p>}
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Age</label>
                    <input
                      type="number"
                      value={editAge}
                      onChange={(e) => setEditAge(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Gender</label>
                    <select
                      value={editGender}
                      onChange={(e) => setEditGender(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Address</label>
                  <textarea
                    rows={2}
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Medical Background / History</label>
                  <textarea
                    rows={3}
                    value={editMedicalInfo}
                    onChange={(e) => setEditMedicalInfo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
                    placeholder="Describe any chronic pains or past operations..."
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <Save size={13} />
                    <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(user.name);
                      setEditAge(user.age || "");
                      setEditGender(user.gender || "Male");
                      setEditPhone(user.phone || "");
                      setEditAddress(user.address || "");
                      setEditMedicalInfo(user.medicalInfo || "");
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              /* Profile Read View */
              <div className="space-y-4 text-xs sm:text-sm">
                {/* Profile Pic Placeholder */}
                <div className="flex flex-col items-center py-2 text-center">
                  <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-slate-700 font-extrabold text-3xl flex items-center justify-center uppercase shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white mt-3 text-base">{user.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Verified Clinic Patient</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                  <div className="flex gap-3">
                    <Mail size={16} className="text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email address</p>
                      <p className="font-semibold text-slate-800 dark:text-white break-all">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Phone size={16} className="text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Contact Number</p>
                      <p className="font-semibold text-slate-800 dark:text-white">{user.phone || "Not Provided"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Age</p>
                      <p className="font-semibold text-slate-800 dark:text-white">{user.age || "N/A"} Yrs</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Gender</p>
                      <p className="font-semibold text-slate-800 dark:text-white">{user.gender || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Address</p>
                      <p className="font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                        {user.address || "No address provided."}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                    <ClipboardList size={16} className="text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Medical Notes & Conditions</p>
                      <p className="font-medium text-slate-700 dark:text-slate-300 italic mt-1 leading-relaxed">
                        {user.medicalInfo || "None logged. Click edit to log your history."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Column Right: Appointments & History (Spans 8 columns) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Active Appointments */}
            <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
                <Calendar size={18} className="text-blue-500" />
                <span>My Scheduled Appointments</span>
              </h3>

              {isLoading ? (
                <p className="text-xs text-slate-400 font-semibold text-center py-6">Checking slot database...</p>
              ) : activeAppointments.length === 0 ? (
                /* No appointments placeholder card */
                <div className="text-center py-10 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                  <Clock size={32} className="mx-auto text-slate-300" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No Active Appointments</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    You do not have any clinical sessions scheduled. Use our interactive calendar to book your physical checkup in seconds.
                  </p>
                  <button 
                    onClick={onNavigateToBooking}
                    className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl"
                  >
                    Schedule Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeAppointments.map((apt) => (
                    <div 
                      key={apt.id}
                      className="p-5 border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl space-y-4 hover:border-blue-100 transition-colors"
                    >
                      {/* Header row */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-slate-400">Appointment ID: <span className="font-mono text-blue-600 dark:text-blue-400">{apt.id}</span></p>
                          <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white capitalize">
                            {apt.consultationType} Physiotherapy Consultation
                          </h4>
                        </div>
                        <div>
                          {getStatusBadge(apt.status)}
                        </div>
                      </div>

                      {/* Detail Coordinates */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400">Date</p>
                          <p className="font-bold text-slate-800 dark:text-slate-150 mt-0.5">
                            {new Date(apt.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400">Time Slot</p>
                          <p className="font-bold text-slate-800 dark:text-slate-150 mt-0.5">{apt.timeSlot}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400">Physiotherapist</p>
                          <p className="font-bold text-slate-800 dark:text-slate-150 mt-0.5">Dr. Preetha</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400">Location / Mode</p>
                          <p className="font-bold text-slate-800 dark:text-slate-150 mt-0.5 capitalize">{apt.consultationType}</p>
                        </div>
                      </div>

                      {/* Online Join link or address details */}
                      {apt.consultationType === "online" && apt.status === "confirmed" && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="flex gap-2 text-xs text-blue-700 dark:text-blue-300">
                            <Video size={16} className="shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold block">Online Telehealth Active</span>
                              <span className="text-[10px] text-slate-500">Video consultation starts at {apt.timeSlot.split(" - ")[0]}</span>
                            </div>
                          </div>
                          <a 
                            href={apt.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            referrerPolicy="no-referrer"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0"
                          >
                            <span>Launch Google Meet</span>
                          </a>
                        </div>
                      )}

                      {/* Symptoms & notes logged */}
                      {apt.medicalNotes && (
                        <div className="text-xs bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed text-slate-600 dark:text-slate-300">
                          <span className="font-bold text-slate-400 block mb-0.5 uppercase text-[9px] tracking-wider">My Symptoms Notes:</span>
                          "{apt.medicalNotes}"
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => handleCancelAppointment(apt.id)}
                          className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1.5"
                        >
                          <X size={14} />
                          <span>Cancel Appointment</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Appointment History Logs */}
            <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
                <History size={18} className="text-blue-500" />
                <span>My Rehabilitation History</span>
              </h3>

              {pastAppointments.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">You don't have any past completed or cancelled appointments yet.</p>
              ) : (
                <div className="space-y-3">
                  {pastAppointments.map((apt) => (
                    <div 
                      key={apt.id}
                      className="p-4 border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl space-y-2 text-xs"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-500">ID: {apt.id} • {apt.date}</span>
                        {getStatusBadge(apt.status)}
                      </div>

                      <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                        <span>{apt.consultationType} Physiotherapy Session</span>
                        <span>{apt.timeSlot}</span>
                      </div>

                      {/* Doctor Notes and Rehab progress */}
                      {apt.status === "completed" && (
                        <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1 mt-2 text-slate-600 dark:text-slate-300">
                          {apt.medicalNotes && (
                            <p className="leading-relaxed">
                              <strong className="text-slate-400 text-[10px] uppercase tracking-wide block">Doctor Treatment Notes:</strong>
                              "{apt.medicalNotes}"
                            </p>
                          )}
                          {apt.recoveryStatus && (
                            <p className="leading-relaxed text-emerald-700 dark:text-emerald-400">
                              <strong className="text-slate-400 text-[10px] uppercase tracking-wide block">Recovery Progress Status:</strong>
                              "{apt.recoveryStatus}"
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
