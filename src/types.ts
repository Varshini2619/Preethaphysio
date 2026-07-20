export interface User {
  id: string;
  email: string;
  name: string;
  role: "patient" | "doctor";
  age?: number | "";
  gender?: string;
  phone?: string;
  address?: string;
  medicalInfo?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:MM AM/PM - HH:MM AM/PM
  doctorName: string;
  consultationType: "online" | "offline";
  status: "pending" | "confirmed" | "completed" | "cancelled";
  medicalNotes: string;
  recoveryStatus: string;
  meetingLink: string;
  createdAt: string;
}

export interface Review {
  id: string;
  patientName: string;
  rating: number;
  comment: string;
  imageUrl?: string;
  createdAt: string;
}

export interface ClinicEmail {
  id: string;
  to: string;
  subject: string;
  body: string;
  sentAt: string;
}

export interface SlotAvailability {
  slot: string;
  status: "available" | "booked" | "closed";
  appointmentId: string | null;
}

export interface ServiceDetail {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  duration: string;
  price?: string;
  iconName: string;
  image?: string;
}
