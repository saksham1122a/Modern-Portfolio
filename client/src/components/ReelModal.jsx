import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import "./ReelModal.css";

const ReelModal = ({ isOpen, onClose, videoSrc }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="reel-modal__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onClose}
        >
          <motion.div
            className="reel-modal__content"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="reel-modal__close" onClick={onClose} aria-label="Close video">
              <X size={20} />
            </button>
            {videoSrc ? (
              <video
                className="reel-modal__video"
                src={videoSrc}
                controls
                autoPlay
                playsInline
              />
            ) : (
              <div className="reel-modal__placeholder">
                <p>Drop your intro reel video file at <code>/public/videos/reel.mp4</code></p>
                <p className="reel-modal__placeholder-sub">
                  and pass its path into the Hero component's <code>videoSrc</code> prop.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReelModal;
