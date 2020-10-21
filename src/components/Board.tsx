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

  const boardElem = [];
  for (let y = 0; y < board.height; y++) {
    const row = [];
    for (let x = 0; x < board.width; x++) {
      row.push(
        <Cell
          key={x}
          cell={board.getCell(x, y)}
          shadow={shadow.some(([sx, sy]) => x === sx && y === sy)}
          setCells={(leftClick) => {
            if (!leftClick) {
              setCells([[x, y]], false);
              return;
            }
            const pos: Array<[number, number]> = pattern.pattern.map(([px, py]) => [
              x + px,
              y + py,
            ]);
            setCells(pos, true);
          }}
          handleMouseMove={() => handleMouseEnter(x, y)}
        />
      );
    }
    boardElem.push(
      <div
        key={y}
        className="board-row"
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {row}
      </div>
    );
  }

  return (
    <div
      className="board"
      style={{
        display: "flex",
        flexDirection: "column",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {boardElem}
    </div>
  );
};
