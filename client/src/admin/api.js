const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const token = () => localStorage.getItem("admin_token");

const req = async (path, options = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const adminAPI = {
  // Auth
  login: (body) => req("/admin/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => req("/admin/me"),
  stats: () => req("/admin/stats"),

  // Messages
  getMessages: () => req("/contact"),
  markRead: (id, read) => req(`/contact/${id}/read`, { method: "PATCH", body: JSON.stringify({ read }) }),
  deleteMessage: (id) => req(`/contact/${id}`, { method: "DELETE" }),

  // Projects
  getProjects: () => req("/projects"),
  createProject: (body) => req("/projects", { method: "POST", body: JSON.stringify(body) }),
  updateProject: (id, body) => req(`/projects/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteProject: (id) => req(`/projects/${id}`, { method: "DELETE" }),

  // Skills
  getSkills: () => req("/skills"),
  createSkill: (body) => req("/skills", { method: "POST", body: JSON.stringify(body) }),
  updateSkill: (id, body) => req(`/skills/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteSkill: (id) => req(`/skills/${id}`, { method: "DELETE" }),

  // Experience
  getExperience: () => req("/experience"),
  createExperience: (body) => req("/experience", { method: "POST", body: JSON.stringify(body) }),
  updateExperience: (id, body) => req(`/experience/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteExperience: (id) => req(`/experience/${id}`, { method: "DELETE" }),
};

// Users (visitors)
export const usersAPI = {
  list: () => adminReq("/users"),
  delete: (id) => adminReq(`/users/${id}`, { method: "DELETE" }),
};

function adminReq(path, options = {}) {
  const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const tok = () => localStorage.getItem("admin_token");
  return fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(tok() ? { Authorization: `Bearer ${tok()}` } : {}) },
    ...options,
  }).then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.message || "Error"); return d; });
}
