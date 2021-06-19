// @flow
import NBack from "./components/NBack";
import React, { useState, useEffect } from "react";
import type { GameResult } from "./gameLogic";
import type { Props, OwnProps } from "./components/NBack";
import { DEFAULT_SETTINGS } from "./constants";
import { AsyncStorage } from "react-native";

const POSITION_KEY = "mapNBack";
const RESULTS_KEY = "results";
const DEFAULT_NBACK_LEVEL = 1;

function setBodyStyle() {
  const body = document.body;
  if (body != null) {
    body.style = "background: #EEEEEE;";
  }
}

export default function MainNBack() {
  const [position, setPosition] = useState(1);
  const [results, setResults] = useState(([]: GameResult[]));
  useEffect(() => {
    async function loadAll() {
      const pval = await AsyncStorage.getItem(POSITION_KEY);
      setPosition(parseInt(pval) || DEFAULT_NBACK_LEVEL);
      // const rval = await AsyncStorage.getItem(RESULTS_KEY);
      // if (rval != null) {
      //   try {
      //     const res = JSON.parse(rval) || [];
      //     setResults(res);
      //   } catch (e) {
      //     // no worries
      //   }
      // }
    }
    setBodyStyle();
    loadAll();

    window.onmessage = function(e) {
      if (typeof e.data === "string") {
        //
        if (e.data.startsWith(window.location.href + ";data;")) {
          // extract the data string
          const res = e.data
            .split(";")
            .slice(2)
            .map((data) => JSON.parse(data));
          setResults(res);
        }
      }
    };
    window.top.postMessage(window.location.href + ";ready", "*");
  }, []);
  function storePosition(p: number) {
    setPosition(p);
    AsyncStorage.setItem(POSITION_KEY, (p || DEFAULT_NBACK_LEVEL).toString());
  }
  function onCompleteGame(result: ?GameResult) {
    if (result != null) {
      const updated = [...results, result];
      setResults(updated);
      async function storeResults() {
        AsyncStorage.setItem(RESULTS_KEY, JSON.stringify(updated));
      }
      storeResults();
      const message =
        window.location.href + ";complete;" + JSON.stringify(result);
      window.top.postMessage(message, "*");
    }
  }

  return (
    <NBack
      isDebug={false}
      settings={DEFAULT_SETTINGS}
      onCompleteGame={onCompleteGame}
      storePosition={storePosition}
      position={position}
      results={results}
    />
  );
}
