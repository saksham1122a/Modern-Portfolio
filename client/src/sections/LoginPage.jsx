import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, User, Mail, Lock, CheckCircle, ArrowLeft } from "lucide-react";
import { useUserAuth } from "../hooks/useUserAuth";
import "./LoginPage.css";

const FloatingField = ({ icon: Icon, label, type, value, onChange, error, showToggle, onToggle, placeholder, autoFocus }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="lp-field">
      <div className={`lp-field__wrap ${focused ? "lp-field__wrap--focused" : ""} ${error ? "lp-field__wrap--error" : ""}`}>
        <span className="lp-field__icon"><Icon size={17} /></span>
        <div className="lp-field__inner">
          <label className={`lp-field__label ${focused || value ? "lp-field__label--up" : ""}`}>{label}</label>
          <input
            className="lp-field__input"
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={focused ? placeholder : ""}
            autoFocus={autoFocus}
          />
        </div>
        {showToggle && (
          <button type="button" className="lp-field__toggle" onClick={onToggle} tabIndex={-1}>
            {type === "password" ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.span className="lp-field__error"
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

const PasswordStrength = ({ password }) => {
  if (!password) return null;
  const checks = [
    { label: "6+ characters", ok: password.length >= 6 },
    { label: "Uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /\d/.test(password) },
    { label: "Special char", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ["#f87171", "#fbbf24", "#fbbf24", "#4ade80", "#4ade80"];
  const labels = ["Weak", "Fair", "Fair", "Strong", "Strong"];

  return (
    <div className="lp-strength">
      <div className="lp-strength__bars">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="lp-strength__bar"
            style={{ background: i < score ? colors[score] : "rgba(255,255,255,0.06)" }} />
        ))}
      </div>
      <span className="lp-strength__label" style={{ color: colors[score] }}>{labels[score]}</span>
    </div>
  );
};

const LoginPage = () => {
  const { login, register, user } = useUserAuth();
  const [tab, setTab] = useState(
    window.location.search.includes("tab=register") ? "register" : "login"
  );
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ name: "", email: "", password: "", confirm: "" });

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  // Already logged in → go home
  useEffect(() => {
    if (user) window.location.href = "/";
  }, [user]);

  const setL = (k) => (e) => setLoginForm((f) => ({ ...f, [k]: e.target.value }));
  const setR = (k) => (e) => setRegForm((f) => ({ ...f, [k]: e.target.value }));
  const clearErr = (k) => setErrors((p) => ({ ...p, [k]: "" }));

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
      setTimeout(() => (window.location.href = "/"), 1500);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleRegister = async () => {
    const e = validateReg();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true); setError(""); setErrors({});
    try {
      await register(regForm.name, regForm.email, regForm.password);
      setSuccess(true);
      setTimeout(() => (window.location.href = "/"), 1800);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const switchTab = (t) => { setTab(t); setError(""); setErrors({}); setShowPass(false); };

  return (
    <div className="lp-root">
      {/* Animated background */}
      <div className="lp-bg">
        <div className="lp-bg__glow lp-bg__glow--1" />
        <div className="lp-bg__glow lp-bg__glow--2" />
        <div className="lp-bg__grid" />
      </div>

      {/* Back to portfolio */}
      <motion.a
        href="/"
        className="lp-back"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ArrowLeft size={15} />
        <span>Back to Portfolio</span>
      </motion.a>

      {/* Card */}
      <div
        className="lp-card"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Glowing top border */}
        <div className="lp-card__topbar" />

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              className="lp-success"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 240, damping: 16 }}
              >
                <CheckCircle size={58} className="lp-success__icon" />
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                {tab === "login" ? "Welcome back!" : "You're in!"}
              </motion.h2>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
                {tab === "login" ? "Signed in successfully. Redirecting…" : "Account created! Redirecting to the portfolio…"}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 1 }}>
              {/* Brand */}
              <div className="lp-brand">
                <div className="lp-brand__mark">SN</div>
                <div>
                  <h1 className="lp-brand__name">Saksham Nanda</h1>
                  <p className="lp-brand__role">Full Stack MERN Developer</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="lp-tabs">
                {["login", "register"].map((t) => (
                  <button
                    key={t}
                    className={`lp-tab ${tab === t ? "lp-tab--active" : ""}`}
                    onClick={() => switchTab(t)}
                  >
                    {t === "login" ? "Sign In" : "Create Account"}
                    {tab === t && (
                      <motion.span
                        className="lp-tab__bar"
                        layoutId="lp-tab-bar"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Heading */}
              <AnimatePresence mode="wait">
                <motion.div key={tab}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}
                  className="lp-heading"
                >
                  <h2>{tab === "login" ? "Welcome back" : "Join the portfolio"}</h2>
                  <p>{tab === "login"
                    ? "Sign in to stay connected with Saksham's work."
                    : "Create a free account to follow along."}</p>
                </motion.div>
              </AnimatePresence>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div className="lp-error"
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    ⚠ {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Fields */}
              <AnimatePresence mode="wait">
                {tab === "login" ? (
                  <motion.div key="login-f"
                    initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 14 }} transition={{ duration: 0.26 }}
                    className="lp-fields"
                  >
                    <FloatingField icon={Mail} label="Email address" type="email" placeholder="you@email.com"
                      value={loginForm.email} onChange={(e) => { setL("email")(e); clearErr("email"); }}
                      error={errors.email} autoFocus />
                    <FloatingField icon={Lock} label="Password" type={showPass ? "text" : "password"} placeholder="Your password"
                      value={loginForm.password} onChange={(e) => { setL("password")(e); clearErr("password"); }}
                      error={errors.password} showToggle onToggle={() => setShowPass((v) => !v)} />
                  </motion.div>
                ) : (
                  <motion.div key="reg-f"
                    initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -14 }} transition={{ duration: 0.26 }}
                    className="lp-fields"
                  >
                    <FloatingField icon={User} label="Full name" type="text" placeholder="Saksham Nanda"
                      value={regForm.name} onChange={(e) => { setR("name")(e); clearErr("name"); }}
                      error={errors.name} autoFocus />
                    <FloatingField icon={Mail} label="Email address" type="email" placeholder="you@email.com"
                      value={regForm.email} onChange={(e) => { setR("email")(e); clearErr("email"); }}
                      error={errors.email} />
                    <FloatingField icon={Lock} label="Password" type={showPass ? "text" : "password"} placeholder="Min. 6 characters"
                      value={regForm.password} onChange={(e) => { setR("password")(e); clearErr("password"); }}
                      error={errors.password} showToggle onToggle={() => setShowPass((v) => !v)} />
                    <PasswordStrength password={regForm.password} />
                    <FloatingField icon={Lock} label="Confirm password" type={showPass ? "text" : "password"} placeholder="Repeat password"
                      value={regForm.confirm} onChange={(e) => { setR("confirm")(e); clearErr("confirm"); }}
                      error={errors.confirm} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                className="lp-submit"
                onClick={tab === "login" ? handleLogin : handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <span className="lp-submit__spinner" />
                ) : (
                  <>
                    <span>{tab === "login" ? "Sign In" : "Create Account"}</span>
                    <span className="lp-submit__arrow">→</span>
                  </>
                )}
              </button>

              {/* Switch */}
              <p className="lp-switch">
                {tab === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                <button onClick={() => switchTab(tab === "login" ? "register" : "login")}>
                  {tab === "login" ? "Sign up free" : "Sign in"}
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LoginPage;
