import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Stage 1: 0% -> 25% (Fade out around 20-25%)
  const opacity1 = useTransform(scrollYProgress, [0, 0.2, 0.25], [1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.25], [0, -20]);
  const pointerEvents1 = useTransform(scrollYProgress, (v) => v < 0.25 ? 'auto' : 'none');

  // Stage 2: 25% -> 55% (Fade in 25-30%, stay, Fade out 50-55%)
  const opacity2 = useTransform(scrollYProgress, [0.25, 0.3, 0.5, 0.55], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.25, 0.55], [20, -20]);

  // Stage 3: 55% -> 100% (Fade in 55-65%, stay visible until end)
  const opacity3 = useTransform(scrollYProgress, [0.55, 0.65, 1], [0, 1, 1]);
  const y3 = useTransform(scrollYProgress, [0.55, 0.65], [20, 0]);

  return (
    <div ref={containerRef} className="h-[450vh] relative bg-white">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden pt-[56px] md:pt-[64px]">
        
        {/* Stage 1 */}
        <motion.div 
          style={{ opacity: opacity1, y: y1, pointerEvents: pointerEvents1 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        >
          <div className="space-y-2">
            <p className="text-3xl md:text-5xl font-bold text-text-primary leading-tight">
              2025년에 놓친
            </p>
            <p className="text-3xl md:text-5xl font-bold text-primary leading-tight">
              동국대학교 장학금
            </p>
          </div>
        </motion.div>

        {/* Stage 2 */}
        <motion.div 
          style={{ opacity: opacity2, y: y2 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        >
          <p className="text-8xl md:text-9xl font-extrabold text-primary tracking-tighter">
            361개
          </p>
        </motion.div>

        {/* Stage 3 */}
        <motion.div 
          style={{ opacity: opacity3, y: y3 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        >
          <div className="space-y-4">
            <p className="md:text-4xl text-text-primary leading-relaxed font-bold text-[24px]">
              <span className="text-primary text-4xl md:text-6xl font-bold">PUSH 알림</span>만 켜두세요.<br/>
              <span className="font-bold mt-2 block text-[32px] text-[24px]">이번 학기는<br/>무조건 받게 해드릴게요.</span>
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
