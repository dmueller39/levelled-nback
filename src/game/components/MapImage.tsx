// @flow
import * as React from "react";

import LocationButton from "./LocationButton";
import type {
  ProgressMapData,
  ProgressMapLocation,
  ProgressMapDataItem,
} from "../progressMap";

type Props = {
  onPressLocation: (location: ProgressMapLocation) => void;
  progressMap: ProgressMapData;
  backgroundColor: string;
};

export default function MapImage(props: Props) {
  const buttons: Array<JSX.Element> = [];

  props.progressMap.forEach((item: ProgressMapDataItem, y: number) => {
    item.locations.forEach(
      (location: ProgressMapLocation | null, x: number) => {
        if (location != null) {
          const loc: ProgressMapLocation = location;

          buttons.push(
            <LocationButton
              key={"LocationButton-" + y + "-" + x}
              last3MasteryLevels={location.last3MasteryLevels}
              onPress={() => props.onPressLocation(loc)}
            />
          );
        }
      }
    );
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
