"use client";

import { motion } from "framer-motion";

export function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-center gap-6">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            initial={{ scale: 1 }}
            animate={{
              scale: [1, 2, 1],
            }}
            transition={{
              duration: 2.0,
              repeat: Number.POSITIVE_INFINITY,
              delay: index * 0.4,
              ease: "easeInOut",
            }}
            className="text-xl"
          >
            👍
          </motion.div>
        ))}
      </div>
    </div>
  );
}
