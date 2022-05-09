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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const draw = (ctx: CanvasRenderingContext2D) => {
    const fill1 = getFill(props.last3MasteryLevels[0]);
    const fill2 = getFill(props.last3MasteryLevels[1]);
    const fill3 = getFill(props.last3MasteryLevels[2]);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.arc(22, 22, 14, 0, 2 * Math.PI, false);
    ctx.fillStyle = fill1;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000000";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(22, 22, 9, 0, 2 * Math.PI, false);
    ctx.fillStyle = fill2;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(22, 22, 4, 0, 2 * Math.PI, false);
    ctx.fillStyle = fill3;
    ctx.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas instanceof HTMLCanvasElement) {
      const context = canvas.getContext("2d");
      if (context instanceof CanvasRenderingContext2D) {
        draw(context);
      }
    }
  }, [draw, props.last3MasteryLevels]);

  const ref = useRef(null);
  const setRef = useCallback((node: null | HTMLCanvasElement) => {
    if (node instanceof HTMLCanvasElement) {
      const context = node.getContext("2d");
      if (context instanceof CanvasRenderingContext2D) {
        context.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    }

    // Save a reference to the node
    canvasRef.current = node;
  }, []);

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
        <canvas
          height={44 * window.devicePixelRatio}
          width={44 * window.devicePixelRatio}
          style={{ width: 44, height: 44 }}
          ref={setRef}
        />
      </div>
    </div>
  );
};

export default LocationButton;
