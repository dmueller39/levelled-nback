// @flow
import * as React from "react";
import {
  getGameStateOnPositionPress,
  getGameStateOnColorPress,
  getGameStateOnTick,
  getInitialGameState,
  getCurrentIndex,
  HIDDEN,
  DISABLED,
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
import "./TouchableOpacity.css";

const Margin = 10;

type State = {
  gameState: GameState;
  startTime: number;
};

type Props = {
  gamePlan: GamePlan;
  isDebug: boolean;
  onCompleteGame: (result: GameResult | null) => void;
  addBlurListener: (callback: () => void) => () => void;
};

function InputElement({
  buttonColor,
  disabled,
  callback,
  name,
  inputKey,
}: {
  buttonColor: string;
  name: string;
  disabled: boolean;
  callback: () => void;
  inputKey: string;
}) {
  return (
    <div className="inputContainer">
      <div
        key={name}
        onClick={disabled ? () => {} : callback}
        className="touchableOpacity"
      >
        <div className="buttonText" style={{ backgroundColor: buttonColor }}>
          {name}
        </div>
      </div>
      <WebKeyboardListener inputKey={inputKey} onKeyPress={callback}>
        <div className={disabled ? "disabledInputKey" : "inputKey"}>
          ({inputKey})
        </div>
      </WebKeyboardListener>
    </div>
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

  _timer: ReturnType<typeof setInterval> | null = null;

  _start() {
    this._timer = setInterval(this._tick, 40);
    this.setState({
      gameState: getInitialGameState(this.props.gamePlan),
      startTime: Date.now(),
    });
  }

  _endGame = (result: GameResult | null) => {
    this.props.onCompleteGame(result);
    return DefaultState;
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
    this.setState({ gameState });
  };

  _tick = () => {
    this.setState(this._updateState);
  };

  _updateState = (state: State) => {
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
      if (gameState.isRunning === false) {
        // reset the game
        return this._endGame({
          mistakes: gameState.mistakes,
          time: Date.now(),
          gamePlan: this.props.gamePlan,
        });
      } else {
        return {
          gameState,
        };
      }
    }
    return state;
  };

  _renderButton(
    name: string,
    inputKey: string,
    state: ButtonState,
    callback: () => void
  ) {
    if (state !== HIDDEN) {
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
        default:
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

    return (
      <div className="container" style={{ width: "100%" }}>
        <Grid
          width={300}
          height={300}
          margin={Margin}
          gamePlan={this.props.gamePlan}
          gameState={this.state.gameState}
        />
        <div className="buttonContainer" style={{ width: "100%" }}>
          {buttons}
        </div>
        {this.props.isDebug ? (
          <div className="debugText">
            <div className="debugText">
              {JSON.stringify(this.state.gameState, null, "\t")}
              {JSON.stringify(this.props.gamePlan, null, "\t")}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
