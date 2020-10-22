import React, { useState } from "react";
import { Cell } from "./Cell";
import * as Life from "../life/life";

type BoardProps = {
  board: Life.Board;
  pattern: Life.Pattern;
  setCells: (pos: Array<[number, number]>, cell: Life.Cell) => void;
};

export const Board: React.SFC<BoardProps> = ({ board, pattern, setCells }) => {
  const [shadow, setShadow] = useState<Array<[number, number]>>([]);

  const handleMouseEnter = (x: number, y: number) => {
    setShadow(pattern.pattern.map(([px, py]) => [x + px, y + py]));
  };

  const cells = [];
  for (let y = 0; y < board.height; y++) {
    for (let x = 0; x < board.width; x++) {
      cells.push(
        <Cell
          key={`${x}-${y}`}
          boardWidth={board.width}
          boardHeight={board.height}
          cell={board.getCell(x, y)}
          shadow={shadow.some(([sx, sy]) => x === sx && y === sy)}
          setCells={(leftClick) => {
            if (!leftClick) {
              setCells([[x, y]], false);
              return;
            }
            const pos: Array<[number, number]> = pattern.pattern
              .map(([px, py]): [number, number] => [x + px, y + py])
              .filter(([x, y]) => x >= 0 && x < board.width && y >= 0 && y < board.height);
            setCells(pos, true);
          }}
          handleMouseMove={() => handleMouseEnter(x, y)}
        />
      );
    }
  }

  return (
    <div
      className="board"
      style={{
        display: "flex",
        flexWrap: "wrap",
        width: "100%",
        height: "100%",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {cells}
    </div>
  );
};
