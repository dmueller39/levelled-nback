// @flow
import * as React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";

import LocationButton from "./LocationButton";
import type { GameResult, Settings } from "../gameLogic";
import type {
  ProgressMapData,
  ProgressMapLocation,
  ProgressMapDataItem,
  MasteryLevel,
} from "../progressMap";
import {
  getProgressMap,
  MASTERY_LEVEL_IN_PROGRESS,
  MASTERY_LEVEL_NONE,
  MASTERY_LEVEL_MASTERED,
  MASTERY_LEVEL_SKIPPED,
} from "../progressMap";

type Props = {
  onPressLocation: (ProgressMapLocation) => void,
  progressMap: ProgressMapData,
  windowHeight: number,
  windowWidth: number,
  backgroundColor: string,
};

type State = {};

export default class MapImage extends React.Component<Props, State> {
  state = {};

  render() {
    const height = this.props.progressMap.length * 54;
    const width = Math.min(this.props.windowWidth, 600);

    const buttons: React.Element<typeof LocationButton>[] = [];

    this.props.progressMap.forEach((item: ProgressMapDataItem, y: number) => {
      item.locations.forEach((location: ?ProgressMapLocation, x: number) => {
        if (location != null) {
          const loc: ProgressMapLocation = location;
          const top = y * 54;
          const left = (x + 0.5) * (width / 3) - 22;

          buttons.push(
            <LocationButton
              key={"LocationButton-" + y + "-" + x}
              style={{ position: "absolute", left, top }}
              last3MasteryLevels={location.last3MasteryLevels}
              onPress={() => this.props.onPressLocation(loc)}
            />
          );
        }
      });
    });

    return (
      <View
        style={{
          alignItems: "center",
        }}
      >
        <View style={{ width, height }}>{buttons}</View>
      </View>
    );
  }
}
