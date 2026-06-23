import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink, GitFork, BookOpen } from "lucide-react";
import { projects } from "../data/projects";
import "./Projects.css";

const TECH_COLORS = {
  "React": "#61dafb",
  "Node.js": "#6cc24a",
  "Express.js": "#888",
  "MongoDB": "#4db33d",
  "JWT": "#e63946",
  "REST APIs": "#ff8087",
  "Mongoose": "#a31f29",
};

/* Gradient fallbacks for project images */
const PROJECT_GRADIENTS = [
  "linear-gradient(135deg, #1a0a0b 0%, #3d0e13 50%, #1a0a0b 100%)",
  "linear-gradient(135deg, #0a0a1a 0%, #0e133d 50%, #0a0a1a 100%)",
  "linear-gradient(135deg, #0a1a0a 0%, #0e3d0e 50%, #0a1a0a 100%)",
];

const TiltCard = ({ project, index }) => {
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: "-80px" });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className="project-card-wrap"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: hovered ? "transform 0.08s ease" : "transform 0.5s ease",
      }}
    >
      <div className={`project-card glass ${project.featured ? "project-card--featured" : ""}`}>
        {/* Image / Gradient */}
        <div
          className="project-card__image"
          style={{ background: PROJECT_GRADIENTS[index % PROJECT_GRADIENTS.length] }}
        >
          <div className="project-card__image-overlay" />
          {project.featured && (
            <span className="project-card__badge">Featured</span>
          )}
          {/* Dynamic light follow */}
          <div
            className="project-card__light"
            style={{
              background: `radial-gradient(circle at ${50 + tilt.x * 3}% ${50 - tilt.y * 3}%, rgba(230,57,70,0.25) 0%, transparent 60%)`,
            }}
          />
          <div className="project-card__label">
            <span>{project.title.split("—")[0].split(" — ")[0]}</span>
          </div>
        </div>

        {/* Content */}
        <div className="project-card__body">
          <h3 className="project-card__title">{project.title}</h3>
          <p className="project-card__desc">{project.description}</p>

          <div className="project-card__stack">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="project-card__tech"
                style={{ color: TECH_COLORS[tech] || "var(--text-secondary)" }}
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="project-card__actions">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline project-card__btn"
              >
                <GitFork size={14} />
                GitHub
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary project-card__btn"
              >
                <ExternalLink size={14} />
                Live Demo
              </a>
            )}
            {project.caseStudyUrl && (
              <a
                href={project.caseStudyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost project-card__btn"
              >
                <BookOpen size={14} />
                Case Study
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [projectList, setProjectList] = useState(projects);

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    fetch(`${apiBase}/projects`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          // Sort by order
          const sorted = [...data.data].sort((a, b) => (a.order || 0) - (b.order || 0));
          setProjectList(sorted);
        }
      })
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  return (
    <section className="section projects" id="projects" ref={ref}>
      <div className="projects__bg" aria-hidden="true" />
      <div className="container">
        <motion.span
          className="section-eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Projects
        </motion.span>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          Things I've built
        </motion.h2>
        <motion.p
          className="projects__subtitle"
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.18 }}
        >
          Production-grade MERN applications — hover to interact.
        </motion.p>

        <div className="projects__grid">
          {projectList.map((project, i) => (
            <TiltCard key={project._id || i} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
