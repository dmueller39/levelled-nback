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
import Game from "./Game";
import LevelInfo from "./LevelInfo";
import type { ProgressMapLocation, MasteryLevel } from "../progressMap";
import type { StackNavigationProp, RouteProp } from "@react-navigation/stack";

const Margin = 10;
const Spacing = 1;

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
    windowHeight: Dimensions.get("window").height,
    windowWidth: Dimensions.get("window").width,
  };

  _onDimensionsChange = () => {
    this.setState(() => {
      return {
        windowHeight: Dimensions.get("window").height,
        windowWidth: Dimensions.get("window").width,
      };
    });
  };

  componentDidMount = async () => {
    Dimensions.addEventListener("change", this._onDimensionsChange);
  };

  componentWillUnmount = async () => {
    Dimensions.removeEventListener("change", this._onDimensionsChange);
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
