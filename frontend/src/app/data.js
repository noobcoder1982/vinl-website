// These are fallback songs used only if the backend server is unreachable.
// For the live site, songs are fetched dynamically from the Render API.
export const FALLBACK_SONGS = [
  {
    id: 1,
    title: "Boom",
    artist: "Suno AI",
    duration: 150,
    imageUrl: "public/covers/cover_4.jpg",
    genre: "Trap",
    audioUrl: "https://res.cloudinary.com/drahjrfdf/video/upload/f_auto,q_auto/v1774630530/BOOM_u4p8sd.mp3"
  },

  {
    id: 2,
    title: "Before I Stay",
    artist: "Suno AI",
    duration: 223,
    imageUrl: "public/covers/cover_5.jpg",
    genre: "Chill",
    audioUrl: "https://res.cloudinary.com/drahjrfdf/video/upload/v1774630523/Before_I_Stay_yyvddu.mp3"
  },

  {
    id: 3,
    title: "Word Slips",
    artist: "Waveform",
    duration: 386,
    imageUrl: "public/covers/cover_1.jpg",
    genre: "Electronic",
    audioUrl: "https://res.cloudinary.com/drahjrfdf/video/upload/v1774630514/World_Slips_Out_Of_My_Hands_o7brzi.mp3"
  },

  {
    id: 4,
    title: "Half-light on your shoulder",
    artist: "Ambient AI",
    duration: 235,
    imageUrl: "public/covers/cover_2.jpg",
    genre: "Ambient",
    audioUrl: "https://res.cloudinary.com/drahjrfdf/video/upload/v1774630519/Half-light_on_your_shoulder_epwijw.mp3"
  },

  {
    id: 5,
    title: "midnight breeze",
    artist: "Nature Beats",
    duration: 262,
    imageUrl: "public/covers/cover_3.jpg",
    genre: "Relax",
    audioUrl: "https://res.cloudinary.com/drahjrfdf/video/upload/v1774630516/Midnight_Breeze_sbco1d.mp3"
  }
];

export const PLAYLISTS = [
{ id: 1, name: "Liked Songs", songIds: [1, 3] },
{ id: 2, name: "Focus & Flow", songIds: [2] }
];

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export const SONGS = FALLBACK_SONGS; // Exported for compatibility with existing imports

export const SYNCED_LYRICS = {
  1: [
    { time: 0, text: "Wait for the drop" },
    { time: 3, text: "Here it comes now" },
    { time: 7, text: "BOOM in the speakers" },
    { time: 10, text: "Feel that low end rumble" },
    { time: 14, text: "Electronic currents flowing" },
    { time: 18, text: "Through the digital veins" },
    { time: 22, text: "Lost in the rhythm" },
    { time: 26, text: "Never coming down" },
    { time: 30, text: "Yeah, we live for this" }
  ],
  2: [
    { time: 0, text: "Soft light through the window" },
    { time: 5, text: "Before I stay another night" },
    { time: 10, text: "The city whispers secrets" },
    { time: 15, text: "In the glow of street lamps" },
    { time: 20, text: "Will you remember my name?" },
    { time: 25, text: "When the sun starts to rise" },
    { time: 30, text: "Lost in the moments we had" }
  ]
};
