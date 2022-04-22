// @flow
import NBack from "./components/NBack";
import React, { useState, useEffect } from "react";
import type { GameResult } from "./gameLogic";
import { DEFAULT_SETTINGS } from "./constants";

const POSITION_KEY = "mapNBack";
const DEFAULT_NBACK_LEVEL = 1;

function setBodyStyle() {
  const body = document.body;
  if (body != null) {
    // body.style = "background: #EEEEEE;";
  }
}

export default function MainNBack() {
  const [position, setPosition] = useState(1);
  const [results, setResults] = useState([] as GameResult[]);
  useEffect(() => {
    async function loadAll() {
      const pval = sessionStorage.getItem(POSITION_KEY);
      setPosition(pval != null ? parseInt(pval) : DEFAULT_NBACK_LEVEL);
    }
    setBodyStyle();
    loadAll();

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
        }
      }
    };
    if (window.top) {
      window.top.postMessage(window.location.href + ";ready", "*");
    }
  }, []);
  function storePosition(p: number) {
    setPosition(p);
    sessionStorage.setItem(POSITION_KEY, (p || DEFAULT_NBACK_LEVEL).toString());
  }
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
      isDebug={false}
      settings={DEFAULT_SETTINGS}
      onCompleteGame={onCompleteGame}
      storePosition={storePosition}
      position={position}
      results={results}
    />
  );
}
