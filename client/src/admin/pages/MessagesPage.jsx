import { useEffect, useState } from "react";
import { adminAPI } from "../api";
import { Card, Badge, Btn, Modal, Confirm, Empty, Alert, Spinner } from "../components/UI";

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter] = useState("all"); // all | unread | read

  const load = () => {
    setLoading(true);
    adminAPI.getMessages()
      .then((d) => setMessages(d.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openMessage = async (msg) => {
    setSelected(msg);
    if (!msg.read) {
      await adminAPI.markRead(msg._id, true).catch(() => {});
      setMessages((prev) => prev.map((m) => m._id === msg._id ? { ...m, read: true } : m));
    }
  };

  const toggleRead = async (e, msg) => {
    e.stopPropagation();
    await adminAPI.markRead(msg._id, !msg.read).catch(() => {});
    setMessages((prev) => prev.map((m) => m._id === msg._id ? { ...m, read: !m.read } : m));
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminAPI.deleteMessage(confirm._id);
      setMessages((prev) => prev.filter((m) => m._id !== confirm._id));
      if (selected?._id === confirm._id) setSelected(null);
      setConfirm(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = messages.filter((m) =>
    filter === "all" ? true : filter === "unread" ? !m.read : m.read
  );

  const unreadCount = messages.filter((m) => !m.read).length;

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}><Spinner size={28} /></div>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Messages</h2>
          <p style={{ color: "#6b6b70", fontSize: 13, marginTop: 4 }}>
            {messages.length} total · {unreadCount} unread
          </p>
        </div>
        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "unread", "read"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "0.4rem 0.9rem",
                borderRadius: 8,
                border: "1px solid",
                borderColor: filter === f ? "#e63946" : "rgba(255,255,255,0.1)",
                background: filter === f ? "rgba(230,57,70,0.15)" : "transparent",
                color: filter === f ? "#ff5a64" : "#a3a3a8",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                textTransform: "capitalize",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {error && <Alert type="error" style={{ marginBottom: 16 }}>{error}</Alert>}

      {filtered.length === 0 ? (
        <Empty icon="📭" message={filter === "unread" ? "No unread messages" : "No messages yet"} />
      ) : (
        <Card style={{ overflow: "hidden" }}>
          {filtered.map((msg, i) => (
            <div
              key={msg._id}
              onClick={() => openMessage(msg)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "1rem 1.25rem",
                borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                cursor: "pointer",
                background: !msg.read ? "rgba(230,57,70,0.04)" : "transparent",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = !msg.read ? "rgba(230,57,70,0.04)" : "transparent")}
            >
              {/* Unread dot */}
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: msg.read ? "transparent" : "#e63946",
                flexShrink: 0,
                boxShadow: msg.read ? "none" : "0 0 8px #e63946",
              }} />

              {/* Avatar */}
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: "rgba(230,57,70,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15, fontWeight: 700, color: "#e63946", flexShrink: 0,
              }}>
                {msg.name?.[0]?.toUpperCase()}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <span style={{ fontWeight: msg.read ? 400 : 700, fontSize: 14, color: "#f5f5f5" }}>{msg.name}</span>
                  <span style={{ fontSize: 12, color: "#6b6b70" }}>{msg.email}</span>
                </div>
                <div style={{ fontSize: 13, color: "#a3a3a8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  <span style={{ fontWeight: msg.read ? 400 : 600 }}>{msg.subject || "No subject"}</span>
                  {" · "}
                  <span style={{ color: "#6b6b70" }}>{msg.message?.slice(0, 60)}…</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: "#6b6b70" }}>
                  {new Date(msg.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </span>
                <button
                  title={msg.read ? "Mark unread" : "Mark read"}
                  onClick={(e) => toggleRead(e, msg)}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#6b6b70", padding: 4 }}
                >
                  {msg.read ? "○" : "●"}
                </button>
                <button
                  title="Delete"
                  onClick={(e) => { e.stopPropagation(); setConfirm(msg); }}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#f87171", padding: 4 }}
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Message detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Message" width={600}>
        {selected && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "1.5rem" }}>
              {[
                ["From", selected.name],
                ["Email", selected.email],
                ["Subject", selected.subject || "—"],
                ["Received", new Date(selected.createdAt).toLocaleString("en-IN")],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 10, color: "#6b6b70", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{k}</div>
                  <div style={{ fontSize: 14, color: "#f5f5f5", fontWeight: 500 }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "1rem", marginBottom: "1.5rem" }}>
              <p style={{ color: "#d4d4d8", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0 }}>
                {selected.message}
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <a
                href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || "Your message")}`}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "0.55rem 1.1rem", borderRadius: 8,
                  background: "#e63946", color: "#fff",
                  fontSize: 13, fontWeight: 600, textDecoration: "none",
                }}
              >
                ↩ Reply via Email
              </a>
              <Btn variant="danger" onClick={() => { setConfirm(selected); setSelected(null); }}>
                🗑 Delete
              </Btn>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm delete */}
      <Confirm
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Delete message from "${confirm?.name}"? This cannot be undone.`}
      />
    </div>
  );
};

export default MessagesPage;
