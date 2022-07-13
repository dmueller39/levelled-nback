// @flow

export const INACTIVE_COLOR = "#EEEEEE";
export const ACTIVE_COLOR = "grey";

export const DEFAULT_SETTINGS: Settings = {
  nBack: 2,
  rows: 3,
  columns: 3,
  turns: 20,
  positionsEnabled: true,
  colorsEnabled: true,
  colorValues: ["red", "blue", "green", "yellow", "orange", "purple"],
  onDuration: 4000,
  offDuration: 1000,
  progressMap: {
    offset: 0,
    spacing: 3,
    minTurns: 4,
    maxTurns: 20,
    minTurnsPerMinute: 10,
    maxTurnsPerMinute: 10,
    steps: 9,
    minNBack: 1,
    maxNBack: 10,
  },
  weeklyGoal: 7,
};

export type Settings = {
  nBack: number;
  rows: number;
  columns: number;
  turns: number;
  positionsEnabled: boolean;
  colorsEnabled: boolean;
  colorValues: string[];
  onDuration: number;
  offDuration: number;
  debugEnabled?: boolean;
  progressMap: {
    offset: number;
    spacing: number;
    minTurns: number;
    maxTurns: number;
    minTurnsPerMinute: number;
    maxTurnsPerMinute: number;
    steps: number;
    minNBack: number;
    maxNBack: number;
  };
  weeklyGoal: number;
};
