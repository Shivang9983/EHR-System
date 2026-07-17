import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  'Verifying Session',
  'Connecting Secure Database',
  'Loading Healthcare Workspace',
  'Preparing Dashboard'
];

function ProjectLogo() {
  return (
    <div className="relative flex items-center justify-center w-14 h-14 mb-4">
      {/* Soft pulse glow background */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-slate-200/80 dark:border-slate-800 shadow-3xs"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Existing Project Logo SVG (HeartPulse) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-7 h-7 text-indigo-650 dark:text-indigo-400 z-10"
        aria-hidden="true"
      >
        {/* Heart shape - smooth pulse */}
        <motion.path
          d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
          initial={{ opacity: 0.35 }}
          animate={{ opacity: [0.35, 0.7, 0.35] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Heartbeat pulse path - draws left to right */}
        <motion.path
          d="M3.22 12H9.5l1.5-3 2 6 1.5-3h4.78"
          initial={{ pathLength: 0 }}
          animate={{
            pathLength: [0, 1, 1],
            pathOffset: [0, 0, 1]
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.7, 1]
          }}
        />
      </svg>
    </div>
  );
}

export default function LoadingScreen({ isFinished, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const onCompleteRef = useRef(onComplete);

  // Sync completion callback ref to prevent stale closures
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Main progress simulation loop
  useEffect(() => {
    let animationFrame;
    let currentProgress = 0;
    
    const updateProgress = () => {
      if (isFinished) {
        // Fast-forward to 100% when backend loading completes
        currentProgress += 2.0; 
        if (currentProgress >= 100) {
          currentProgress = 100;
          setProgress(100);
          return;
        }
      } else {
        // Normal pace towards 99%
        if (currentProgress < 99) {
          // Logarithmic slowdown as we approach 99%
          const remaining = 99 - currentProgress;
          currentProgress += Math.max(remaining * 0.015, 0.04);
        } else {
          // Cautious micro-crawling at 99% while waiting for API response
          currentProgress = Math.min(currentProgress + 0.003, 99.8);
        }
      }
      
      setProgress(currentProgress);
      animationFrame = requestAnimationFrame(updateProgress);
    };

    animationFrame = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationFrame);
  }, [isFinished]);

  // Sync step changes based on current progress
  useEffect(() => {
    if (progress >= 100) {
      setActiveStep(3);
      const timeout = setTimeout(() => {
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }, 400); // Small delay to let user see 100% completion
      return () => clearTimeout(timeout);
    }

    if (progress < 25) {
      setActiveStep(0);
    } else if (progress < 50) {
      setActiveStep(1);
    } else if (progress < 75) {
      setActiveStep(2);
    } else {
      setActiveStep(3);
    }
  }, [progress]);

  return (
    <div 
      className="relative flex items-center justify-center min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 overflow-hidden px-4 selection:bg-indigo-500/10 selection:text-indigo-600 transition-colors duration-300"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      {/* Screen reader content */}
      <span className="sr-only">
        Loading EHR Workspace: {Math.round(progress)}% - {STEPS[activeStep]}
      </span>

      {/* Grid Pattern Background - Stripe/Linear Style */}
      <svg 
        className="absolute inset-0 w-full h-full stroke-slate-200/40 dark:stroke-slate-800/40 [mask-image:radial-gradient(100%_100%_at_center,white,transparent)]" 
        aria-hidden="true"
      >
        <defs>
          <pattern id="loading-grid" width="40" height="40" patternUnits="userSpaceOnUse" x="-1" y="-1">
            <path d="M.5 40V.5H40" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#loading-grid)" />
      </svg>

      {/* Soft Ambient Blur Spots */}
      <motion.div
        className="absolute -top-48 -left-48 w-96 h-96 rounded-full bg-indigo-650/5 dark:bg-indigo-505/5 blur-3xl"
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -20, 30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute -bottom-48 -right-48 w-96 h-96 rounded-full bg-teal-500/5 dark:bg-teal-500/5 blur-3xl"
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 40, -10, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Centered Loading Card */}
      <motion.div 
        className="relative w-full max-w-sm p-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-lg shadow-slate-100/50 dark:shadow-none flex flex-col items-center text-center z-15"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Animated Existing Project Logo */}
        <ProjectLogo />

        {/* Branding header */}
        <div className="space-y-1 mb-6">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
            EHR Management Suite
          </h2>
          <p className="text-[10px] text-slate-500 dark:text-slate-550 font-medium">
            SECURE PORTAL CONNECTION
          </p>
        </div>

        {/* Custom Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
          <motion.div 
            className="h-full bg-indigo-650 dark:bg-indigo-500 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ type: 'tween', ease: 'easeOut' }}
          />
        </div>

        {/* Status Message Sequence and Progress Text */}
        <div className="flex items-center justify-between w-full mt-1 px-0.5">
          {/* Animated Status Text (Glides up and fades in/out) */}
          <div className="h-5 overflow-hidden flex items-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={activeStep}
                className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                {STEPS[activeStep]}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Tabular numbers for percentage display (avoids jitter) */}
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 font-mono tracking-tighter w-10 text-right">
            {Math.round(progress)}%
          </span>
        </div>
      </motion.div>
    </div>
  );
}
