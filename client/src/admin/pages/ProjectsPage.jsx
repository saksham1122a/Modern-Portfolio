import { useEffect, useState } from "react";
import { adminAPI } from "../api";
import { Card, Btn, Modal, Confirm, Empty, Alert, Spinner, Field, Input, Textarea, Badge } from "../components/UI";

const EMPTY_FORM = {
  title: "", description: "", image: "", techStack: "",
  liveUrl: "", githubUrl: "", caseStudyUrl: "", featured: false, order: 0,
};

const ProjectForm = ({ initial = EMPTY_FORM, onSave, onCancel, loading }) => {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initial, techStack: Array.isArray(initial.techStack) ? initial.techStack.join(", ") : initial.techStack || "" });
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Required";
    if (!form.description.trim()) e.description = "Required";
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({
      ...form,
      techStack: form.techStack.split(",").map((t) => t.trim()).filter(Boolean),
      order: Number(form.order) || 0,
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Title *" error={errors.title}>
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="ShopSphere — E-Commerce Platform" />
        </Field>
        <Field label="Order (display position)">
          <Input type="number" value={form.order} onChange={(e) => set("order", e.target.value)} />
        </Field>
      </div>

      <Field label="Description *" error={errors.description}>
        <Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="What the project does and what makes it interesting..." />
      </Field>

      <Field label="Image URL">
        <Input value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="/images/project1.jpg  or  https://..." />
      </Field>

      <Field label="Tech Stack (comma separated)">
        <Input value={form.techStack} onChange={(e) => set("techStack", e.target.value)} placeholder="React, Node.js, MongoDB, Express.js" />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        <Field label="Live URL">
          <Input value={form.liveUrl} onChange={(e) => set("liveUrl", e.target.value)} placeholder="https://..." />
        </Field>
        <Field label="GitHub URL">
          <Input value={form.githubUrl} onChange={(e) => set("githubUrl", e.target.value)} placeholder="https://github.com/..." />
        </Field>
        <Field label="Case Study URL">
          <Input value={form.caseStudyUrl} onChange={(e) => set("caseStudyUrl", e.target.value)} placeholder="https://..." />
        </Field>
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13, color: "#a3a3a8" }}>
        <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)}
          style={{ width: 16, height: 16, accentColor: "#e63946" }} />
        Mark as Featured Project
      </label>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn onClick={submit} loading={loading}>Save Project</Btn>
      </div>
    </div>
  );
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null); // null | "add" | project object (edit)
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    adminAPI.getProjects()
      .then((d) => setProjects(d.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    setSaving(true); setError("");
    try {
      if (modal === "add") {
        const d = await adminAPI.createProject(form);
        setProjects((prev) => [...prev, d.data]);
      } else {
        const d = await adminAPI.updateProject(modal._id, form);
        setProjects((prev) => prev.map((p) => p._id === modal._id ? d.data : p));
      }
      setModal(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminAPI.deleteProject(confirm._id);
      setProjects((prev) => prev.filter((p) => p._id !== confirm._id));
      setConfirm(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}><Spinner size={28} /></div>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Projects</h2>
          <p style={{ color: "#6b6b70", fontSize: 13, marginTop: 4 }}>{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
        </div>
        <Btn onClick={() => setModal("add")}>+ Add Project</Btn>
      </div>

      {error && <Alert type="error" style={{ marginBottom: 16 }}>{error}</Alert>}

      {projects.length === 0 ? (
        <Empty icon="🗂️" message="No projects yet. Add your first one!" />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {projects.sort((a, b) => a.order - b.order).map((p) => (
            <Card key={p._id} style={{ padding: "1.1rem 1.25rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                {/* Gradient thumbnail */}
                <div style={{
                  width: 56, height: 56, borderRadius: 10, flexShrink: 0,
                  background: "linear-gradient(135deg, rgba(230,57,70,0.3), rgba(163,31,41,0.3))",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                }}>
                  🗂️
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: "#f5f5f5" }}>{p.title}</span>
                    {p.featured && <Badge variant="primary">Featured</Badge>}
                    <Badge variant="muted">#{p.order}</Badge>
                  </div>
                  <p style={{ color: "#a3a3a8", fontSize: 13, lineHeight: 1.5, marginBottom: 8, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {p.description}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {p.techStack?.map((t) => <Badge key={t} variant="muted">{t}</Badge>)}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  {p.githubUrl && (
                    <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 12, color: "#6b6b70", textDecoration: "none" }} title="GitHub">↗</a>
                  )}
                  <Btn variant="outline" style={{ padding: "0.4rem 0.8rem", fontSize: 12 }} onClick={() => setModal(p)}>Edit</Btn>
                  <Btn variant="danger" style={{ padding: "0.4rem 0.8rem", fontSize: 12 }} onClick={() => setConfirm(p)}>Delete</Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal === "add" ? "Add Project" : "Edit Project"}
        width={680}
      >
        <ProjectForm
          initial={modal !== "add" ? modal : EMPTY_FORM}
          onSave={handleSave}
          onCancel={() => setModal(null)}
          loading={saving}
        />
      </Modal>

      {/* Confirm Delete */}
      <Confirm
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Delete "${confirm?.title}"? This cannot be undone.`}
      />
    </div>
  );
};

export default ProjectsPage;
