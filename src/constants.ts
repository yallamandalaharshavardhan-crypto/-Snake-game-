import { Track } from "./types";

export const TRACKS: Track[] = [
  {
    id: "1",
    title: "Cyber Synth",
    artist: "Neon Pulse",
    coverUrl: "https://picsum.photos/seed/cyber/400/400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "2",
    title: "Neural Drift",
    artist: "Synth Drift",
    coverUrl: "https://picsum.photos/seed/neural/400/400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "3",
    title: "Neon Cobra",
    artist: "Grid Runner",
    coverUrl: "https://picsum.photos/seed/cobra/400/400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const SPEED_INCREMENT = 2;
export const MIN_SPEED = 60;
