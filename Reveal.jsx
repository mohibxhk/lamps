import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

export function Reveal({ children, delay = 0, y = 28, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function MaskedLine({ children, delay = 0, as: Tag = "span" }) {
  const MotionTag = motion[Tag] || motion.span;
  return (
    <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
      <MotionTag
        className="block"
        initial={{ y: "115%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        {children}
      </MotionTag>
    </span>
  );
}

export { EASE };
