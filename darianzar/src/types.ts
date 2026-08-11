export interface PolaroidPhoto {
  id: string;
  url: string;
  caption: string;
  angle: number; // Random-ish tilt angle for realistic display (-15 to 15)
}

export interface WishMessage {
  id: string;
  name: string;
  message: string;
  date: string;
}

export interface AppConfig {
  targetDate: string; // ISO string or YYYY-MM-DDTHH:mm
  title: string;      // e.g. "Her Special Day"
  subtitle: string;   // e.g. "Sesuatu yang indah sedang menunggu dirimu 🌸"
  giftTitle: string;  // e.g. "ADA SESUATU UNTUKMU"
  giftSubtitle: string; // e.g. "Klik kado untuk membukanya"
  letterTitle: string; // e.g. "Happy Birthday"
  letterHeader: string; // e.g. "HAPPY BIRTHDAY SAYANGKUU 🤍"
  letterParagraphs: string[];
  polaroidTitle: string; // e.g. "Our Memories"
  polaroidSubtitle: string; // e.g. "every moment captured in love"
  videoTitle: string; // e.g. "A Moment For You"
  videoSubtitle: string; // e.g. "a special video message"
  videoUrl: string;
  wishesTitle: string; // e.g. "Birthday Wishes"
  wishesSubtitle: string; // e.g. "Happy Birthday, my love 💖"
  finalSlide1: string; // e.g. "HAPPY BIRTHDAY"
  finalSlide2: string; // e.g. "With All My Love"
  finalSlide3: string; // e.g. "Always & Forever"
  musicUrl: string;
  musicTitle: string;
  partnerName: string; // e.g., "SAYANGKUU"
}
