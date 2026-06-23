import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";

/* ── Animated particle canvas ── */
const ParticleCanvas = () => {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    let raf;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);

    const COUNT = 60;
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.35, dy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.5 + 0.15,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230,57,70,${p.alpha})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(230,57,70,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
};

/* ── Floating label input ── */
const FloatingInput = ({ label, type = "text", value, onChange, onKeyDown, autoFocus }) => {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;
  return (
    <div style={{ position: "relative", marginBottom: "1.75rem" }}>
      <label style={{
        position: "absolute", left: 0,
        top: lifted ? -20 : 14,
        fontSize: lifted ? 11 : 14,
        color: lifted ? "#e63946" : "#6b6b70",
        fontFamily: "monospace",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
        pointerEvents: "none",
      }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
        autoComplete={type === "email" ? "email" : "current-password"}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          borderBottom: `1px solid ${focused ? "#e63946" : "rgba(255,255,255,0.15)"}`,
          borderRadius: 0,
          padding: "0.75rem 0",
          fontSize: 16,
          color: "#f5f5f5",
          fontFamily: "inherit",
          outline: "none",
          boxShadow: focused ? "0 1px 0 #e63946" : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      />
    </div>
  );
};

const LoginPage = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const handle = async () => {
    if (!form.email || !form.password) { setError("Email and password are required"); return; }
    setLoading(true); setError("");
    try {
      await login(form.email, form.password);
    } catch (e) {
      setError(e.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse 100% 80% at 50% -10%, rgba(230,57,70,0.22) 0%, #08080a 55%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: "#f5f5f5", overflow: "hidden",
    }}>
      <ParticleCanvas />

      {/* Ghost text */}
      {["left", "right"].map((side) => (
        <div key={side} style={{
          position: "fixed", [side]: "5%", top: "50%", transform: "translateY(-50%)",
          opacity: 0.04, fontSize: "clamp(60px,10vw,120px)", fontWeight: 900,
          letterSpacing: "-0.04em", lineHeight: 1, userSelect: "none",
          color: "#e63946", pointerEvents: "none",
          textAlign: side === "right" ? "right" : "left",
        }}>
          {side === "left" ? "ADMIN" : "PANEL"}
        </div>
      ))}

      {/* Card */}
      <div style={{
        position: "relative", zIndex: 1,
        width: "100%", maxWidth: 420, padding: "0 1.5rem",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 64, height: 64, borderRadius: "50%",
            background: "rgba(230,57,70,0.12)", border: "1px solid rgba(230,57,70,0.3)",
            fontSize: 26, marginBottom: "1.25rem",
            boxShadow: "0 0 40px rgba(230,57,70,0.2)",
          }}>⚡</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 6 }}>
            Admin Panel
          </h1>
          <p style={{ color: "#6b6b70", fontSize: 13, fontFamily: "monospace" }}>
            SAKSHAM NANDA · PORTFOLIO
          </p>
        </div>

        {/* Form */}
        <div style={{ marginBottom: "2rem" }}>
          {error && (
            <div style={{
              background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)",
              borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1.5rem",
              color: "#fca5a5", fontSize: 13, display: "flex", alignItems: "center", gap: 8,
            }}>
              ⚠ {error}
            </div>
          )}

          <FloatingInput
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && handle()}
            autoFocus
          />
          <FloatingInput
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && handle()}
          />

          <button
            onClick={handle}
            disabled={loading}
            style={{
              width: "100%", padding: "1rem", marginTop: "0.5rem",
              background: loading ? "rgba(230,57,70,0.5)" : "#e63946",
              color: "#fff", border: "none", borderRadius: 10,
              fontSize: 15, fontWeight: 700, fontFamily: "inherit",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              boxShadow: "0 4px 24px rgba(230,57,70,0.35)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(230,57,70,0.45)"; } }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 24px rgba(230,57,70,0.35)"; }}
          >
            {loading ? (
              <span style={{
                width: 18, height: 18,
                border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff",
                borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block",
              }} />
            ) : "Sign In →"}
          </button>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: "1.25rem" }} />
          <a href="/" style={{ fontSize: 12, color: "#6b6b70", textDecoration: "none", fontFamily: "monospace" }}>
            ↗ View Portfolio
          </a>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default LoginPage;
