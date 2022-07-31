// @flow
import type { GameResult, Settings, GameLevel } from "./gameLogic";

export const NODE_START: ProgressMapLocationNodeType = 0;
export const NODE_DEFAULT: ProgressMapLocationNodeType = 1;
export const NODE_END: ProgressMapLocationNodeType = 2;

export type ProgressMapLocationNodeType = 0 | 1 | 2;

export type MasteryLevel = 0 | 1 | 2 | 3;

// the player has played the level, but hasn't mastered it
export const MASTERY_LEVEL_NONE: MasteryLevel = 0;
// the player has played the level, but hasn't mastered it
export const MASTERY_LEVEL_IN_PROGRESS: MasteryLevel = 1;
// the player mastered the level by playing it
export const MASTERY_LEVEL_MASTERED: MasteryLevel = 2;
// the player jumped ahead and mastered a more difficult level
export const MASTERY_LEVEL_SKIPPED: MasteryLevel = 3;

export type ProgressMapLocation = {
  last3MasteryLevels: [MasteryLevel, MasteryLevel, MasteryLevel];
  results: GameResult[];
  gameLevel: GameLevel;
  nodeType: ProgressMapLocationNodeType;
};

export type ProgressMapDataItem = {
  key: string;
  locations: [
    ProgressMapLocation | null,
    ProgressMapLocation | null,
    ProgressMapLocation | null
  ];
};

export type ProgressMapData = ProgressMapDataItem[];

type AbstractLevel = {
  last3MasteryLevels: [MasteryLevel, MasteryLevel, MasteryLevel];
  results: GameResult[];
  nodeType: ProgressMapLocationNodeType;
  nBack: number;
  turns: number;
  turnsPerMinute: number;
};

type OutlineItem = {
  positions: AbstractLevel | null;
  colors: AbstractLevel | null;
  dual: AbstractLevel | null;
};

export function getIsMastered(location: ProgressMapLocation) {
  return (
    location.last3MasteryLevels[0] == MASTERY_LEVEL_MASTERED &&
    location.last3MasteryLevels[1] == MASTERY_LEVEL_MASTERED &&
    location.last3MasteryLevels[2] == MASTERY_LEVEL_MASTERED
  );
}

function getKeyWithOutlineItem(item: OutlineItem): string {
  return (
    "" +
    (item.positions == null
      ? "null"
      : "" + item.positions.nBack + "-" + item.positions.turns) +
    "-" +
    (item.colors == null
      ? "null"
      : "" + item.colors.nBack + "-" + item.colors.turns) +
    "=" +
    (item.dual == null ? "null" : "" + item.dual.nBack + "-" + item.dual.turns)
  );
}

function getMasteryLevel(
  nBack: number,
  colorsEnabled: boolean,
  positionsEnabled: boolean,
  turns: number,
  gameResults: GameResult[]
): {
  results: GameResult[];
  last3MasteryLevels: [MasteryLevel, MasteryLevel, MasteryLevel];
} {
  let results: GameResult[] = [];
  const last3MasteryLevels = [
    MASTERY_LEVEL_NONE,
    MASTERY_LEVEL_NONE,
    MASTERY_LEVEL_NONE,
  ];
  let foundResultIndex = 0;
  for (let i = 0; i < gameResults.length; i++) {
    const { gamePlan, mistakes } = gameResults[i];
    if (
      gamePlan.isPractice !== true &&
      (gamePlan.colors != null) == colorsEnabled &&
      (gamePlan.positions != null) == positionsEnabled
    ) {
      if (gamePlan.nBack == nBack && gamePlan.gameTurns - nBack == turns) {
        if (mistakes == 0) {
          last3MasteryLevels[foundResultIndex] = MASTERY_LEVEL_MASTERED;
        } else {
          last3MasteryLevels[foundResultIndex] = MASTERY_LEVEL_IN_PROGRESS;
        }
        foundResultIndex++;
        results.push(gameResults[i]);
      } else if (
        gamePlan.nBack >= nBack &&
        gamePlan.gameTurns - gamePlan.nBack >= turns
      ) {
        // if they've mastered a higher level, then mark this as skipped
        if (mistakes == 0) {
          for (let j = foundResultIndex; j < last3MasteryLevels.length; j++) {
            if (last3MasteryLevels[j] == MASTERY_LEVEL_NONE) {
              last3MasteryLevels[j] = MASTERY_LEVEL_SKIPPED;
            }
          }
        }
      }
    }
  }
  return {
    last3MasteryLevels: [
      last3MasteryLevels[0],
      last3MasteryLevels[1],
      last3MasteryLevels[2],
    ],
    results,
  };
}

// 0 is the lowest level in the progress map, and n is the highest
export function getProgressMap(
  unsortedGameResults: GameResult[],
  gameSettings: Settings
): ProgressMapData {
  const { offset, minTurns, minTurnsPerMinute, steps, minNBack } =
    gameSettings.progressMap;

  const gameResults = unsortedGameResults.sort((a, b) => b.time - a.time);

  const totalSteps = offset + steps;
  const outline: OutlineItem[] = [];

  for (let i = minNBack; i <= 8; i++) {
    for (let j = 0; j <= totalSteps; j++) {
      let positions = null;
      let colors = null;
      let dual = null;
      if (j < steps) {
        const nBack = i;
        const turns = j + minTurns;
        positions = {
          nodeType: j == 0 ? NODE_START : NODE_DEFAULT,
          nBack: i,
          turns: j + minTurns,
          turnsPerMinute: minTurnsPerMinute,
          ...getMasteryLevel(nBack, false, true, turns, gameResults),
        };
        colors = {
          nodeType: j == 0 ? NODE_START : NODE_DEFAULT,
          nBack: i,
          turns: j + minTurns,
          turnsPerMinute: minTurnsPerMinute,
          ...getMasteryLevel(nBack, true, false, turns, gameResults),
        };
        dual = {
          nodeType: j == offset ? NODE_START : NODE_DEFAULT,
          nBack: i,
          turns: j - offset + minTurns,
          turnsPerMinute: minTurnsPerMinute,
          ...getMasteryLevel(i, true, true, j - offset + minTurns, gameResults),
        };
      }

      outline.push({
        positions,
        colors,
        dual,
      });
    }
  }

  return outline.map((outlineItem) => ({
    key: getKeyWithOutlineItem(outlineItem),
    locations: [
      outlineItem.positions == null
        ? null
        : {
            ...outlineItem.positions,
            gameLevel: {
              nBack: outlineItem.positions.nBack,
              rows: gameSettings.rows,
              columns: gameSettings.columns,
              positionsEnabled: true,
              colorsEnabled: false,
              colorValues: ["#000000"],
              turns: outlineItem.positions.turns,
              turnsPerMinute: outlineItem.positions.turnsPerMinute,
            },
          },
      outlineItem.colors == null
        ? null
        : {
            ...outlineItem.colors,
            gameLevel: {
              nBack: outlineItem.colors.nBack,
              rows: 1,
              columns: 1,
              positionsEnabled: false,
              colorsEnabled: true,
              colorValues: gameSettings.colorValues,
              turns: outlineItem.colors.turns,
              turnsPerMinute: outlineItem.colors.turnsPerMinute,
            },
          },
      outlineItem.dual == null
        ? null
        : {
            ...outlineItem.dual,
            gameLevel: {
              nBack: outlineItem.dual.nBack,
              rows: gameSettings.rows,
              columns: gameSettings.columns,
              positionsEnabled: true,
              colorsEnabled: true,
              colorValues: gameSettings.colorValues,
              turns: outlineItem.dual.turns,
              turnsPerMinute: outlineItem.dual.turnsPerMinute,
            },
          },
    ],
  }));
}

export function getLastIndex(map: ProgressMapData): number {
  const times = map
    .map((dataItem) =>
      dataItem.locations
        .map((loc) => {
          if (loc != null && loc.results != null && loc.results.length > 0) {
            return loc.results
              .map((result) => result.time)
              .reduce((prev, curr) => Math.max(prev, curr), 0);
          } else {
            return 0;
          }
        })
        .reduce((prev, curr) => Math.max(prev, curr), 0)
    )
    .map((time) => (Number.isNaN(time) ? 0 : time));

  const maxTime = Math.max(...times);
  return Math.max(times.indexOf(maxTime), 0);
}
