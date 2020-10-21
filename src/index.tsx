import React, { useState } from "react";
import ReactDOM from "react-dom";
import * as Life from "./life";

const cellSize = 20;

type CellProps = {
  cell: Life.Cell;
  shadow: boolean;
  setCells: (leftClick: boolean) => void;
  handleMouseMove: () => void;
};

const Cell: React.SFC<CellProps> = ({
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

type BoardProps = {
  board: Life.Board;
  pattern: Life.Pattern;
  setCells: (pos: Array<[number, number]>, cell: Life.Cell) => void;
};

const Board: React.SFC<BoardProps> = ({ board, pattern, setCells }) => {
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

const App = () => {
  const [board, setBoard] = useState(new Life.Board(20, 20));
  const [timerID, setTimerID] = useState<NodeJS.Timeout | undefined>(undefined);
  const [runInterval, setRunInterval] = useState(50);
  const [pattern, setPattern] = useState(Life.patterns[0]);

  const setCells = (pos: Array<[number, number]>, cell: Life.Cell) => {
    setBoard((board) => {
      const clone = board.clone();
      pos.forEach(([x, y]) => clone.setCell(x, y, cell));
      return clone;
    });
  };

  const step = () => {
    setBoard((board) => {
      const clone = board.clone();
      clone.step();
      return clone;
    });
  };

  const run = () => {
    if (timerID !== undefined) return;
    setTimerID(setInterval(step, runInterval) as NodeJS.Timeout);
  };

  const stop = () => {
    if (timerID === undefined) return;
    clearInterval(timerID);
    setTimerID(undefined);
  };

  const clear = () => {
    if (timerID !== undefined) {
      stop();
    }
    setBoard((board) => {
      const clone = board.clone();
      clone.clear();
      return clone;
    });
  };

  return (
    <div>
      <div className="container_app" style={{ display: "flex", justifyContent: "center" }}>
        <div
          className="container_board_buttons"
          style={{ display: "flex", flexDirection: "column", margin: 5 }}
        >
          <Board board={board} pattern={pattern} setCells={setCells} />
          <div
            className="conainer_buttons"
            style={{ display: "flex", justifyContent: "center", margin: 5 }}
          >
            <button onClick={step}>step</button>
            <button disabled={timerID !== undefined} onClick={run}>
              run
            </button>
            <button disabled={timerID === undefined} onClick={stop}>
              stop
            </button>
            <button onClick={clear}>clear</button>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={runInterval}
              disabled={timerID !== undefined}
              onChange={(e) => setRunInterval(Number(e.target.value))}
            />
            <span>{runInterval}(ms)</span>
            <span>{board.generation}世代</span>
          </div>
        </div>
        <form className="pattern_list" style={{ margin: 5 }}>
          <select
            size={Life.patterns.length}
            value={pattern.name}
            onChange={(e) => {
              const p = Life.patterns.find((p) => p.name === e.target.value);
              if (p === undefined) {
                // ???
                console.error(`cannot find pattern ${e.target.value}`);
                return;
              }
              setPattern(p);
            }}
          >
            {Life.patterns.map((pattern, i) => (
              <option key={i} value={pattern.name}>
                {pattern.name}
              </option>
            ))}
          </select>
        </form>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
