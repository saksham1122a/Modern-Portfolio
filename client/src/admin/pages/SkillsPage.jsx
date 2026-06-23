import { useEffect, useState } from "react";
import { adminAPI } from "../api";
import { Card, Btn, Modal, Confirm, Empty, Alert, Spinner, Field, Input, Select, Badge } from "../components/UI";

const CATEGORIES = ["frontend", "backend", "database", "language", "tools"];
const CAT_LABELS = { frontend: "Frontend", backend: "Backend", database: "Database", language: "Languages", tools: "Tools" };
const CAT_COLORS = { frontend: "#e63946", backend: "#60a5fa", database: "#4ade80", language: "#fbbf24", tools: "#a78bfa" };

const EMPTY_FORM = { name: "", category: "frontend", proficiency: 85, yearsExperience: 1, order: 0 };

const SkillForm = ({ initial = EMPTY_FORM, onSave, onCancel, loading }) => {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initial });
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };

  const submit = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (form.proficiency < 0 || form.proficiency > 100) e.proficiency = "Must be 0–100";
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, proficiency: Number(form.proficiency), yearsExperience: Number(form.yearsExperience), order: Number(form.order) });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Skill Name *" error={errors.name}>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="React.js" />
        </Field>
        <Field label="Category *">
          <Select value={form.category} onChange={(e) => set("category", e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
          </Select>
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        <Field label={`Proficiency: ${form.proficiency}%`} error={errors.proficiency}>
          <Input type="range" min={0} max={100} value={form.proficiency}
            onChange={(e) => set("proficiency", e.target.value)}
            style={{ padding: "0.4rem 0", background: "transparent", border: "none" }} />
        </Field>
        <Field label="Years Experience">
          <Input type="number" min={0} max={20} value={form.yearsExperience} onChange={(e) => set("yearsExperience", e.target.value)} />
        </Field>
        <Field label="Display Order">
          <Input type="number" value={form.order} onChange={(e) => set("order", e.target.value)} />
        </Field>
      </div>

      {/* Live preview */}
      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "1rem", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize: 11, color: "#6b6b70", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>Preview</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{form.name || "Skill Name"}</span>
          <span style={{ fontSize: 11, color: CAT_COLORS[form.category] }}>{CAT_LABELS[form.category]}</span>
        </div>
        <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${form.proficiency}%`, background: CAT_COLORS[form.category], borderRadius: 999, transition: "width 0.3s" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: 11, color: "#6b6b70" }}>{form.yearsExperience}yr{form.yearsExperience != 1 ? "s" : ""}</span>
          <span style={{ fontSize: 11, color: CAT_COLORS[form.category], fontWeight: 600 }}>{form.proficiency}%</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn onClick={submit} loading={loading}>Save Skill</Btn>
      </div>
    </div>
  );
};

const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [filterCat, setFilterCat] = useState("all");

  const load = () => {
    setLoading(true);
    adminAPI.getSkills()
      .then((d) => setSkills(d.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    setSaving(true); setError("");
    try {
      if (modal === "add") {
        const d = await adminAPI.createSkill(form);
        setSkills((prev) => [...prev, d.data]);
      } else {
        const d = await adminAPI.updateSkill(modal._id, form);
        setSkills((prev) => prev.map((s) => s._id === modal._id ? d.data : s));
      }
      setModal(null);
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminAPI.deleteSkill(confirm._id);
      setSkills((prev) => prev.filter((s) => s._id !== confirm._id));
      setConfirm(null);
    } catch (e) { setError(e.message); }
    finally { setDeleting(false); }
  };

  const filtered = filterCat === "all" ? skills : skills.filter((s) => s.category === filterCat);

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}><Spinner size={28} /></div>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Skills</h2>
          <p style={{ color: "#6b6b70", fontSize: 13, marginTop: 4 }}>{skills.length} skill{skills.length !== 1 ? "s" : ""} across {CATEGORIES.length} categories</p>
        </div>
        <Btn onClick={() => setModal("add")}>+ Add Skill</Btn>
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {["all", ...CATEGORIES].map((c) => (
          <button key={c} onClick={() => setFilterCat(c)} style={{
            padding: "0.35rem 0.85rem", borderRadius: 8, border: "1px solid",
            borderColor: filterCat === c ? (CAT_COLORS[c] || "#e63946") : "rgba(255,255,255,0.1)",
            background: filterCat === c ? `${CAT_COLORS[c] || "#e63946"}22` : "transparent",
            color: filterCat === c ? (CAT_COLORS[c] || "#ff5a64") : "#a3a3a8",
            fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize",
          }}>
            {c === "all" ? "All" : CAT_LABELS[c]}
            {c !== "all" && <span style={{ marginLeft: 5, opacity: 0.7 }}>({skills.filter((s) => s.category === c).length})</span>}
          </button>
        ))}
      </div>

      {error && <Alert type="error" style={{ marginBottom: 16 }}>{error}</Alert>}

      {filtered.length === 0 ? (
        <Empty icon="⚡" message="No skills in this category yet." />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {filtered.sort((a, b) => a.order - b.order).map((skill) => (
            <Card key={skill._id} style={{ padding: "1rem 1.1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#f5f5f5", marginBottom: 3 }}>{skill.name}</div>
                  <Badge variant="muted" style={{ color: CAT_COLORS[skill.category] }}>{CAT_LABELS[skill.category]}</Badge>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn variant="outline" style={{ padding: "0.3rem 0.65rem", fontSize: 11 }} onClick={() => setModal(skill)}>Edit</Btn>
                  <Btn variant="danger" style={{ padding: "0.3rem 0.65rem", fontSize: 11 }} onClick={() => setConfirm(skill)}>✕</Btn>
                </div>
              </div>

              <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden", marginBottom: 6 }}>
                <div style={{ height: "100%", width: `${skill.proficiency}%`, background: CAT_COLORS[skill.category] || "#e63946", borderRadius: 999 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: "#6b6b70" }}>{skill.yearsExperience}yr{skill.yearsExperience !== 1 ? "s" : ""}</span>
                <span style={{ fontSize: 11, color: CAT_COLORS[skill.category] || "#e63946", fontWeight: 600 }}>{skill.proficiency}%</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === "add" ? "Add Skill" : "Edit Skill"} width={520}>
        <SkillForm initial={modal !== "add" ? modal : EMPTY_FORM} onSave={handleSave} onCancel={() => setModal(null)} loading={saving} />
      </Modal>

      <Confirm open={!!confirm} onClose={() => setConfirm(null)} onConfirm={handleDelete} loading={deleting}
        message={`Delete skill "${confirm?.name}"? This cannot be undone.`} />
    </div>
  );
};

export default SkillsPage;
