import { useEffect, useRef, useState } from "react";
import { Music, Music4, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MusicPlayerProps {
  url: string;
  isPlaying: boolean;
  onTogglePlay: (playState: boolean) => void;
  title: string;
}

export default function MusicPlayer({ url, isPlaying, onTogglePlay, title }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Setup audio instance
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.loop = true;
    } else {
      audioRef.current.src = url;
    }

    const playAudio = async () => {
      if (isPlaying && audioRef.current) {
        try {
          await audioRef.current.play();
          setError(null);
        } catch (err: any) {
          console.log("Autoplay blocked or audio load error:", err);
          // If it fails (e.g. browser autoplay restriction), sync state back or show hint
          onTogglePlay(false);
        }
      } else if (audioRef.current) {
        audioRef.current.pause();
      }
    };

    playAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [url, isPlaying]);

  const handleToggle = () => {
    onTogglePlay(!isPlaying);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-black/40 backdrop-blur-md border border-[#9ec4f7]/20 py-2 px-3 rounded-full shadow-lg">
      <div className="text-right hidden md:block">
        <p className="text-[10px] text-[#9ec4f7]/70 font-mono tracking-wider uppercase">Now Playing</p>
        <p className="text-xs text-rose-100/90 font-medium truncate max-w-[120px]">{title}</p>
      </div>

      <button
        id="toggle-music-btn"
        onClick={handleToggle}
        className="w-8 h-8 rounded-full bg-[#9ec4f7]/15 hover:bg-[#9ec4f7]/25 border border-[#9ec4f7]/40 flex items-center justify-center cursor-pointer transition-all text-[#9ec4f7] hover:scale-105 active:scale-95"
        title={isPlaying ? "Mute Background Music" : "Play Background Music"}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="playing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center justify-center"
            >
              <Volume2 className="w-4 h-4 animate-pulse" />
            </motion.div>
          ) : (
            <motion.div
              key="muted"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center justify-center text-rose-300/60"
            >
              <VolumeX className="w-4 h-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Floating spin visualizer if playing */}
      {isPlaying && (
        <span className="flex gap-0.5 items-end h-3 w-4">
          <span className="w-0.5 bg-[#9ec4f7] rounded-full animate-[bounce_1s_infinite_100ms] h-full" />
          <span className="w-0.5 bg-[#9ec4f7] rounded-full animate-[bounce_1s_infinite_300ms] h-2/3" />
          <span className="w-0.5 bg-[#9ec4f7] rounded-full animate-[bounce_1s_infinite_500ms] h-1/2" />
          <span className="w-0.5 bg-[#9ec4f7] rounded-full animate-[bounce_1s_infinite_200ms] h-4/5" />
        </span>
      )}
    </div>
  );
}

