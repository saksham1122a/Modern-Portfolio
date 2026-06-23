import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, ArrowDown, Download } from "lucide-react";
import RevealText from "../components/RevealText";
import ReelModal from "../components/ReelModal";
import "./Hero.css";

const Hero = () => {
  const [reelOpen, setReelOpen] = useState(false);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax: image drifts up slower than scroll, glow drifts further
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const scrollToProjects = () => {
    const el = document.getElementById("projects");
    if (el) window.scrollTo({ top: el.offsetTop - 90, behavior: "smooth" });
  };

  return (
    <section className="hero" id="home" ref={sectionRef}>
      <motion.div className="hero__glow" style={{ y: glowY }} aria-hidden="true" />

      <div className="container hero__container">
        <motion.div className="hero__content" style={{ opacity: contentOpacity }}>
          <motion.div
            className="hero__badge"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="hero__badge-dot" />
            Available for freelance &amp; full-time roles
          </motion.div>

          <h1 className="hero__heading">
            <RevealText text="Hi, I'm" delay={0.3} />
            <br />
            <RevealText text="Saksham Nanda" delay={0.5} className="hero__heading-accent" />
          </h1>

          <motion.p
            className="hero__subheading"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            Full Stack MERN Developer
          </motion.p>

          <motion.p
            className="hero__description"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            I build scalable web applications, modern digital experiences, and
            high-performance solutions using MongoDB, Express.js, React.js, and
            Node.js.
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <button className="btn btn-primary" onClick={() => setReelOpen(true)}>
              <Play size={16} fill="currentColor" />
              Play Reel
            </button>
            <button className="btn btn-outline" onClick={scrollToProjects}>
              View Projects
            </button>
            <a className="btn btn-ghost" href="/resume.docx" download="Saksham_Nanda_Resume.docx">
              <Download size={16} />
              Resume
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero__image-wrap"
          style={{ y: imageY }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero__image-frame">
            <img src="/images/profile.jpg" alt="Saksham Nanda" className="hero__image" />
          </div>
          <button
            className="hero__play-overlay"
            onClick={() => setReelOpen(true)}
            aria-label="Play introduction reel"
          >
            <span className="hero__play-icon">
              <Play size={22} fill="currentColor" />
            </span>
            <span className="hero__play-label">Watch intro</span>
          </button>
        </motion.div>
      </div>

      <motion.button
        className="hero__scroll-cue"
        onClick={scrollToProjects}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        aria-label="Scroll down"
      >
        <span>Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={16} />
        </motion.span>
      </motion.button>

      <ReelModal isOpen={reelOpen} onClose={() => setReelOpen(false)} videoSrc="/videos/reel.mp4" />
    </section>
  );
};

export default Hero;
