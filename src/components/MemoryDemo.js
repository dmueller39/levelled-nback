// @flow
import * as React from "react";
import {
  Button,
  Dimensions,
  Text,
  Vibration,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  getGameStateOnPositionPress,
  getGameStateOnColorPress,
  getGameStateOnTick,
  getInitialGameState,
  getCurrentIndex,
  HIDDEN,
  DISABLED,
  NEUTRAL,
  CORRECT,
  INCORRECT,
} from "../gameLogic";
import type {
  ButtonState,
  GamePlan,
  GameState,
  GameResult,
} from "../gameLogic";
import Grid from "./Grid";

type State = {
  currentStep: number,
};

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

function getColor(
  items: ?Array<any>,
  currentStep: number,
  nBack: number
): string {
  if (items == null) {
    return "grey";
  }
  if (currentStep < nBack) {
    return "grey";
  }
  if (items[currentStep] == items[currentStep - nBack]) {
    return "green";
  } else {
    return "red";
  }
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
  if (index == currentStep) {
    return "flex";
  }
  if (index == currentStep - nBack) {
    return "flex";
  }
  return "none";
}

function getOpacity(currentStep: number, nBack: number, index: number): number {
  if (index == currentStep || currentStep - nBack == index) {
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
  if (index == currentStep) {
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

  let colorArrowColor = getColor(
    props.gamePlan.colors,
    currentStep,
    props.gamePlan.nBack
  );
  let positionArrowColor = getColor(
    props.gamePlan.positions,
    currentStep,
    props.gamePlan.nBack
  );

  for (let index = 0; index < props.gamePlan.gameTurns; index++) {
    const state = {
      squares: squaresForTurn(props.gamePlan, index),
    };
    let colorArrowDisplay = getDisplay(
      props.gamePlan.colors,
      currentStep,
      props.gamePlan.nBack,
      index
    );
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
      <View
        key={"demo-grid-" + index}
        style={[styles.gridContainer, heightStyle]}
      >
        <View style={[styles.iconContainer, heightStyle]}>
          <Text
            style={{
              fontSize: 32,
              display: positionArrowDisplay,
            }}
          >
            👉
          </Text>
        </View>
        <View
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
        </View>
        <View style={[styles.iconContainer, heightStyle]}>
          <Text
            style={{
              fontSize: 32,
              display: positionArrowDisplay,
            }}
          >
            👈
          </Text>
        </View>
      </View>
    );
  }

  const positionText = props.gamePlan.positions != null ? "position" : "";
  const colorText = props.gamePlan.colors != null ? "color" : "";

  return (
    <ScrollView contentContainerStyle={styles.container}>{grids}</ScrollView>
  );
}

const styles = StyleSheet.create({
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
});
