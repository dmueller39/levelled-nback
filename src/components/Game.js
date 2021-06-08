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
import WebKeyboardListener from "../common/WebKeyboardListener";

const DeviceWidth = Dimensions.get("window").width;
const Margin = 10;
const Spacing = 1;

type State = {
  gameState: GameState,
  startTime: number,
};

type Props = {
  gamePlan: GamePlan,
  isDebug: boolean,
  windowWidth: number,
  windowHeight: number,
  onCompleteGame: (?GameResult) => void,
  addBlurListener: (() => void) => () => void,
};

function InputElement({
  buttonColor,
  disabled,
  callback,
  name,
  inputKey,
}: {
  buttonColor: string,
  name: string,
  disabled: boolean,
  callback: () => void,
  inputKey: string,
}) {
  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity key={name} disabled={disabled} onPress={callback}>
        <Text style={[styles.buttonText, { backgroundColor: buttonColor }]}>
          {name}
        </Text>
      </TouchableOpacity>
      <WebKeyboardListener inputKey={inputKey} onKeyPress={callback}>
        <Text style={disabled ? styles.disabledInputKey : styles.inputKey}>
          ({inputKey})
        </Text>
      </WebKeyboardListener>
    </View>
  );
}

const DefaultState = {
  gameState: {
    isRunning: false,
    positionButtonState: HIDDEN,
    colorButtonState: HIDDEN,
    squares: [
      "white",
      "white",
      "white",
      "white",
      "white",
      "white",
      "white",
      "white",
      "white",
    ],
    currentIndex: -1,
    mistakes: 0,
  },
  startTime: 0,
};

export default class Game extends React.Component<Props, State> {
  state = DefaultState;

  _unsubscribe: () => void = () => {};

  _clearTimer = () => {
    if (this._timer != null) {
      clearInterval(this._timer);
    }
    this._timer = null;
  };

  componentDidMount() {
    this._start();
    this._unsubscribe = this.props.addBlurListener(() => {
      this._clearTimer();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
    this._clearTimer();
  }

  _timer: ?IntervalID;

  _start() {
    this._timer = setInterval(this._tick, 40);
    this.setState({
      gameState: getInitialGameState(this.props.gamePlan),
      startTime: Date.now(),
    });
  }

  _endGame = (result: ?GameResult) => {
    this.props.onCompleteGame(result);
    return DefaultState;
  };

  _checkForVibration = (prevGameState: GameState, gameState: GameState) => {
    if (
      (gameState.positionButtonState == INCORRECT &&
        prevGameState.positionButtonState != INCORRECT) ||
      (gameState.colorButtonState == INCORRECT &&
        prevGameState.colorButtonState != INCORRECT)
    ) {
      console.log("vibrating");
      Vibration.vibrate();
    }
  };

  _onPressPosition: () => void = () => {
    const currentIndex = getCurrentIndex(
      this.props.gamePlan,
      this.state.startTime,
      Date.now()
    );
    const gameState = getGameStateOnPositionPress(
      this.props.gamePlan,
      this.state.gameState,
      currentIndex
    );
    this._checkForVibration(this.state.gameState, gameState);
    this.setState({ gameState });
  };

  _onPressColor = () => {
    const currentIndex = getCurrentIndex(
      this.props.gamePlan,
      this.state.startTime,
      Date.now()
    );
    const gameState = getGameStateOnColorPress(
      this.props.gamePlan,
      this.state.gameState,
      currentIndex
    );
    this._checkForVibration(this.state.gameState, gameState);
    this.setState({ gameState });
  };

  _tick = () => {
    this.setState(this._updateState);
  };

  _updateState = (state: State) => {
    let positionButtonState = this.state.gameState.positionButtonState;
    if (state.gameState.isRunning) {
      const currentIndex = getCurrentIndex(
        this.props.gamePlan,
        this.state.startTime,
        Date.now()
      );
      const gameState = getGameStateOnTick(
        this.props.gamePlan,
        this.state.gameState,
        currentIndex
      );
      if (gameState.isRunning == false) {
        // reset the game
        return this._endGame({
          mistakes: gameState.mistakes,
          time: Date.now(),
          gamePlan: this.props.gamePlan,
        });
      } else {
        this._checkForVibration(this.state.gameState, gameState);
        return {
          gameState,
        };
      }
    }
    return {};
  };

  _renderButton(
    name: string,
    inputKey: string,
    state: ButtonState,
    callback: () => void
  ) {
    if (state != HIDDEN) {
      let buttonColor = "#8888FF";
      let disabled = false;
      switch (state) {
        case CORRECT:
          buttonColor = "#88FF88";
          break;
        case INCORRECT:
          buttonColor = "#FF8888";
          break;
        case DISABLED:
          buttonColor = "#CCCCFF";
          disabled = true;
          break;
      }

      return (
        <InputElement
          key={inputKey}
          name={name}
          buttonColor={buttonColor}
          disabled={disabled}
          callback={callback}
          inputKey={inputKey}
        />
      );
    }
    return null;
  }

  render() {
    const views = [];

    const buttons = [];
    const positionButton = this._renderButton(
      "position",
      "a",
      this.state.gameState.positionButtonState,
      this._onPressPosition
    );
    if (positionButton != null) {
      buttons.push(positionButton);
    }
    const colorButton = this._renderButton(
      "color",
      "l",
      this.state.gameState.colorButtonState,
      this._onPressColor
    );
    if (colorButton != null) {
      buttons.push(colorButton);
    }

    const dimension = Math.min(
      this.props.windowHeight - 200,
      this.props.windowWidth
    );

    return (
      <View
        style={[
          styles.container,
          { width: this.props.windowWidth, height: this.props.windowHeight },
        ]}
      >
        <Grid
          width={dimension}
          height={dimension}
          margin={Margin}
          gamePlan={this.props.gamePlan}
          gameState={this.state.gameState}
        />
        <View
          style={[styles.buttonContainer, { width: this.props.windowWidth }]}
        >
          {buttons}
        </View>
        {this.props.isDebug ? (
          <View pointerEvents="none" style={styles.debugText}>
            <Text pointerEvents="none" style={styles.debugText}>
              {JSON.stringify(this.state.gameState, null, "\t")}
              {JSON.stringify(this.props.gamePlan, null, "\t")}
            </Text>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  buttonText: {
    justifyContent: "center",
    color: "white",
    padding: 10,
    fontSize: 24,
  },
  debugText: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    fontSize: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 8,
  },
  inputContainer: {
    alignItems: "center",
  },
  disabledInputKey: {
    color: "#888888",
  },
  inputKey: {
    color: "#111111",
  },
});
