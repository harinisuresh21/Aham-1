import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Global Page Load & Refresh Fog Reveal Effect
 * 
 * Creates an atmospheric, organic mist & fog veil that smoothly dissolves (opacity 1 -> 0)
 * upon page mount, load, or refresh, effortlessly revealing the wellness content beneath.
 */
const FogReveal = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="fog-reveal-overlay"
        aria-hidden="true"
        className="fixed inset-0 z-[100] pointer-events-none overflow-hidden select-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 1.5,
          ease: [0.25, 1, 0.4, 1], // Smooth organic 1.5s mist dissipation
        }}
        onAnimationComplete={() => setIsVisible(false)}
      >
        {/* 1. Primary Full-Viewport Translucent Mist Veil */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FDFAF5]/98 via-[#F6EFE2]/92 to-[#FDFAF5]/98 backdrop-blur-[5px]" />

        {/* 2. Billowing Left Organic Fog Cloud */}
        <motion.div
          initial={{ x: '-5%', opacity: 0.9, scale: 1 }}
          animate={{ x: '-18%', opacity: 0, scale: 1.18 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute -top-1/4 -left-1/4 w-[900px] h-[800px] rounded-[45%] bg-gradient-to-tr from-[#FAF5EC] via-[#EDE4D3]/70 to-transparent blur-[60px]"
        />

        {/* 3. Billowing Right Organic Fog Cloud */}
        <motion.div
          initial={{ x: '5%', opacity: 0.9, scale: 1 }}
          animate={{ x: '18%', opacity: 0, scale: 1.22 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute -bottom-1/4 -right-1/4 w-[950px] h-[850px] rounded-[40%] bg-gradient-to-bl from-[#FDFAF5] via-[#EFE6D5]/70 to-transparent blur-[70px]"
        />

        {/* 4. Warm Golden Herbal Glow in center */}
        <motion.div
          initial={{ opacity: 0.55, scale: 0.9 }}
          animate={{ opacity: 0, scale: 1.3 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full bg-gradient-to-r from-[#E5A93B]/15 via-[#C2A573]/12 to-transparent blur-3xl"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default FogReveal;
