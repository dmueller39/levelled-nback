// @flow
import * as React from "react";
import { getProgressMap } from "../progressMap";
import HeaderHint from "./HeaderHint";
import MapImage from "./MapImage";
import type { GameResult, Settings } from "../gameLogic";
import type { ProgressMapLocation, ProgressMapDataItem } from "../progressMap";
import "./TouchableOpacity.css";

const NBACK_MINIMUM = 1;
const NBACK_MAXIMUM = 7;

type Props = {
  onPressLocation: (ProgressMapLocation) => void,
  onUpdateNBack: (number) => void,
  results: GameResult[],
  settings: Settings,
  nBack: number,
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

  _onClickLeft = () => {
    this.props.onUpdateNBack(Math.max(this.props.nBack - 1, NBACK_MINIMUM));
  };

  _onClickRight = () => {
    this.props.onUpdateNBack(Math.min(this.props.nBack + 1, NBACK_MAXIMUM));
  };

  _renderArrowButton = (
    icon: string,
    disabled: boolean,
    onClick: () => void
  ) => {
    const color = disabled ? "grey" : "black";
    return (
      <div
        disabled={disabled}
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
        }}
        className="touchableOpacity"
        onClick={onClick}
      >
        <div style={{ fontSize: 32, color: color }}>{icon}</div>
      </div>
    );
  };

  _renderHeader() {
    return (
      <div
        style={{
          flex: 1,
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {this._renderArrowButton(
            "⇦",
            this.props.nBack === NBACK_MINIMUM,
            this._onClickLeft
          )}
          <div
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
          </div>
          {this._renderArrowButton(
            "⇨",
            this.props.nBack === NBACK_MAXIMUM,
            this._onClickRight
          )}
        </div>
      </div>
    );
  }

  _renderGuide() {
    return (
      <div
        style={{
          flex: 1,
          alignItems: "center",
        }}
      >
        <div
          style={{
            flexDirection: "row",
            paddingTop: 12,
            paddingBottom: 16,
            display: "flex",
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
        </div>
      </div>
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
            location != null && location.gameLevel.nBack === this.props.nBack
        ).length > 0
      );
    });
    const backgroundColor = getBGFill(this.props.nBack);
    return (
      <div>
        {this._renderHeader()}
        {this._renderGuide()}
        <MapImage
          backgroundColor={backgroundColor}
          progressMap={progressMap}
          onPressLocation={this._onPressLocation}
        />
      </div>
    );
  }
}
