import { motion } from "framer-motion";

export function Preloader({ onComplete }) {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: "-100%" }}
      transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 1.8 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-50 flex items-center justify-center bg-night text-paper"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center gap-4"
      >
        <img
          src="/logo-dark.png"
          alt="Gianni Gabutti Logo"
          className="h-16 w-auto sm:h-20 animate-pulse"
        />
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#8a8a82]">
          Gianni Gabutti — Loading
        </span>
      </motion.div>
    </motion.div>
  );
}
