import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import MessagesPage from "./pages/MessagesPage";
import ProjectsPage from "./pages/ProjectsPage";
import SkillsPage from "./pages/SkillsPage";
import ExperiencePage from "./pages/ExperiencePage";
import UsersPage from "./pages/UsersPage";
import { adminAPI } from "./api";
import { Spinner } from "./components/UI";

/* Global admin styles injected once */
const injectStyles = () => {
  if (document.getElementById("admin-global-styles")) return;
  const style = document.createElement("style");
  style.id = "admin-global-styles";
  style.textContent = `
    @keyframes spin { to { transform: rotate(360deg); } }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
  `;
  document.head.appendChild(style);
};

const PAGE_COMPONENTS = {
  dashboard: Dashboard,
  messages: MessagesPage,
  users: UsersPage,
  projects: ProjectsPage,
  skills: SkillsPage,
  experience: ExperiencePage,
};

const AdminShell = () => {
  const { admin, loading } = useAuth();
  const [page, setPage] = useState("dashboard");
  const [unread, setUnread] = useState(0);

  useEffect(() => { injectStyles(); }, []);

  // Poll unread count every 30s while logged in
  useEffect(() => {
    if (!admin) return;
    const fetchUnread = () =>
      adminAPI.stats()
        .then((d) => setUnread(d.data.unreadMessages))
        .catch(() => {});
    fetchUnread();
    const id = setInterval(fetchUnread, 30000);
    return () => clearInterval(id);
  }, [admin]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0c" }}>
        <Spinner size={32} />
      </div>
    );
  }

  if (!admin) return <LoginPage />;

  const PageComponent = PAGE_COMPONENTS[page] || Dashboard;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0d0d10", color: "#f5f5f5" }}>
      <Sidebar page={page} setPage={setPage} unread={unread} />

      <main style={{ flex: 1, padding: "2rem 2.5rem", overflowY: "auto", minWidth: 0 }}>
        <PageComponent setPage={setPage} />
      </main>
    </div>
  );
};

const AdminApp = () => (
  <AuthProvider>
    <AdminShell />
  </AuthProvider>
);

export default AdminApp;
