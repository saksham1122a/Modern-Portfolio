import { GithubIcon, LinkedinIcon } from "./icons/BrandIcons";
import "./Footer.css";

const FOOTER_LINKS = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
];

const SOCIALS = [
  { icon: GithubIcon, href: "https://github.com/saksham1122a", label: "GitHub" },
  { icon: LinkedinIcon, href: "https://www.linkedin.com/in/sakshamnanda01", label: "LinkedIn" },
];

const Footer = () => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 90, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">Saksham Nanda</span>
          <p className="footer__tagline">Full Stack MERN Developer · Ludhiana, Punjab</p>
        </div>

        <nav className="footer__links" aria-label="Footer navigation">
          {FOOTER_LINKS.map((link) => (
            <a key={link.id} href={`#${link.id}`}
              onClick={(e) => { e.preventDefault(); scrollTo(link.id); }}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="footer__socials">
          {SOCIALS.map(({ icon: Icon, href, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>

      <div className="container footer__bottom">
        <p>
          © {new Date().getFullYear()} Saksham Nanda · Modern Portfolio
        </p>
      </div>
    </footer>
  );
};

export default Footer;
