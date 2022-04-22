// @flow
import React, { useState } from "react";
import GameLevel from "./GameLevel";
import Menu from "./Menu";
import type { GameResult, GamePlan, Settings } from "../gameLogic";
import type { ProgressMapLocation } from "../progressMap";

export type StateProps = {|
  settings: ?Settings,
  results: GameResult[],
  position: number,
  isDebug: boolean,
|};

export type DispatchProps = {|
  onCompleteGame: (?GameResult) => void,
  storePosition: (number) => void,
|};

export type OwnProps = {||};

export type Props = {| ...StateProps, ...DispatchProps, ...OwnProps |};

export default function NBack(props: Props) {
  const [location, setLocation] = useState((null: ?ProgressMapLocation));
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
    const onCompleteGame = (result: ?GameResult) => {
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
        isDebug={props.isDebug}
        location={location}
        onCompleteGame={onCompleteGame}
        addBlurListener={addBlurListener}
        onCancel={onCancel}
      />
    );
  }
}
