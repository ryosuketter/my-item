"use client";

import { motion } from "framer-motion";

export function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative w-96 h-12 overflow-hidden">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: 300 }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="text-4xl absolute"
        >
          👍
        </motion.div>
      </div>
    </div>
  );
}
