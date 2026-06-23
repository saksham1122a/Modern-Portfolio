import { motion } from "framer-motion";

/**
 * Reveals text word-by-word with a staggered fade/slide-up animation.
 * More elegant and performant than a literal character-typing effect.
 */
const RevealText = ({ text, el: Element = "span", delay = 0, staggerChild = 0.06, className = "" }) => {
  const words = text.split(" ");

  return (
    <Element className={className}>
      <span style={{ display: "inline" }}>
        {words.map((word, i) => (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}>
            <motion.span
              style={{ display: "inline-block" }}
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: delay + i * staggerChild,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
              {i !== words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        ))}
      </span>
    </Element>
  );
};

export default RevealText;
