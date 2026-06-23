import { useAuth } from "../hooks/useAuth";

const NAV = [
  { id: "dashboard",  label: "Dashboard",  icon: "📊" },
  { id: "messages",   label: "Messages",   icon: "✉️"  },
  { id: "users",      label: "Visitors",   icon: "👥"  },
  { id: "projects",   label: "Projects",   icon: "🗂️"  },
  { id: "skills",     label: "Skills",     icon: "⚡"  },
  { id: "experience", label: "Experience", icon: "🏆"  },
];

const Sidebar = ({ page, setPage, unread = 0 }) => {
  const { admin, logout } = useAuth();

  return (
    <aside style={{
      width: 220,
      minHeight: "100vh",
      background: "rgba(10,10,12,0.95)",
      borderRight: "1px solid rgba(255,255,255,0.07)",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      position: "sticky",
      top: 0,
      height: "100vh",
    }}>
      {/* Brand */}
      <div style={{ padding: "1.5rem 1.25rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "-0.01em", color: "#f5f5f5" }}>
          ⚡ Admin Panel
        </div>
        <div style={{ fontSize: 11, color: "#6b6b70", marginTop: 4 }}>
          {admin?.email}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0.75rem 0.75rem" }}>
        {NAV.map((item) => {
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "0.6rem 0.85rem",
                borderRadius: 9,
                border: "none",
                background: active ? "rgba(230,57,70,0.15)" : "transparent",
                color: active ? "#ff5a64" : "#a3a3a8",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                cursor: "pointer",
                textAlign: "left",
                marginBottom: 2,
                transition: "background 0.15s, color 0.15s",
                position: "relative",
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              {item.label}
              {item.id === "messages" && unread > 0 && (
                <span style={{
                  marginLeft: "auto",
                  background: "#e63946",
                  color: "#fff",
                  borderRadius: 999,
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "1px 6px",
                  minWidth: 18,
                  textAlign: "center",
                }}>
                  {unread}
                </span>
              )}
              {active && (
                <span style={{
                  position: "absolute",
                  left: 0,
                  top: "20%",
                  bottom: "20%",
                  width: 3,
                  background: "#e63946",
                  borderRadius: 999,
                }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "block", fontSize: 12, color: "#6b6b70", marginBottom: 10, textDecoration: "none" }}
        >
          ↗ View Portfolio
        </a>
        <button
          onClick={logout}
          style={{
            width: "100%",
            padding: "0.5rem",
            borderRadius: 8,
            border: "1px solid rgba(248,113,113,0.25)",
            background: "rgba(248,113,113,0.08)",
            color: "#f87171",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
