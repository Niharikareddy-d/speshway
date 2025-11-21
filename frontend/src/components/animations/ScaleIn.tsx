import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const ScaleIn = ({ children, delay = 0, duration = 0.5, className }: ScaleInProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay, type: "spring", stiffness: 200 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

