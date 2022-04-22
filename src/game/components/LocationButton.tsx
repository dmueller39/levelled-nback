// @flow
import * as React from "react";
import type { MasteryLevel } from "../progressMap";
import {
  MASTERY_LEVEL_IN_PROGRESS,
  MASTERY_LEVEL_MASTERED,
  MASTERY_LEVEL_SKIPPED,
} from "../progressMap";
import "./TouchableOpacity.css";

type Props = {
  onPress: () => void;
  last3MasteryLevels: [MasteryLevel, MasteryLevel, MasteryLevel];
};

type State = {};

function getFill(masteryLevel: MasteryLevel): string {
  switch (masteryLevel) {
    case MASTERY_LEVEL_MASTERED:
      return "green";
    case MASTERY_LEVEL_IN_PROGRESS:
      return "yellow";
    case MASTERY_LEVEL_SKIPPED:
      return "#DDDDDD";
    default:
      return "white";
  }
}

export default class LocationButton extends React.Component<Props, State> {
  _onPress = () => {
    this.props.onPress();
  };

  render() {
    const fill1 = getFill(this.props.last3MasteryLevels[0]);
    const fill2 = getFill(this.props.last3MasteryLevels[1]);
    const fill3 = getFill(this.props.last3MasteryLevels[2]);
    return (
      <div
        style={{
          height: 44,
          width: "33%",
          alignContent: "center",
          alignItems: "center",
        }}
        onClick={this._onPress}
        className="touchableOpacity"
      >
        <div
          style={{
            margin: "auto",
            borderRadius: 14,
            width: 22,
            height: 22,
            backgroundColor: fill1,
            borderWidth: 1,
            borderColor: "black",
            borderStyle: "solid",
          }}
        />
        {/* <Circle
          cx="22"
          cy="22"
          r="14"
          fill={fill1}
          stroke="black"
          strokeWidth={1}
        />
        <Circle cx="22" cy="22" r="9" fill={fill2} />
        <Circle cx="22" cy="22" r="4" fill={fill3} /> */}
      </div>
    );
  }
}
