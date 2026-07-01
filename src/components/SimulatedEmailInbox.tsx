import React, { useState, useEffect } from "react";
import { Mail, Inbox, ChevronUp, ChevronDown, Clock, Send, Sparkles, X } from "lucide-react";
import { ClinicEmail } from "../types";

export default function SimulatedEmailInbox() {
  const [emails, setEmails] = useState<ClinicEmail[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<ClinicEmail | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchEmails = async () => {
    try {
      const res = await fetch("/api/simulated-emails");
      if (res.ok) {
        const data = await res.json();
        setEmails(data || []);
      }
    } catch (e) {
      console.error("Failed to load simulated email stream", e);
    }
  };

  useEffect(() => {
    fetchEmails();
    const interval = setInterval(() => {
      fetchEmails();
    }, 4000); // Poll every 4 seconds for live dispatch notification stream!
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      // Unread are those newer than last open (we can approximate simply as emails.length for demo)
      setUnreadCount(emails.length);
    } else {
      setUnreadCount(0);
    }
  }, [emails, isOpen]);

  return (
    <div 
      id="live-email-inbox-widget" 
      className="fixed bottom-4 right-4 z-50 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 transition-all duration-300"
      style={{ maxHeight: isOpen ? "480px" : "48px" }}
    >
      {/* Widget Title Bar */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <Mail size={16} className="text-blue-400 animate-bounce" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-extrabold text-[8px] px-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-xs font-bold tracking-wide">Live Clinic Mail Dispatcher</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-blue-950 border border-blue-900 text-blue-300 font-bold px-2 py-0.5 rounded-full animate-pulse">
            Nodemailer Simulator
          </span>
          {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </div>
      </div>

      {/* Expanded Mail Logs Container */}
      {isOpen && (
        <div className="p-4 bg-slate-950/95 flex flex-col h-[400px] justify-between">
          {selectedEmail ? (
            /* Selected Individual Email Body View */
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              <button 
                onClick={() => setSelectedEmail(null)}
                className="text-[10px] font-bold text-blue-400 hover:underline mb-2 flex items-center gap-1"
              >
                ← Back to Dispatch Inbox
              </button>

              <div className="space-y-1.5 border-b border-slate-800 pb-2">
                <p><span className="text-slate-400 font-semibold">To:</span> {selectedEmail.to}</p>
                <p><span className="text-slate-400 font-semibold">Subject:</span> {selectedEmail.subject}</p>
                <p className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Clock size={10} />
                  <span>{new Date(selectedEmail.sentAt).toLocaleTimeString()}</span>
                </p>
              </div>

              {/* Rich body simulation content */}
              <div 
                className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-slate-300 font-sans space-y-2 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
              />
            </div>
          ) : (
            /* Inbox list of sent emails */
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider pb-2 border-b border-slate-900">
                <Inbox size={12} />
                <span>Dispatched Logs ({emails.length})</span>
              </div>

              {emails.length === 0 ? (
                <div className="text-center py-12 space-y-2 text-slate-500 text-xs">
                  <Send size={24} className="mx-auto opacity-30" />
                  <p>Waiting for mail triggers...</p>
                  <p className="text-[10px] max-w-[200px] mx-auto leading-relaxed">
                    Welcome or Confirmation emails will populate here instantly upon registration or booking.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {emails.map((mail) => (
                    <div 
                      key={mail.id}
                      onClick={() => setSelectedEmail(mail)}
                      className="p-3 bg-slate-900 border border-slate-800 hover:border-blue-900/50 hover:bg-slate-800/40 rounded-xl cursor-pointer transition-all space-y-1"
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-blue-400 truncate max-w-[150px]">{mail.to}</span>
                        <span className="text-slate-500">{new Date(mail.sentAt).toLocaleTimeString()}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white truncate">{mail.subject}</h4>
                      <p className="text-[10px] text-slate-400 truncate">Click to read verified HTML body details...</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer explanation banner */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-start gap-2">
            <Sparkles size={14} className="text-blue-400 shrink-0 mt-0.5 animate-pulse" />
            <p className="leading-relaxed">
              This sandbox console intercepts and renders clinical Nodemailer drafts in real-time. Verify registration codes and booking meet links here instantly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
