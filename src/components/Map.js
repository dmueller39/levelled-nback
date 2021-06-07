// @flow
import * as React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import { getProgressMap } from "../progressMap";
import LocationButton from "./LocationButton";
import HeaderHint from "./HeaderHint";
import MapImage from "./MapImage";
import type { GameResult, Settings } from "../gameLogic";
import type {
  ProgressMapData,
  ProgressMapLocation,
  ProgressMapDataItem,
} from "../progressMap";

import { Ionicons } from "@expo/vector-icons";

const NBACK_MINIMUM = 1;
const NBACK_MAXIMUM = 7;

type Props = {
  onPressLocation: (ProgressMapLocation) => void,
  onUpdateNBack: (number) => void,
  results: GameResult[],
  settings: Settings,
  nBack: number,
  windowHeight: number,
  windowWidth: number,
};

function getBGFill(nBack: number): string {
  const index = (nBack - 1) % NBACK_MAXIMUM;
  const bgFills = [
    "#3b2bc4",
    "#3fc42b",
    "#bcc42b",
    "#c4892b",
    "#c42b2b",
    "#c42bbc",
    "#8e8a91",
  ];
  return bgFills[index];
}

type State = any;

export default class Menu extends React.Component<Props, State> {
  scrollView: any = null;

  _onPressLocation = (location: ProgressMapLocation) => {
    this.props.onPressLocation(location);
  };

  _onPressLeft = () => {
    this.props.onUpdateNBack(Math.max(this.props.nBack - 1, NBACK_MINIMUM));
  };

  _onPressRight = () => {
    this.props.onUpdateNBack(Math.min(this.props.nBack + 1, NBACK_MAXIMUM));
  };

  _renderArrowButton = (
    icon: string,
    disabled: boolean,
    onPress: () => void
  ) => {
    const color = disabled ? "grey" : "black";
    return (
      <TouchableOpacity
        disabled={disabled}
        style={styles.iconButton}
        onPress={onPress}
      >
        <Text style={{ fontSize: 32, color: color }}>{icon}</Text>
      </TouchableOpacity>
    );
  };

  _renderHeader() {
    const color = getBGFill(this.props.nBack);
    const width = Math.min(this.props.windowWidth, 600);
    return (
      <View
        style={{
          width: this.props.windowWidth,
          flex: 1,
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width,
          }}
        >
          {this._renderArrowButton(
            "⇦",
            this.props.nBack == NBACK_MINIMUM,
            this._onPressLeft
          )}
          <Text
            style={{
              textAlign: "center",
              flex: 1,
              fontSize: 14,
              color: "black",
              fontWeight: "bold",
              flexDirection: "row",
            }}
          >
            n-back = {this.props.nBack}
          </Text>
          {this._renderArrowButton(
            "⇨",
            this.props.nBack == NBACK_MAXIMUM,
            this._onPressRight
          )}
        </View>
      </View>
    );
  }

  _renderGuide() {
    const color = getBGFill(this.props.nBack);
    const width = Math.min(this.props.windowWidth, 600);
    return (
      <View
        style={{
          width: this.props.windowWidth,
          flex: 1,
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width,
            paddingTop: 12,
            paddingBottom: 16,
          }}
        >
          <HeaderHint
            settings={this.props.settings}
            nBack={this.props.nBack}
            positionsEnabled={true}
          />
          <HeaderHint
            settings={this.props.settings}
            nBack={this.props.nBack}
            colorsEnabled={true}
          />
          <HeaderHint
            settings={this.props.settings}
            nBack={this.props.nBack}
            positionsEnabled={true}
            colorsEnabled={true}
          />
        </View>
      </View>
    );
  }

  render() {
    // TODO update getProgressMap to only generate the desired nBack level
    const progressMap = getProgressMap(
      this.props.results,
      this.props.settings
    ).filter((item: ProgressMapDataItem) => {
      return (
        item.locations.filter(
          (location: ?ProgressMapLocation) =>
            location != null && location.gameLevel.nBack == this.props.nBack
        ).length > 0
      );
    });
    const backgroundColor = getBGFill(this.props.nBack);
    return (
      <View>
        {this._renderHeader()}
        {this._renderGuide()}
        <MapImage
          backgroundColor={backgroundColor}
          progressMap={progressMap}
          onPressLocation={this._onPressLocation}
          windowHeight={this.props.windowHeight}
          windowWidth={this.props.windowWidth}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  iconButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
});
