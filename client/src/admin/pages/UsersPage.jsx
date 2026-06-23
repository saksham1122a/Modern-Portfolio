import { useEffect, useState } from "react";
import { usersAPI } from "../api";
import { Card, Btn, Confirm, Empty, Alert, Spinner, Badge } from "../components/UI";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    usersAPI.list()
      .then((d) => setUsers(d.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await usersAPI.delete(confirm._id);
      setUsers((prev) => prev.filter((u) => u._id !== confirm._id));
      setConfirm(null);
    } catch (e) { setError(e.message); }
    finally { setDeleting(false); }
  };

  const filtered = users.filter(
    (u) => u.name?.toLowerCase().includes(search.toLowerCase()) ||
           u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (name) => name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?";

  const AVATAR_COLORS = ["#e63946","#60a5fa","#4ade80","#fbbf24","#a78bfa","#f472b6","#34d399"];
  const colorFor = (id) => AVATAR_COLORS[(id?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}><Spinner size={28} /></div>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Visitors</h2>
          <p style={{ color: "#6b6b70", fontSize: 13, marginTop: 4 }}>
            {users.length} registered account{users.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Search */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10, padding: "0.55rem 1rem", color: "#f5f5f5",
            fontSize: 13, fontFamily: "inherit", outline: "none", width: 240,
          }}
          onFocus={(e) => (e.target.style.borderColor = "#e63946")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
        />
      </div>

      {error && <Alert type="error" style={{ marginBottom: 16 }}>{error}</Alert>}

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))", gap: 12, marginBottom: "1.5rem" }}>
        {[
          { label: "Total", value: users.length, icon: "👥" },
          { label: "This month", value: users.filter((u) => new Date(u.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length, icon: "📅" },
          { label: "This week", value: users.filter((u) => new Date(u.createdAt) > new Date(Date.now() - 7*24*60*60*1000)).length, icon: "🆕" },
        ].map((s) => (
          <Card key={s.label} style={{ padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 22 }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#e63946", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#6b6b70", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Empty icon="👥" message={search ? "No users match your search" : "No visitor accounts yet"} />
      ) : (
        <Card style={{ overflow: "hidden" }}>
          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr auto", gap: 12, padding: "0.75rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 11, color: "#6b6b70", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            <span>Name</span><span>Email</span><span>Joined</span><span>Status</span><span />
          </div>

          {filtered.map((user, i) => (
            <div
              key={user._id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 2fr 1fr 1fr auto",
                gap: 12,
                alignItems: "center",
                padding: "0.85rem 1.25rem",
                borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {/* Name + avatar */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                  background: colorFor(user._id),
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, color: "#fff",
                }}>
                  {getInitials(user.name)}
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, color: "#f5f5f5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.name}
                </span>
              </div>

              {/* Email */}
              <span style={{ fontSize: 13, color: "#a3a3a8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.email}
              </span>

              {/* Joined */}
              <span style={{ fontSize: 12, color: "#6b6b70", fontFamily: "monospace" }}>
                {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>

              {/* Status */}
              <Badge variant="success">Active</Badge>

              {/* Delete */}
              <Btn variant="danger" style={{ padding: "0.3rem 0.65rem", fontSize: 11 }} onClick={() => setConfirm(user)}>
                ✕
              </Btn>
            </div>
          ))}
        </Card>
      )}

      <Confirm
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Delete account for "${confirm?.name}" (${confirm?.email})? This cannot be undone.`}
      />
    </div>
  );
};

export default UsersPage;
