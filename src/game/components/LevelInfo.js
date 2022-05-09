// @flow
import * as React from "react";

import type { GamePlan } from "../gameLogic";
import type { ProgressMapLocation } from "../progressMap";

import Demo from "./Demo";
import { getGamePlan } from "../gameLogic";
import "./TouchableOpacity.css";

type Props = {
  location: ProgressMapLocation,
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
        <div style={styles.container}>
          <div style={styles.hContainer}>
            <div
              style={styles.cancelButton}
              className="touchableOpacity"
              onClick={this._onCancel}
            >
              Cancel
            </div>
            <div
              style={styles.playButton}
              className="touchableOpacity"
              onClick={this._onStart}
            >
              Start
            </div>
          </div>
          <Demo height={400} width={300} gamePlan={this.state.demoGamePlan} />
        </div>
      );
    }

    return (
      <div style={styles.container}>
        <div style={styles.hContainer}>
          <div
            style={styles.cancelButton}
            className="touchableOpacity"
            onClick={this._onCancel}
          >
            Cancel
          </div>
          <div
            style={styles.playButton}
            className="touchableOpacity"
            onClick={this._onStart}
          >
            Start
          </div>
        </div>
        <div style={{ minHeight: 300, flex: 1, justifyContent: "center" }}>
          <div style={styles.headerText}>
            {this.state.demoGamePlan.positions != null &&
            this.state.demoGamePlan.colors != null
              ? "Dual"
              : ""}{" "}
            {this.state.demoGamePlan.nBack}-Back{"\n"}
            {this.state.demoGamePlan.gameTurns -
              this.state.demoGamePlan.nBack}{" "}
            Turns
          </div>
          <div style={styles.playButton}>
            <span onClick={this._onDemo} className="touchableOpacity">
              Demo
            </span>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  headerText: {
    textAlign: "center",
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
    whiteSpace: "pre-wrap",
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
    display: "flex",
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
};
