export interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
}

export type Point = {
  x: number;
  y: number;
};

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export type GameState = "IDLE" | "PLAYING" | "PAUSED" | "GAME_OVER";
