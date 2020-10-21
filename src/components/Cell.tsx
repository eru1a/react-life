import React from "react";
import * as Life from "../life/life";

// 画面の大きさに合わせて変更出来るようにするには...?
const cellSize = 20;

type CellProps = {
  cell: Life.Cell;
  shadow: boolean;
  setCells: (leftClick: boolean) => void;
  handleMouseMove: () => void;
};

export const Cell: React.SFC<CellProps> = ({
  cell,
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
        border: "1px solid #000",
        padding: 0,
        width: cellSize,
        height: cellSize,
        lineHeight: cellSize,
        marginTop: -1,
        marginRight: -1,
      }}
    ></div>
  );
};
