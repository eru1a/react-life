import React from "react";
import * as Life from "../life/life";

type CellProps = {
  cell: Life.Cell;
  boardWidth: number;
  boardHeight: number;
  shadow: boolean;
  setCells: (leftClick: boolean) => void;
  handleMouseMove: () => void;
};

export const Cell: React.SFC<CellProps> = ({
  cell,
  boardWidth,
  boardHeight,
  shadow,
  setCells,
  handleMouseMove: handleMouseEnter,
}) => {
  let background = "white";
  if (cell && shadow) {
    background = "yellow";
  } else if (cell) {
    background = "lightgreen";
  } else if (shadow) {
    background = "lightblue";
  }

  return (
    <div
      onMouseDown={(e) => {
        switch (e.nativeEvent.which) {
          case 1:
            setCells(true);
            break;
          case 3:
            setCells(false);
            break;
          default:
            break;
        }
      }}
      onMouseEnter={() => handleMouseEnter()}
      style={{
        background,
        // 重なってしまうの良くない
        border: "1px solid #666",
        width: `${(1 / boardWidth) * 100}%`,
        height: `${(1 / boardHeight) * 100}%`,
        boxSizing: "border-box",
      }}
    ></div>
  );
};
