"use client"

import { motion } from "framer-motion"

const Background = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#150d2a_0%,_#0B0B0F_50%,_#080510_100%)]" />

      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px]"
        style={{ background: "rgba(108, 60, 224, 0.08)" }}
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -30, 40, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[130px]"
        style={{ background: "rgba(139, 115, 64, 0.06)" }}
        animate={{
          x: [0, -35, 20, 0],
          y: [0, 20, -35, 0],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-2/3 left-1/2 w-[300px] h-[300px] rounded-full blur-[100px]"
        style={{ background: "rgba(167, 139, 250, 0.05)" }}
        animate={{
          x: [0, 25, -15, 0],
          y: [0, -15, 25, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_30%,_rgba(5,3,8,0.85)_100%)]" />
    </div>
  )
}

export default Background
