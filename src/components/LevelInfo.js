// @flow
import * as React from "react";

import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import type { GameLevel, GamePlan, GameResult, Settings } from "../gameLogic";
import {
  MASTERY_LEVEL_MASTERED,
  getIsMastered,
  getProgressMap,
} from "../progressMap";
import type { MasteryLevel, ProgressMapLocation } from "../progressMap";

import Demo from "./Demo";
import LocationButton from "./LocationButton";
import { getGamePlan } from "../gameLogic";

type ViewProps = React.ElementProps<typeof View>;
type ViewStyleProp = $PropertyType<ViewProps, "style">;
type Props = {
  location: ProgressMapLocation,
  windowWidth: number,
  windowHeight: number,
  onStart: (GamePlan) => void,
  onCancel: () => void,
};

type State = { demoGamePlan: GamePlan, isDemo: boolean };

export default class LevelInfo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const demoGamePlan = getGamePlan(this.props.location.gameLevel);
    this.state = {
      demoGamePlan,
      isDemo: false,
    };
  }

  _onStart = () => {
    const gamePlan = getGamePlan(this.props.location.gameLevel);
    this.props.onStart(gamePlan);
  };

  _onDemo = () => {
    this.setState({
      isDemo: true,
    });
  };

  _onCancel = () => {
    if (this.state.isDemo) {
      this.setState({
        isDemo: false,
      });
    } else {
      this.props.onCancel();
    }
  };

  render() {
    if (this.state.isDemo) {
      return (
        <View
          style={[
            {
              width: this.props.windowWidth,
              height: this.props.windowHeight,
            },
            styles.container,
          ]}
        >
          <View style={styles.hContainer}>
            <Text style={styles.cancelButton} onPress={this._onCancel}>
              Cancel
            </Text>
            <Text style={styles.playButton} onPress={this._onStart}>
              Start
            </Text>
          </View>
          <Demo
            height={this.props.windowHeight - 64}
            width={Math.min(this.props.windowWidth, 600)}
            gamePlan={this.state.demoGamePlan}
          />
        </View>
      );
    }

    return (
      <View
        style={[
          {
            width: this.props.windowWidth,
            height: this.props.windowHeight,
          },
          styles.container,
        ]}
      >
        <View style={styles.hContainer}>
          <Text style={styles.cancelButton} onPress={this._onCancel}>
            Cancel
          </Text>
          <Text style={styles.playButton} onPress={this._onStart}>
            Start
          </Text>
        </View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={styles.headerText}>
            {this.state.demoGamePlan.positions != null &&
            this.state.demoGamePlan.colors != null
              ? "Dual"
              : ""}{" "}
            {this.state.demoGamePlan.nBack}-Back{"\n"}
            {this.state.demoGamePlan.gameTurns -
              this.state.demoGamePlan.nBack}{" "}
            Turns
          </Text>
          <Text style={styles.playButton} onPress={this._onDemo}>
            Demo
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    textAlign: "center",
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
  },
  playButton: {
    color: "green",
    fontSize: 24,
    textAlign: "center",
    padding: 10,
  },
  cancelButton: {
    color: "red",
    fontSize: 24,
    textAlign: "center",
    padding: 10,
  },
  practiceButton: {
    color: "orange",
    fontSize: 24,
    padding: 2,
    marginRight: 5,
  },
  practiceInfoButton: {
    padding: 6,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  header: {
    flexDirection: "row",
    padding: 10,
  },
  hContainer: {
    justifyContent: "center",
    flexDirection: "row",
  },
  hspacer: {
    flex: 1,
  },
  cancel: {
    width: 44,
    height: 44,
  },
  nbacktext: {
    textAlign: "left",
    fontSize: 15,
  },
});
