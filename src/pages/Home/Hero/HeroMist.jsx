import React from 'react';
import { motion } from 'framer-motion';

/**
 * Atmospheric Fog & Organic Mist Layer
 * - 0s to 2s: Rich, rolling atmospheric fog holds the scene in a calm, misty state.
 * - ~2s mark: Fog smoothly rolls outward, clears completely, and reveals the clean scene.
 */
const HeroMist = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden z-20 select-none"
    >
      {/* 1. Primary Full-Screen Rolling Fog Veil (Clears completely around 2.0s) */}
      <motion.div
        initial={{ opacity: 0.95, filter: 'blur(30px)' }}
        animate={{
          opacity: [0.95, 0.92, 0.88, 0],
          filter: ['blur(30px)', 'blur(35px)', 'blur(45px)', 'blur(60px)'],
          scale: [1, 1.02, 1.05, 1.15],
        }}
        transition={{
          times: [0, 0.45, 0.75, 1],
          duration: 2.3,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="absolute inset-0 bg-gradient-to-b from-[#FDFAF5]/95 via-[#F4EEDF]/90 to-[#FDFAF5]/85 pointer-events-none"
      />

      {/* 2. Billowing Organic Mist Cloud 1 (Left-Center, dissipates at 2.1s) */}
      <motion.div
        initial={{ x: '-10%', y: '-5%', opacity: 0.85, scale: 0.95 }}
        animate={{
          x: ['-10%', '0%', '15%'],
          y: ['-5%', '5%', '-10%'],
          opacity: [0.85, 0.75, 0],
          scale: [0.95, 1.08, 1.3],
        }}
        transition={{
          times: [0, 0.7, 1],
          duration: 2.4,
          ease: 'easeInOut',
        }}
        className="absolute -top-1/4 -left-1/4 w-[900px] h-[750px] bg-gradient-to-tr from-[#FDFAF5] via-[#E8E2D2]/70 to-transparent rounded-[45%] blur-[50px] pointer-events-none"
      />

      {/* 3. Billowing Organic Mist Cloud 2 (Right Product Area, clears at 2.2s) */}
      <motion.div
        initial={{ x: '15%', y: '10%', opacity: 0.9, scale: 1 }}
        animate={{
          x: ['15%', '5%', '-10%'],
          y: ['10%', '-5%', '-20%'],
          opacity: [0.9, 0.8, 0],
          scale: [1, 1.1, 1.35],
        }}
        transition={{
          times: [0, 0.65, 1],
          duration: 2.2,
          ease: 'easeInOut',
        }}
        className="absolute -top-20 -right-20 w-[950px] h-[800px] bg-gradient-to-bl from-[#FDFAF5] via-[#EFE7D5]/70 to-transparent rounded-[40%] blur-[55px] pointer-events-none"
      />

      {/* 4. Swirling Forest Green & Warm Cream Undercurrent (Persistent ambient atmosphere) */}
      <motion.div
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 3.0, ease: 'easeOut' }}
        className="absolute -top-32 right-10 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-[#243D2B]/20 via-[#71835B]/15 to-transparent blur-3xl pointer-events-none"
      />

      {/* 5. Golden Botanical Pollen Particles (Float and clear out) */}
      {[
        { top: '24%', left: '46%', size: 4, delay: 0.2 },
        { top: '36%', left: '60%', size: 5, delay: 0.5 },
        { top: '52%', left: '50%', size: 3.5, delay: 0.3 },
        { top: '28%', left: '76%', size: 4.5, delay: 0.7 },
        { top: '62%', left: '70%', size: 3, delay: 0.4 },
      ].map((particle, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 15 }}
          animate={{
            opacity: [0, 0.8, 0],
            y: [15, -45, -90],
          }}
          transition={{
            duration: 2.4,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
          style={{
            top: particle.top,
            left: particle.left,
            width: particle.size,
            height: particle.size,
          }}
          className="absolute rounded-full bg-[#E5A93B] shadow-[0_0_8px_rgba(229,169,59,0.8)] pointer-events-none"
        />
      ))}
    </div>
  );
};

export default HeroMist;
