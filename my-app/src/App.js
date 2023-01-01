import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import "./App.css";
import logo from './logo.png'; // Tell webpack this JS file uses this image
// constants
const ROWS = 30,
  COLS = 50;
const dx = [0, 1, 1, 1, 0, -1, -1, -1];
const dy = [1, 1, 0, -1, -1, -1, 0, 1];
// helper functions
function createTiles() {
  const arr = Array(ROWS)
    .fill(0)
    .map((row) => new Array(COLS).fill(0));
  return arr;
}
function randomTiles() {
  const arr = Array(ROWS)
    .fill(0)
    .map((row) => new Array(COLS).fill(0))
    .map((x) => x.map((y) => (Math.random() < 0.4 ? 1 : 0)));
  return arr;
}
function App() {
  const [grid, setGrid] = useState(createTiles());
  const [running, setRunning] = useState(false);
  const count = (i, j, grid) => {
    let n = 0;
    for (let k = 0; k < 8; k++) {
      let newX = i + dx[k];
      let newY = j + dy[k];
      if (newX < 0 || newY < 0 || newX >= ROWS || newY >= COLS) continue;
      n += grid[newX][newY];
    }
    return n;
  };
  const runSimulation = (grid, running) => {
    if (!running) return;
    //clone grid
    let arr2 = createTiles();

    for (let i = 0; i < ROWS; i++)
      for (let j = 0; j < COLS; j++) arr2[i][j] = grid[i][j];
    //do algo
    const newGrid = grid.map((rows, i) =>
      rows.map((col, j) => {
        let n = count(i, j, arr2);

        // return n;
        if (arr2[i][j] && (n === 2 || n === 3)) {
          return 1;
        } else if (!arr2[i][j] && n === 3) return 1;
        else return 0;
      })
    );
    setGrid(newGrid);
    console.log({ running });
  };
  useEffect(() => {
    const interval = setInterval(() => {
      runSimulation(grid, running);
    }, 100);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [running, grid]);

  return (
    <div>
      <div className="title">
        <p>Conway's Game of Life</p>
      </div>
      <div className="gridContainer">
        <div className="grid">
          {grid.map((rows, i) =>
            rows.map((col, j) => (
              <div
                key={`${i}-${j}`}
                onClick={() => {
                  const newGrid = grid.map((r, a) =>
                    r.map((c, b) => {
                      if (a === i && b === j) return 1 - c;
                      else return c;
                    })
                  );
                  setGrid(newGrid);
                }}
                style={{ backgroundColor: col ? "#525a9e" : "#d1e0d5" }}
                className="node"
              />
            ))
          )}
        </div>
      </div>
      <div className="footer">
        
          <button className = "buttons"
            onClick={() => {
              setRunning(!running);
            }}
          >
            {running ? "Stop" : "Start"}
          </button>
          <button className = "buttons"
            onClick={() => {
              setGrid(randomTiles());
              setRunning(false);
            }}
          >
            Random
          </button>
          <button className = "buttons"
            onClick={() => {
              setRunning(false);
              setGrid(createTiles());
            }}
          >
            Clear
          </button>
        </div>
        <div className = "git">
          <a href = "https://github.com/EpzShadow/react-game-of-life">
            <img src = {logo} alt = "github link"/></a>
        </div>
      </div>
  );
}

export default App;
