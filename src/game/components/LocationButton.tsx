// @flow
import React, { useRef, useEffect, useCallback } from "react";
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

const LocationButton = (props: Props) => {
  const fill1 = getFill(props.last3MasteryLevels[0]);
  const fill2 = getFill(props.last3MasteryLevels[1]);
  const fill3 = getFill(props.last3MasteryLevels[2]);

  return (
    <div
      style={{
        height: 44,
        width: "33%",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          height: 44,
          width: 44,
          margin: "auto",
        }}
        onClick={props.onPress}
        className="touchableOpacity"
      >
        <svg height="44" width="44">
          <circle
            cx="22"
            cy="22"
            r="14"
            fill={fill1}
            stroke="black"
            stroke-width="1"
          ></circle>
          <circle cx="22" cy="22" r="9" fill={fill2}></circle>
          <circle cx="22" cy="22" r="4" fill={fill3}></circle>
        </svg>
      </div>
    </div>
  );
};

export default LocationButton;
