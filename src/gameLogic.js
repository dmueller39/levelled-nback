// @flow

import shuffle from "./common/shuffle";

export const HIDDEN: ButtonState = 0;
export const DISABLED: ButtonState = 1;
export const NEUTRAL: ButtonState = 2;
export const CORRECT: ButtonState = 3;
export const INCORRECT: ButtonState = 4;

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

export type ButtonState = 0 | 1 | 2 | 3 | 4;

export type Settings = {
  nBack: number,
  rows: number,
  columns: number,
  turns: number,
  positionsEnabled: boolean,
  colorsEnabled: boolean,
  colorValues: string[],
  onDuration: number,
  offDuration: number,
  debugEnabled?: boolean,
  progressMap: {
    offset: number,
    spacing: number,
    minTurns: number,
    maxTurns: number,
    minTurnsPerMinute: number,
    maxTurnsPerMinute: number,
    steps: number,
    minNBack: number,
    maxNBack: number,
  },
  weeklyGoal: number,
};

export type GameLevel = {
  nBack: number,
  rows: number,
  columns: number,
  positionsEnabled: boolean,
  colorsEnabled: boolean,
  colorValues: string[],
  turns: number,
  turnsPerMinute: number,
};

export type GamePlan = {
  nBack: number,
  rows: number,
  columns: number,
  gameTurns: number,
  positions: ?(number[]),
  colors: ?(number[]),
  colorValues: string[],
  onDuration: number,
  offDuration: number,
  isPractice: boolean,
};

export type GameResult = {
  mistakes: number,
  time: number,
  gamePlan: GamePlan,
};

export type GameState = {
  isRunning: boolean,
  currentIndex: number,
  positionButtonState: ButtonState,
  colorButtonState: ButtonState,
  squares: string[],
  mistakes: number,
};

function getEmptyStateSquares(gamePlan: GamePlan): string[] {
  const result = [];
  for (let i = 0; i < gamePlan.rows * gamePlan.columns; i++) {
    result.push("white");
  }
  return result;
}

function getGameIndex(index: number): number {
  if (index % 2 == 0) {
    return index / 2;
  } else {
    return (index - 1) / 2;
  }
}

export function getCurrentIndex(
  gamePlan: GamePlan,
  startTime: number,
  now: number
): number {
  const interval = now - startTime - gamePlan.offDuration;
  if (interval < 0) {
    return -1;
  }
  const base =
    Math.floor(interval / (gamePlan.offDuration + gamePlan.onDuration)) * 2;
  const extra =
    interval % (gamePlan.offDuration + gamePlan.onDuration) >
    gamePlan.onDuration
      ? 1
      : 0;
  return base + extra;
}

function getRandomNBackArray(turns, max, nBack): number[] {
  const matches = turns * (0.2 + Math.random() * 0.1);

  const matchLocations: Array<boolean> = [];

  for (let i = 0; i < turns; i++) {
    if (i < matches) {
      matchLocations.push(true);
    } else {
      matchLocations.push(false);
    }
  }

  const randomMatchLocations = shuffle(matchLocations);

  const result = [];
  for (let i = 0; i < turns + nBack; i++) {
    let position = Math.floor(Math.random() * max);
    if (i >= nBack) {
      if (randomMatchLocations[i - nBack]) {
        position = result[i - nBack];
      } else if (position == result[i - nBack]) {
        position = Math.floor(Math.random() * max);
      }
    }
    result.push(position);
  }
  return result;
}

export function getGamePlan(
  gameLevel: GameLevel,
  isPractice: boolean = false
): GamePlan {
  const {
    nBack,
    turns,
    positionsEnabled,
    colorsEnabled,
    colorValues,
    turnsPerMinute,
  } = gameLevel;
  let { rows, columns } = gameLevel;
  if (!positionsEnabled) {
    rows = 1;
    columns = 1;
  }
  const positions = positionsEnabled
    ? getRandomNBackArray(turns, rows * columns, nBack)
    : null;
  const colors = colorsEnabled
    ? getRandomNBackArray(turns, colorValues.length, nBack)
    : null;

  const onDuration = (60000.0 * 0.8) / turnsPerMinute;
  const offDuration = (60000.0 * 0.2) / turnsPerMinute;
  return {
    isPractice,
    nBack,
    rows,
    columns,
    gameTurns: turns + nBack,
    positions,
    colors,
    colorValues,
    onDuration,
    offDuration,
  };
}

export function getInitialGameState(gamePlan: GamePlan): GameState {
  return {
    isRunning: true,
    currentIndex: -1,
    positionButtonState: gamePlan.positions == null ? HIDDEN : DISABLED,
    colorButtonState: gamePlan.colors == null ? HIDDEN : DISABLED,
    squares: getEmptyStateSquares(gamePlan),
    mistakes: 0,
  };
}

export function getGameStateOnPositionPress(
  gamePlan: GamePlan,
  gameState: GameState,
  index: number
): GameState {
  let { positionButtonState, mistakes } = gameState;
  const { positions } = gamePlan;
  if (positions == null || positionButtonState != NEUTRAL) {
    return gameState;
  }
  const gameIndex = getGameIndex(index);
  if (gameIndex - gamePlan.nBack >= 0) {
    if (positions[gameIndex] == positions[gameIndex - gamePlan.nBack]) {
      positionButtonState = CORRECT;
    } else {
      positionButtonState = INCORRECT;
      mistakes += 1;
    }
  }
  return { ...gameState, positionButtonState, mistakes };
}

export function getGameStateOnColorPress(
  gamePlan: GamePlan,
  gameState: GameState,
  index: number
): GameState {
  let { colorButtonState, mistakes } = gameState;
  const { colors } = gamePlan;
  if (colors == null || colorButtonState != NEUTRAL) {
    return gameState;
  }
  const gameIndex = getGameIndex(index);
  if (gameIndex - gamePlan.nBack >= 0) {
    if (colors[gameIndex] == colors[gameIndex - gamePlan.nBack]) {
      colorButtonState = CORRECT;
    } else {
      colorButtonState = INCORRECT;
      mistakes = mistakes + 1;
    }
  }
  return { ...gameState, colorButtonState, mistakes };
}

export function getGameStateOnTick(
  gamePlan: GamePlan,
  gameState: GameState,
  index: number
): GameState {
  const gameIndex = getGameIndex(index);
  if (gameIndex < 0) {
    return gameState;
  }
  const { positions, colors, colorValues } = gamePlan;
  const squares = getEmptyStateSquares(gamePlan);
  if (index % 2 == 0) {
    let squareIndex = 0;
    if (positions != null) {
      squareIndex = positions[gameIndex];
    }
    if (colors != null && colorValues != null) {
      const colorIndex = colors[gameIndex];
      squares[squareIndex] = colorValues[colorIndex];
    } else {
      squares[squareIndex] = "grey";
    }
  }

  let {
    positionButtonState,
    colorButtonState,
    isRunning,
    mistakes,
  } = gameState;
  if (index != gameState.currentIndex) {
    isRunning = gameIndex < gamePlan.gameTurns;
    const needsMore = gameIndex < gamePlan.nBack;
    if (!isRunning || needsMore) {
      colorButtonState = gamePlan.colors == null ? HIDDEN : DISABLED;
      positionButtonState = gamePlan.positions == null ? HIDDEN : DISABLED;
    } else if (index % 2 === 0) {
      colorButtonState = gamePlan.colors == null ? HIDDEN : NEUTRAL;
      positionButtonState = gamePlan.positions == null ? HIDDEN : NEUTRAL;
    } else if (index % 2 === 1) {
      const gameIndex = getGameIndex(index);
      if (gameIndex - gamePlan.nBack >= 0) {
        if (
          positionButtonState == NEUTRAL &&
          gamePlan.positions != null &&
          gamePlan.positions[gameIndex] ==
            gamePlan.positions[gameIndex - gamePlan.nBack]
        ) {
          mistakes += 1;
          positionButtonState = INCORRECT;
        }
        if (
          colorButtonState == NEUTRAL &&
          gamePlan.colors != null &&
          gamePlan.colors[gameIndex] ==
            gamePlan.colors[gameIndex - gamePlan.nBack]
        ) {
          mistakes += 1;
          colorButtonState = INCORRECT;
        }
      }
    }
  }

  return {
    currentIndex: index,
    positionButtonState,
    colorButtonState,
    isRunning,
    squares,
    mistakes,
  };
}
