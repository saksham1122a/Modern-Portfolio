import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, User, Mail, Lock, CheckCircle } from "lucide-react";
import { useUserAuth } from "../hooks/useUserAuth";
import "./AuthModal.css";

const InputField = ({ icon: Icon, label, type, value, onChange, error, showToggle, onToggle, placeholder }) => (
  <div className="auth-field">
    <label className="auth-field__label">{label}</label>
    <div className={`auth-field__wrap ${error ? "auth-field__wrap--error" : ""}`}>
      <span className="auth-field__icon"><Icon size={16} /></span>
      <input
        className="auth-field__input"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
      />
      {showToggle && (
        <button type="button" className="auth-field__toggle" onClick={onToggle}>
          {type === "password" ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>
      )}
    </div>
    {error && <span className="auth-field__error">{error}</span>}
  </div>
);

const AuthModal = ({ open, onClose, defaultTab = "login" }) => {
  const { login, register } = useUserAuth();
  const [tab, setTab] = useState(defaultTab);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ name: "", email: "", password: "", confirm: "" });

  useEffect(() => {
    if (open) { setTab(defaultTab); setError(""); setErrors({}); setSuccess(false); }
  }, [open, defaultTab]);

  useEffect(() => {
    if (!open) return;
    const esc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [open, onClose]);

  const validateLogin = () => {
    const e = {};
    if (!loginForm.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(loginForm.email)) e.email = "Enter a valid email";
    if (!loginForm.password) e.password = "Password is required";
    return e;
  };

  const validateReg = () => {
    const e = {};
    if (!regForm.name.trim()) e.name = "Name is required";
    if (!regForm.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(regForm.email)) e.email = "Enter a valid email";
    if (!regForm.password) e.password = "Password is required";
    else if (regForm.password.length < 6) e.password = "Minimum 6 characters";
    if (regForm.password !== regForm.confirm) e.confirm = "Passwords don't match";
    return e;
  };

  const handleLogin = async () => {
    const e = validateLogin();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true); setError(""); setErrors({});
    try {
      await login(loginForm.email, loginForm.password);
      setSuccess(true);
      setTimeout(onClose, 1400);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const handleRegister = async () => {
    const e = validateReg();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true); setError(""); setErrors({});
    try {
      await register(regForm.name, regForm.email, regForm.password);
      setSuccess(true);
      setTimeout(onClose, 1600);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="auth-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className="auth-modal"
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button className="auth-modal__close" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  className="auth-success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 260 }}
                  >
                    <CheckCircle size={52} className="auth-success__icon" />
                  </motion.div>
                  <h3>{tab === "login" ? "Welcome back!" : "Account created!"}</h3>
                  <p>{tab === "login" ? "You're signed in." : "Welcome to the portfolio."}</p>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 1 }}>
                  {/* Header */}
                  <div className="auth-modal__header">
                    <div className="auth-modal__logo">SN</div>
                    <h2 className="auth-modal__title">
                      {tab === "login" ? "Welcome back" : "Create account"}
                    </h2>
                    <p className="auth-modal__subtitle">
                      {tab === "login"
                        ? "Sign in to your account"
                        : "Join to stay connected with Saksham's work"}
                    </p>
                  </div>

                  {/* Tabs */}
                  <div className="auth-tabs">
                    {["login", "register"].map((t) => (
                      <button
                        key={t}
                        className={`auth-tab ${tab === t ? "auth-tab--active" : ""}`}
                        onClick={() => { setTab(t); setError(""); setErrors({}); }}
                      >
                        {t === "login" ? "Sign In" : "Sign Up"}
                        {tab === t && (
                          <motion.span className="auth-tab__indicator" layoutId="tab-indicator"
                            transition={{ type: "spring", stiffness: 350, damping: 30 }} />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Error banner */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        className="auth-error"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        ⚠ {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Form fields */}
                  <div className="auth-form">
                    <AnimatePresence mode="wait">
                      {tab === "login" ? (
                        <motion.div key="login-fields"
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.25 }}
                          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                        >
                          <InputField icon={Mail} label="Email" type="email" placeholder="you@email.com"
                            value={loginForm.email} onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
                            error={errors.email} />
                          <InputField icon={Lock} label="Password" type={showPass ? "text" : "password"} placeholder="••••••••"
                            value={loginForm.password} onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                            error={errors.password} showToggle onToggle={() => setShowPass((v) => !v)} />
                        </motion.div>
                      ) : (
                        <motion.div key="reg-fields"
                          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.25 }}
                          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                        >
                          <InputField icon={User} label="Full Name" type="text" placeholder="Saksham Nanda"
                            value={regForm.name} onChange={(e) => setRegForm((f) => ({ ...f, name: e.target.value }))}
                            error={errors.name} />
                          <InputField icon={Mail} label="Email" type="email" placeholder="you@email.com"
                            value={regForm.email} onChange={(e) => setRegForm((f) => ({ ...f, email: e.target.value }))}
                            error={errors.email} />
                          <InputField icon={Lock} label="Password" type={showPass ? "text" : "password"} placeholder="Min. 6 characters"
                            value={regForm.password} onChange={(e) => setRegForm((f) => ({ ...f, password: e.target.value }))}
                            error={errors.password} showToggle onToggle={() => setShowPass((v) => !v)} />
                          <InputField icon={Lock} label="Confirm Password" type={showPass ? "text" : "password"} placeholder="Repeat password"
                            value={regForm.confirm} onChange={(e) => setRegForm((f) => ({ ...f, confirm: e.target.value }))}
                            error={errors.confirm} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      className="auth-submit"
                      onClick={tab === "login" ? handleLogin : handleRegister}
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="auth-spinner" />
                      ) : (
                        tab === "login" ? "Sign In" : "Create Account"
                      )}
                    </button>

                    <p className="auth-switch">
                      {tab === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                      <button onClick={() => { setTab(tab === "login" ? "register" : "login"); setError(""); setErrors({}); }}>
                        {tab === "login" ? "Sign up" : "Sign in"}
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
