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
  NEUTRAL,
  CORRECT,
  INCORRECT,
} from "../gameLogic";
import type { ButtonState, GamePlan, GameState } from "../gameLogic";
import Grid from "./Grid";
import MemoryDemo from "./MemoryDemo";
import "./Demo.css";

type State = {
  gameState: GameState;
  startTime: number;
};

type Props = {
  gamePlan: GamePlan;
  width: number;
  height: number;
};

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

function getGameIndex(currentIndex: number): number {
  return Math.floor(currentIndex / 2);
}

function getButtonState(
  items: Array<any> | null,
  currentIndex: number,
  nBack: number
): ButtonState {
  if (items == null) {
    return HIDDEN;
  }
  const gameIndex = getGameIndex(currentIndex);
  if (gameIndex < nBack) {
    return DISABLED;
  }
  if (currentIndex % 2) {
    return NEUTRAL;
  }
  if (items[gameIndex] === items[gameIndex - nBack]) {
    return CORRECT;
  }
  return INCORRECT;
}

export default class GameDemo extends React.Component<Props, State> {
  state = DefaultState;

  componentDidMount() {
    this._start();
  }
  componentWillUnmount() {
    this._endGame();
  }

  _timer: ReturnType<typeof setInterval> | null = null;

  _start() {
    this._timer = setInterval(this._tick, 40);
    this.setState({
      gameState: getInitialGameState(this.props.gamePlan),
      startTime: Date.now(),
    });
  }

  _endGame = () => {
    if (this._timer != null) {
      clearInterval(this._timer);
    }
    this._timer = null;
    // restart?
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
    this.setState(this._updateState(this.state));
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
        return this._endGame();
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
    state: ButtonState,
    callback: () => void,
    width: number
  ) {
    if (state !== HIDDEN) {
      let buttonColor = "#8888FF";
      switch (state) {
        case CORRECT:
          buttonColor = "#88FF88";
          break;
        case INCORRECT:
          buttonColor = "#FF8888";
          break;
        case DISABLED:
          buttonColor = "#CCCCFF";
          break;
        default:
          break;
      }

      return (
        <div
          key={name}
          style={{
            backgroundColor: buttonColor,
            width: 0.3 * width,
            fontSize: width * 0.07,
          }}
          className="DemoButtonText"
        >
          {name}
        </div>
      );
    }
    return null;
  }

  render() {
    const buttons = [];
    const halfWidth = this.props.width * 0.5;
    const gameIndex = getGameIndex(this.state.gameState.currentIndex);

    const positionButton = this._renderButton(
      "position",
      getButtonState(
        this.props.gamePlan.positions,
        this.state.gameState.currentIndex,
        this.props.gamePlan.nBack
      ),
      this._onPressPosition,
      halfWidth
    );
    if (positionButton != null) {
      buttons.push(positionButton);
    }
    const colorButton = this._renderButton(
      "color",
      getButtonState(
        this.props.gamePlan.colors,
        this.state.gameState.currentIndex,
        this.props.gamePlan.nBack
      ),
      this._onPressColor,
      halfWidth
    );
    if (colorButton != null) {
      buttons.push(colorButton);
    }

    return (
      <div
        className="DemoContainer"
        style={{
          flexDirection: "row",
          display: "flex",
          width: this.props.width,
          margin: "auto",
        }}
      >
        <div className="gameContainer" style={{ width: halfWidth }}>
          <MemoryDemo
            height={this.props.height - 2 * 8}
            width={halfWidth}
            gamePlan={this.props.gamePlan}
            currentStep={gameIndex}
          />
        </div>
        <div className="gameContainer" style={{ width: halfWidth }}>
          <Grid
            width={halfWidth}
            height={halfWidth}
            margin={0}
            gamePlan={this.props.gamePlan}
            gameState={this.state.gameState}
          />
          <div className="DemoButtonContainer">{buttons}</div>
        </div>
      </div>
    );
  }
}
