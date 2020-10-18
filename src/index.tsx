import React, { useState } from "react";
import ReactDOM from "react-dom";
import * as Life from "./life";

const cellSize = 20;

type CellProps = {
  cell: Life.Cell;
  handleClick: () => void;
};

const Cell: React.SFC<CellProps> = ({ cell, handleClick }) => {
  return (
    <div
      className="cell"
      style={{
        background: cell ? "lightgreen" : "white",
        border: "1px solid #000",
        padding: 0,
        width: cellSize,
        height: cellSize,
        lineHeight: cellSize,
        marginTop: -1,
        marginRight: -1,
      }}
      onMouseDown={() => handleClick()}
    ></div>
  );
};

type BoardProps = {
  board: Life.Board;
  handleClick: (x: number, y: number) => void;
};

const Board: React.SFC<BoardProps> = ({ board, handleClick }) => {
  // const [leftClick, setLeftClick] = useState(false);

  const boardElem = [];
  for (let y = 0; y < board.height; y++) {
    const row = [];
    for (let x = 0; x < board.width; x++) {
      row.push(<Cell key={x} cell={board.getCell(x, y)} handleClick={() => handleClick(x, y)} />);
    }
    boardElem.push(
      <div key={y} className="board-row">
        {row}
      </div>
    );
  }

  return (
    <div
      className="board"
      style={{
        display: "flex",
        width: cellSize * (board.width + 1),
        height: cellSize * (board.height + 1),
      }}
      // onMouseDown={(e) => {
      //   if (e.nativeEvent.which === 1) {
      //     setLeftClick(true);
      //   }
      // }}
      // onMouseUp={(e) => {
      //   if (e.nativeEvent.which === 1) {
      //     setLeftClick(false);
      //   }
      // }}
      // onMouseLeave={() => {
      //   setLeftClick(false);
      // }}
    >
      {boardElem}
    </div>
  );
};

const App = () => {
  const [board, setBoard] = useState(new Life.Board());
  const [timerID, setTimerID] = useState<NodeJS.Timeout | undefined>(undefined);
  const [runInterval, setRunInterval] = useState(50);

  const handleClick = (x: number, y: number) => {
    setBoard((board) => {
      const clone = board.clone();
      clone.setCell(x, y, true);
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
    setTimerID(setInterval(step, runInterval));
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
      <Board board={board} handleClick={handleClick} />
      <div>
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
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
