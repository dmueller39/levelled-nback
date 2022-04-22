// @flow
import * as React from "react";
import type { GamePlan, GameResult } from "../gameLogic";
import Game from "./Game";
import LevelInfo from "./LevelInfo";
import type { ProgressMapLocation } from "../progressMap";

type State = {
  isPlaying: boolean,
  gamePlan?: GamePlan,
  windowWidth: number,
  windowHeight: number,
};

export type Props = {|
  isDebug: boolean,
  onCompleteGame: (?GameResult) => void,
  onCancel: () => void,
  addBlurListener: (() => void) => () => void,
  location: ProgressMapLocation,
|};

export default class GameLevel extends React.Component<Props, State> {
  state = {
    isPlaying: false,
    windowHeight: 400,
    windowWidth: 300,
  };

  _onStart = (gamePlan: GamePlan) => {
    this.setState({
      isPlaying: true,
      gamePlan,
    });
  };

  _onCompleteGame = (result: ?GameResult) => {
    this.props.onCompleteGame(result);
  };

  render() {
    if (this.state.isPlaying && this.state.gamePlan != null) {
      return (
        <Game
          gamePlan={this.state.gamePlan}
          isDebug={this.props.isDebug}
          windowWidth={this.state.windowWidth}
          windowHeight={this.state.windowHeight}
          onCompleteGame={this._onCompleteGame}
          addBlurListener={this.props.addBlurListener}
        />
      );
    } else {
      return (
        <LevelInfo
          location={this.props.location}
          isDebug={this.props.isDebug}
          windowWidth={this.state.windowWidth}
          windowHeight={this.state.windowHeight}
          onStart={this._onStart}
          onCancel={this.props.onCancel}
        />
      );
    }
  }
}
