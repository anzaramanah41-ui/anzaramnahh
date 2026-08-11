import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  type: "star" | "heart" | "dot";
}

export default function Sparkles() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    // Generate a list of semi-random elegant background particles
    const newSparkles: Sparkle[] = Array.from({ length: 45 }).map((_, i) => {
      const typeRand = Math.random();
      let type: "star" | "heart" | "dot" = "dot";
      if (typeRand < 0.2) {
        type = "star";
      } else if (typeRand < 0.35) {
        type = "heart";
      }

      return {
        id: i,
        x: Math.random() * 100, // percentage of viewport width
        y: Math.random() * 100, // percentage of viewport height
        size: Math.random() * (type === "heart" ? 12 : 6) + 4, // size in pixels
        duration: Math.random() * 6 + 4, // duration of animation
        delay: Math.random() * 5, // delay before starting
        type,
      };
    });
    setSparkles(newSparkles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute text-rose-200/25"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
          }}
          animate={{
            y: ["0px", "-40px", "0px"],
            opacity: [0.15, 0.6, 0.15],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: sparkle.duration,
            repeat: Infinity,
            delay: sparkle.delay,
            ease: "easeInOut",
          }}
        >
          {sparkle.type === "star" ? (
            <svg
              width={sparkle.size}
              height={sparkle.size}
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-[#b8d7fb]/40"
            >
              <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
            </svg>
          ) : sparkle.type === "heart" ? (
            <svg
              width={sparkle.size}
              height={sparkle.size}
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-rose-400/30"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <span
              className="inline-block bg-[#9ec4f7]/30 rounded-full"
              style={{
                width: `${sparkle.size / 2}px`,
                height: `${sparkle.size / 2}px`,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

