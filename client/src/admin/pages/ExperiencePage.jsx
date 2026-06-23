import { useEffect, useState } from "react";
import { adminAPI } from "../api";
import { Card, Btn, Modal, Confirm, Empty, Alert, Spinner, Field, Input, Textarea, Badge } from "../components/UI";

const EMPTY_FORM = {
  role: "", company: "", location: "", startDate: "", endDate: "",
  description: "", achievements: "", order: 0,
};

const toInputDate = (d) => {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
};

const ExperienceForm = ({ initial = EMPTY_FORM, onSave, onCancel, loading }) => {
  const [form, setForm] = useState({
    ...EMPTY_FORM,
    ...initial,
    startDate: toInputDate(initial.startDate),
    endDate: toInputDate(initial.endDate),
    achievements: Array.isArray(initial.achievements) ? initial.achievements.join("\n") : initial.achievements || "",
  });
  const [errors, setErrors] = useState({});
  const [current, setCurrent] = useState(!initial.endDate);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };

  const submit = () => {
    const e = {};
    if (!form.role.trim()) e.role = "Required";
    if (!form.company.trim()) e.company = "Required";
    if (!form.startDate) e.startDate = "Required";
    if (!form.description.trim()) e.description = "Required";
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({
      ...form,
      endDate: current ? null : form.endDate || null,
      achievements: form.achievements.split("\n").map((a) => a.trim()).filter(Boolean),
      order: Number(form.order) || 0,
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Role / Title *" error={errors.role}>
          <Input value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="Full Stack Developer" />
        </Field>
        <Field label="Company *" error={errors.company}>
          <Input value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Sensation Software Solutions" />
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        <Field label="Location">
          <Input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Mohali, Punjab" />
        </Field>
        <Field label="Start Date *" error={errors.startDate}>
          <Input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
        </Field>
        <Field label={current ? "End Date (Current)" : "End Date"}>
          <Input type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} disabled={current} style={{ opacity: current ? 0.4 : 1 }} />
        </Field>
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13, color: "#a3a3a8" }}>
        <input type="checkbox" checked={current} onChange={(e) => { setCurrent(e.target.checked); if (e.target.checked) set("endDate", ""); }}
          style={{ width: 16, height: 16, accentColor: "#e63946" }} />
        Currently working here
      </label>

      <Field label="Description *" error={errors.description}>
        <Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)}
          placeholder="What you did, what you built, what problem you solved..." />
      </Field>

      <Field label="Achievements (one per line)">
        <Textarea rows={4} value={form.achievements} onChange={(e) => set("achievements", e.target.value)}
          placeholder={"Built RESTful APIs for campus feedback platform\nReduced tracking effort by automating complaint routing\nCollaborated with a 3-member team"} />
      </Field>

      <Field label="Display Order">
        <Input type="number" value={form.order} onChange={(e) => set("order", e.target.value)} style={{ maxWidth: 120 }} />
      </Field>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn onClick={submit} loading={loading}>Save Experience</Btn>
      </div>
    </div>
  );
};

const ExperiencePage = () => {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    adminAPI.getExperience()
      .then((d) => setExperience(d.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    setSaving(true); setError("");
    try {
      if (modal === "add") {
        const d = await adminAPI.createExperience(form);
        setExperience((prev) => [...prev, d.data]);
      } else {
        const d = await adminAPI.updateExperience(modal._id, form);
        setExperience((prev) => prev.map((e) => e._id === modal._id ? d.data : e));
      }
      setModal(null);
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminAPI.deleteExperience(confirm._id);
      setExperience((prev) => prev.filter((e) => e._id !== confirm._id));
      setConfirm(null);
    } catch (e) { setError(e.message); }
    finally { setDeleting(false); }
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "Present";

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}><Spinner size={28} /></div>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Experience</h2>
          <p style={{ color: "#6b6b70", fontSize: 13, marginTop: 4 }}>{experience.length} entr{experience.length !== 1 ? "ies" : "y"}</p>
        </div>
        <Btn onClick={() => setModal("add")}>+ Add Entry</Btn>
      </div>

      {error && <Alert type="error" style={{ marginBottom: 16 }}>{error}</Alert>}

      {experience.length === 0 ? (
        <Empty icon="🏆" message="No experience entries yet." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {experience.sort((a, b) => a.order - b.order).map((item) => (
            <Card key={item._id} style={{ padding: "1.25rem 1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: "#f5f5f5" }}>{item.role}</span>
                    {!item.endDate && <Badge variant="success">Current</Badge>}
                  </div>
                  <div style={{ fontSize: 13, color: "#e63946", fontWeight: 500, marginBottom: 6 }}>{item.company}</div>
                  <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: "#6b6b70" }}>📅 {fmt(item.startDate)} — {fmt(item.endDate)}</span>
                    {item.location && item.location !== "—" && (
                      <span style={{ fontSize: 12, color: "#6b6b70" }}>📍 {item.location}</span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: "#a3a3a8", lineHeight: 1.5, marginBottom: item.achievements?.length ? 10 : 0,
                    overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {item.description}
                  </p>
                  {item.achievements?.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {item.achievements.slice(0, 3).map((a, i) => (
                        <span key={i} style={{ fontSize: 11, color: "#6b6b70", background: "rgba(255,255,255,0.04)",
                          padding: "2px 8px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.07)" }}>
                          {a.length > 40 ? a.slice(0, 40) + "…" : a}
                        </span>
                      ))}
                      {item.achievements.length > 3 && (
                        <span style={{ fontSize: 11, color: "#6b6b70" }}>+{item.achievements.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <Btn variant="outline" style={{ padding: "0.4rem 0.8rem", fontSize: 12 }} onClick={() => setModal(item)}>Edit</Btn>
                  <Btn variant="danger" style={{ padding: "0.4rem 0.8rem", fontSize: 12 }} onClick={() => setConfirm(item)}>Delete</Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === "add" ? "Add Experience" : "Edit Experience"} width={680}>
        <ExperienceForm initial={modal !== "add" ? modal : EMPTY_FORM} onSave={handleSave} onCancel={() => setModal(null)} loading={saving} />
      </Modal>

      <Confirm open={!!confirm} onClose={() => setConfirm(null)} onConfirm={handleDelete} loading={deleting}
        message={`Delete "${confirm?.role} at ${confirm?.company}"? This cannot be undone.`} />
    </div>
  );
};

export default ExperiencePage;
