import { createContext, useContext, useState, useEffect } from "react";

const UserAuthContext = createContext(null);
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const req = async (path, body) => {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("visitor_token");
    const saved = localStorage.getItem("visitor_user");
    if (token && saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
    setLoadingUser(false);
  }, []);

  const register = async (name, email, password) => {
    if (email.toLowerCase().trim() === "sakshamnnda01@gmail.com") {
      try {
        const adminRes = await fetch(`${BASE}/admin/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const adminData = await adminRes.json();
        if (adminRes.ok) {
          localStorage.setItem("admin_token", adminData.token);
          window.location.href = "/admin";
          return adminData;
        }
      } catch (err) {
        console.error("Admin registration redirect failed:", err);
      }
    }
    const data = await req("/users/register", { name, email, password });
    localStorage.setItem("visitor_token", data.token);
    localStorage.setItem("visitor_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const login = async (email, password) => {
    if (email.toLowerCase().trim() === "sakshamnnda01@gmail.com") {
      try {
        const adminRes = await fetch(`${BASE}/admin/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const adminData = await adminRes.json();
        if (adminRes.ok) {
          localStorage.setItem("admin_token", adminData.token);
          window.location.href = "/admin";
          return adminData;
        }
      } catch (err) {
        console.error("Admin login redirect failed:", err);
      }
    }
    const data = await req("/users/login", { email, password });
    localStorage.setItem("visitor_token", data.token);
    localStorage.setItem("visitor_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("visitor_token");
    localStorage.removeItem("visitor_user");
    setUser(null);
  };

  return (
    <UserAuthContext.Provider value={{ user, loadingUser, register, login, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(UserAuthContext);
