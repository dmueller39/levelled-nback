// @flow
import * as React from "react";

import type { GameResult, Settings } from "../gameLogic";
import type { ProgressMapLocation } from "../progressMap";

import Map from "./Map";

export type Props = {|
  storePosition: (number) => void,
  setLocation: (ProgressMapLocation) => void,
  settings: ?Settings,
  results: GameResult[],
  position: number,
|};

type State = {
  currentLocation: ?ProgressMapLocation,
};

export default class Menu extends React.Component<Props, State> {
  state = {
    currentLocation: null,
  };

  _onPressLocation = (location: ProgressMapLocation) => {
    this.props.setLocation(location);
  };

  render() {
    const { results, settings } = this.props;
    if (results == null || settings == null) {
      return null;
    }

    /** todo, only render scrollview on iOS/Android */
    return (
      <div>
        <Map
          nBack={this.props.position}
          results={results}
          settings={settings}
          onPressLocation={this._onPressLocation}
          onUpdateNBack={this.props.storePosition}
        />
      </div>
    );
  }
}
