import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

// Initialize Resend for email (if API key is provided)
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// CORS configuration
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  frontendUrl
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Helper function to send real email via Resend
async function sendEmail(to: string, subject: string, html: string) {
  if (!resend) {
    console.log('Resend not configured, skipping email send');
    return false;
  }

  try {
    await resend.emails.send({
      from: 'Dr. Preetha Physiotherapy Clinic <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      html: html
    });
    console.log(`Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

// Helper for JWT Authentication
function getAuthenticatedUser(req: express.Request): { id: string; email: string; role: string } | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    return { id: decoded.id, email: decoded.email, role: decoded.role };
  } catch (e) {
    return null;
  }
}

// Initialize seed data if tables are empty
async function initializeSeedData() {
  try {
    // Check if users exist
    const { data: existingUsers } = await supabase.from('users').select('id').limit(1);
    
    if (!existingUsers || existingUsers.length === 0) {
      // Seed users
      const passwordHash = await bcrypt.hash("doctor123", 10);
      await supabase.from('users').insert([
        {
          id: "doc-preetha",
          email: "doctor@preethaphysio.com",
          password_hash: passwordHash,
          name: "Dr. Preetha, BPT",
          age: 38,
          gender: "Female",
          phone: "+91 9443212345",
          address: "No. 12, Gandhi Nagar, Phase 2, Near VIT University, Vellore - 632014, Tamil Nadu",
          medical_info: "Senior Orthopedic Physiotherapist & Rehabilitation Expert",
          role: "doctor"
        }
      ]);

      const patientPasswordHash = await bcrypt.hash("patient123", 10);
      await supabase.from('users').insert([
        {
          id: "patient-demo",
          email: "patient@example.com",
          password_hash: patientPasswordHash,
          name: "Vijay Kumar",
          age: 45,
          gender: "Male",
          phone: "+91 9876543210",
          address: "Sathuvachari, Vellore - 632009, Tamil Nadu",
          medical_info: "Suffering from chronic lower back pain (L4-L5 disc compression) for 3 months.",
          role: "patient"
        }
      ]);

      // Seed reviews
      await supabase.from('reviews').insert([
        {
          id: "rev-1",
          patient_name: "Ananya Iyer",
          rating: 5,
          comment: "Dr. Preetha is exceptionally skilled. My shoulder pain of 6 months vanished in just 5 session of dry needling and target exercises! Highly recommend her.",
          image_url: "",
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "rev-2",
          patient_name: "Rajesh Sekhar",
          rating: 5,
          comment: "Excellent experience. Visited the Vellore clinic for knee rehab after ACL surgery. The guidance was top-class and she provided a very detailed home exercise sheet too.",
          image_url: "",
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "rev-3",
          patient_name: "Karthik Raja",
          rating: 4,
          comment: "Very helpful online consultation. Since I was in Chennai, we did a virtual check. Her posture instructions and muscle activation tips worked wonders for my neck spasm.",
          image_url: "",
          created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]);

      // Seed welcome email
      await supabase.from('emails').insert([
        {
          id: "email-welcome",
          to: "patient@example.com",
          subject: "Welcome to Dr. Preetha Physiotherapy Clinic",
          body: "Hello Vijay Kumar,<br/><br/>Welcome to Dr. Preetha Physiotherapy Clinic! We are dedicated to relieving your pain and restoring your movement.<br/><br/>Feel free to book appointments anytime through our real-time smart portal.<br/><br/>Best Regards,<br/>Dr. Preetha Physiotherapy Clinic Support Team",
          sent_at: new Date().toISOString()
        }
      ]);

      console.log("Seed data initialized successfully");
    }
  } catch (error) {
    console.error("Error initializing seed data:", error);
  }
}

// Initialize seed data on startup
initializeSeedData();

// API Routes

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, name, age, gender, phone, address, medicalInfo } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Email, password, and name are required fields." });
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists." });
    }

    const newId = "patient-" + Math.random().toString(36).substr(2, 9);
    const passwordHash = await bcrypt.hash(password, 10);

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          id: newId,
          email: email.toLowerCase(),
          password_hash: passwordHash,
          name,
          age: Number(age) || null,
          gender: gender || null,
          phone: phone || null,
          address: address || null,
          medical_info: medicalInfo || null,
          role: "patient"
        }
      ])
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({ error: "Failed to create user." });
    }

    // Send a simulated welcome email
    await supabase.from('emails').insert([
      {
        id: "email-" + Math.random().toString(36).substr(2, 9),
        to: email,
        subject: "Welcome to Dr. Preetha Physiotherapy Clinic",
        body: `<h3>Hello ${name},</h3><p>Welcome to <strong>Dr. Preetha Physiotherapy Clinic</strong>!</p><p>We are delighted to support you on your rehabilitation journey. Our modern clinic specializes in treating back pain, neck pain, sports injuries, and customized recovery plans.</p><p>You can manage and book your appointments in real-time on our website.</p><p>Warm regards,<br/><strong>Dr. Preetha BPT</strong></p>`,
        sent_at: new Date().toISOString()
      }
    ]);

    // Send real welcome email via Resend
    await sendEmail(
      email,
      "Welcome to Dr. Preetha Physiotherapy Clinic",
      `<h3>Hello ${name},</h3><p>Welcome to <strong>Dr. Preetha Physiotherapy Clinic</strong>!</p><p>We are delighted to support you on your rehabilitation journey. Our modern clinic specializes in treating back pain, neck pain, sports injuries, and customized recovery plans.</p><p>You can manage and book your appointments in real-time on our website.</p><p>Warm regards,<br/><strong>Dr. Preetha BPT</strong></p>`
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: newId, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: "Registration successful!",
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        age: newUser.age,
        gender: newUser.gender,
        phone: newUser.phone,
        address: newUser.address,
        medicalInfo: newUser.medical_info
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        age: user.age,
        gender: user.gender,
        phone: user.phone,
        address: user.address,
        medicalInfo: user.medical_info
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Forgot Password
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (!user) {
      return res.status(404).json({ error: "No account found with this email." });
    }

    const resetToken = Math.random().toString(36).substr(2, 6).toUpperCase();

    // Send a simulated reset email
    await supabase.from('emails').insert([
      {
        id: "email-" + Math.random().toString(36).substr(2, 9),
        to: email,
        subject: "Reset Password Code - Dr. Preetha Physiotherapy Clinic",
        body: `<h3>Password Reset Request</h3><p>Dear ${user.name},</p><p>We received a request to reset your password. Please use the following code to complete your reset in the app:</p><h2 style="color: #2563eb; letter-spacing: 2px;">${resetToken}</h2><p>If you did not request this, you can safely ignore this email.</p><p>Thank you,<br/>Dr. Preetha Clinic Admin</p>`,
        sent_at: new Date().toISOString()
      }
    ]);

    res.json({
      message: "A password reset code has been sent to your email.",
      code: resetToken
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Get profile
app.get("/api/profile", async (req, res) => {
  try {
    const activeUser = getAuthenticatedUser(req);
    if (!activeUser) {
      return res.status(401).json({ error: "Unauthorized access." });
    }

    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', activeUser.id)
      .single();

    if (!user) {
      return res.status(404).json({ error: "User profile not found." });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      age: user.age,
      gender: user.gender,
      phone: user.phone,
      address: user.address,
      medicalInfo: user.medical_info
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Update profile
app.put("/api/profile", async (req, res) => {
  try {
    const activeUser = getAuthenticatedUser(req);
    if (!activeUser) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const { name, age, gender, phone, address, medicalInfo } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (age !== undefined) updateData.age = Number(age);
    if (gender) updateData.gender = gender;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (medicalInfo !== undefined) updateData.medical_info = medicalInfo;

    const { data: user, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', activeUser.id)
      .select()
      .single();

    if (error || !user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Sync profile data back to any appointments made by this patient
    if (name || phone) {
      const aptUpdate: any = {};
      if (name) aptUpdate.patient_name = name;
      if (phone) aptUpdate.patient_phone = phone;

      await supabase
        .from('appointments')
        .update(aptUpdate)
        .eq('patient_id', activeUser.id);
    }

    res.json({
      message: "Profile updated successfully!",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        age: user.age,
        gender: user.gender,
        phone: user.phone,
        address: user.address,
        medicalInfo: user.medical_info
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Get appointments (role based filtering)
app.get("/api/appointments", async (req, res) => {
  try {
    const activeUser = getAuthenticatedUser(req);
    if (!activeUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let query = supabase.from('appointments').select('*');

    if (activeUser.role === "patient") {
      query = query.eq('patient_id', activeUser.id);
    }

    const { data: appointments } = await query;

    // Sort: pending & confirmed first, soonest first
    appointments?.sort((a: any, b: any) => 
      new Date(a.date + "T" + a.time_slot.split(" - ")[0]).getTime() - 
      new Date(b.date + "T" + b.time_slot.split(" - ")[0]).getTime()
    );

    res.json(appointments || []);
  } catch (error) {
    console.error("Get appointments error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Get all slots availability for a given date
app.get("/api/slots", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: "Date parameter is required (YYYY-MM-DD)." });
    }

    const selectedDate = new Date(date as string);
    const isSunday = selectedDate.getDay() === 0;

    // Hourly slots
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

    if (isSunday) {
      const statusObj = slotsList.map(s => ({ slot: s, status: "closed", appointmentId: null }));
      return res.json({ date, isClosed: true, slots: statusObj, availableCount: 0 });
    }

    const { data: dateBookings } = await supabase
      .from('appointments')
      .select('*')
      .eq('date', date as string)
      .neq('status', 'cancelled');

    const statusObj = slotsList.map(slot => {
      const booking = dateBookings?.find((b: any) => b.time_slot === slot);
      return {
        slot,
        status: booking ? "booked" : "available",
        appointmentId: booking ? booking.id : null
      };
    });

    const availableCount = statusObj.filter(s => s.status === "available").length;

    res.json({
      date,
      isClosed: false,
      slots: statusObj,
      availableCount
    });
  } catch (error) {
    console.error("Get slots error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Book Appointment
app.post("/api/appointments", async (req, res) => {
  try {
    const activeUser = getAuthenticatedUser(req);
    if (!activeUser) {
      return res.status(401).json({ error: "Unauthorized. Please login to book an appointment." });
    }

    const { date, timeSlot, consultationType, medicalNotes } = req.body;
    if (!date || !timeSlot || !consultationType) {
      return res.status(400).json({ error: "Date, timeSlot, and consultationType are required." });
    }

    // Prevent Sunday booking
    const selectedDate = new Date(date);
    if (selectedDate.getDay() === 0) {
      return res.status(400).json({ error: "Sunday is a weekly holiday. Clinic is closed." });
    }

    // Prevent double booking for this exact date & slot
    const { data: existingBooking } = await supabase
      .from('appointments')
      .select('*')
      .eq('date', date)
      .eq('time_slot', timeSlot)
      .neq('status', 'cancelled')
      .single();

    if (existingBooking) {
      return res.status(400).json({ error: "This slot has already been booked. Please choose another slot." });
    }

    // Prevent concurrent booking for the same patient on same date/time
    const { data: patientBooking } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', activeUser.id)
      .eq('date', date)
      .eq('time_slot', timeSlot)
      .neq('status', 'cancelled')
      .single();

    if (patientBooking) {
      return res.status(400).json({ error: "You already have an active appointment scheduled at this time." });
    }

    const { data: patient } = await supabase
      .from('users')
      .select('*')
      .eq('id', activeUser.id)
      .single();

    if (!patient) {
      return res.status(404).json({ error: "Patient profile not found." });
    }

    const appointmentId = "APT-" + Math.floor(1000 + Math.random() * 9000);
    const meetingLink = consultationType === "online" 
      ? `https://meet.google.com/physio-preetha-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}` 
      : "";

    const { data: newAppointment, error: insertError } = await supabase
      .from('appointments')
      .insert([
        {
          id: appointmentId,
          patient_id: activeUser.id,
          patient_name: patient.name,
          patient_phone: patient.phone || "Not Provided",
          date,
          time_slot: timeSlot,
          doctor_name: "Dr. Preetha",
          consultation_type: consultationType,
          status: "confirmed",
          medical_notes: medicalNotes || "",
          recovery_status: "",
          meeting_link: meetingLink,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({ error: "Failed to book appointment." });
    }

    // Send a simulated appointment confirmation email
    const formattedDate = new Date(date).toLocaleDateString("en-IN", {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    
    const clinicAddressStr = "No. 12, Gandhi Nagar, Phase 2, Near VIT University, Vellore - 632014";
    const emailContent = `
      <h3>Appointment Confirmed! - Dr. Preetha Physiotherapy Clinic</h3>
      <p>Dear ${patient.name},</p>
      <p>Your physiotherapy appointment has been successfully booked and confirmed.</p>
      <table style="border-collapse: collapse; width: 100%; max-width: 500px; font-family: sans-serif; margin: 15px 0;">
        <tr style="background-color: #f3f4f6;"><td style="padding: 10px; font-weight: bold;">Appointment ID:</td><td style="padding: 10px;">${appointmentId}</td></tr>
        <tr><td style="padding: 10px; font-weight: bold;">Consultation:</td><td style="padding: 10px; text-transform: capitalize;">${consultationType} Consultation</td></tr>
        <tr style="background-color: #f3f4f6;"><td style="padding: 10px; font-weight: bold;">Date:</td><td style="padding: 10px;">${formattedDate}</td></tr>
        <tr><td style="padding: 10px; font-weight: bold;">Time Slot:</td><td style="padding: 10px;">${timeSlot}</td></tr>
        <tr style="background-color: #f3f4f6;"><td style="padding: 10px; font-weight: bold;">Doctor:</td><td style="padding: 10px;">Dr. Preetha</td></tr>
        ${consultationType === "online" 
          ? `<tr><td style="padding: 10px; font-weight: bold; color: #2563eb;">Online Meeting Link:</td><td style="padding: 10px;"><a href="${meetingLink}" target="_blank" style="color: #2563eb; font-weight: 500;">Join Video Consultation</a></td></tr>` 
          : `<tr><td style="padding: 10px; font-weight: bold;">Clinic Address:</td><td style="padding: 10px;">${clinicAddressStr}</td></tr>`
        }
      </table>
      <p>Please arrive 10 minutes prior to your scheduled offline appointment or join the online link on time.</p>
      <p>To cancel or reschedule, please use the Patient Dashboard at least 2 hours before your slot.</p>
      <p>Best Health,<br/><strong>Dr. Preetha Physiotherapy Clinic Team</strong></p>
    `;

    await supabase.from('emails').insert([
      {
        id: "email-" + Math.random().toString(36).substr(2, 9),
        to: patient.email,
        subject: `Confirmed: Appointment ${appointmentId} on ${date}`,
        body: emailContent,
        sent_at: new Date().toISOString()
      }
    ]);

    // Send real appointment confirmation email via Resend
    await sendEmail(patient.email, `Confirmed: Appointment ${appointmentId} on ${date}`, emailContent);

    res.status(201).json({
      message: "Appointment booked successfully!",
      appointment: newAppointment
    });
  } catch (error) {
    console.error("Book appointment error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Update appointment status / notes / recovery progress (Doctor or Patient)
app.put("/api/appointments/:id", async (req, res) => {
  try {
    const activeUser = getAuthenticatedUser(req);
    if (!activeUser) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const { id } = req.params;
    const { status, medicalNotes, recoveryStatus, date, timeSlot } = req.body;

    const { data: apt } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();

    if (!apt) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    // Permissions gate
    if (activeUser.role !== "doctor" && apt.patient_id !== activeUser.id) {
      return res.status(403).json({ error: "Access denied. You can only update your own appointments." });
    }

    // Patient can only cancel
    if (activeUser.role === "patient" && status && status !== "cancelled") {
      return res.status(403).json({ error: "Patients are only authorized to cancel appointments." });
    }

    const updateData: any = {};

    // Handle rescheduling double-booking prevention
    if (date && timeSlot && (date !== apt.date || timeSlot !== apt.time_slot)) {
      if (activeUser.role !== "doctor") {
        return res.status(403).json({ error: "Only the doctor is authorized to reschedule appointments." });
      }
      const { data: slotBooking } = await supabase
        .from('appointments')
        .select('*')
        .eq('date', date)
        .eq('time_slot', timeSlot)
        .neq('status', 'cancelled')
        .neq('id', id)
        .single();

      if (slotBooking) {
        return res.status(400).json({ error: "Cannot reschedule. Target slot is already booked." });
      }
      updateData.date = date;
      updateData.time_slot = timeSlot;
    }

    if (status) updateData.status = status;
    if (medicalNotes !== undefined) updateData.medical_notes = medicalNotes;
    if (recoveryStatus !== undefined) updateData.recovery_status = recoveryStatus;

    const { data: updatedApt } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    // Send email notifications on action if relevant
    let emailTitle = "";
    let emailBody = "";

    const { data: patient } = await supabase
      .from('users')
      .select('*')
      .eq('id', apt.patient_id)
      .single();

    if (patient) {
      if (status === "cancelled") {
        emailTitle = `Cancelled: Appointment ${apt.id} on ${apt.date}`;
        emailBody = `<h3>Appointment Cancellation</h3><p>Dear ${patient.name},</p><p>We confirm that your appointment <strong>${apt.id}</strong> scheduled for <strong>${apt.date}</strong> at <strong>${apt.time_slot}</strong> has been cancelled.</p><p>If this was unexpected, please book a new slot on our portal or contact us immediately.</p><p>Warmly,<br/>Dr. Preetha Clinic Support</p>`;
      } else if (status === "confirmed") {
        emailTitle = `Approved: Appointment ${apt.id} on ${apt.date}`;
        emailBody = `<h3>Appointment Approved</h3><p>Dear ${patient.name},</p><p>Your appointment <strong>${apt.id}</strong> scheduled for <strong>${apt.date}</strong> at <strong>${apt.time_slot}</strong> has been approved and confirmed by Dr. Preetha.</p><p>Best Health,<br/>Dr. Preetha Clinic Support</p>`;
      } else if (status === "completed") {
        emailTitle = `Treatment Session Completed - ${apt.id}`;
        emailBody = `<h3>Treatment Completed successfully!</h3><p>Dear ${patient.name},</p><p>Thank you for attending your physiotherapy session with Dr. Preetha on <strong>${apt.date}</strong>.</p><p><strong>Doctor Notes:</strong> ${apt.medical_notes || "Regular maintenance rehab exercises."}</p><p><strong>Rehab Progress:</strong> ${apt.recovery_status || "Continuing to show solid improvement!"}</p><p>Please review your home exercise schedule and maintain good posture!</p><p>Best regards,<br/>Dr. Preetha Physiotherapy Clinic</p>`;
      }

      if (emailTitle) {
        await supabase.from('emails').insert([
          {
            id: "email-" + Math.random().toString(36).substr(2, 9),
            to: patient.email,
            subject: emailTitle,
            body: emailBody,
            sent_at: new Date().toISOString()
          }
        ]);

        // Send real email notification via Resend
        await sendEmail(patient.email, emailTitle, emailBody);
      }
    }

    res.json({
      message: "Appointment updated successfully",
      appointment: updatedApt
    });
  } catch (error) {
    console.error("Update appointment error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Reviews API
app.get("/api/reviews", async (req, res) => {
  try {
    const { data: reviews } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    // Calculate stats
    const total = reviews?.length || 0;
    const average = total > 0 ? Number((reviews!.reduce((acc: number, r: any) => acc + r.rating, 0) / total).toFixed(1)) : 5.0;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as any;
    reviews?.forEach((r: any) => {
      if (distribution[r.rating] !== undefined) {
        distribution[r.rating]++;
      }
    });

    res.json({
      reviews: reviews || [],
      stats: {
        average,
        total,
        distribution
      }
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.post("/api/reviews", async (req, res) => {
  try {
    const activeUser = getAuthenticatedUser(req);
    if (!activeUser) {
      return res.status(401).json({ error: "Only logged-in users can write reviews." });
    }

    const { rating, comment, id } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ error: "Rating and comment are required." });
    }

    const { data: patient } = await supabase
      .from('users')
      .select('name')
      .eq('id', activeUser.id)
      .single();

    const patientName = patient ? patient.name : "Verified Patient";

    if (id) {
      // Edit existing review
      const { data: updatedReview, error } = await supabase
        .from('reviews')
        .update({
          rating: Number(rating),
          comment,
          created_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error || !updatedReview) {
        return res.status(404).json({ error: "Review not found." });
      }

      return res.json({ message: "Review updated successfully!", review: updatedReview });
    }

    // Create new review
    const { data: newReview, error: insertError } = await supabase
      .from('reviews')
      .insert([
        {
          id: "rev-" + Math.random().toString(36).substr(2, 9),
          patient_name: patientName,
          rating: Number(rating),
          comment,
          image_url: "",
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({ error: "Failed to submit review." });
    }

    res.status(201).json({
      message: "Review submitted successfully!",
      review: newReview
    });
  } catch (error) {
    console.error("Post review error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Simulated Emails endpoint for the frontend inbox viewer
app.get("/api/simulated-emails", async (req, res) => {
  try {
    const { data: emails } = await supabase
      .from('emails')
      .select('*')
      .order('sent_at', { ascending: false });

    res.json(emails || []);
  } catch (error) {
    console.error("Get emails error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Serve Vite SPA
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Clinic server running on http://0.0.0.0:${PORT}`);
  });
};

startServer();
