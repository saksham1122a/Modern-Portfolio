import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, LogOut, UserCircle } from "lucide-react";
import { useScrollPosition } from "../hooks/useScrollPosition";
import { useActiveSection } from "../hooks/useActiveSection";
import { useUserAuth } from "../hooks/useUserAuth";
import AuthModal from "./AuthModal";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Experience", id: "experience" },
  { label: "Contact", id: "contact" },
];

const SECTION_IDS = NAV_LINKS.map((l) => l.id);

const MagneticLink = ({ id, label, isActive, onClick }) => {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    setOffset({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => setOffset({ x: 0, y: 0 });

  return (
    <motion.a
      ref={ref}
      href={`#${id}`}
      className={`nav-link ${isActive ? "nav-link--active" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      onClick={(e) => {
        e.preventDefault();
        onClick(id);
      }}
    >
      {label}
      {isActive && (
        <motion.span
          className="nav-link__underline"
          layoutId="nav-underline"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
    </motion.a>
  );
};

const Navbar = () => {
  const scrolled = useScrollPosition(40);
  const activeId = useActiveSection(SECTION_IDS);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null); // null | "login" | "register"
  const [userMenu, setUserMenu] = useState(false);
  const { user, logout } = useUserAuth();

  const scrollToSection = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 90, behavior: "smooth" });
  };

  const getInitials = (name) =>
    name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?";

  return (
    <>
      <motion.header
        className={`navbar ${scrolled ? "navbar--shrunk" : ""}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="navbar__inner glass">
          <a href="#home" className="navbar__brand"
            onClick={(e) => { e.preventDefault(); scrollToSection("home"); }}>
            <img src="/images/profile.jpg" alt="Saksham Nanda" className="navbar__avatar" />
            <span className="navbar__name">Saksham</span>
          </a>

          <nav className="navbar__links" aria-label="Primary navigation">
            {NAV_LINKS.map((link) => (
              <MagneticLink key={link.id} id={link.id} label={link.label}
                isActive={activeId === link.id} onClick={scrollToSection} />
            ))}
          </nav>

          {/* Auth area */}
          <div className="navbar__auth">
            {user ? (
              <div className="navbar__user" onClick={() => setUserMenu((v) => !v)}>
                <div className="navbar__user-avatar">
                  {getInitials(user.name)}
                </div>
                <AnimatePresence>
                  {userMenu && (
                    <motion.div
                      className="navbar__user-menu glass"
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="navbar__user-info">
                        <span className="navbar__user-name">{user.name}</span>
                        <span className="navbar__user-email">{user.email}</span>
                      </div>
                      <button className="navbar__user-logout" onClick={() => { logout(); setUserMenu(false); }}>
                        <LogOut size={14} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button className="navbar__login-btn" onClick={() => setAuthModal("login")}>
                <LogIn size={14} />
                <span>Login</span>
              </button>
            )}
          </div>

          <button className="navbar__toggle"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="mobile-menu glass"
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            {NAV_LINKS.map((link, i) => (
              <motion.a key={link.id} href={`#${link.id}`}
                className={`mobile-menu__link ${activeId === link.id ? "mobile-menu__link--active" : ""}`}
                onClick={(e) => { e.preventDefault(); scrollToSection(link.id); }}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}>
                {link.label}
              </motion.a>
            ))}
            {!user ? (
              <button className="mobile-menu__login"
                onClick={() => { setMenuOpen(false); setAuthModal("login"); }}>
                <LogIn size={14} /> Login / Sign Up
              </button>
            ) : (
              <button className="mobile-menu__login mobile-menu__login--logout"
                onClick={() => { logout(); setMenuOpen(false); }}>
                <LogOut size={14} /> Sign Out ({user.name})
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal
        open={!!authModal}
        defaultTab={authModal || "login"}
        onClose={() => setAuthModal(null)}
      />
    </>
  );
};

export default Navbar;
