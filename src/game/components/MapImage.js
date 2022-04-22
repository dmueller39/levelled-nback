// @flow
import * as React from "react";

import LocationButton from "./LocationButton";
import type {
  ProgressMapData,
  ProgressMapLocation,
  ProgressMapDataItem,
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

    const buttons: React.Element<typeof LocationButton>[] = [];

    this.props.progressMap.forEach((item: ProgressMapDataItem, y: number) => {
      item.locations.forEach((location: ?ProgressMapLocation, x: number) => {
        if (location != null) {
          const loc: ProgressMapLocation = location;

          buttons.push(
            <LocationButton
              key={"LocationButton-" + y + "-" + x}
              last3MasteryLevels={location.last3MasteryLevels}
              onPress={() => this.props.onPressLocation(loc)}
            />
          );
        }
      });
    });

    return (
      <div
        style={{
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            flexWrap: "wrap",
            display: "flex",
            flexDirection: "row",
          }}
        >
          {buttons}
        </div>
      </div>
    );
  }
}
