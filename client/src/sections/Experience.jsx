import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { MapPin, Calendar, CheckCircle2 } from "lucide-react";
import { experience } from "../data/experience";
import "./Experience.css";

const formatDate = (dateStr) => {
  if (!dateStr) return "Present";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const ExperienceCard = ({ item, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className="exp-item"
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Connector dot */}
      <motion.div
        className="exp-item__dot"
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.2, type: "spring", stiffness: 300 }}
      />

      <div className="exp-item__card glass">
        <div className="exp-item__header">
          <div>
            <h3 className="exp-item__role">{item.role}</h3>
            <p className="exp-item__company">{item.company}</p>
          </div>
          <div className="exp-item__meta">
            <span className="exp-item__date">
              <Calendar size={12} />
              {formatDate(item.startDate)} — {formatDate(item.endDate)}
            </span>
            {item.location && item.location !== "—" && (
              <span className="exp-item__location">
                <MapPin size={12} />
                {item.location}
              </span>
            )}
          </div>
        </div>

        <p className="exp-item__desc">{item.description}</p>

        {item.achievements?.length > 0 && (
          <ul className="exp-item__achievements">
            {item.achievements.map((ach, i) => (
              <motion.li
                key={i}
                className="exp-item__achievement"
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
              >
                <CheckCircle2 size={14} className="exp-item__check" />
                {ach}
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

/* Animated vertical progress line */
const TimelineLine = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className="exp-timeline__track" aria-hidden="true">
      <motion.div className="exp-timeline__progress" style={{ scaleY, originY: 0 }} />
    </div>
  );
};

const Experience = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [expList, setExpList] = useState(experience);

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    fetch(`${apiBase}/experience`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          const sorted = [...data.data].sort((a, b) => (a.order || 0) - (b.order || 0));
          setExpList(sorted);
        }
      })
      .catch((err) => console.error("Error fetching experience:", err));
  }, []);

  return (
    <section className="section experience" id="experience" ref={ref}>
      <div className="container">
        <motion.span
          className="section-eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Experience
        </motion.span>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          The journey
        </motion.h2>

        <div className="exp-timeline">
          <TimelineLine />
          <div className="exp-timeline__items">
            {expList.map((item, i) => (
              <ExperienceCard key={item._id || i} item={item} index={i} />
            ))}
          </div>
        </div>

        {/* Publications & Certifications */}
        <div className="exp-extras">
          <motion.div
            className="exp-extra glass"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="exp-extra__title">📄 Publications</h3>
            <p className="exp-extra__text">
              Delivered a research paper titled <em>"Will AI Replace Human Jobs?"</em> at the{" "}
              <strong>PCTE ICMR–IET 2025 International Conference</strong> on AI and employment trends.
            </p>
          </motion.div>

          <motion.div
            className="exp-extra glass"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="exp-extra__title">🏆 Achievements</h3>
            <ul className="exp-extra__list">
              <li>Three-time winner of <strong>JAM (Just A Minute)</strong> literary event</li>
              <li>Winner of <strong>British Parliamentary Debate</strong> competition</li>
              <li>Anchored 3–4 professional events including Athena</li>
            </ul>
          </motion.div>

          <motion.div
            className="exp-extra glass"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="exp-extra__title">🎓 Certifications</h3>
            <ul className="exp-extra__list">
              <li><strong>Google Developer Student Club Member</strong> — 2024–Present</li>
              <li><strong>Backend Development</strong> certification — Udemy</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
