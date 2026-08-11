import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, Calendar, Gift, ChevronRight, BookOpen, 
  Image as ImageIcon, Play, Send, RefreshCw, Volume2, Sparkles as SparklesIcon, X
} from "lucide-react";

import Sparkles from "./components/Sparkles";
import MusicPlayer from "./components/MusicPlayer";
import Customizer from "./components/Customizer";
import { DEFAULT_CONFIG, DEFAULT_POLAROIDS, DEFAULT_WISHES } from "./defaultData";
import { AppConfig, PolaroidPhoto, WishMessage } from "./types";

// ⭐ CARA MENAMBAH FOTO: Taruh semua file foto Anda di folder assets/fotombg/
//    dan mereka akan muncul otomatis di galeri "All of Our Memories"!
const allUltahImages = (import.meta as any).glob("../assets/fotombg/*.{jpg,jpeg,png,JPG,JPEG,PNG}", { eager: true });
const ultahImageUrls = Object.values(allUltahImages).map((mod: any) => mod.default || mod);

// Helper to parse filename and format caption beautifully
const formatCaption = (url: string) => {
  try {
    const filename = url.split("/").pop()?.split("?")[0] || "";
    
    // Check if WhatsApp style: IMG-YYYYMMDD-WAxxxx.jpg
    const waMatch = filename.match(/IMG-(\d{4})(\d{2})(\d{2})-WA/);
    if (waMatch) {
      const year = waMatch[1];
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = monthNames[parseInt(waMatch[2], 10) - 1] || "Memory";
      const day = parseInt(waMatch[3], 10);
      return `${day} ${month} ${year}`;
    }
    
    // Check if camera style: IMG_YYYYMMDD_HHMMSS.jpg
    const camMatch = filename.match(/IMG_(\d{4})(\d{2})(\d{2})_/);
    if (camMatch) {
      const year = camMatch[1];
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = monthNames[parseInt(camMatch[2], 10) - 1] || "Memory";
      const day = parseInt(camMatch[3], 10);
      return `${day} ${month} ${year}`;
    }
  } catch (e) {
    // fallback
  }
  return "Sweet Memory";
};

export default function App() {
  // ⭐ SELALU muat data SEGAR dari defaultData.ts
  //    Setiap perubahan di defaultData.ts langsung terlihat!
  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem("her_special_day_config");
    if (saved) {
      try {
        // Gabungkan data default + kustomisasi dari panel
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      } catch (e) {
        console.error("Error parsing saved config:", e);
      }
    }
    return DEFAULT_CONFIG;
  });

  const [polaroids, setPolaroids] = useState<PolaroidPhoto[]>(() => {
    const saved = localStorage.getItem("her_special_day_polaroids");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved polaroids:", e);
      }
    }
    return DEFAULT_POLAROIDS;
  });

  const [wishes, setWishes] = useState<WishMessage[]>(() => {
    const saved = localStorage.getItem("her_special_day_wishes");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved wishes:", e);
      }
    }
    return DEFAULT_WISHES;
  });

  // State persist handlers
  const handleUpdateConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    localStorage.setItem("her_special_day_config", JSON.stringify(newConfig));
  };

  const handleUpdatePolaroids = (newPolaroids: PolaroidPhoto[]) => {
    setPolaroids(newPolaroids);
    localStorage.setItem("her_special_day_polaroids", JSON.stringify(newPolaroids));
  };

  const handleUpdateWishes = (newWishes: WishMessage[]) => {
    setWishes(newWishes);
    localStorage.setItem("her_special_day_wishes", JSON.stringify(newWishes));
  };

  const handleResetData = () => {
    if (window.confirm("Apakah kamu yakin ingin mengembalikan semua data dan foto ke setelan awal?")) {
      setConfig(DEFAULT_CONFIG);
      setPolaroids(DEFAULT_POLAROIDS);
      setWishes(DEFAULT_WISHES);
      localStorage.removeItem("her_special_day_config");
      localStorage.removeItem("her_special_day_polaroids");
      localStorage.removeItem("her_special_day_wishes");
    }
  };

  // Main UI Stage Manager
  const [currentStage, setCurrentStage] = useState<
    "countdown" | "gift" | "polaroidIntro" | "letter" | "memories" | "allMemories" | "video" | "wishes" | "final"
  >("countdown");

  // Audio system triggers
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "01",
    seconds: "00",
  });
  const [isCountdownFinished, setIsCountdownFinished] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(config.targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        setIsCountdownFinished(true);
        clearInterval(interval);
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days: d < 10 ? `0${d}` : `${d}`,
          hours: h < 10 ? `0${h}` : `${h}`,
          minutes: m < 10 ? `0${m}` : `${m}`,
          seconds: s < 10 ? `0${s}` : `${s}`,
        });
        setIsCountdownFinished(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [config.targetDate]);

  // Unboxing animations
  const [giftState, setGiftState] = useState<"idle" | "shaking" | "opening" | "opened">("idle");

  const handleOpenGiftClick = () => {
    setIsMusicPlaying(true);
    setCurrentStage("gift");
  };

  const handleUnbox = () => {
    setGiftState("shaking");
    setTimeout(() => {
      setGiftState("opening");
      setTimeout(() => {
        setGiftState("opened");
        setTimeout(() => {
          setCurrentStage("polaroidIntro");
        }, 1800);
      }, 1000);
    }, 600);
  };

  // Lightbox
  const [activeLightboxImage, setActiveLightboxImage] = useState<PolaroidPhoto | null>(null);

  // Guest book
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;

    const newWish: WishMessage = {
      id: Date.now().toString(),
      name: newCommentName.trim(),
      message: newCommentText.trim(),
      date: "Just now",
    };

    const updated = [newWish, ...wishes];
    handleUpdateWishes(updated);
    setNewCommentName("");
    setNewCommentText("");
  };

  // Final slides
  const [finalSlideIndex, setFinalSlideIndex] = useState(0);
  const finalSlides = [
    config.finalSlide1,
    config.finalSlide2,
    config.finalSlide3,
    "Thank you for being part of my life. I hope this little gift can make your special day even more beautiful.",
  ];

  return (
    <div className="relative min-h-screen bg-[#ffe9f0] bg-radial-[at_center_center,_var(--tw-gradient-stops)] from-[#ffd9e6] via-[#ffe9f0] to-[#fbd3e3] flex flex-col justify-between overflow-hidden selection:bg-[#f5b8cf] selection:text-[#a64d6e]">
      <Sparkles />

      <MusicPlayer 
        url={config.musicUrl} 
        isPlaying={isMusicPlaying} 
        onTogglePlay={setIsMusicPlaying} 
        title={config.musicTitle}
      />

      <Customizer
        config={config}
        onUpdateConfig={handleUpdateConfig}
        polaroids={polaroids}
        onUpdatePolaroids={handleUpdatePolaroids}
        wishes={wishes}
        onUpdateWishes={handleUpdateWishes}
        onReset={handleResetData}
      />

      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-pink-400/20 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-rose-400/20 blur-[120px] rounded-full pointer-events-none z-0" />

      <header className="p-6 text-center z-10 shrink-0 select-none">
        <span className="text-[10px] tracking-[0.25em] font-mono text-[#a64d6e]/80 uppercase font-bold drop-shadow">
          ✧ MENGHITUNG HARI ✧
        </span>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 flex items-center justify-center z-10 py-6">
        <AnimatePresence mode="wait">
          
          {currentStage === "countdown" && (
            <motion.div
              key="countdown-stage"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center space-y-10 w-full"
            >
              <div className="space-y-4">
                <h1 className="font-serif italic font-normal text-4xl sm:text-5xl md:text-6xl text-[#a64d6e] tracking-wide leading-tight">
                  {config.title}
                </h1>
                <p className="text-sm sm:text-base text-[#a64d6e]/75 font-serif italic max-w-md mx-auto">
                  {config.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto px-2">
                {[
                  { value: timeLeft.days, label: "HARI" },
                  { value: timeLeft.hours, label: "JAM" },
                  { value: timeLeft.minutes, label: "MENIT" },
                  { value: timeLeft.seconds, label: "DETIK" },
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className="bg-black/35 backdrop-blur-md border border-[#9ec4f7]/15 rounded-xl p-3 sm:p-5 flex flex-col justify-center items-center shadow-2xl relative overflow-hidden group"
                  >
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#9ec4f7]/30 to-transparent" />
                    <span className="text-2xl sm:text-4xl md:text-5xl font-mono font-medium tracking-widest text-[#9ec4f7] tabular-nums drop-shadow-md">
                      {item.value}
                    </span>
                    <span className="text-[9px] sm:text-[11px] tracking-widest font-mono text-rose-100/50 mt-1.5 font-bold">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-6 pt-2">
                <p className="text-xs sm:text-sm font-mono tracking-widest text-[#9ec4f7]/80 flex items-center justify-center gap-1.5">
                  {isCountdownFinished ? (
                    <span className="flex items-center gap-1.5 text-[#b0275d] animate-pulse">
                      ✨ Hari ini adalah hari spesialmu! ✨
                    </span>
                  ) : (
                    <span className="text-[#a64d6e]/50">⏳ Beberapa detik lagi...</span>
                  )}
                </p>

                <button
                  id="open-gift-cta"
                  disabled={!isCountdownFinished}
                  onClick={handleOpenGiftClick}
                  className={`relative group px-8 py-3.5 rounded-full text-xs font-mono tracking-[0.2em] uppercase font-bold transition-all duration-300 ${
                    isCountdownFinished
                      ? "bg-[#9ec4f7] text-black shadow-[0_0_25px_rgba(158,196,247,0.4)] hover:shadow-[0_0_35px_rgba(158,196,247,0.6)] cursor-pointer hover:scale-105 active:scale-95"
                      : "bg-[#a64d6e]/10 text-[#a64d6e]/40 border border-[#a64d6e]/20 cursor-not-allowed"
                  }`}
                >
                  {isCountdownFinished ? (
                    <span className="flex items-center justify-center gap-2">
                      ✦ OPEN HER GIFT ✦
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      🔒 TUNGGU SAMPAI WAKTUNYA
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {currentStage === "gift" && (
            <motion.div
              key="gift-stage"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-8 max-w-md"
            >
              <div className="space-y-2">
                <span className="text-[10px] tracking-[0.2em] font-mono text-[#a64d6e] block uppercase font-bold">
                  ✧ {config.giftTitle} ✧
                </span>
                <p className="text-xs text-[#a64d6e]/75 italic">
                  {config.giftSubtitle}
                </p>
              </div>

              <div className="relative h-64 flex items-center justify-center py-6">
                <AnimatePresence>
                  {giftState === "opening" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: [0.8, 1, 0], scale: [0.8, 2.5, 3] }}
                      className="absolute text-[#9ec4f7] pointer-events-none"
                    >
                      <SparklesIcon className="w-16 h-16" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  onClick={giftState === "idle" ? handleUnbox : undefined}
                  animate={
                    giftState === "shaking"
                      ? { rotate: [-4, 4, -4, 4, -4, 0], y: [-2, 2, -2, 2, -2, 0] }
                      : giftState === "opening"
                      ? { scale: [1, 1.1, 0.9, 0] }
                      : {}
                  }
                  transition={{
                    duration: giftState === "shaking" ? 0.6 : 0.8,
                    ease: "easeInOut",
                  }}
                  className={`relative w-44 h-44 cursor-pointer flex flex-col justify-center items-center group ${
                    giftState === "idle" ? "hover:scale-105 active:scale-95" : ""
                  }`}
                >
                  {giftState === "idle" && (
                    <div className="absolute inset-0 bg-[#9ec4f7]/10 blur-xl rounded-full scale-110 group-hover:bg-[#9ec4f7]/15 transition-all" />
                  )}

                  <motion.div
                    animate={
                      giftState === "opening"
                        ? { y: -120, x: 20, rotate: 45, opacity: 0 }
                        : {}
                    }
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="z-10 relative -mb-1"
                  >
                    <svg width="120" height="35" viewBox="0 0 120 35" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                      <path d="M2 33H118V10C118 5.58172 114.418 2 110 2H10C5.58172 2 2 5.58172 2 10V33Z" fill="#251e33" stroke="#9ec4f7" strokeWidth="3.5" />
                      <rect x="52" y="2" width="16" height="31" fill="#9ec4f7" />
                      <circle cx="60" cy="2" r="10" stroke="#9ec4f7" strokeWidth="3" />
                      <path d="M45 2C41 0 32 3 45 10" stroke="#9ec4f7" strokeWidth="3.5" strokeLinecap="round" />
                      <path d="M75 2C79 0 88 3 75 10" stroke="#9ec4f7" strokeWidth="3.5" strokeLinecap="round" />
                    </svg>
                  </motion.div>

                  <div className="relative">
                    <svg width="110" height="100" viewBox="0 0 110 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
                      <path d="M2 2V88C2 93.5228 6.47715 98 12 98H98C103.523 98 108 93.5228 108 88V2H2Z" fill="#1b1526" stroke="#9ec4f7" strokeWidth="3.5" />
                      <rect x="47" y="2" width="16" height="96" fill="#9ec4f7" />
                    </svg>
                  </div>
                </motion.div>
              </div>

              <p className="text-xs font-mono text-[#a64d6e] tracking-widest uppercase select-none">
                {giftState === "idle" && "🎁 KLIK KADO UNTUK MEMBUKA"}
                {giftState === "shaking" && "✨ Membuka kado..."}
                {giftState === "opening" && "💖 Surprise!"}
                {giftState === "opened" && "✨ Membuka Album Kenangan..."}
              </p>
            </motion.div>
          )}

          {currentStage === "polaroidIntro" && (
            <motion.div
              key="intro-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="relative w-full min-h-[450px] flex flex-col justify-center items-center"
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                {polaroids.slice(0, 4).map((photo, idx) => {
                  const offsets = [
                    { left: "5%", top: "10%" },
                    { right: "5%", top: "8%" },
                    { left: "8%", bottom: "10%" },
                    { right: "8%", bottom: "12%" },
                  ];
                  return (
                    <motion.div
                      key={photo.id}
                      initial={{ scale: 0, opacity: 0, rotate: 0 }}
                      animate={{ scale: 0.8, opacity: 0.65, rotate: photo.angle }}
                      transition={{ delay: idx * 0.3, type: "spring", damping: 15, stiffness: 80 }}
                      style={{ ...offsets[idx] }}
                      className="absolute hidden md:block w-36 bg-white p-2 pb-5 text-black polaroid-shadow border border-gray-100"
                    >
                      <div className="w-full aspect-square bg-gray-500 overflow-hidden rounded-sm mb-2">
                        <img src={photo.url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <p className="font-cursive text-center text-[10px] truncate max-w-[120px] text-gray-800">
                        {photo.caption}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-center space-y-8 max-w-lg mx-auto p-4 z-10"
              >
                <div className="space-y-4">
                  <span className="text-[10px] tracking-[0.3em] font-mono text-[#a64d6e] block uppercase font-bold">
                    ✧ A LOVE LETTER FOR YOU ✧
                  </span>
                  <h1 className="font-serif italic font-normal text-4xl sm:text-5xl md:text-6xl text-[#a64d6e] leading-tight">
                    Your Special Day
                  </h1>
                  <p className="text-xs sm:text-sm text-[#a64d6e]/75 font-serif italic max-w-sm mx-auto">
                    Created with love, just for you
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setCurrentStage("letter")}
                    className="relative group px-8 py-3.5 bg-[#9ec4f7] text-black rounded-full text-xs font-mono tracking-[0.2em] uppercase font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(158,196,247,0.3)] hover:shadow-[0_0_30px_rgba(158,196,247,0.5)] flex items-center justify-center gap-2 mx-auto"
                  >
                    <BookOpen className="w-4 h-4" /> READ MY LETTER
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {currentStage === "letter" && (
            <motion.div
              key="letter-stage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-xl mx-auto space-y-8"
            >
              <div className="text-center space-y-2">
                <span className="text-[10px] tracking-[0.25em] font-mono text-[#a64d6e] uppercase font-bold block">
                  ✧ {config.letterTitle} ✧
                </span>
                <h2 className="font-serif italic font-normal text-3xl text-[#a64d6e] leading-tight">
                  {config.partnerName}
                </h2>
              </div>

              <motion.div
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                className="bg-black/35 backdrop-blur-md border border-[#9ec4f7]/20 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden max-h-[480px] overflow-y-auto"
              >
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#9ec4f7]/30 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#9ec4f7]/30 to-transparent" />

                <div className="space-y-6 text-sm sm:text-base text-rose-100/90 leading-relaxed font-serif">
                  <p className="font-bold text-[#9ec4f7] font-sans tracking-wide text-xs">
                    {config.letterHeader}
                  </p>
                  
                  {config.letterParagraphs.map((para, idx) => (
                    <p key={idx} className="indent-4 first-of-type:indent-0">
                      {para}
                    </p>
                  ))}
                  
                  <div className="pt-6 border-t border-white/5 text-right space-y-1 select-none">
                    <p className="font-cursive text-2xl text-[#9ec4f7]">With love,</p>
                    <p className="text-[10px] font-mono tracking-widest text-[#9ec4f7]/50 font-bold uppercase">
                      ALWAYS & FOREVER YOURS 🤍
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setCurrentStage("memories")}
                  className="relative group px-8 py-3.5 bg-[#9ec4f7] text-black rounded-full text-xs font-mono tracking-[0.2em] uppercase font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(158,196,247,0.3)] hover:shadow-[0_0_30px_rgba(158,196,247,0.5)] flex items-center justify-center gap-1.5"
                >
                  <ImageIcon className="w-4 h-4" /> OUR MEMORIES <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          {currentStage === "memories" && (
            <motion.div
              key="memories-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full space-y-10"
            >
              <div className="text-center space-y-3">
                <h2 className="font-serif italic font-normal text-3xl sm:text-4xl text-[#a64d6e] leading-tight">
                  {config.polaroidTitle}
                </h2>
                <p className="text-xs text-[#a64d6e]/75 font-serif italic uppercase tracking-wider">
                  {config.polaroidSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto px-2">
                {polaroids.map((photo, idx) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.6 }}
                    whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
                    style={{ rotate: `${photo.angle}deg` }}
                    onClick={() => setActiveLightboxImage(photo)}
                    className="bg-white p-2.5 pb-6 text-black polaroid-shadow border border-gray-100 cursor-pointer select-none relative group transform transition-all"
                  >
                    <div className="absolute top-[-10px] left-[30%] right-[30%] h-4 bg-blue-200/20 backdrop-blur-xs border border-blue-200/5 rotate-[-2deg] opacity-70" />

                    <div className="w-full aspect-square bg-gray-100 overflow-hidden rounded-xs mb-3 relative">
                      <img 
                        src={photo.url} 
                        alt={photo.caption} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=300";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>

                    <p className="font-cursive text-center text-xs text-gray-800 leading-none select-none px-1 py-0.5 truncate">
                      {photo.caption}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col items-center gap-4 pt-6">
                <button
                  onClick={() => setCurrentStage("allMemories")}
                  className="relative group px-8 py-3.5 bg-[#9ec4f7] text-black rounded-full text-xs font-mono tracking-[0.2em] uppercase font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(158,196,247,0.3)] hover:shadow-[0_0_30px_rgba(158,196,247,0.5)] flex items-center justify-center gap-2 animate-pulse"
                >
                  <ImageIcon className="w-4 h-4" /> SHOW ALL MEMORISE
                </button>

                <button
                  onClick={() => setCurrentStage("video")}
                  className="relative group px-8 py-3.5 bg-[#9ec4f7] text-black rounded-full text-xs font-mono tracking-[0.2em] uppercase font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(158,196,247,0.3)] hover:shadow-[0_0_30px_rgba(158,196,247,0.5)] flex items-center justify-center gap-1.5"
                >
                  <Play className="w-4 h-4 fill-black" /> WATCH VIDEO <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          {currentStage === "allMemories" && (
            <motion.div
              key="all-memories-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full space-y-10"
            >
              <div className="text-center space-y-3">
                <h2 className="font-serif italic font-normal text-3xl sm:text-4xl text-[#a64d6e] leading-tight">
                  All of Our Memories
                </h2>
                <p className="text-xs text-[#a64d6e]/75 font-serif italic uppercase tracking-wider">
                  every single beautiful moment we shared
                </p>
              </div>

              <div className="w-full max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar max-w-5xl mx-auto px-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 pb-6">
                  {ultahImageUrls.map((url, idx) => {
                    const angle = ((idx * 7) % 13) - 6;
                    const caption = formatCaption(url);
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(idx * 0.03, 1), duration: 0.6 }}
                        whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
                        style={{ rotate: `${angle}deg` }}
                        onClick={() => setActiveLightboxImage({ id: `all-${idx}`, url: url, caption: caption, angle: angle })}
                        className="bg-white p-2 sm:p-2.5 pb-5 sm:pb-6 text-black polaroid-shadow border border-gray-100 cursor-pointer select-none relative group transform transition-all"
                      >
                        <div className="absolute top-[-10px] left-[30%] right-[30%] h-4 bg-blue-200/20 backdrop-blur-xs border border-blue-200/5 rotate-[-2deg] opacity-70" />

                        <div className="w-full aspect-square bg-gray-100 overflow-hidden rounded-xs mb-3 relative">
                          <img 
                            src={url} 
                            alt={caption} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=300";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </div>

                        <p className="font-cursive text-center text-[10px] sm:text-xs text-gray-800 leading-none select-none px-1 py-0.5 truncate">
                          {caption}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setCurrentStage("memories")}
                  className="relative group px-8 py-3.5 bg-[#9ec4f7] text-black rounded-full text-xs font-mono tracking-[0.2em] uppercase font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(158,196,247,0.3)] hover:shadow-[0_0_30px_rgba(158,196,247,0.5)] flex items-center justify-center gap-2"
                >
                  KEMBALI KE ALBUM ✦
                </button>
              </div>
            </motion.div>
          )}

          {currentStage === "video" && (
            <motion.div
              key="video-stage"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-2xl mx-auto space-y-8 text-center"
            >
              <div className="space-y-2">
                <span className="text-[10px] tracking-[0.25em] font-mono text-[#a64d6e] uppercase font-bold block">
                  ✧ {config.videoTitle} ✧
                </span>
                <p className="text-xs text-[#a64d6e]/75 font-serif italic">
                  {config.videoSubtitle}
                </p>
              </div>

              <div className="bg-black/45 backdrop-blur-md border border-[#9ec4f7]/15 rounded-2xl p-3 sm:p-5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#9ec4f7]/30 to-transparent" />
                
                <div className="w-full flex justify-center items-center rounded-lg bg-[#110e17] border border-white/5 py-6">
                <video
                src={config.videoUrl}
                controls
                autoPlay
                loop
                muted
                className="w-[300px] h-[533px] rounded-2xl object-contain"
                poster="..."
                />
              </div>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setCurrentStage("wishes")}
                  className="relative group px-8 py-3.5 bg-[#9ec4f7] text-black rounded-full text-xs font-mono tracking-[0.2em] uppercase font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(158,196,247,0.3)] hover:shadow-[0_0_30px_rgba(158,196,247,0.5)] flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> BIRTHDAY WISHE BOARD <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          {currentStage === "wishes" && (
            <motion.div
              key="wishes-stage"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8"
            >
              <div className="md:col-span-2 space-y-6 flex flex-col justify-center">
                <div className="space-y-3 text-center md:text-left">
                  <h2 className="font-serif italic font-normal text-3xl text-[#a64d6e] leading-tight">
                    {config.wishesTitle}
                  </h2>
                  <p className="text-xs text-[#a64d6e]/75 font-serif italic">
                    {config.wishesSubtitle}
                  </p>
                </div>

                <form onSubmit={handleSubmitComment} className="space-y-4 bg-black/25 p-5 border border-[#9ec4f7]/15 rounded-xl">
                  <div className="space-y-1">
                    <label className="text-[10px] tracking-wider font-mono text-rose-100/50 uppercase font-bold">Your Name</label>
                    <input
                      type="text"
                      required
                      value={newCommentName}
                      onChange={(e) => setNewCommentName(e.target.value)}
                      placeholder="Nama kamu..."
                      className="w-full bg-black/40 border border-[#9ec4f7]/15 rounded px-3 py-2 text-sm text-[#f3e8eb] focus:outline-none focus:border-[#9ec4f7] placeholder-white/25"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] tracking-wider font-mono text-rose-100/50 uppercase font-bold">Your Wish</label>
                    <textarea
                      required
                      rows={3}
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Tulis ucapan tulusmu di sini... 💖"
                      className="w-full bg-black/40 border border-[#9ec4f7]/15 rounded px-3 py-2 text-sm text-[#f3e8eb] focus:outline-none focus:border-[#9ec4f7] placeholder-white/25 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#9ec4f7] hover:bg-blue-200 text-black rounded font-mono text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Kirim Ucapan
                  </button>
                </form>
              </div>

              <div className="md:col-span-3 bg-black/35 backdrop-blur-md border border-[#9ec4f7]/15 rounded-xl p-5 shadow-2xl flex flex-col max-h-[500px] overflow-y-auto">
                <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
                  <Heart className="w-4 h-4 text-rose-300 fill-rose-300/20" />
                  <span className="text-xs font-mono tracking-wider text-rose-100/70 uppercase font-bold">
                    Birthday Wishes ({wishes.length})
                  </span>
                </div>

                <div className="flex-1 space-y-3">
                  <AnimatePresence>
                    {wishes.map((wish, idx) => (
                      <motion.div
                        key={wish.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white/5 hover:bg-white/[0.07] border border-white/5 rounded-lg p-3 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#9ec4f7] to-blue-300 flex items-center justify-center text-black text-[10px] font-bold">
                            {wish.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs text-[#9ec4f7] font-medium">{wish.name}</span>
                          <span className="text-[9px] font-mono text-rose-100/30 ml-auto">{wish.date}</span>
                        </div>
                        <p className="text-xs text-rose-100/80 italic leading-relaxed pl-8">
                          "{wish.message}"
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Lightbox overlay */}
      <AnimatePresence>
        {activeLightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveLightboxImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveLightboxImage(null)}
                className="absolute -top-10 right-0 text-white/70 hover:text-white cursor-pointer transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="bg-white p-3 pb-6 rounded-lg polaroid-shadow text-center">
                <img
                  src={activeLightboxImage.url}
                  alt={activeLightboxImage.caption}
                  className="w-full aspect-square object-cover rounded-sm mb-3"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600";
                  }}
                />
                <p className="font-cursive text-sm text-gray-800">{activeLightboxImage.caption}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="p-6 text-center z-10 shrink-0 select-none">
        <span className="text-[9px] tracking-[0.2em] font-mono text-[#a64d6e]/60 uppercase font-bold">
          ✦ Made with Love ✦
        </span>
      </footer>
    </div>
  );
}

