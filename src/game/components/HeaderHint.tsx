// @flow
import * as React from "react";
import shuffle from "../common/shuffle";
import Grid from "./Grid";
import type { Settings } from "../gameLogic";
import { INACTIVE_COLOR, ACTIVE_COLOR } from "../constants";

type Props = {
  nBack: number;
  colorsEnabled?: boolean;
  positionsEnabled?: boolean;
  settings: Settings;
};

type State = { colors: Array<string>; positions: Array<number> };

const POSITIONS: Array<number> = [0, 5, 6, 1, 4, 3, 2, 8, 7];

function generateState(settings: Settings): State {
  return {
    colors: shuffle(settings.colorValues),
    positions: shuffle(POSITIONS),
  };
}

export default class HeaderHint extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = generateState(props.settings);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.nBack !== this.props.nBack) {
      this.setState(generateState(this.props.settings));
    }
  }

  getSquaresForStep(step: number, isLast: boolean): Array<string> {
    const colors = this.props.colorsEnabled || false;
    const positions = this.props.positionsEnabled || false;

    const index = positions
      ? isLast
        ? this.state.positions[0]
        : this.state.positions[step]
      : 0;
    const color = colors
      ? isLast
        ? this.state.colors[0]
        : this.state.colors[step]
      : ACTIVE_COLOR;
    const result = [];
    for (let i = 0; i < 9; i++) {
      result.push(INACTIVE_COLOR);
    }
    result[index] = color;
    return result;
  }

  render() {
    const gamePlan = this.props.positionsEnabled
      ? { rows: 3, columns: 3 }
      : { rows: 1, columns: 1 };

    const squares = this.getSquaresForStep(0, false);
    return (
      <div
        style={{
          flexDirection: "row",
          justifyContent: "center",
          width: "33%",
        }}
      >
        <Grid
          margin={1}
          width={26}
          height={26}
          gameState={{ squares }}
          gamePlan={gamePlan}
        />
      </div>
    );
  }
}
