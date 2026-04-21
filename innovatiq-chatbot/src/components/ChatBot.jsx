import { useState, useEffect, useRef } from "react";

const BRAND = "#E8174B";
const BRAND_DARK = "#b01038";
const LOGO_URL = "https://innovatiq.com.sg/wp-content/uploads/2023/01/innovatiq-logo.png";

const POPUP_MESSAGES = [
  "👋 Welcome to Innovatiq! How can we help you today?",
  "🚀 Explore our AI-Powered Digital Solutions!",
  "🔒 Looking for Cyber Security services? We've got you!",
  "☁️ Discover our Cloud Service solutions today!",
  "💡 Need Digital Transformation? Let's talk!",
  "🛠️ Our Managed Services keep your business running smoothly.",
  "🌐 Advanced Infra & Network Services — built for scale.",
  "🤝 Our Consulting experts are ready to help!",
  "⚡ Field Services available — anytime, anywhere.",
  "📩 Chat with us and get a free consultation today!",
];

const SERVICES = [
  { name: "Cloud Service", icon: "☁️" },
  { name: "Cyber Security", icon: "🔒" },
  { name: "Consulting Service", icon: "🤝" },
  { name: "Digital Transformation", icon: "💡" },
  { name: "Managed Service", icon: "🛠️" },
  { name: "Advance Infra Network Service", icon: "🌐" },
  { name: "Field Service", icon: "⚡" },
];

const PRODUCTS = [
  { name: "SKillEra (TMS)", icon: "🎯", desc: "Talent Management System" },
  { name: "LearnPro (LMS)", icon: "📚", desc: "AI-powered Learning Management System" },
  { name: "Learning Motivational Platform (LMP)", icon: "💡", desc: "Motivational Learning Platform" },
  { name: "SecurOn (PMS)", icon: "🛡️", desc: "Project Management System" },
];

const PRODUCT_FIELDS = [
  { key: "name", label: "Full Name", type: "text", placeholder: "Your name" },
  { key: "email", label: "Email", type: "email", placeholder: "your@email.com" },
  { key: "phone", label: "Phone", type: "tel", placeholder: "+65 XXXX XXXX" },
  { key: "company", label: "Company", type: "text", placeholder: "Company name" },
  { key: "message", label: "Message", type: "textarea", placeholder: "Tell us about your requirements..." },
];

export default function ChatBot({ emailTo = "info@innovatiq.com.sg" }) {
  const [open, setOpen] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupIndex, setPopupIndex] = useState(0);
  const [step, setStep] = useState("main");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi there! 👋 Welcome to Innovatiq Support. How can I help you today?" },
  ]);
  const chatEndRef = useRef(null);
  const popupTimerRef = useRef(null);
  const initialTimerRef = useRef(null);

  useEffect(() => {
    initialTimerRef.current = setTimeout(() => {
      if (!open) setPopupVisible(true);
    }, 50000);
    return () => clearTimeout(initialTimerRef.current);
  }, []);

  useEffect(() => {
    if (popupVisible && !open) {
      popupTimerRef.current = setInterval(() => {
        setPopupIndex((prev) => (prev + 1) % POPUP_MESSAGES.length);
      }, 30000);
    }
    return () => clearInterval(popupTimerRef.current);
  }, [popupVisible, open]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (text, from = "bot", delay = 400) => {
    return new Promise((res) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, { from, text }]);
        res();
      }, delay);
    });
  };

  const handleOpen = () => {
    setOpen(true);
    setPopupVisible(false);
    clearInterval(popupTimerRef.current);
  };

  const handleMainOption = async (option) => {
    await addMessage(option === "product" ? "Products" : option === "service" ? "Services" : "Others", "user", 0);
    if (option === "service") {
      await addMessage("Great! Here are our services. Which one are you interested in?");
      setStep("service");
    } else if (option === "product") {
      await addMessage("We have amazing products! Please select one to learn more:");
      setStep("product");
    } else {
      await addMessage("Sure! Let me take you to our Careers page. 🚀");
      setStep("others");
      setTimeout(() => window.open("https://innovatiq.com.sg/careers", "_blank"), 1000);
    }
  };

  const handleServiceSelect = async (service) => {
    await addMessage(service.name, "user", 0);
    await addMessage(`Great choice! 🎉 You're interested in ${service.name}. Let me collect your details to connect you with our expert.`);
    setSelectedProduct(service);
    setStep("form");
  };

  const handleProductSelect = async (product) => {
    await addMessage(product.name, "user", 0);
    await addMessage(`Excellent! 🎉 You're interested in ${product.name} — ${product.desc}. Please share your details and we'll get back to you!`);
    setSelectedProduct(product);
    setStep("form");
  };

  const handleFormSubmit = async () => {
    const required = ["name", "email", "message"];
    const missing = required.filter((k) => !formData[k]);
    if (missing.length) {
      await addMessage("Please fill in Name, Email and Message to continue.");
      return;
    }
    setSending(true);
    try {
      await fetch("http://localhost:5001/api/chatbot/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailTo,
          interest: selectedProduct?.name || "General Inquiry",
          ...formData,
          chatHistory: messages.map((m) => `[${m.from.toUpperCase()}]: ${m.text}`).join("\n"),
        }),
      });
    } catch (e) {
      console.error("Email send error:", e);
    }
    setSending(false);
    setSent(true);
    await addMessage("Thank you! ✅ Your details have been submitted. Our team will reach out to you at " + formData.email + " shortly!");
    setStep("done");
  };

  const handleReset = () => {
    setStep("main");
    setSelectedProduct(null);
    setFormData({});
    setSent(false);
    setMessages([{ from: "bot", text: "Hi there! 👋 Welcome to Innovatiq Support. How can I help you today?" }]);
  };

  return (
    <>
      <style>{`
        .iq-chatbot * { box-sizing: border-box; font-family: 'Segoe UI', sans-serif; }
        .iq-popup { position: fixed; bottom: 90px; right: 24px; background: white; border-radius: 16px; padding: 14px 18px; max-width: 260px; box-shadow: 0 8px 32px rgba(0,0,0,0.15); cursor: pointer; z-index: 9998; animation: iqSlideIn 0.3s ease; }
        .iq-popup:after { content: ''; position: absolute; bottom: -8px; right: 24px; width: 16px; height: 16px; background: white; transform: rotate(45deg); border-radius: 2px; }
        .iq-popup p { margin: 0; font-size: 13px; color: #333; line-height: 1.5; }
        .iq-fab { position: fixed; bottom: 24px; right: 24px; width: 56px; height: 56px; border-radius: 50%; background: ${BRAND}; color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 9999; box-shadow: 0 4px 16px rgba(232,23,75,0.4); transition: transform 0.2s; }
        .iq-fab:hover { transform: scale(1.08); }
        .iq-window { position: fixed; bottom: 90px; right: 24px; width: 360px; height: 560px; background: white; border-radius: 20px; box-shadow: 0 16px 48px rgba(0,0,0,0.18); display: flex; flex-direction: column; z-index: 9999; animation: iqSlideIn 0.3s ease; overflow: hidden; }
        .iq-header { background: ${BRAND}; padding: 16px; display: flex; align-items: center; gap: 10px; }
        .iq-header img { width: 100px; object-fit: contain; filter: brightness(0) invert(1); }
        .iq-header-info { flex: 1; }
        .iq-header-info h4 { margin: 0; color: white; font-size: 14px; font-weight: 600; }
        .iq-header-info p { margin: 0; color: rgba(255,255,255,0.8); font-size: 11px; }
        .iq-close { background: none; border: none; color: white; font-size: 20px; cursor: pointer; padding: 0; line-height: 1; opacity: 0.85; }
        .iq-close:hover { opacity: 1; }
        .iq-reset { background: none; border: 1px solid rgba(255,255,255,0.5); border-radius: 6px; color: white; font-size: 11px; cursor: pointer; padding: 3px 8px; opacity: 0.85; }
        .iq-reset:hover { opacity: 1; background: rgba(255,255,255,0.15); }
        .iq-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; background: #f9f9f9; }
        .iq-msg { max-width: 80%; padding: 10px 14px; border-radius: 16px; font-size: 13px; line-height: 1.5; }
        .iq-msg.bot { background: white; color: #222; border-bottom-left-radius: 4px; align-self: flex-start; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
        .iq-msg.user { background: ${BRAND}; color: white; border-bottom-right-radius: 4px; align-self: flex-end; }
        .iq-actions { padding: 12px 16px; background: white; border-top: 1px solid #f0f0f0; display: flex; flex-direction: column; gap: 8px; }
        .iq-btn { padding: 10px 16px; border-radius: 12px; border: 1.5px solid ${BRAND}; color: ${BRAND}; background: white; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; text-align: left; }
        .iq-btn:hover { background: ${BRAND}; color: white; }
        .iq-btn-primary { background: ${BRAND}; color: white; }
        .iq-btn-primary:hover { background: ${BRAND_DARK}; border-color: ${BRAND_DARK}; }
        .iq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .iq-input { width: 100%; padding: 9px 12px; border: 1.5px solid #e0e0e0; border-radius: 10px; font-size: 13px; outline: none; transition: border 0.2s; }
        .iq-input:focus { border-color: ${BRAND}; }
        .iq-input-label { font-size: 11px; color: #888; margin-bottom: 3px; display: block; }
        .iq-form { display: flex; flex-direction: column; gap: 8px; }
        @keyframes iqSlideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .iq-dot { width: 8px; height: 8px; background: #4CAF50; border-radius: 50%; display: inline-block; margin-right: 4px; }
      `}</style>

      <div className="iq-chatbot">
        {/* Popup Bubble */}
        {popupVisible && !open && (
          <div className="iq-popup" onClick={handleOpen}>
            <p>{POPUP_MESSAGES[popupIndex]}</p>
          </div>
        )}

        {/* FAB Button */}
        <button className="iq-fab" onClick={() => (open ? setOpen(false) : handleOpen())}>
          {open ? (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="white" strokeWidth="2.5" strokeLinecap="round" d="M6 6l12 12M18 6L6 18"/></svg>
          ) : (
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="white" d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z"/></svg>
          )}
        </button>

        {/* Chat Window */}
        {open && (
          <div className="iq-window">
            {/* Header */}
            <div className="iq-header">
              <img src={LOGO_URL} alt="Innovatiq" onError={(e) => { e.target.style.display = "none"; }} />
              <div className="iq-header-info">
                <h4>Innovatiq Support</h4>
                <p><span className="iq-dot"></span>Online · Typically replies instantly</p>
              </div>
              {step !== "main" && (
                <button className="iq-reset" onClick={handleReset} title="Restart Chat">↺ Reset</button>
              )}
              <button className="iq-close" onClick={() => setOpen(false)}>×</button>
            </div>

            {/* Messages */}
            <div className="iq-messages">
              {messages.map((m, i) => (
                <div key={i} className={`iq-msg ${m.from}`}>
                  {m.text}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Actions */}
            <div className="iq-actions">
              {step === "main" && (
                <>
                  <button className="iq-btn" onClick={() => handleMainOption("product")}>🛍️ Products</button>
                  <button className="iq-btn" onClick={() => handleMainOption("service")}>🔧 Services</button>
                  <button className="iq-btn" onClick={() => handleMainOption("others")}>📄 Careers / Others</button>
                </>
              )}

              {step === "service" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 200, overflowY: "auto" }}>
                  {SERVICES.map((s) => (
                    <button key={s.name} className="iq-btn" onClick={() => handleServiceSelect(s)}>
                      {s.icon} {s.name}
                    </button>
                  ))}
                </div>
              )}

              {step === "product" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {PRODUCTS.map((p) => (
                    <button key={p.name} className="iq-btn" onClick={() => handleProductSelect(p)}>
                      {p.icon} {p.name}
                    </button>
                  ))}
                </div>
              )}

              {step === "form" && (
                <div className="iq-form" style={{ maxHeight: 220, overflowY: "auto" }}>
                  {PRODUCT_FIELDS.map((f) => (
                    <div key={f.key}>
                      <label className="iq-input-label">{f.label}</label>
                      {f.type === "textarea" ? (
                        <textarea
                          className="iq-input"
                          rows={2}
                          placeholder={f.placeholder}
                          value={formData[f.key] || ""}
                          onChange={(e) => setFormData((p) => ({ ...p, [f.key]: e.target.value }))}
                          style={{ resize: "none" }}
                        />
                      ) : (
                        <input
                          className="iq-input"
                          type={f.type}
                          placeholder={f.placeholder}
                          value={formData[f.key] || ""}
                          onChange={(e) => setFormData((p) => ({ ...p, [f.key]: e.target.value }))}
                        />
                      )}
                    </div>
                  ))}
                  <button className="iq-btn iq-btn-primary" onClick={handleFormSubmit} disabled={sending}>
                    {sending ? "Sending..." : "Submit ✓"}
                  </button>
                </div>
              )}

              {step === "done" && (
                <button className="iq-btn iq-btn-primary" onClick={handleReset}>
                  🔄 Start New Chat
                </button>
              )}

              {step === "others" && (
                <button className="iq-btn iq-btn-primary" onClick={handleReset}>
                  🏠 Back to Main Menu
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}