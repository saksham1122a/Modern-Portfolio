import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { achievements } from "../data/experience";
import "./About.css";


const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

const Counter = ({ value, suffix, label }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className="about-stat glass"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="about-stat__value">
        {inView ? value : "0"}
        <span className="about-stat__suffix">{suffix}</span>
      </span>
      <span className="about-stat__label">{label}</span>
    </motion.div>
  );
};

const timelineItems = [
  { year: "2022", title: "The Spark", desc: "Wrote my first line of HTML. Got hooked immediately — realized I could build anything I imagined." },
  { year: "2023", title: "Going Deep", desc: "Started BCA at PCTE. Dove into JavaScript, then React — built my first full-stack app using MERN in semester one." },
  { year: "2024", title: "Levelling Up", desc: "Joined Google Developer Student Club. Built ResolveX and TeamBuddy. Explored JWT auth, role-based access, and scalable APIs." },
  { year: "2025", title: "Going Pro", desc: "Interned at Sensation Software Solutions — shipped real production APIs. Presented a research paper at an international AI conference." },
];

const About = () => {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section className="section about" id="about" ref={sectionRef}>
      <div className="container">
        <motion.span className="section-eyebrow" variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}>
          About Me
        </motion.span>
        <motion.h2 className="section-title" variants={fadeUp} custom={1} initial="hidden" animate={inView ? "visible" : "hidden"}>
          The story so far
        </motion.h2>

        <div className="about__grid">
          {/* Left: narrative */}
          <motion.div className="about__text" variants={fadeUp} custom={2} initial="hidden" animate={inView ? "visible" : "hidden"}>
            <p>
              I'm <strong>Saksham Nanda</strong>, a Full Stack MERN Developer and BCA student
              at PCTE Group of Engineering & Technology, Ludhiana — currently holding a
              <strong> 9.35 CGPA</strong>.
            </p>
            <p>
              I build scalable web applications from the ground up: MongoDB schemas,
              Express APIs, React interfaces. I care about code that's clean, systems
              that scale, and products that actually solve problems.
            </p>
            <p>
              Beyond the terminal, I've anchored professional events, won British
              Parliamentary Debates, and taken JAM competitions — because communication
              is just another kind of engineering.
            </p>

            <div className="about__badges">
              {["MERN Stack", "REST APIs", "JWT Auth", "MVC Architecture", "Responsive UI", "Git Flow"].map((b) => (
                <span key={b} className="about__badge">{b}</span>
              ))}
            </div>
          </motion.div>

          {/* Right: stats */}
          <div className="about__stats">
            {achievements.map((a) => (
              <Counter key={a.label} {...a} />
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="about__timeline">
          {timelineItems.map((item, i) => (
            <TimelineItem key={item.year} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const TimelineItem = ({ item, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="timeline-item"
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="timeline-item__dot" />
      <div className="timeline-item__card glass">
        <span className="timeline-item__year">{item.year}</span>
        <h3 className="timeline-item__title">{item.title}</h3>
        <p className="timeline-item__desc">{item.desc}</p>
      </div>
    </motion.div>
  );
};

export default About;
