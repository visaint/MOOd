/* ── LocalStorage-backed data layer (anonymous, no backend) ── */

export const MOODS = [
  {
    id: "dreamy",
    label: "Dreamy",
    desc: "Soft, warm, hazy. Like waking up to golden hour.",
    prompt:
      "Have something gentle to share? A soft thought, a quiet moment, something that made you smile. Let the warmth carry your words today.",
  },
  {
    id: "neon",
    label: "Neon",
    desc: "Electric, loud, pulsing. Cyber-moo.",
    prompt:
      "Got an energy to release? A bold take, a fierce recommendation, something that made your heart race. Let it glow.",
  },
  {
    id: "vintage",
    label: "Vintage",
    desc: "Sepia-soaked nostalgia. Grain and warmth.",
    prompt:
      "A memory you want to preserve? A story from the past, a relic you love, something that smells like yesterday. Share it before it fades.",
  },
  {
    id: "noir",
    label: "Noir",
    desc: "Dramatic shadows. Black & white truth.",
    prompt:
      "Something real on your mind? A truth you've been carrying, a quiet observation, a moment of clarity. The shadows listen.",
  },
  {
    id: "ethereal",
    label: "Ethereal",
    desc: "Pastel-tinged, floating. Soft dreams.",
    prompt:
      "A dream you want to float away with? A wish for the world, a kindness you want to send out, something light and beautiful.",
  },
  {
    id: "gritty",
    label: "Gritty",
    desc: "Raw, dark, unfiltered. Edge of the herd.",
    prompt:
      "A burden you want to put down? Something raw and honest, a struggle, a small victory. No filter, no polish. Just you.",
  },
  {
    id: "chrome",
    label: "Chrome",
    desc: "Cold, reflective, sharp. Digital shine.",
    prompt:
      "A recommendation for the future? A piece of media that changed you, a tool you love, something sharp and new. Pass it forward.",
  },
] as const;

/* ── 7 SPECIAL MOODS — unlock one per day (CET midnight) ── */
export const SPECIAL_MOODS = [
  {
    id: "comic",
    label: "Comic Chaos",
    desc: "Pop-art explosion. Halftone dreams and bold ink.",
    prompt:
      "Life's a comic strip today. Exaggerate, celebrate, make it colourful. What moment deserves a BAM or a POW?",
    releaseDate: "2026-07-07",
  },
  {
    id: "blurred",
    label: "Soft Lens",
    desc: "Out of focus, into feeling. Blur is a kind of honesty.",
    prompt:
      "Not everything needs to be sharp. A vague feeling, a half-memory, something you can't quite name. Let it stay blurry.",
    releaseDate: "2026-07-08",
  },
  {
    id: "terminal",
    label: "Green Screen",
    desc: "CRT glow. Phosphor trails. The future as it used to look.",
    prompt:
      "Boot up your thoughts. A log entry, a status update, a line of code that changed you. Keep it brief. Keep it real.",
    releaseDate: "2026-07-09",
  },
  {
    id: "pixel",
    label: "8-bit Dream",
    desc: "Blocky, chunky, full of heart. Like your first video game.",
    prompt:
      "Remember when things were simpler? A childhood ritual, a level you never beat, a joy that fits in 8 bits. Press start.",
    releaseDate: "2026-07-10",
  },
  {
    id: "glitch",
    label: "Data Corrupt",
    desc: "Broken signals, beautiful accidents. The error is the art.",
    prompt:
      "Something that broke you open? A mistake that became a gift, a plan that fell apart and revealed something better. Celebrate the glitch.",
    releaseDate: "2026-07-11",
  },
  {
    id: "vhs",
    label: "Tape Fade",
    desc: "Worn magnetic memory. Tracking lines and time-worn colour.",
    prompt:
      "A memory you've watched so many times the tape is wearing thin. Something you recorded, something you can't let go of. Rewind and share.",
    releaseDate: "2026-07-12",
  },
  {
    id: "watercolor",
    label: "Wash \u0026 Flow",
    desc: "Soft paint on rough paper. Bleeding edges, gentle truths.",
    prompt:
      "Something delicate you want to send into the world? A wish, a apology, a love letter to a stranger. Let the colour bleed.",
    releaseDate: "2026-07-13",
  },
] as const;

export type MoodId =
  | (typeof MOODS)[number]["id"]
  | (typeof SPECIAL_MOODS)[number]["id"];

export type SpecialMood = (typeof SPECIAL_MOODS)[number];

export type Post = {
  id: string;
  image: string;
  images?: string[];
  caption: string;
  moodId: MoodId;
  authorId: string;
  authorName: string;
  authorColor: string;
  timestamp: number;
  likes: number;
};

export type Comment = {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorColor: string;
  text: string;
  timestamp: number;
};

export type UserIdentity = {
  id: string;
  name: string;
  color: string;
};

/* ── constants ── */
const STORAGE_POSTS = "mood_posts_v4";
const STORAGE_COMMENTS = "mood_comments_v4";
const STORAGE_USER = "mood_user_v3";
const STORAGE_LIKES = "mood_likes_v4";
const STORAGE_SEEDED = "mood_seeded_v4";

const USER_NAMES = [
  "Anonymous Cow",
  "Mystic Moo",
  "Digital Hoof",
  "Pasture Ghost",
  "Neon Bovine",
  "Chrome Calf",
  "Velvet Udder",
  "Crystal Cow",
  "Hologram Herd",
  "Pixel Paddock",
  "Daisy Chain",
  "Cloud Grazer",
  "Moon Moo",
  "Spectral Steer",
  "Iridescent Ox",
  "Bessie 2.0",
  "Glitch Grazer",
  "Aura Bovine",
  "Nebula Cow",
  "Prism Paddock",
];

const AVATAR_COLORS = [
  "from-sky-300 to-purple-400",
  "from-green-300 to-sky-400",
  "from-purple-300 to-green-400",
  "from-pink-300 to-sky-400",
  "from-amber-300 to-green-400",
  "from-cyan-300 to-purple-400",
  "from-rose-300 to-indigo-400",
  "from-lime-300 to-teal-400",
];

/* ── Helpers ── */
function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function randomAuthor() {
  return {
    id: uid(),
    name: USER_NAMES[Math.floor(Math.random() * USER_NAMES.length)],
    color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
  };
}

/* Generate 2 extra related picsum images for the photo stack — always returns at least 2 */
function generateExtraImages(mainImage: string): string[] {
  if (mainImage.includes("picsum.photos/seed/")) {
    const match = mainImage.match(/\/seed\/([^/]+)\/(\d+)\/(\d+)/);
    if (match) {
      const [, seed, w, h] = match;
      const hNum = parseInt(h);
      return [
        mainImage
          .replace(new RegExp(`/seed/${seed}/`), "/seed/" + seed + "-alt/")
          .replace(`/${h}`, `/${hNum - 60}`),
        mainImage
          .replace(new RegExp(`/seed/${seed}/`), "/seed/" + seed + "-more/")
          .replace(`/${h}`, `/${hNum + 40}`),
      ];
    }
  }
  /* For CDN / data-URL / any other URL, generate deterministic fallback picsum URLs */
  let hash = 0;
  for (let i = 0; i < mainImage.length; i++) {
    hash = (hash << 5) - hash + mainImage.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash).toString(36);
  const h1 = 320 + (Math.abs(hash) % 200);
  const h2 = 300 + (Math.abs(hash * 7 + 13) % 180);
  return [
    `https://picsum.photos/seed/${seed}-alt/600/${h1}`,
    `https://picsum.photos/seed/${seed}-more/600/${h2}`,
  ];
}

/* ── Daily mood — changes at midnight CET ── */
export function getDailyMood(): {
  index: number;
  mood: (typeof MOODS)[number];
} {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [year, month, day] = fmt.format(new Date()).split("-").map(Number);
  const epoch = new Date(2026, 0, 1);
  const today = new Date(year, month - 1, day);
  const diff = Math.floor((today.getTime() - epoch.getTime()) / 86_400_000);
  const index = ((diff % 7) + 7) % 7;
  return { index, mood: MOODS[index] };
}

/* ── CET date helper ── */
export function getCETDateString(): string {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(new Date());
}

/* ── Return special moods whose release date has passed ── */
export function getUnlockedSpecialMoods(): SpecialMood[] {
  const today = getCETDateString();
  return (SPECIAL_MOODS as unknown as SpecialMood[]).filter(
    (m) => today >= m.releaseDate,
  );
}

export function getMoodById(
  id: string,
): (typeof MOODS)[number] | SpecialMood | undefined {
  return (
    MOODS.find((m) => m.id === id) ??
    (SPECIAL_MOODS as unknown as SpecialMood[]).find((m) => m.id === id)
  );
}

/* ── User identity ── */
export function getOrCreateUser(): UserIdentity {
  if (typeof window === "undefined") {
    return { id: "ssr", name: "Server", color: AVATAR_COLORS[0] };
  }
  const raw = localStorage.getItem(STORAGE_USER);
  if (raw) {
    try {
      return JSON.parse(raw) as UserIdentity;
    } catch {
      /* fall through */
    }
  }
  const user: UserIdentity = {
    id: uid(),
    name: USER_NAMES[Math.floor(Math.random() * USER_NAMES.length)],
    color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
  };
  localStorage.setItem(STORAGE_USER, JSON.stringify(user));
  return user;
}

/* ── Posts ── */
export function getPosts(): Post[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_POSTS);
    return raw ? (JSON.parse(raw) as Post[]) : [];
  } catch {
    return [];
  }
}

export function createPost(
  image: string,
  caption: string,
  moodId: MoodId,
  author: UserIdentity,
): Post {
  const post: Post = {
    id: uid(),
    image,
    images: [image, ...generateExtraImages(image)],
    caption,
    moodId,
    authorId: author.id,
    authorName: author.name,
    authorColor: author.color,
    timestamp: Date.now(),
    likes: 0,
  };
  const posts = getPosts();
  posts.unshift(post);
  localStorage.setItem(STORAGE_POSTS, JSON.stringify(posts));
  return post;
}

/* ── Likes ── */
export function hasLiked(postId: string, userId: string): boolean {
  if (typeof window === "undefined") return false;
  const raw = localStorage.getItem(STORAGE_LIKES);
  if (!raw) return false;
  try {
    const map: Record<string, string[]> = JSON.parse(raw);
    return (map[postId] ?? []).includes(userId);
  } catch {
    return false;
  }
}

export function toggleLike(postId: string, userId: string): boolean {
  if (typeof window === "undefined") return false;
  const raw = localStorage.getItem(STORAGE_LIKES) || "{}";
  const map: Record<string, string[]> = JSON.parse(raw);
  const arr = map[postId] ?? [];
  const idx = arr.indexOf(userId);
  const liked = idx === -1;
  if (liked) arr.push(userId);
  else arr.splice(idx, 1);
  map[postId] = arr;
  localStorage.setItem(STORAGE_LIKES, JSON.stringify(map));

  const posts = getPosts();
  const post = posts.find((p) => p.id === postId);
  if (post) {
    post.likes = arr.length;
    localStorage.setItem(STORAGE_POSTS, JSON.stringify(posts));
  }
  return liked;
}

export function getPostLikes(postId: string): number {
  const posts = getPosts();
  return posts.find((p) => p.id === postId)?.likes ?? 0;
}

/* ── Comments ── */
export function getComments(postId: string): Comment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_COMMENTS);
    if (!raw) return [];
    const all: Record<string, Comment[]> = JSON.parse(raw);
    return (all[postId] ?? []).sort((a, b) => a.timestamp - b.timestamp);
  } catch {
    return [];
  }
}

export function addComment(
  postId: string,
  text: string,
  author: UserIdentity,
): Comment {
  const c: Comment = {
    id: uid(),
    postId,
    authorId: author.id,
    authorName: author.name,
    authorColor: author.color,
    text,
    timestamp: Date.now(),
  };
  const raw = localStorage.getItem(STORAGE_COMMENTS) || "{}";
  const all: Record<string, Comment[]> = JSON.parse(raw);
  if (!all[postId]) all[postId] = [];
  all[postId].push(c);
  localStorage.setItem(STORAGE_COMMENTS, JSON.stringify(all));
  return c;
}

/* ═══════════════════════════════════════════════════════════
   SEED DATA — 4 example posts per mood = 28 total
   ═══════════════════════════════════════════════════════════ */

const CDN = "https://cdn.wonder.so/images/019f2c90-3cef-7146-9160-6b7da48066ff";

type SeedEntry = {
  image: string;
  caption: string;
  moodId: MoodId;
  name: string;
  color: string;
  tsOffset: number;
};

const SEED_DATA: SeedEntry[] = [
  /* ── DREAMY (golden amber) ── */
  {
    image: `${CDN}/e627e698ef16f89e2d3d9610f00dfcf2b7791c122f218379896219da097520af.jpg`,
    caption: "soft pasture hours before the world wakes up 🌿",
    moodId: "dreamy",
    name: "Cloud Grazer",
    color: "from-amber-300 to-green-400",
    tsOffset: 3,
  },
  {
    image: "https://picsum.photos/seed/dreamy-fog/600/920",
    caption: "fog rolling over the hills at dawn. nothing else matters.",
    moodId: "dreamy",
    name: "Mystic Moo",
    color: "from-sky-300 to-purple-400",
    tsOffset: 7,
  },
  {
    image: "https://picsum.photos/seed/dreamy-golden/600/780",
    caption: "golden light through the barn window. warmest moment of the day.",
    moodId: "dreamy",
    name: "Daisy Chain",
    color: "from-green-300 to-sky-400",
    tsOffset: 14,
  },
  {
    image: "https://picsum.photos/seed/dreamy-blanket/600/850",
    caption: "warm blankets and slow mornings. the herd can wait.",
    moodId: "dreamy",
    name: "Aura Bovine",
    color: "from-purple-300 to-green-400",
    tsOffset: 22,
  },

  /* ── Dreamy — poetry & stories ── */
  {
    image: "https://picsum.photos/seed/dreamy-poem/600/800",
    caption:
      "the morning light / pours like honey / over everything / i want to remember / this feeling",
    moodId: "dreamy",
    name: "Cloud Grazer",
    color: "from-amber-300 to-green-400",
    tsOffset: 40,
  },
  {
    image: "https://picsum.photos/seed/dreamy-wake/600/860",
    caption:
      "Woke up at 5am by accident. Sat on the porch for an hour watching the mist lift off the field. Didn't check my phone once. Felt like the only person in the world.",
    moodId: "dreamy",
    name: "Mystic Moo",
    color: "from-sky-300 to-purple-400",
    tsOffset: 55,
  },
  {
    image: "https://picsum.photos/seed/dreamy-milk/600/740",
    caption:
      "If you haven't listened to 'Milk \u0026 Honey' by Alt\u0131n G\u00fcn, do yourself a favour. It's the sonic equivalent of a warm blanket.",
    moodId: "dreamy",
    name: "Daisy Chain",
    color: "from-green-300 to-sky-400",
    tsOffset: 68,
  },
  {
    image: "https://picsum.photos/seed/dreamy-plant/600/790",
    caption:
      "Got myself a Monstera today. Named her Fernanda. We sat on the porch and watched the sunset together. She's a good listener.",
    moodId: "dreamy",
    name: "Cloud Grazer",
    color: "from-amber-300 to-green-400",
    tsOffset: 82,
  },

  /* ── NEON (hot pink) ── */
  {
    image: `${CDN}/55d7c92ae232e0b8ced14b12606b903d08af52255e96819894370a0e89248b06.jpg`,
    caption: "strawberry milk under blacklight. it's a vibe 🍓",
    moodId: "neon",
    name: "Pixel Paddock",
    color: "from-pink-300 to-sky-400",
    tsOffset: 2,
  },
  {
    image: "https://picsum.photos/seed/neon-puddle/600/720",
    caption: "neon signs reflecting in puddles. the city hums electric 💜",
    moodId: "neon",
    name: "Neon Bovine",
    color: "from-cyan-300 to-purple-400",
    tsOffset: 6,
  },
  {
    image: "https://picsum.photos/seed/neon-cyber/600/880",
    caption: "cyber-moo. the future is pink and nobody is ready.",
    moodId: "neon",
    name: "Glitch Grazer",
    color: "from-rose-300 to-indigo-400",
    tsOffset: 13,
  },
  {
    image: "https://picsum.photos/seed/neon-glitch/600/760",
    caption: "4am in the digital district. everything glows.",
    moodId: "neon",
    name: "Hologram Herd",
    color: "from-pink-300 to-sky-400",
    tsOffset: 19,
  },

  /* ── Neon — poetry & stories ── */
  {
    image: "https://picsum.photos/seed/neon-poem/600/760",
    caption:
      "the city never sleeps / but i do / tangled in fiber optic vines / dreaming in rgb",
    moodId: "neon",
    name: "Pixel Paddock",
    color: "from-pink-300 to-sky-400",
    tsOffset: 38,
  },
  {
    image: "https://picsum.photos/seed/neon-arcade/600/840",
    caption:
      "The arcade on 42nd Street still has a working Dance Dance Revolution machine from 2001. Went there at 2am with strangers. We're all friends now. The glow made everyone look like angels.",
    moodId: "neon",
    name: "Glitch Grazer",
    color: "from-rose-300 to-indigo-400",
    tsOffset: 52,
  },
  {
    image: "https://picsum.photos/seed/neon-white/600/720",
    caption:
      "Play 'Neon White'. The soundtrack alone is worth it. It's like if a rave and a parkour competition had a baby.",
    moodId: "neon",
    name: "Hologram Herd",
    color: "from-pink-300 to-sky-400",
    tsOffset: 63,
  },
  {
    image: "https://picsum.photos/seed/neon-skate/600/800",
    caption:
      "Tried roller skating for the first time in 15 years. Fell 7 times. Laughed until my stomach hurt. The music was loud, the concrete was rough, life was good.",
    moodId: "neon",
    name: "Neon Bovine",
    color: "from-cyan-300 to-purple-400",
    tsOffset: 78,
  },

  /* ── VINTAGE (burnt orange / sepia) ── */
  {
    image: `${CDN}/1d9e1756abd456a3bd7a09e96eb8d1f5fc121331021e3c1c353178d332138711.jpg`,
    caption: "cow print everything. it's a lifestyle 🐄✨",
    moodId: "vintage",
    name: "Bessie 2.0",
    color: "from-green-300 to-sky-400",
    tsOffset: 26,
  },
  {
    image: "https://picsum.photos/seed/vintage-thrift/600/820",
    caption: "found this at the thrift store. 1999 never left me.",
    moodId: "vintage",
    name: "Daisy Chain",
    color: "from-amber-300 to-green-400",
    tsOffset: 34,
  },
  {
    image: "https://picsum.photos/seed/vintage-grain/600/690",
    caption: "film grain and slow dances. the good kind of static.",
    moodId: "vintage",
    name: "Velvet Udder",
    color: "from-purple-300 to-green-400",
    tsOffset: 42,
  },
  {
    image: "https://picsum.photos/seed/vintage-summer/600/910",
    caption: "summer 1999 captured on a disposable. smells like sunscreen.",
    moodId: "vintage",
    name: "Prism Paddock",
    color: "from-cyan-300 to-purple-400",
    tsOffset: 50,
  },

  /* ── Vintage — poetry & stories ── */
  {
    image: "https://picsum.photos/seed/vintage-photo/600/780",
    caption:
      "the photograph / is yellow at the edges / but the smile / is still in colour",
    moodId: "vintage",
    name: "Bessie 2.0",
    color: "from-green-300 to-sky-400",
    tsOffset: 60,
  },
  {
    image: "https://picsum.photos/seed/vintage-recipe/600/880",
    caption:
      "Found my grandmother's recipe box yesterday. Her handwriting is the most beautiful thing I own now. Made her apple pie. Burnt it a little. She would've said 'that's how you know it's homemade'.",
    moodId: "vintage",
    name: "Velvet Udder",
    color: "from-purple-300 to-green-400",
    tsOffset: 72,
  },
  {
    image: "https://picsum.photos/seed/vintage-paris/600/690",
    caption:
      "Watch 'Midnight in Paris' if you haven't. The most romantic thing ever made about being nostalgic for a time you never lived in.",
    moodId: "vintage",
    name: "Prism Paddock",
    color: "from-cyan-300 to-purple-400",
    tsOffset: 85,
  },
  {
    image: "https://picsum.photos/seed/vintage-book/600/820",
    caption:
      "Found a beat-up copy of 'The House in the Cerulean Sea' at a thrift store. It's the literary equivalent of a warm hug. Read it in one sitting on a park bench.",
    moodId: "vintage",
    name: "Velvet Udder",
    color: "from-purple-300 to-green-400",
    tsOffset: 95,
  },

  /* ── NOIR (charcoal / stark b&w) ── */
  {
    image: "https://picsum.photos/seed/noir-city/600/880",
    caption: "the city breathes in monochrome tonight. shadows cut deep.",
    moodId: "noir",
    name: "Moon Moo",
    color: "from-rose-300 to-indigo-400",
    tsOffset: 5,
  },
  {
    image: "https://picsum.photos/seed/noir-rain/600/740",
    caption: "rain on asphalt. a single streetlight. that's the whole mood.",
    moodId: "noir",
    name: "Spectral Steer",
    color: "from-lime-300 to-teal-400",
    tsOffset: 11,
  },
  {
    image: "https://picsum.photos/seed/noir-shadow/600/860",
    caption: "shadows tell the truth. the rest is just noise.",
    moodId: "noir",
    name: "Pasture Ghost",
    color: "from-sky-300 to-purple-400",
    tsOffset: 18,
  },
  {
    image: "https://picsum.photos/seed/noir-train/600/720",
    caption: "midnight train. empty platform. one way ticket.",
    moodId: "noir",
    name: "Crystal Cow",
    color: "from-green-300 to-sky-400",
    tsOffset: 27,
  },

  /* ── Noir — poetry & stories ── */
  {
    image: "https://picsum.photos/seed/noir-streetlight/600/820",
    caption:
      "the streetlight / knows more secrets / than any confessional / and it never tells",
    moodId: "noir",
    name: "Moon Moo",
    color: "from-rose-300 to-indigo-400",
    tsOffset: 45,
  },
  {
    image: "https://picsum.photos/seed/noir-diner/600/740",
    caption:
      "The diner at 3am is a theatre of lost souls. A man in a trench coat sits in booth 4 every night. Tonight I sat across from him. He said 'first time?' We talked until dawn.",
    moodId: "noir",
    name: "Spectral Steer",
    color: "from-lime-300 to-teal-400",
    tsOffset: 58,
  },
  {
    image: "https://picsum.photos/seed/noir-chandler/600/860",
    caption:
      "Read anything by Raymond Chandler. Start with 'The Big Sleep'. It's the blueprint for every detective story you've ever loved.",
    moodId: "noir",
    name: "Pasture Ghost",
    color: "from-sky-300 to-purple-400",
    tsOffset: 70,
  },

  /* ── ETHEREAL (lavender / violet) ── */
  {
    image: `${CDN}/31d925c5a73cb1ff0d2eaa10ad8e4ba9d75386a5ee59db57d78f04c72cc8b235.jpg`,
    caption: "head in the clouds, hooves in the grass ☁️",
    moodId: "ethereal",
    name: "Aura Bovine",
    color: "from-green-300 to-sky-400",
    tsOffset: 8,
  },
  {
    image: "https://picsum.photos/seed/ethereal-pastel/600/790",
    caption: "pastel skies and the quietest thoughts. floating through today.",
    moodId: "ethereal",
    name: "Hologram Herd",
    color: "from-purple-300 to-green-400",
    tsOffset: 16,
  },
  {
    image: "https://picsum.photos/seed/ethereal-lavender/600/840",
    caption: "floating through lavender fields. reality can wait.",
    moodId: "ethereal",
    name: "Nebula Cow",
    color: "from-cyan-300 to-purple-400",
    tsOffset: 24,
  },
  {
    image: "https://picsum.photos/seed/ethereal-dream/600/710",
    caption: "dreams feel closer here. between waking and sleeping.",
    moodId: "ethereal",
    name: "Crystal Cow",
    color: "from-pink-300 to-sky-400",
    tsOffset: 33,
  },

  /* ── Ethereal — poetry & stories ── */
  {
    image: "https://picsum.photos/seed/ethereal-star/600/790",
    caption:
      "i am made / of stardust and / half-remembered dreams / and the space between / heartbeats",
    moodId: "ethereal",
    name: "Aura Bovine",
    color: "from-green-300 to-sky-400",
    tsOffset: 48,
  },
  {
    image: "https://picsum.photos/seed/ethereal-sound/600/840",
    caption:
      "Went to a sound bath meditation for the first time. The crystal bowls made frequencies I could feel in my teeth. For a moment I forgot my own name. It was the most peaceful I've ever been.",
    moodId: "ethereal",
    name: "Hologram Herd",
    color: "from-purple-300 to-green-400",
    tsOffset: 62,
  },
  {
    image: "https://picsum.photos/seed/ethereal-ambient/600/710",
    caption:
      "If you like ambient music, listen to 'Music for Nine Postcards' by Hiroshi Yoshimura. It sounds like floating through a greenhouse at dawn.",
    moodId: "ethereal",
    name: "Nebula Cow",
    color: "from-cyan-300 to-purple-400",
    tsOffset: 77,
  },
  {
    image: "https://picsum.photos/seed/ethereal-read/600/850",
    caption:
      "Best reading spot: the botanical gardens greenhouse. Warm, humid, surrounded by ferns. The words just melt into you. Finished an entire novel without moving.",
    moodId: "ethereal",
    name: "Nebula Cow",
    color: "from-cyan-300 to-purple-400",
    tsOffset: 90,
  },

  /* ── GRITTY (olive / rust) ── */
  {
    image: "https://picsum.photos/seed/gritty-concrete/600/800",
    caption: "concrete and rust. the real stuff. no filter needed.",
    moodId: "gritty",
    name: "Glitch Grazer",
    color: "from-rose-300 to-indigo-400",
    tsOffset: 10,
  },
  {
    image: "https://picsum.photos/seed/gritty-industrial/600/750",
    caption: "late night in the industrial district. raw energy.",
    moodId: "gritty",
    name: "Pasture Ghost",
    color: "from-green-300 to-sky-400",
    tsOffset: 20,
  },
  {
    image: "https://picsum.photos/seed/gritty-boots/600/870",
    caption: "worn boots and diesel. this is where the real work happens.",
    moodId: "gritty",
    name: "Moon Moo",
    color: "from-amber-300 to-green-400",
    tsOffset: 31,
  },
  {
    image: "https://picsum.photos/seed/gritty-edge/600/730",
    caption: "the edge of the herd. nobody goes here. I like it.",
    moodId: "gritty",
    name: "Digital Hoof",
    color: "from-sky-300 to-purple-400",
    tsOffset: 44,
  },

  /* ── Gritty — poetry & stories ── */
  {
    image: "https://picsum.photos/seed/gritty-rust/600/800",
    caption:
      "rust remembers / what paint forgets / every scar / tells the truth",
    moodId: "gritty",
    name: "Glitch Grazer",
    color: "from-rose-300 to-indigo-400",
    tsOffset: 56,
  },
  {
    image: "https://picsum.photos/seed/gritty-warehouse/600/750",
    caption:
      "The warehouse district at 4am is a different planet. Broken glass sparkles like constellations. A stray dog walked beside me for six blocks. We didn't speak. We didn't need to.",
    moodId: "gritty",
    name: "Digital Hoof",
    color: "from-sky-300 to-purple-400",
    tsOffset: 74,
  },
  {
    image: "https://picsum.photos/seed/gritty-florida/600/870",
    caption:
      "Watch 'The Florida Project'. It's raw, it's beautiful, it'll break your heart and put it back together in the wrong order.",
    moodId: "gritty",
    name: "Pasture Ghost",
    color: "from-green-300 to-sky-400",
    tsOffset: 88,
  },

  /* ── CHROME (ice blue / metallic) ── */
  {
    image: `${CDN}/90d941b19c45a773dc0565c35a61a500cd35aaba145bec886eadb3536e995dd5.jpg`,
    caption: "found the exact colour of my brain today. iridescent. 📸",
    moodId: "chrome",
    name: "Chrome Calf",
    color: "from-sky-300 to-purple-400",
    tsOffset: 4,
  },
  {
    image: "https://picsum.photos/seed/chrome-reflect/600/830",
    caption: "reflective surfaces, sharp edges. the future is geometric.",
    moodId: "chrome",
    name: "Crystal Cow",
    color: "from-cyan-300 to-purple-400",
    tsOffset: 12,
  },
  {
    image: "https://picsum.photos/seed/chrome-dawn/600/770",
    caption: "digital dawn, cold and clear. everything is possible.",
    moodId: "chrome",
    name: "Iridescent Ox",
    color: "from-green-300 to-sky-400",
    tsOffset: 21,
  },
  {
    image: "https://picsum.photos/seed/chrome-glass/600/890",
    caption: "silver and glass. the future runs on chrome.",
    moodId: "chrome",
    name: "Prism Paddock",
    color: "from-purple-300 to-green-400",
    tsOffset: 35,
  },

  /* ── Chrome — poetry & stories ── */
  {
    image: "https://picsum.photos/seed/chrome-screen/600/830",
    caption:
      "i am a screen / reflecting light / from a star / that died / before i was born",
    moodId: "chrome",
    name: "Chrome Calf",
    color: "from-sky-300 to-purple-400",
    tsOffset: 46,
  },
  {
    image: "https://picsum.photos/seed/chrome-taxi/600/770",
    caption:
      "The self-driving taxi took me across the bridge at sunset. The city looked like a circuit board. The AI said 'beautiful, isn't it?' I still don't know if that was programmed or real.",
    moodId: "chrome",
    name: "Iridescent Ox",
    color: "from-green-300 to-sky-400",
    tsOffset: 65,
  },
  {
    image: "https://picsum.photos/seed/chrome-afx/600/890",
    caption:
      "Listen to 'Selected Ambient Works 85-92' by Aphex Twin. It sounds like what the future felt like in 1992. Somehow it still sounds like tomorrow.",
    moodId: "chrome",
    name: "Prism Paddock",
    color: "from-purple-300 to-green-400",
    tsOffset: 80,
  },
  {
    image: "https://picsum.photos/seed/chrome-her/600/770",
    caption:
      "Watch 'Her' by Spike Jonze. It's a movie about falling in love with an AI. It'll make you feel things about your devices you never expected. I cried for an hour.",
    moodId: "chrome",
    name: "Chrome Calf",
    color: "from-sky-300 to-purple-400",
    tsOffset: 94,
  },
];

/* ═══════════════════════════════════════════════════════════
   SPECIAL SEED DATA — 4 posts per special mood
   ═══════════════════════════════════════════════════════════ */

const SPECIAL_SEED_DATA: SeedEntry[] = [
  /* ── COMIC (pop-art) ── */
  {
    image: "https://picsum.photos/seed/comic-bam/600/820",
    caption:
      "BAM! the morning hit me like a panel from a silver-age comic. today is going to be primary-coloured.",
    moodId: "comic",
    name: "Neon Bovine",
    color: "from-pink-300 to-sky-400",
    tsOffset: 2,
  },
  {
    image: "https://picsum.photos/seed/comic-pop/600/740",
    caption:
      "everything is louder in a comic. the coffee, the sunlight, the way she laughed. i want to draw a sound effect over my whole day.",
    moodId: "comic",
    name: "Pixel Paddock",
    color: "from-cyan-300 to-purple-400",
    tsOffset: 6,
  },
  {
    image: "https://picsum.photos/seed/comic-splash/600/880",
    caption:
      "a splash page kind of day. colours everywhere, no panel can contain this energy. SHOOOOM.",
    moodId: "comic",
    name: "Glitch Grazer",
    color: "from-rose-300 to-indigo-400",
    tsOffset: 14,
  },
  {
    image: "https://picsum.photos/seed/comic-zap/600/760",
    caption:
      "the sunset looked like a ben-day dot pattern. i think i'm seeing the world through a silver-age lens now and i don't want it to stop.",
    moodId: "comic",
    name: "Hologram Herd",
    color: "from-pink-300 to-sky-400",
    tsOffset: 22,
  },

  /* ── BLURRED (soft focus) ── */
  {
    image: "https://picsum.photos/seed/blur-street/600/800",
    caption:
      "the city is a watercolour out of focus. i can't read the signs but i understand everything.",
    moodId: "blurred",
    name: "Aura Bovine",
    color: "from-purple-300 to-green-400",
    tsOffset: 3,
  },
  {
    image: "https://picsum.photos/seed/blur-garden/600/720",
    caption:
      "i took off my glasses in the garden and the flowers became impressionist paintings. sometimes clarity is overrated.",
    moodId: "blurred",
    name: "Mystic Moo",
    color: "from-sky-300 to-purple-400",
    tsOffset: 10,
  },
  {
    image: "https://picsum.photos/seed/blur-rain/600/850",
    caption:
      "rain on the window blurs the world into something kinder. every sharp edge turns soft. every colour runs into the next.",
    moodId: "blurred",
    name: "Cloud Grazer",
    color: "from-green-300 to-sky-400",
    tsOffset: 18,
  },
  {
    image: "https://picsum.photos/seed/blur-lights/600/780",
    caption:
      "i asked my therapist if she wanted to see the blurry photo i took of the streetlights. she said 'that's how most of us feel'. fair enough.",
    moodId: "blurred",
    name: "Daisy Chain",
    color: "from-amber-300 to-green-400",
    tsOffset: 28,
  },

  /* ── TERMINAL (CRT green) ── */
  {
    image: "https://picsum.photos/seed/term-log/600/820",
    caption:
      "> LOAD MEMORY\n> ..\n> sunrise over a foggy field.\n> no known errors.",
    moodId: "terminal",
    name: "Digital Hoof",
    color: "from-green-300 to-sky-400",
    tsOffset: 5,
  },
  {
    image: "https://picsum.photos/seed/term-code/600/740",
    caption:
      "> whoami\n> someone trying their best\n> pwd\n> /home/unknown/but/trying",
    moodId: "terminal",
    name: "Chrome Calf",
    color: "from-sky-300 to-purple-400",
    tsOffset: 13,
  },
  {
    image: "https://picsum.photos/seed/term-grid/600/880",
    caption:
      '> RECOMMENDATION\n> "Master Boot Record - Internet"\n> an album that sounds like a computer trying to feel things. and succeeding.',
    moodId: "terminal",
    name: "Neon Bovine",
    color: "from-cyan-300 to-purple-400",
    tsOffset: 24,
  },
  {
    image: "https://picsum.photos/seed/term-night/600/720",
    caption:
      "> date\n> 3:14 AM\n> feeling\n> wired and awake and full of strange hope",
    moodId: "terminal",
    name: "Glitch Grazer",
    color: "from-rose-300 to-indigo-400",
    tsOffset: 34,
  },

  /* ── PIXEL (8-bit) ── */
  {
    image: "https://picsum.photos/seed/pixel-world/600/860",
    caption:
      "the world looks like an RPG map from above. every street is a corridor. every tree is a sprite. i want to walk into every house and talk to every NPC.",
    moodId: "pixel",
    name: "Pixel Paddock",
    color: "from-pink-300 to-sky-400",
    tsOffset: 7,
  },
  {
    image: "https://picsum.photos/seed/pixel-heart/600/780",
    caption:
      "she gave me a pixel heart. 8x8. red. it meant more than anything i've ever received in 4k.",
    moodId: "pixel",
    name: "Prism Paddock",
    color: "from-purple-300 to-green-400",
    tsOffset: 16,
  },
  {
    image: "https://picsum.photos/seed/pixel-game/600/830",
    caption:
      "PLAYING: LIFE (EASY MODE)\nLEVEL: THE SUMMER YOU TURNED 10\nBOSS: NONE. JUST FRIENDSHIP.",
    moodId: "pixel",
    name: "Moon Moo",
    color: "from-rose-300 to-indigo-400",
    tsOffset: 27,
  },
  {
    image: "https://picsum.photos/seed/pixel-forest/600/710",
    caption:
      "the forest looked like a Zelda screen. i half-expected a heart container to appear when i pushed the log. maybe it did, but not the kind you see.",
    moodId: "pixel",
    name: "Aura Bovine",
    color: "from-green-300 to-sky-400",
    tsOffset: 40,
  },

  /* ── GLITCH (data corrupt) ── */
  {
    image: "https://picsum.photos/seed/glitch-signal/600/790",
    caption:
      "the radio cut in and out on the highway. between the static, a song i haven't heard in ten years. the universe is corrupting beautifully.",
    moodId: "glitch",
    name: "Glitch Grazer",
    color: "from-rose-300 to-indigo-400",
    tsOffset: 9,
  },
  {
    image: "https://picsum.photos/seed/glitch-fracture/600/840",
    caption:
      "something broke today. or something broke open. the line between error and art is thinner than we think.",
    moodId: "glitch",
    name: "Digital Hoof",
    color: "from-sky-300 to-purple-400",
    tsOffset: 19,
  },
  {
    image: "https://picsum.photos/seed/glitch-static/600/730",
    caption:
      "my brain feels like a corrupted JPEG today. blocks of colour where memories should be. honestly? it's kind of beautiful.",
    moodId: "glitch",
    name: "Hologram Herd",
    color: "from-pink-300 to-sky-400",
    tsOffset: 32,
  },
  {
    image: "https://picsum.photos/seed/glitch-screen/600/870",
    caption:
      "the screen flickered and for one frame i saw something i can't describe. a colour that doesn't exist. i've been chasing it ever since.",
    moodId: "glitch",
    name: "Crystal Cow",
    color: "from-green-300 to-sky-400",
    tsOffset: 45,
  },

  /* ── VHS (tape fade) ── */
  {
    image: "https://picsum.photos/seed/vhs-summer/600/820",
    caption:
      "found a tape labelled 'summer 99' in a box. i don't have a VCR anymore but i remember every frame by heart. the magnetic ghosts are real.",
    moodId: "vhs",
    name: "Velvet Udder",
    color: "from-purple-300 to-green-400",
    tsOffset: 11,
  },
  {
    image: "https://picsum.photos/seed/vhs-tracking/600/750",
    caption:
      "the tracking lines are part of the memory now. you can't separate the noise from the feeling. maybe that's how all memories work.",
    moodId: "vhs",
    name: "Pasture Ghost",
    color: "from-sky-300 to-purple-400",
    tsOffset: 22,
  },
  {
    image: "https://picsum.photos/seed/vhs-rewind/600/860",
    caption:
      "i keep rewinding the same week in my head. the one where everything was okay. the tape is worn thin but i can't stop.",
    moodId: "vhs",
    name: "Daisy Chain",
    color: "from-amber-300 to-green-400",
    tsOffset: 35,
  },
  {
    image: "https://picsum.photos/seed/vhs-glow/600/710",
    caption:
      "RECOMMENDATION: 'The Vast of Night' on something with a warm screen. it's a movie that feels like a dream you had about a TV show that never existed.",
    moodId: "vhs",
    name: "Moon Moo",
    color: "from-rose-300 to-indigo-400",
    tsOffset: 50,
  },

  /* ── WATERCOLOR (wash & flow) ── */
  {
    image: "https://picsum.photos/seed/water-wash/600/840",
    caption:
      "i tried to paint the sky today. my brush held too much water and the blue bled everywhere. it looked better than the real sky.",
    moodId: "watercolor",
    name: "Nebula Cow",
    color: "from-cyan-300 to-purple-400",
    tsOffset: 8,
  },
  {
    image: "https://picsum.photos/seed/water-letter/600/780",
    caption:
      "i wrote a letter i'll never send. the ink bled into the paper grain like tears that haven't fallen yet. maybe i'll paint over it tomorrow.",
    moodId: "watercolor",
    name: "Aura Bovine",
    color: "from-green-300 to-sky-400",
    tsOffset: 20,
  },
  {
    image: "https://picsum.photos/seed/water-petals/600/830",
    caption:
      "a wish for everyone today: may your edges soften. may you bleed into the people around you the way colour bleeds on wet paper. beautifully. uncontrollably.",
    moodId: "watercolor",
    name: "Crystal Cow",
    color: "from-pink-300 to-sky-400",
    tsOffset: 33,
  },
  {
    image: "https://picsum.photos/seed/water-tide/600/730",
    caption:
      "RECOMMENDATION: 'Kiki's Delivery Service' on a rainy afternoon. it's a watercolour painting that moves. the whole movie feels like a hug from someone who understands.",
    moodId: "watercolor",
    name: "Daisy Chain",
    color: "from-green-300 to-sky-400",
    tsOffset: 48,
  },
];

/* ── Helpers for comment seeding ── */
const COMMENT_TEXTS = [
  "this is everything ✨",
  "saving this mood forever",
  "the aesthetic is immaculate",
  "mood of the day fr",
  "how do you capture this so well??",
  "vibes are immaculate",
  "this speaks to my soul",
  "herd mental 🐄",
  "the colours are unreal",
  "this exact feeling",
  "stop it, this is too good",
  "obsessed with this",
  "this reads like a poem i didn't know i needed",
  "the way you put this into words… wow",
  "i felt this one deep in my chest",
  "tried this because of your post. life changing.",
  "ok but where can i find more of this energy?",
  "you have a gift for capturing moments",
  "this is the content i signed up for",
  "i want to frame this and hang it on my wall",
  "literally sent this to everyone i know",
  "tearing up a little not gonna lie",
  "bookmarked this for later. essential vibes.",
  "the herd needed to hear this today",
  "your eye for detail is unmatched",
  "this feels like a memory i haven't made yet",
  "can we talk about how perfect this is?",
  "i took a screenshot. i don't even know why. it just felt right.",
  "the way the light hits in this photo is unreal",
  "this caption hit different at 2am",
  "adding this to my vision board immediately",
  "you put into words what i've been feeling for weeks",
  "the composition of this is chef's kiss",
  "wait i need to try this recommendation asap",
  "this whole post feels like a hug",
  "why does this make me emotional?",
];

function seedCommentsForPosts(posts: Post[]): void {
  const existing = localStorage.getItem(STORAGE_COMMENTS);
  const all: Record<string, Comment[]> = existing ? JSON.parse(existing) : {};
  for (const post of posts) {
    if (all[post.id]) continue;
    if (Math.random() > 0.85) continue;
    const count = Math.floor(Math.random() * 4) + 1;
    for (let i = 0; i < count; i++) {
      const a = randomAuthor();
      const c: Comment = {
        id: uid(),
        postId: post.id,
        authorId: a.id,
        authorName: a.name,
        authorColor: a.color,
        text: COMMENT_TEXTS[Math.floor(Math.random() * COMMENT_TEXTS.length)],
        timestamp: post.timestamp + Math.floor(Math.random() * 86_400_000),
      };
      if (!all[post.id]) all[post.id] = [];
      all[post.id].push(c);
    }
  }
  localStorage.setItem(STORAGE_COMMENTS, JSON.stringify(all));
}

/* ── Seed once on first visit ── */
export function seedIfEmpty(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(STORAGE_SEEDED)) return;
  if (getPosts().length > 0) return;

  const now = Date.now();
  const posts: Post[] = SEED_DATA.map((s) => ({
    id: uid(),
    image: s.image,
    images: [s.image, ...generateExtraImages(s.image)],
    caption: s.caption,
    moodId: s.moodId,
    authorId: uid(),
    authorName: s.name,
    authorColor: s.color,
    timestamp: now - s.tsOffset * 3_600_000,
    likes: Math.floor(Math.random() * 90) + 8,
  }));

  /* Also seed any unlocked special moods */
  const unlocked = getUnlockedSpecialMoods();
  const unlockedIds = new Set(unlocked.map((m) => m.id));
  const specialPosts = SPECIAL_SEED_DATA.filter((s) =>
    unlockedIds.has(
      s.moodId as
        | "comic"
        | "blurred"
        | "terminal"
        | "pixel"
        | "glitch"
        | "vhs"
        | "watercolor",
    ),
  ).map((s) => ({
    id: uid(),
    image: s.image,
    images: [s.image, ...generateExtraImages(s.image)],
    caption: s.caption,
    moodId: s.moodId,
    authorId: uid(),
    authorName: s.name,
    authorColor: s.color,
    timestamp: now - s.tsOffset * 3_600_000,
    likes: Math.floor(Math.random() * 70) + 10,
  }));

  const allPosts = [...posts, ...specialPosts];
  localStorage.setItem(STORAGE_POSTS, JSON.stringify(allPosts));
  localStorage.setItem(STORAGE_SEEDED, "1");

  seedCommentsForPosts(allPosts);
}

/* ── Check for newly unlocked special moods on each page load ── */
export function seedSpecialsIfNeeded(): void {
  if (typeof window === "undefined") return;
  const unlocked = getUnlockedSpecialMoods();
  const posts = getPosts();
  const existingIds = new Set(posts.map((p) => p.moodId));
  const now = Date.now();

  const toAdd = SPECIAL_SEED_DATA.filter(
    (s) =>
      unlocked.some((m) => m.id === s.moodId) && !existingIds.has(s.moodId),
  );

  if (toAdd.length === 0) return;

  const newPosts: Post[] = toAdd.map((s) => ({
    id: uid(),
    image: s.image,
    images: [s.image, ...generateExtraImages(s.image)],
    caption: s.caption,
    moodId: s.moodId,
    authorId: uid(),
    authorName: s.name,
    authorColor: s.color,
    timestamp: now - s.tsOffset * 3_600_000,
    likes: Math.floor(Math.random() * 70) + 10,
  }));

  const updated = [...posts, ...newPosts];
  localStorage.setItem(STORAGE_POSTS, JSON.stringify(updated));
  seedCommentsForPosts(newPosts);
}
