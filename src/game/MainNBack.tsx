// @flow
import NBack from "./components/NBack";
import React, { useState, useEffect } from "react";
import type { GameResult } from "./gameLogic";
import { DEFAULT_SETTINGS } from "./constants";

const POSITION_KEY = "mapNBack";
const DEFAULT_NBACK_LEVEL = 1;

export default function MainNBack() {
  const [position, setPosition] = useState(DEFAULT_NBACK_LEVEL);
  const [results, setResults] = useState([] as GameResult[]);
  useEffect(() => {
    window.onmessage = function (e) {
      if (typeof e.data === "string") {
        //
        if (e.data.startsWith(window.location.href + ";data;")) {
          // extract the data string
          const res = e.data
            .split(";")
            .slice(2)
            .map((data) => JSON.parse(data));
          setResults(res as GameResult[]);
          const latest = res.reduce(
            (max, current) =>
              max == null || max.time < current.time ? current : max,
            null
          );

          if (latest != null) {
            setPosition((latest as GameResult).gamePlan.nBack);
          }
        }
      }
    };
    if (window.top) {
      window.top.postMessage(window.location.href + ";ready", "*");
    }
  }, []);
  function onCompleteGame(result: GameResult | null) {
    if (result != null) {
      const updated = [...results, result];
      setResults(updated);
      const message =
        window.location.href + ";complete;" + JSON.stringify(result);
      if (window.top) {
        window.top.postMessage(message, "*");
      }
    }
  }

  return (
    <NBack
      settings={DEFAULT_SETTINGS}
      onCompleteGame={onCompleteGame}
      storePosition={setPosition}
      position={position}
      results={results}
    />
  );
}
