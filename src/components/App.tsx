import React, { useState } from "react";
import { Board } from "./Board";
import * as Life from "../life/life";
import styled from "styled-components";

const BoardArea = styled.div`
  @media (min-aspect-ratio: 99/100) {
    width: 90vh;
    height: 90vh;
  }
  @media (max-aspect-ratio: 100/99) {
    width: 90vw;
    height: 90vw;
  }

  margin: auto;
`;

export const App = () => {
  const [board, setBoard] = useState(new Life.Board(20, 20));
  const [timerID, setTimerID] = useState<number | undefined>(undefined);
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
      <div className="container_app" style={{ display: "flex", justifyContent: "center" }}>
        <div
          className="container_board_buttons"
          style={{
            display: "flex",
            flexFlow: "column",
            margin: 5,
          }}
        >
          <BoardArea>
            <Board board={board} pattern={pattern} setCells={setCells} />
          </BoardArea>
          <div
            className="conainer_buttons"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              margin: 5,
            }}
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
