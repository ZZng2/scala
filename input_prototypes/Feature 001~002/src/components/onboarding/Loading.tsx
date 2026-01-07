import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 5; // increment
      });
    }, 50); // 50ms * 20 steps = 1000ms. But we need 1.5s total.
    // 1500ms / 20 = 75ms. Let's do 60ms * 25 steps roughly.
    // Let's just animate width and use timeout.

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 1500);

    return () => {
      clearInterval(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      <div className="w-[80%] max-w-md space-y-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">
            맞춤 장학금을<br/>찾고 있어요
          </h2>
          <p className="text-muted-foreground">잠시만 기다려주세요...</p>
        </motion.div>

        <div className="relative w-full h-2 bg-surface rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-primary font-medium"
        >
          장학금 DB 조회 중...
        </motion.div>
      </div>
    </div>
  );
}
