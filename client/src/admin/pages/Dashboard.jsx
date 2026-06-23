import { useEffect, useState } from "react";
import { adminAPI } from "../api";
import { StatCard, Card, Badge, Spinner, Alert } from "../components/UI";

const Dashboard = ({ setPage }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminAPI.stats()
      .then((d) => setStats(d.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
      <Spinner size={32} />
    </div>
  );

  if (error) return <Alert type="error">{error}</Alert>;

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: "0.4rem" }}>Dashboard</h2>
      <p style={{ color: "#6b6b70", fontSize: 13, marginBottom: "1.75rem" }}>
        Welcome back, overview of your portfolio data.
      </p>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, marginBottom: "2rem" }}>
        <StatCard label="Total Messages" value={stats.totalMessages} icon="✉️" accent="#e63946" />
        <StatCard label="Unread" value={stats.unreadMessages} icon="🔴" accent="#f87171" />
        <StatCard label="Visitors" value={stats.totalUsers ?? 0} icon="👥" accent="#60a5fa" />
        <StatCard label="Projects" value={stats.totalProjects} icon="🗂️" accent="#a78bfa" />
        <StatCard label="Skills" value={stats.totalSkills} icon="⚡" accent="#fbbf24" />
        <StatCard label="Experience" value={stats.totalExperience} icon="🏆" accent="#4ade80" />
      </div>

      {/* Recent messages */}
      <Card style={{ overflow: "hidden" }}>
        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Recent Messages</h3>
          <button
            onClick={() => setPage("messages")}
            style={{ fontSize: 12, color: "#e63946", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
          >
            View all →
          </button>
        </div>

        {stats.recentMessages?.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#6b6b70", fontSize: 13 }}>No messages yet</div>
        ) : (
          <div>
            {stats.recentMessages?.map((msg) => (
              <div
                key={msg._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "0.85rem 1.25rem",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  cursor: "pointer",
                }}
                onClick={() => setPage("messages")}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "rgba(230,57,70,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, flexShrink: 0,
                }}>
                  {msg.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: msg.read ? "#a3a3a8" : "#f5f5f5" }}>
                    {msg.name}
                    {!msg.read && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#e63946", display: "inline-block", marginLeft: 6 }} />}
                  </div>
                  <div style={{ fontSize: 12, color: "#6b6b70", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {msg.subject || "No subject"}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "#6b6b70", flexShrink: 0 }}>
                  {new Date(msg.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
