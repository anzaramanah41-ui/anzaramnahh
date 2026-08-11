import { useState } from "react";
import { AppConfig, PolaroidPhoto, WishMessage } from "../types";
import { MUSIC_PRESETS } from "../defaultData";
import { 
  Settings, Heart, Calendar, Image, FileText, 
  Video, Music, Plus, Trash2, RotateCcw, X, Edit, MessageSquare, CheckCircle2 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CustomizerProps {
  config: AppConfig;
  onUpdateConfig: (newConfig: AppConfig) => void;
  polaroids: PolaroidPhoto[];
  onUpdatePolaroids: (newPolaroids: PolaroidPhoto[]) => void;
  wishes: WishMessage[];
  onUpdateWishes: (newWishes: WishMessage[]) => void;
  onReset: () => void;
}

export default function Customizer({
  config,
  onUpdateConfig,
  polaroids,
  onUpdatePolaroids,
  wishes,
  onUpdateWishes,
  onReset,
}: CustomizerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "letter" | "polaroids" | "video" | "wishes" | "music">("general");

  const updateConfigField = (key: keyof AppConfig, value: any) => {
    onUpdateConfig({
      ...config,
      [key]: value
    });
  };

  const handleSetQuickTimer = (seconds: number) => {
    const target = new Date(Date.now() + seconds * 1000).toISOString();
    updateConfigField("targetDate", target);
  };

  const handleUpdatePolaroid = (index: number, key: keyof PolaroidPhoto, value: any) => {
    const newPolaroids = [...polaroids];
    newPolaroids[index] = {
      ...newPolaroids[index],
      [key]: value
    };
    onUpdatePolaroids(newPolaroids);
  };

  const handleAddWish = () => {
    const newWish: WishMessage = {
      id: Date.now().toString(),
      name: "Sahabat Terbaik",
      message: "Selamat hari spesial! Semoga semua keinginanmu dikabulkan ya sayang! 🥰🌸",
      date: "Just now"
    };
    onUpdateWishes([newWish, ...wishes]);
  };

  const handleRemoveWish = (id: string) => {
    onUpdateWishes(wishes.filter(w => w.id !== id));
  };

  const handleUpdateLetterParagraph = (index: number, value: string) => {
    const newParagraphs = [...config.letterParagraphs];
    newParagraphs[index] = value;
    updateConfigField("letterParagraphs", newParagraphs);
  };

  const handleAddLetterParagraph = () => {
    updateConfigField("letterParagraphs", [...config.letterParagraphs, "Tambahkan paragraf ungkapan sayang barumu di sini... 💖"]);
  };

  const handleRemoveLetterParagraph = (index: number) => {
    if (config.letterParagraphs.length > 1) {
      updateConfigField("letterParagraphs", config.letterParagraphs.filter((_, i) => i !== index));
    }
  };

  return (
    <>
      {/* Elegant floating customizer trigger button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          id="customizer-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#9ec4f7] to-blue-200 text-black border border-blue-300 shadow-2xl flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-transform"
          title="Buka Panel Kustomisasi Web"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Settings className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex justify-end">
            {/* Click outside to close */}
            <div className="absolute inset-0 cursor-default" onClick={() => setIsOpen(false)} />

            {/* Customizer Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl bg-[#110e17] border-l border-[#9ec4f7]/20 h-full flex flex-col shadow-2xl z-50 text-[#f3e8eb]"
            >
              {/* Header */}
              <div className="p-5 border-b border-[#9ec4f7]/15 flex items-center justify-between bg-black/30">
                <div className="flex items-center gap-2.5">
                  <Heart className="w-5 h-5 text-[#9ec4f7] fill-[#9ec4f7]/20" />
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#9ec4f7]">Gift Customizer</h3>
                    <p className="text-xs text-rose-200/50">Edit content, photos, & music live</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onReset}
                    className="p-1.5 hover:bg-rose-500/10 text-rose-300 hover:text-rose-200 border border-transparent hover:border-rose-500/20 rounded transition-colors text-xs flex items-center gap-1 cursor-pointer"
                    title="Kembalikan data bawaan"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:bg-white/5 border border-transparent hover:border-white/10 rounded transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-[#9ec4f7]/10 bg-black/15 overflow-x-auto text-xs shrink-0 scrollbar-none">
                <button
                  onClick={() => setActiveTab("general")}
                  className={`px-4 py-3 border-b-2 font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === "general" ? "border-[#9ec4f7] text-[#9ec4f7] bg-[#9ec4f7]/5" : "border-transparent text-rose-100/50 hover:text-[#f3e8eb]"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 inline mr-1" /> Countdown & Names
                </button>
                <button
                  onClick={() => setActiveTab("letter")}
                  className={`px-4 py-3 border-b-2 font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === "letter" ? "border-[#9ec4f7] text-[#9ec4f7] bg-[#9ec4f7]/5" : "border-transparent text-rose-100/50 hover:text-[#f3e8eb]"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 inline mr-1" /> Love Letter
                </button>
                <button
                  onClick={() => setActiveTab("polaroids")}
                  className={`px-4 py-3 border-b-2 font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === "polaroids" ? "border-[#9ec4f7] text-[#9ec4f7] bg-[#9ec4f7]/5" : "border-transparent text-rose-100/50 hover:text-[#f3e8eb]"
                  }`}
                >
                  <Image className="w-3.5 h-3.5 inline mr-1" /> Polaroid Photos
                </button>
                <button
                  onClick={() => setActiveTab("video")}
                  className={`px-4 py-3 border-b-2 font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === "video" ? "border-[#9ec4f7] text-[#9ec4f7] bg-[#9ec4f7]/5" : "border-transparent text-rose-100/50 hover:text-[#f3e8eb]"
                  }`}
                >
                  <Video className="w-3.5 h-3.5 inline mr-1" /> Video Message
                </button>
                <button
                  onClick={() => setActiveTab("wishes")}
                  className={`px-4 py-3 border-b-2 font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === "wishes" ? "border-[#9ec4f7] text-[#9ec4f7] bg-[#9ec4f7]/5" : "border-transparent text-rose-100/50 hover:text-[#f3e8eb]"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 inline mr-1" /> Wishes Board
                </button>
                <button
                  onClick={() => setActiveTab("music")}
                  className={`px-4 py-3 border-b-2 font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === "music" ? "border-[#9ec4f7] text-[#9ec4f7] bg-[#9ec4f7]/5" : "border-transparent text-rose-100/50 hover:text-[#f3e8eb]"
                  }`}
                >
                  <Music className="w-3.5 h-3.5 inline mr-1" /> Background Music
                </button>
              </div>

              {/* Scrollable Content View */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {activeTab === "general" && (
                  <div className="space-y-4">
                    <div className="bg-blue-300/10 border border-blue-300/20 rounded-lg p-3 text-xs text-blue-200">
                      💡 <strong>Petunjuk Pengujian:</strong> Atur timer menjadi beberapa detik saja untuk melihat transisi kado secara langsung!
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleSetQuickTimer(5)}
                        className="p-2 text-xs bg-[#9ec4f7]/10 border border-[#9ec4f7]/30 hover:bg-[#9ec4f7]/20 rounded transition-colors text-[#9ec4f7] cursor-pointer"
                      >
                        ⏱️ Mulai dalam 5 detik
                      </button>
                      <button
                        onClick={() => handleSetQuickTimer(120)}
                        className="p-2 text-xs bg-[#9ec4f7]/10 border border-[#9ec4f7]/30 hover:bg-[#9ec4f7]/20 rounded transition-colors text-[#9ec4f7] cursor-pointer"
                      >
                        ⏱️ Mulai dalam 2 menit
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-rose-200/60 font-mono">COUNTDOWN TARGET (DATE & TIME)</label>
                      <input
                        type="datetime-local"
                        value={config.targetDate.slice(0, 16)}
                        onChange={(e) => updateConfigField("targetDate", new Date(e.target.value).toISOString())}
                        className="w-full bg-black/40 border border-[#9ec4f7]/20 rounded px-3 py-2 text-sm text-[#f3e8eb] focus:outline-none focus:border-[#9ec4f7]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-rose-200/60 font-mono">MAIN COUNTDOWN TITLE</label>
                      <input
                        type="text"
                        value={config.title}
                        onChange={(e) => updateConfigField("title", e.target.value)}
                        className="w-full bg-black/40 border border-[#9ec4f7]/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#9ec4f7]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-rose-200/60 font-mono">COUNTDOWN SUBTITLE</label>
                      <input
                        type="text"
                        value={config.subtitle}
                        onChange={(e) => updateConfigField("subtitle", e.target.value)}
                        className="w-full bg-black/40 border border-[#9ec4f7]/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#9ec4f7]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-rose-200/60 font-mono">PARTNER'S CALL NAME</label>
                      <input
                        type="text"
                        value={config.partnerName}
                        onChange={(e) => updateConfigField("partnerName", e.target.value)}
                        className="w-full bg-black/40 border border-[#9ec4f7]/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#9ec4f7]"
                      />
                    </div>

                    <div className="border-t border-[#9ec4f7]/10 pt-4 grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-rose-200/60 font-mono">GIFT TITLE</label>
                        <input
                          type="text"
                          value={config.giftTitle}
                          onChange={(e) => updateConfigField("giftTitle", e.target.value)}
                          className="w-full bg-black/40 border border-[#9ec4f7]/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#9ec4f7]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-rose-200/60 font-mono">GIFT SUBTITLE</label>
                        <input
                          type="text"
                          value={config.giftSubtitle}
                          onChange={(e) => updateConfigField("giftSubtitle", e.target.value)}
                          className="w-full bg-black/40 border border-[#9ec4f7]/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#9ec4f7]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "letter" && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs text-rose-200/60 font-mono">LETTER CATEGORY TITLE</label>
                      <input
                        type="text"
                        value={config.letterTitle}
                        onChange={(e) => updateConfigField("letterTitle", e.target.value)}
                        className="w-full bg-black/40 border border-[#9ec4f7]/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#9ec4f7]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-rose-200/60 font-mono">LETTER CARD HEADER</label>
                      <input
                        type="text"
                        value={config.letterHeader}
                        onChange={(e) => updateConfigField("letterHeader", e.target.value)}
                        className="w-full bg-black/40 border border-[#9ec4f7]/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#9ec4f7]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-rose-200/60 font-mono block">LETTER PARAGRAPHS</label>
                      {config.letterParagraphs.map((para, idx) => (
                        <div key={idx} className="flex gap-2 items-start bg-black/20 p-2.5 rounded border border-white/5">
                          <span className="text-xs text-[#9ec4f7]/50 font-mono mt-2 shrink-0">{idx + 1}.</span>
                          <textarea
                            value={para}
                            onChange={(e) => handleUpdateLetterParagraph(idx, e.target.value)}
                            rows={3}
                            className="flex-1 bg-transparent text-sm text-[#f3e8eb] focus:outline-none resize-none"
                          />
                          <button
                            onClick={() => handleRemoveLetterParagraph(idx)}
                            disabled={config.letterParagraphs.length <= 1}
                            className="text-rose-400 hover:text-rose-300 disabled:opacity-20 transition-opacity mt-1 shrink-0 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={handleAddLetterParagraph}
                        className="w-full py-2 border border-dashed border-[#9ec4f7]/30 text-xs text-[#9ec4f7] hover:bg-[#9ec4f7]/5 rounded flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                      >
                        <Plus className="w-3.5 h-3.5" /> Tambah Paragraf Surat
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "polaroids" && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs text-rose-200/60 font-mono">SCRAPBOOK TITLE</label>
                      <input
                        type="text"
                        value={config.polaroidTitle}
                        onChange={(e) => updateConfigField("polaroidTitle", e.target.value)}
                        className="w-full bg-black/40 border border-[#9ec4f7]/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#9ec4f7]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-rose-200/60 font-mono">SCRAPBOOK SUBTITLE</label>
                      <input
                        type="text"
                        value={config.polaroidSubtitle}
                        onChange={(e) => updateConfigField("polaroidSubtitle", e.target.value)}
                        className="w-full bg-black/40 border border-[#9ec4f7]/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#9ec4f7]"
                      />
                    </div>

                    <div className="space-y-4 pt-2">
                      <label className="text-xs text-rose-200/60 font-mono block">POLAROID PHOTOS (8 PLACES)</label>
                      {polaroids.map((photo, idx) => (
                        <div key={photo.id} className="bg-black/20 p-3 rounded-lg border border-white/5 space-y-2 flex gap-3">
                          <img
                            src={photo.url}
                            alt={`Preview ${idx + 1}`}
                            className="w-16 h-16 object-cover rounded border border-white/10 shrink-0"
                            onError={(e) => {
                              // Fallback placeholder if link breaks
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=150";
                            }}
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-[#9ec4f7] font-serif font-bold">Photo #{idx + 1}</span>
                              <span className="text-[10px] text-white/30 font-mono">Angle: {photo.angle}°</span>
                            </div>
                            <input
                              type="text"
                              value={photo.url}
                              placeholder="Paste direct image URL"
                              onChange={(e) => handleUpdatePolaroid(idx, "url", e.target.value)}
                              className="w-full bg-black/40 border border-[#9ec4f7]/10 rounded px-2 py-1 text-xs text-rose-100/80 focus:outline-none focus:border-[#9ec4f7]"
                            />
                            <input
                              type="text"
                              value={photo.caption}
                              placeholder="Handwritten-style Caption"
                              onChange={(e) => handleUpdatePolaroid(idx, "caption", e.target.value)}
                              className="w-full bg-black/40 border border-[#9ec4f7]/10 rounded px-2 py-1 text-xs text-rose-100/80 focus:outline-none focus:border-[#9ec4f7]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "video" && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs text-rose-200/60 font-mono">VIDEO STAGE TITLE</label>
                      <input
                        type="text"
                        value={config.videoTitle}
                        onChange={(e) => updateConfigField("videoTitle", e.target.value)}
                        className="w-full bg-black/40 border border-[#9ec4f7]/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#9ec4f7]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-rose-200/60 font-mono">VIDEO STAGE SUBTITLE</label>
                      <input
                        type="text"
                        value={config.videoSubtitle}
                        onChange={(e) => updateConfigField("videoSubtitle", e.target.value)}
                        className="w-full bg-black/40 border border-[#9ec4f7]/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#9ec4f7]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-rose-200/60 font-mono">VIDEO SOURCE URL (.mp4 or similar)</label>
                      <input
                        type="text"
                        value={config.videoUrl}
                        onChange={(e) => updateConfigField("videoUrl", e.target.value)}
                        className="w-full bg-black/40 border border-[#9ec4f7]/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#9ec4f7]"
                        placeholder="Paste direct MP4 video link"
                      />
                      <p className="text-[10px] text-white/30 italic">💡 Support MP4, WebM, or online direct streams. Paste video link to see live updates.</p>
                    </div>
                  </div>
                )}

                {activeTab === "wishes" && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs text-rose-200/60 font-mono">WISHES BOARD TITLE</label>
                      <input
                        type="text"
                        value={config.wishesTitle}
                        onChange={(e) => updateConfigField("wishesTitle", e.target.value)}
                        className="w-full bg-black/40 border border-[#9ec4f7]/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#9ec4f7]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-rose-200/60 font-mono">WISHES BOARD SUBTITLE</label>
                      <input
                        type="text"
                        value={config.wishesSubtitle}
                        onChange={(e) => updateConfigField("wishesSubtitle", e.target.value)}
                        className="w-full bg-black/40 border border-[#9ec4f7]/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#9ec4f7]"
                      />
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs text-rose-200/60 font-mono">WISHES BOARD MESSAGES</label>
                        <button
                          onClick={handleAddWish}
                          className="px-2.5 py-1 bg-[#9ec4f7]/15 hover:bg-[#9ec4f7]/25 text-xs text-[#9ec4f7] border border-[#9ec4f7]/40 rounded flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Tambah Ucapan
                        </button>
                      </div>

                      <div className="space-y-2">
                        {wishes.map((wish) => (
                          <div key={wish.id} className="bg-black/25 p-2.5 rounded border border-white/5 space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-[#9ec4f7] font-medium">{wish.name}</span>
                              <button
                                onClick={() => handleRemoveWish(wish.id)}
                                className="text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-xs text-rose-100/80 italic">"{wish.message}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "music" && (
                  <div className="space-y-4">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-xs text-emerald-300 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                      <div>
                        <strong>Musik Latar Romantis:</strong> Musik akan dimainkan secara otomatis begitu tombol "✦ OPEN HER GIFT ✦" atau kado dibuka demi keselarasan pengalaman.
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-rose-200/60 font-mono block">SELECT MUSIC PRESET</label>
                      <div className="grid grid-cols-1 gap-2">
                        {MUSIC_PRESETS.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              updateConfigField("musicUrl", p.url);
                              updateConfigField("musicTitle", p.title);
                            }}
                            className={`p-3 text-left rounded-lg text-xs border transition-all flex items-center justify-between cursor-pointer ${
                              config.musicUrl === p.url 
                                ? "bg-[#9ec4f7]/15 border-[#9ec4f7] text-[#9ec4f7]" 
                                : "bg-black/20 border-white/5 text-rose-100/60 hover:border-[#9ec4f7]/30 hover:text-rose-100"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <Music className="w-3.5 h-3.5" />
                              <span>{p.title}</span>
                            </span>
                            {config.musicUrl === p.url && <span className="text-[10px] tracking-widest font-mono uppercase text-[#9ec4f7]">Active</span>}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-rose-200/60 font-mono">OR CUSTOM MP3 AUDIO LINK</label>
                      <input
                        type="text"
                        value={config.musicUrl}
                        onChange={(e) => updateConfigField("musicUrl", e.target.value)}
                        className="w-full bg-black/40 border border-[#9ec4f7]/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#9ec4f7]"
                        placeholder="Paste direct audio url (.mp3)"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-rose-200/60 font-mono">CUSTOM MUSIC TITLE</label>
                      <input
                        type="text"
                        value={config.musicTitle}
                        onChange={(e) => updateConfigField("musicTitle", e.target.value)}
                        className="w-full bg-black/40 border border-[#9ec4f7]/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#9ec4f7]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom bar */}
              <div className="p-4 border-t border-[#9ec4f7]/15 bg-black/30 flex justify-between items-center text-[11px] text-rose-200/40 shrink-0 font-mono">
                <span>Her Special Day v1.0.0</span>
                <span className="text-rose-300">Auto-saved to localStorage 💾</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

