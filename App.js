import React, { useState, useEffect } from 'react';
import './App.css';

function Square({ value, onSquareClick, winning }) {
  return (
    <button className={`square ${winning ? 'winning-square' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, winnerLine }) {
  function handleClick(i) {
    if (winnerLine || squares[i] || !xIsNext) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = 'X'; 
    onPlay(nextSquares);
  }

  useEffect(() => {
    if (!xIsNext) {
      const timerId = setTimeout(() => {
        const emptySquares = squares.reduce((acc, val, index) => (val === null ? acc.concat(index) : acc), []);
        const randomIndex = Math.floor(Math.random() * emptySquares.length);
        const computerMove = emptySquares[randomIndex];
        const nextSquares = squares.slice();
        nextSquares[computerMove] = 'O';

        const computerWinner = calculateWinner(nextSquares);
        if (computerWinner) {
          onPlay(nextSquares, computerWinner);
        } else {
          onPlay(nextSquares);
        }
      }, 0); 

      return () => clearTimeout(timerId);
    }
  }, [squares, xIsNext, onPlay]);

  return (
    <div className="board">
      {Array.from({ length: 3 }, (_, row) => (
        <div key={row} className="board-row">
          {Array.from({ length: 3 }, (_, col) => {
            const index = row * 3 + col;
            return (
              <Square
                key={index}
                value={squares[index]}
                onSquareClick={() => handleClick(index)}
                winning={winnerLine && winnerLine.includes(index)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);

  function handlePlay(nextSquares, winner) {
    const newHistory = history.slice(0, currentMove + 1);
    setHistory([...newHistory, nextSquares]);
    setCurrentMove(newHistory.length);
    setXIsNext(!xIsNext); 

    if (winner || calculateWinner(nextSquares) || currentMove === 8) {
      return;
    }
  }

  function restartGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setXIsNext(true);
  }

  const currentSquares = history[currentMove];
  const winner = calculateWinner(currentSquares);
  const winnerLine = winner ? getWinnerLine(currentSquares, winner) : null;

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (currentMove === 9) {
    status = 'It\'s a draw!';
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  const isWinnerClass = winner ? 'winner' : '';

  return (
    <div className={`game ${isWinnerClass}`}>
      <div className="game-info">
        <div className={`status-above-board ${isWinnerClass}`}>{status}</div>
      </div>
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} winnerLine={winnerLine} />
      </div>
      <div className="game-info">
        <button className="restart" onClick={restartGame}>
          Restart Game
        </button>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

function getWinnerLine(squares, winner) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] === winner && squares[b] === winner && squares[c] === winner) {
      return line;
    }
  }

  return null;
}

export default Game;
