// @flow
import * as React from "react";
import type { GamePlan } from "../gameLogic";
import Grid from "./Grid";

type Props = {
  gamePlan: GamePlan,
  currentStep: number,
  width: number,
  height: number,
};

function squaresForTurn(gamePlan: GamePlan, turn: number): Array<string> {
  const squares = [];
  const squareCount = gamePlan.rows * gamePlan.columns;
  for (let index = 0; index < squareCount; index++) {
    squares.push("white");
  }

  let squareIndex = 0;
  if (gamePlan.positions != null) {
    squareIndex = gamePlan.positions[turn];
  }
  if (gamePlan.colors != null && gamePlan.colorValues != null) {
    const colorIndex = gamePlan.colors[turn];
    squares[squareIndex] = gamePlan.colorValues[colorIndex];
  } else {
    squares[squareIndex] = "grey";
  }

  return squares;
}

function getDisplay(
  items: ?Array<any>,
  currentStep: number,
  nBack: number,
  index: number
): string {
  if (items == null) {
    return "none";
  }
  if (index === currentStep) {
    return "flex";
  }
  if (index === currentStep - nBack) {
    return "flex";
  }
  return "none";
}

function getOpacity(currentStep: number, nBack: number, index: number): number {
  if (index === currentStep || currentStep - nBack === index) {
    return 1.0;
  }
  if (currentStep - nBack < index && index < currentStep) {
    return 0.85;
  }
  return 0.33;
}

function getBorderColor(
  currentStep: number,
  nBack: number,
  index: number
): string {
  if (index === currentStep) {
    return "black";
  }
  return "transparent";
}

export default function MemoryDemo(props: Props) {
  const rowHeight = Math.min(
    Math.floor(props.height / (props.gamePlan.nBack + 1)),
    62
  );

  const grids = [];

  const currentStep = props.currentStep;

  for (let index = 0; index < props.gamePlan.gameTurns; index++) {
    const state = {
      squares: squaresForTurn(props.gamePlan, index),
    };
    let positionArrowDisplay = getDisplay(
      props.gamePlan.positions,
      currentStep,
      props.gamePlan.nBack,
      index
    );
    let opacity = getOpacity(currentStep, props.gamePlan.nBack, index);
    let borderColor = getBorderColor(currentStep, props.gamePlan.nBack, index);
    const heightStyle = { height: rowHeight };
    grids.push(
      <div
        key={"demo-grid-" + index}
        style={{ ...styles.gridContainer, ...heightStyle }}
      >
        <div style={{ ...styles.iconContainer, ...heightStyle }}>
          <div
            style={{
              fontSize: 32,
              display: positionArrowDisplay,
            }}
          >
            👉
          </div>
        </div>
        <div
          style={{
            height: rowHeight + 2,
            opacity,
            borderWidth: 2,
            borderColor,
          }}
        >
          <Grid
            width={rowHeight}
            height={rowHeight}
            margin={4}
            gamePlan={props.gamePlan}
            gameState={state}
          />
        </div>
        <div style={{ ...styles.iconContainer, ...heightStyle }}>
          <div
            style={{
              fontSize: 32,
              display: positionArrowDisplay,
            }}
          >
            👈
          </div>
        </div>
      </div>
    );
  }

  return <div style={styles.container}>{grids}</div>;
}

const styles = {
  header: {
    flexDirection: "row",
  },
  spacer: {
    width: 60,
  },
  text: {
    width: 80,
    textAlign: "center",
  },
  iconContainer: {
    height: 62,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  gridContainer: { height: 62, flexDirection: "row" },
  container: {
    alignItems: "center",
    flex: 1,
  },
};
