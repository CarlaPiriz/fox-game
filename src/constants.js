export const TICK_RATE = 2000;
export const ICONS = ["fish", "poop", "weather"];
export const RAIN_CHANCE = 0.23;
export const SCENES = ["day", "rain"];
export const DAY = 45;
export const NIGHT = 10;
export const getNextHungerTime = (clock) =>
  Math.floor(Math.random() * 3) + 5 + clock;
export const getNextDieTime = (clock) =>
  Math.floor(Math.random() * 2) + 5 + clock;
export const getNextPoopTime = (clock) =>
  Math.floor(Math.random() * 3) + 4 + clock;
