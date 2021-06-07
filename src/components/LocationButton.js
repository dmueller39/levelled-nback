// @flow
import * as React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import type { MasteryLevel } from "../progressMap";
import {
  MASTERY_LEVEL_IN_PROGRESS,
  MASTERY_LEVEL_NONE,
  MASTERY_LEVEL_MASTERED,
  MASTERY_LEVEL_SKIPPED,
} from "../progressMap";

type ViewProps = React.ElementProps<typeof View>;
type ViewStyleProp = $PropertyType<ViewProps, "style">;

type Props = {
  onPress: () => void,
  last3MasteryLevels: [MasteryLevel, MasteryLevel, MasteryLevel],
  style?: ViewStyleProp,
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
  }
  return "white";
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
      <TouchableOpacity
        style={[styles.container, this.props.style]}
        onPress={this._onPress}
      >
        <Svg height="44" width="44">
          <Circle
            cx="22"
            cy="22"
            r="14"
            fill={fill1}
            stroke="black"
            strokeWidth={1}
          />
          <Circle cx="22" cy="22" r="9" fill={fill2} />
          <Circle cx="22" cy="22" r="4" fill={fill3} />
        </Svg>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    width: 44,
  },
});
