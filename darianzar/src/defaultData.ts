import { AppConfig, PolaroidPhoto, WishMessage } from "./types";

/* ============================================================
   ⭐ CARA MENGGANTI FOTO, VIDEO, DAN MUSIK:
   ============================================================
   1. Letakkan file foto Anda di folder:  assets/fotombg/
   2. Letakkan file video Anda di folder: assets/fibu foto/
   3. Letakkan file musik Anda di folder: assets/sound/
   4. Update path di bawah sesuai nama file Anda.
   5. Untuk foto di "All Memories", cukup taruh di assets/fotombg/
      dan mereka akan muncul otomatis!
   ============================================================ */

// --- FOTO: Ganti path di bawah dengan nama file foto Anda ---
const photo1 = new URL("../assets/fotombg/najmaa4.jpeg", import.meta.url).href;
const photo2 = new URL("../assets/fotombg/najmaa13.jpeg", import.meta.url).href;
const photo3 = new URL("../assets/fotombg/najmaa3.jpeg", import.meta.url).href;
const photo4 = new URL("../assets/fotombg/najmaa1.jpeg", import.meta.url).href;
const photo5 = new URL("../assets/fotombg/najmaa12.jpeg", import.meta.url).href;
const photo6 = new URL("../assets/fotombg/najmaa9.jpeg", import.meta.url).href;
const photo7 = new URL("../assets/fotombg/najmaa7.jpeg", import.meta.url).href;
const photo8 = new URL("../assets/fotombg/najmaa8.jpeg", import.meta.url).href;

// --- VIDEO: Ganti path di bawah dengan nama file video Anda ---
// Gunakan link YouTube atau file .mp4 lokal
const localVideo = new URL("../assets/fibu foto/nazar.mp4", import.meta.url).href;

// --- MUSIK: Ganti path di bawah dengan nama file musik Anda ---
// Bisa pakai file .mp3 lokal atau link dari internet
const localMusic = new URL("../assets/sound/perfect.mp3", import.meta.url).href;

/* ============================================================
   ⭐ CUSTOMIZATION GUIDE - Cara Mengubah Teks:
   ============================================================
   Di bawah ini adalah semua teks yang bisa Anda ubah.
   Cukup ganti teks di dalam tanda petik "..." sesuai keinginan.
   ============================================================ */

export const DEFAULT_CONFIG: AppConfig = {
  // ⏱ TIMER: Atur waktu countdown (default: 1 menit untuk testing)
  targetDate: new Date(Date.now() + 60000).toISOString(), // 1 minute from now for testing

  // 🎯 TITLE HALAMAN UTAMA
  title: "Happy Birthday!!",
  subtitle: "Sesuatu yang indah sedang menunggumu cantikk 💝",

  // 🎁 BAGIAN KADO
  giftTitle: "ADA SESUATU UNTUKMU",
  giftSubtitle: "Klik kado untuk membukanya 🎀",

  // 💌 BAGIAN SURAT
  letterTitle: "Happy Birthday",
  letterHeader: "UNTUK NAJMAKU YANG PALING CANTIK SEDUNIA 💌",
  letterParagraphs: [
    "Selamat ulang tahun untuk orang yang paling spesial di hidupku. Hari ini adalah hari terindah karena pada hari ini, kamu dilahirkan ke dunia.",
    "Aku menyukai semua tentangmu, bersyukur banget bisa bertemu kamu dikehidupanku. Kamu adalah sumber kebahagiaan, inspirasi, cinta terbesarku dan kamu juga yang menghidupkan kembali warna warnaku.",
    "Semoga di usiamu yang baru ini, semua mimpi dan harapanmu menjadi kenyataan. Kamu pantas mendapatkan yang terbaik dalam hidup ini.",
    "Terima kasih sudah menjadi dirimu yang tulus, baik hati, dan selalu membuat hari-hariku lebih bermakna.",
    "Aku mencintaimu, hari ini, esok, dan selamanya. Selamat ulang tahun, cintaku cantikku duniaku semestaku. 💖"
  ],

  // 📸 BAGIAN FOTO POLAROID
  polaroidTitle: "Kenangan Kita",
  polaroidSubtitle: "setiap momen indah yang kita lalui bersama ✨",

  // 🎬 BAGIAN VIDEO
  videoTitle: "Pesan Spesial Untukmu",
  videoSubtitle: "sebuah video penuh cinta untuk hari istimewamu 🎥",
  videoUrl: localVideo,

  // 💬 BAGIAN UCAPAN
  wishesTitle: "Ucapan Ulang Tahun",
  wishesSubtitle: "Selamat ulang tahun, cintaku 💖",

  // 🎠 BAGIAN SLIDE AKHIR
  finalSlide1: "SELAMAT ULANG TAHUN NAJMA CANTIK",
  finalSlide2: "DENGAN SEGALA CINTAKU UNTUKMU",
  finalSlide3: "ALWAYS AND FOREVER",

  // 🎵 BAGIAN MUSIK
  musicUrl: localMusic,
  musicTitle: "Perfect 🎵",

  // 👤 NAMA PASANGAN
  partnerName: "NAJMAA CANTIK ❤️"
};

export const DEFAULT_POLAROIDS: PolaroidPhoto[] = [
  {
    id: "1",
    url: photo1,
    caption: "Foto 1 foto kamu, karena kamu nomor 1",
    angle: -4
  },
  {
    id: "2",
    url: photo2,
    caption: "Dari kecill aja udah cantik bangett",
    angle: 6
  },
  {
    id: "3",
    url: photo3,
    caption: "Kaya ibu dari anak anakku nanti",
    angle: -3
  },
  {
    id: "4",
    url: photo4,
    caption: "Senyummnya maniss bgtt si sayangg",
    angle: 5
  },
  {
    id: "5",
    url: photo5,
    caption: "Aib pun tetep cantikk sayanggg",
    angle: -6
  },
  {
    id: "6",
    url: photo6,
    caption: "Eh eh udah kaya jadi pasutri ajaa",
    angle: 4
  },
  {
    id: "7",
    url: photo7,
    caption: "Uh omaygat mommy najmaa",
    angle: -2
  },
  {
    id: "8",
    url: photo8,
    caption: "Mirip bidadariii",
    angle: 5
  }
];

export const DEFAULT_WISHES: WishMessage[] = [
  {
    id: "1",
    name: "Anzar",
    message: "Happy Birthday my sunshine! Semoga selalu bahagia di sampingku ya, aku sayang bgt sama kamu!",
    date: "10 seconds ago"
  },
  {
    id: "2",
    name: "Sinta",
    message: "Selamat ulang tahun Najmaa! Semoga semua impianmu tahun ini tercapai ya. Di tunggu traktiran baso nya!",
    date: "2 hours ago"
  },
  {
    id: "3",
    name: "Mama Najma",
    message: "Barakallah fii umrik anak manis. Semoga sehat selalu, panjang umur, dan dimudahkan segala urusannya ya sayang. Amin.",
    date: "5 hours ago"
  }
];

export const MUSIC_PRESETS = [
  {
    id: "romantic-guitar",
    title: "Acoustic Guitar Love (Recommended)",
    url: "https://assets.codepen.io/4358584/An+Indie+Folk+Guitar+Track.mp3"
  },
  {
    id: "lofi-dream",
    title: "Mellow Dream Lofi Piano",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    id: "ambient-soft",
    title: "Sweet Ambient Piano Melody",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  }
];
