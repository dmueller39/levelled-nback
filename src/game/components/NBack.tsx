// @flow
import React, { useState } from "react";
import GameLevel from "./GameLevel";
import Menu from "./Menu";
import type { GameResult, Settings } from "../gameLogic";
import type { ProgressMapLocation } from "../progressMap";

export type StateProps = {
  settings: Settings | null;
  results: GameResult[];
  position: number;
};

export type DispatchProps = {
  onCompleteGame: (result: GameResult | null) => void;
  storePosition: (position: number) => void;
};

export type OwnProps = {};

export type Props = StateProps & DispatchProps & OwnProps;

export default function NBack(props: Props) {
  const [location, setLocation] = useState<ProgressMapLocation | null>(null);
  if (location == null) {
    return (
      <Menu
        results={props.results}
        storePosition={props.storePosition}
        settings={props.settings}
        position={props.position}
        setLocation={setLocation}
      />
    );
  } else {
    const onCompleteGame = (result: GameResult | null) => {
      setLocation(null);
      props.onCompleteGame(result);
    };

    const addBlurListener = (callback: () => void) => {
      window.addEventListener("blur", callback);
      return () => {
        window.removeEventListener("blur", callback);
      };
    };

    const onCancel = () => {
      setLocation(null);
    };

    return (
      <GameLevel
        location={location}
        onCompleteGame={onCompleteGame}
        addBlurListener={addBlurListener}
        onCancel={onCancel}
      />
    );
  }
}
