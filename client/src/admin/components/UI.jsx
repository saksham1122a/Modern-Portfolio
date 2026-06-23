/* ── Spinner ── */
export const Spinner = ({ size = 20 }) => (
  <span
    style={{
      display: "inline-block",
      width: size,
      height: size,
      border: "2px solid rgba(255,255,255,0.2)",
      borderTopColor: "#e63946",
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
    }}
  />
);

/* ── Badge ── */
const BADGE_STYLES = {
  success: { background: "rgba(74,222,128,0.15)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)" },
  danger:  { background: "rgba(248,113,113,0.15)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)" },
  warning: { background: "rgba(251,191,36,0.15)",  color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)" },
  muted:   { background: "rgba(255,255,255,0.06)",  color: "#a3a3a8", border: "1px solid rgba(255,255,255,0.1)" },
  primary: { background: "rgba(230,57,70,0.15)",    color: "#ff5a64", border: "1px solid rgba(230,57,70,0.3)" },
};

export const Badge = ({ variant = "muted", children }) => (
  <span style={{
    ...BADGE_STYLES[variant],
    padding: "0.2rem 0.6rem",
    borderRadius: 999,
    fontSize: 11,
    fontFamily: "monospace",
    fontWeight: 600,
    letterSpacing: "0.05em",
    whiteSpace: "nowrap",
  }}>
    {children}
  </span>
);

/* ── Button ── */
const BTN = {
  primary: { background: "#e63946", color: "#fff", border: "none" },
  outline: { background: "transparent", color: "#f5f5f5", border: "1px solid rgba(255,255,255,0.15)" },
  danger:  { background: "rgba(248,113,113,0.15)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)" },
  ghost:   { background: "rgba(255,255,255,0.05)", color: "#a3a3a8", border: "1px solid rgba(255,255,255,0.08)" },
};

export const Btn = ({ variant = "primary", children, loading, style, ...props }) => (
  <button
    style={{
      ...BTN[variant],
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "0.55rem 1.1rem",
      borderRadius: 8,
      fontSize: 13,
      fontWeight: 600,
      cursor: props.disabled || loading ? "not-allowed" : "pointer",
      opacity: props.disabled || loading ? 0.6 : 1,
      transition: "opacity 0.2s, transform 0.15s",
      fontFamily: "inherit",
      ...style,
    }}
    onMouseEnter={(e) => { if (!props.disabled && !loading) e.currentTarget.style.transform = "translateY(-1px)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
    {...props}
  >
    {loading ? <Spinner size={14} /> : children}
  </button>
);

/* ── Card ── */
export const Card = ({ children, style }) => (
  <div style={{
    background: "rgba(20,20,23,0.6)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 14,
    backdropFilter: "blur(12px)",
    ...style,
  }}>
    {children}
  </div>
);

/* ── Stat card ── */
export const StatCard = ({ label, value, icon, accent }) => (
  <Card style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: 16 }}>
    <span style={{
      fontSize: 24,
      width: 48,
      height: 48,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: accent ? `${accent}22` : "rgba(230,57,70,0.12)",
      borderRadius: 12,
    }}>{icon}</span>
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1, color: accent || "#e63946" }}>{value}</div>
      <div style={{ fontSize: 12, color: "#6b6b70", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
    </div>
  </Card>
);

/* ── Modal ── */
export const Modal = ({ open, onClose, title, children, width = 560 }) => {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(8,8,9,0.8)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#141417", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 16, width: "100%", maxWidth: width,
          maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#6b6b70", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ padding: "1.5rem" }}>{children}</div>
      </div>
    </div>
  );
};

/* ── Confirm dialog ── */
export const Confirm = ({ open, onClose, onConfirm, message, loading }) => (
  <Modal open={open} onClose={onClose} title="Confirm Action" width={400}>
    <p style={{ color: "#a3a3a8", marginBottom: "1.5rem", lineHeight: 1.6 }}>{message}</p>
    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
      <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
      <Btn variant="danger" onClick={onConfirm} loading={loading}>Delete</Btn>
    </div>
  </Modal>
);

/* ── Form field ── */
export const Field = ({ label, error, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && (
      <label style={{ fontSize: 11, fontFamily: "monospace", color: "#6b6b70", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </label>
    )}
    {children}
    {error && <span style={{ fontSize: 11, color: "#f87171" }}>{error}</span>}
  </div>
);

const inputBase = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  padding: "0.65rem 0.9rem",
  color: "#f5f5f5",
  fontSize: 14,
  fontFamily: "inherit",
  outline: "none",
  width: "100%",
  transition: "border-color 0.2s",
};

export const Input = ({ style, ...props }) => (
  <input
    style={{ ...inputBase, ...style }}
    onFocus={(e) => (e.target.style.borderColor = "#e63946")}
    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
    {...props}
  />
);

export const Textarea = ({ style, ...props }) => (
  <textarea
    style={{ ...inputBase, resize: "vertical", minHeight: 90, ...style }}
    onFocus={(e) => (e.target.style.borderColor = "#e63946")}
    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
    {...props}
  />
);

export const Select = ({ style, children, ...props }) => (
  <select
    style={{ ...inputBase, cursor: "pointer", ...style }}
    onFocus={(e) => (e.target.style.borderColor = "#e63946")}
    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
    {...props}
  >
    {children}
  </select>
);

/* ── Empty state ── */
export const Empty = ({ icon = "📭", message = "Nothing here yet" }) => (
  <div style={{ textAlign: "center", padding: "3rem", color: "#6b6b70" }}>
    <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
    <p style={{ fontSize: 14 }}>{message}</p>
  </div>
);

/* ── Alert ── */
export const Alert = ({ type = "error", children }) => {
  const colors = {
    error:   { bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)", color: "#fca5a5" },
    success: { bg: "rgba(74,222,128,0.1)",  border: "rgba(74,222,128,0.3)",  color: "#86efac" },
  };
  const c = colors[type];
  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color, borderRadius: 8, padding: "0.75rem 1rem", fontSize: 13 }}>
      {children}
    </div>
  );
};
