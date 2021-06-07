// @flow
import * as React from "react";

import { StyleSheet, View, Dimensions } from "react-native";
import type { GameResult, Settings } from "../gameLogic";
import type { ProgressMapLocation } from "../progressMap";
import { getProgressMap } from "../progressMap";

import { Ionicons } from "@expo/vector-icons";
import Map from "./Map";

export type Props = {|
  storePosition: (number) => void,
  setLocation: (ProgressMapLocation) => void,
  settings: ?Settings,
  results: GameResult[],
  position: number,
|};

type State = {
  windowHeight: number,
  windowWidth: number,
  currentLocation: ?ProgressMapLocation,
};

export default class Menu extends React.Component<Props, State> {
  state = {
    currentLocation: null,
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

  _onPressLocation = (location: ProgressMapLocation) => {
    this.props.setLocation(location);
  };

  render() {
    const { results, settings } = this.props;
    if (results == null || settings == null) {
      return null;
    }
    const progressMap = getProgressMap(results, settings);

    /** todo, only render scrollview on iOS/Android */
    return (
      <View style={[{ width: this.state.windowWidth }, styles.container]}>
        <Map
          nBack={this.props.position}
          results={results}
          settings={settings}
          onPressLocation={this._onPressLocation}
          onUpdateNBack={this.props.storePosition}
          windowHeight={this.state.windowHeight}
          windowWidth={this.state.windowWidth}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  hContainer: {
    padding: 8,
    margin: "auto",
  },
});
