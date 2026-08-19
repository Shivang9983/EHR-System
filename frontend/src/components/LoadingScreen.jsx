import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen({ isFinished, onComplete }) {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Main progress simulation loop
  useEffect(() => {
    let animationFrame;
    let currentProgress = 0;

    const updateProgress = () => {
      if (isFinished) {
        currentProgress += 3.0;
        if (currentProgress >= 100) {
          currentProgress = 100;
          setProgress(100);
          return;
        }
      } else {
        if (currentProgress < 99) {
          const remaining = 99 - currentProgress;
          currentProgress += Math.max(remaining * 0.02, 0.06);
        } else {
          currentProgress = Math.min(currentProgress + 0.005, 99.8);
        }
      }

      setProgress(currentProgress);
      animationFrame = requestAnimationFrame(updateProgress);
    };

    animationFrame = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationFrame);
  }, [isFinished]);

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAF7F2] text-[#1C1613] overflow-hidden select-none font-sans"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      {/* Subtle Warm Linen Texture Border Box */}
      <motion.div
        className="w-full max-w-xs p-8 bg-white border border-[#E8E2D8] rounded-2xl shadow-sm flex flex-col items-center text-center space-y-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Minimal Clinical Pulse Emblem */}
        <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C1613] flex items-center justify-center shadow-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 text-[#1C1613]"
          >
            {/* Heart Silhouette */}
            <path
              d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
              className="opacity-20"
            />
            {/* Smooth pulse trace */}
            <motion.path
              d="M3.22 12H9.5l1.5-3 2 6 1.5-3h4.78"
              initial={{ pathLength: 0 }}
              animate={{
                pathLength: [0, 1, 1],
                pathOffset: [0, 0, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                times: [0, 0.7, 1],
              }}
            />
          </svg>
        </div>

        {/* Minimalist Title & Subtitle */}
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-[#1C1613] tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            EHR Clinical Suite
          </h2>
          <p className="text-[10px] text-[#8C7A6E] font-medium tracking-wide uppercase">
            Initializing Secure Practice
          </p>
        </div>

        {/* Hairline Progress Line */}
        <div className="w-full space-y-2">
          <div className="w-full h-1 bg-[#FAF7F2] border border-[#E8E2D8] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#1C1613] rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ type: 'tween', ease: 'easeOut' }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-[#8C7A6E] font-mono">
            <span>Workspace</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
