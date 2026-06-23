import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { skills } from "../data/skills";
import "./Skills.css";

const CATEGORY_LABELS = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  language: "Languages",
  tools: "Tools",
};

const CATEGORY_COLORS = {
  frontend: "#e63946",
  backend: "#ff5a64",
  database: "#a31f29",
  language: "#ff8087",
  tools: "#c4323e",
};

const SkillCard = ({ skill, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="skill-card glass"
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.55, delay: (index % 4) * 0.07, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, borderColor: "var(--glass-border-accent)" }}
    >
      <div className="skill-card__header">
        <span className="skill-card__name">{skill.name}</span>
        <span
          className="skill-card__category"
          style={{ color: CATEGORY_COLORS[skill.category] }}
        >
          {CATEGORY_LABELS[skill.category]}
        </span>
      </div>

      <div className="skill-card__bar-track">
        <motion.div
          className="skill-card__bar-fill"
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.proficiency}%` } : {}}
          transition={{ duration: 1.1, delay: (index % 4) * 0.07 + 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: `linear-gradient(90deg, var(--color-primary-dim), ${CATEGORY_COLORS[skill.category]})` }}
        />
        <motion.div
          className="skill-card__bar-glow"
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.proficiency}%` } : {}}
          transition={{ duration: 1.1, delay: (index % 4) * 0.07 + 0.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <div className="skill-card__footer">
        <span className="skill-card__exp">{skill.yearsExperience}yr{skill.yearsExperience !== 1 ? "s" : ""}</span>
        <span className="skill-card__pct">{skill.proficiency}%</span>
      </div>
    </motion.div>
  );
};

/* Glowing roadmap path drawn with SVG + scroll-driven stroke-dashoffset */
const RoadmapPath = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const pathLen = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  return (
    <div ref={ref} className="roadmap-path" aria-hidden="true">
      <svg viewBox="0 0 1200 80" preserveAspectRatio="none" fill="none">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Track */}
        <path d="M0 40 Q300 10 600 40 Q900 70 1200 40" stroke="rgba(230,57,70,0.15)" strokeWidth="3" />
        {/* Glowing progress */}
        <motion.path
          d="M0 40 Q300 10 600 40 Q900 70 1200 40"
          stroke="#e63946"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#glow)"
          style={{ pathLength: pathLen }}
        />
      </svg>
    </div>
  );
};

const Skills = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [skillList, setSkillList] = useState(skills);

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    fetch(`${apiBase}/skills`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setSkillList(data.data);
        }
      })
      .catch((err) => console.error("Error fetching skills:", err));
  }, []);

  const grouped = skillList.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  // Sort each category by order
  Object.keys(grouped).forEach((cat) => {
    grouped[cat].sort((a, b) => (a.order || 0) - (b.order || 0));
  });

  return (
    <section className="section skills" id="skills" ref={ref}>
      <div className="skills__bg-glow" aria-hidden="true" />
      <div className="container">
        <motion.span
          className="section-eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Skills
        </motion.span>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          My developer roadmap
        </motion.h2>
        <motion.p
          className="skills__subtitle"
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.18 }}
        >
          Technologies I've worked with — organised by category, with proficiency built from real projects.
        </motion.p>
      </div>

      <RoadmapPath />

      <div className="container">
        {Object.entries(grouped).map(([category, catSkills], gi) => (
          <div key={category} className="skills__group">
            <motion.h3
              className="skills__group-title"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: gi * 0.05 }}
            >
              <span
                className="skills__group-dot"
                style={{ background: CATEGORY_COLORS[category] }}
              />
              {CATEGORY_LABELS[category]}
            </motion.h3>
            <div className="skills__grid">
              {catSkills.map((skill, i) => (
                <SkillCard key={skill.name || i} skill={skill} index={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
