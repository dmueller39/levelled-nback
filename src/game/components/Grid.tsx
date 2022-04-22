// @flow
import * as React from "react";
import "./Grid.css";

const Spacing = 1;

type Props = {
  margin: number;
  width: number;
  height: number;
  gameState: { squares: Array<string> };
  gamePlan: { columns: number; rows: number };
};

type State = {};

export default class NBackGrid extends React.Component<Props, State> {
  _getColor = (index: number) => {
    return this.props.gameState.squares[index];
  };

  render() {
    const views = [];

    const { columns, rows } = this.props.gamePlan;

    // this won't work for customizable columns/rows, but its good enough for now
    const squareWidth = Math.floor(
      (this.props.width - this.props.margin * 2.0 - Spacing * (columns - 1)) /
        columns
    );

    const squareHeight = Math.floor(
      (this.props.height - this.props.margin * 2.0 - Spacing * (rows - 1)) /
        rows
    );

    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        const key = "" + i + "_" + j;
        const left = i * (squareWidth + Spacing) + this.props.margin;
        const top = j * (squareHeight + Spacing) + this.props.margin;
        const backgroundColor = this._getColor(j * rows + i);
        const viewStyle = {
          left,
          top,
          height: squareHeight,
          width: squareWidth,
          backgroundColor,
        };
        views.push(<div key={key} style={viewStyle} className="square" />);
      }
    }

    return (
      <div
        style={{
          width: this.props.width,
          height: this.props.height,
          margin: "auto",
          position: "relative",
          backgroundColor: "black",
        }}
      >
        {views}
      </div>
    );
  }
}
