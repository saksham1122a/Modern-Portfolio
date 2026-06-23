import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Mail, Phone, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../components/icons/BrandIcons";
import "./Contact.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const CONTACT_INFO = [
  { icon: Mail,    label: "Email",    value: "sakshamnnda01@gmail.com",   href: "mailto:sakshamnnda01@gmail.com" },
  { icon: Phone,   label: "Phone",    value: "+91 6006915762",             href: "tel:+916006915762" },
  { icon: MapPin,  label: "Location", value: "Ludhiana, Punjab, India",   href: null },
];

const SOCIALS = [
  { icon: GithubIcon,   label: "GitHub",   href: "https://github.com/saksham1122a" },
  { icon: LinkedinIcon, label: "LinkedIn", href: "https://www.linkedin.com/in/sakshamnanda01" },
];

const InputField = ({ label, name, type = "text", value, onChange, error, required, as: As = "input", rows }) => {
  const [focused, setFocused] = useState(false);
  const filled = value?.length > 0;

  return (
    <div className={`form-field ${focused ? "form-field--focused" : ""} ${error ? "form-field--error" : ""} ${filled ? "form-field--filled" : ""}`}>
      <label className="form-field__label" htmlFor={name}>{label}{required && " *"}</label>
      <As
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="form-field__input"
        rows={rows}
        aria-describedby={error ? `${name}-err` : undefined}
      />
      {error && <span id={`${name}-err`} className="form-field__error">{error}</span>}
    </div>
  );
};

const Contact = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [serverMsg, setServerMsg] = useState("");

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.message.trim()) e.message = "Message is required";
    else if (form.message.trim().length < 10) e.message = "Message must be at least 10 characters";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setStatus("sending");
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      setStatus("success");
      setServerMsg(data.message);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setServerMsg(err.message);
    }
  };

  return (
    <section className="section contact" id="contact" ref={ref}>
      <div className="contact__bg" aria-hidden="true" />
      <div className="container">
        <motion.span
          className="section-eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          Contact
        </motion.span>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
        >
          Let's build something
        </motion.h2>

        <div className="contact__grid">
          {/* Left: info */}
          <motion.div
            className="contact__info"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.16,1,0.3,1] }}
          >
            <p className="contact__intro">
              I'm open to freelance projects, full-time roles, and interesting collaborations.
              Drop me a message and I'll get back to you within 24 hours.
            </p>

            <div className="contact__details">
              {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="contact__detail">
                  <span className="contact__detail-icon"><Icon size={16} /></span>
                  <div>
                    <span className="contact__detail-label">{label}</span>
                    {href
                      ? <a href={href} className="contact__detail-value">{value}</a>
                      : <span className="contact__detail-value">{value}</span>
                    }
                  </div>
                </div>
              ))}
            </div>

            <div className="contact__socials">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                   className="contact__social-btn glass" aria-label={label}>
                  <Icon size={18} />
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            className="contact__form-wrap"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.16,1,0.3,1] }}
          >
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  className="contact__success glass"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16,1,0.3,1] }}
                >
                  <CheckCircle size={48} className="contact__success-icon" />
                  <h3>Message sent!</h3>
                  <p>{serverMsg || "Thanks for reaching out — I'll get back to you soon."}</p>
                  <button className="btn btn-outline" onClick={() => setStatus("idle")}>
                    Send another
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form" className="contact__form glass" initial={{ opacity: 1 }}>
                  <div className="contact__form-row">
                    <InputField label="Name" name="name" value={form.name} onChange={handleChange} error={errors.name} required />
                    <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} required />
                  </div>
                  <InputField label="Subject" name="subject" value={form.subject} onChange={handleChange} error={errors.subject} />
                  <InputField label="Message" name="message" as="textarea" rows={5} value={form.message} onChange={handleChange} error={errors.message} required />

                  {status === "error" && (
                    <div className="contact__error-banner">
                      <AlertCircle size={14} />
                      {serverMsg || "Something went wrong. Please try again."}
                    </div>
                  )}

                  <button
                    className="btn btn-primary contact__submit"
                    onClick={handleSubmit}
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? (
                      <span className="contact__spinner" />
                    ) : (
                      <Send size={16} />
                    )}
                    {status === "sending" ? "Sending…" : "Send Message"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
