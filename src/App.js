import { useState } from "react";
import "./App.css";
import Board from "./component/Board";

function App() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]); // 9x9 array
  const [xIsNext, setxIsNext] = useState(true); // true or false
  const [stepNumber, setStepNumber] = useState(0);

  const calculateWinner = (squares) => {
    // 성공했을때의 경우의 수를 구함
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

    for (let index = 0; index < lines.length; index++) {
      const [a, b, c] = lines[index];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]; // x,o
      }
    }
    return null;
  };

  const current = history[stepNumber]; // 제일 최신(마지막) 배열
  const winner = calculateWinner(current.squares);

  // 상태의 따라서 순서 혹은 승자 표출하기
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next Player: " + (xIsNext ? "X" : "O");
  }

  /**
   * 클릭시 o,x 추가
   */
  const handleClick = (i) => {
    const newHistory = history.slice(0, stepNumber + 1); // 히스토리 배열 반환
    const newCurrent = newHistory[newHistory.length - 1]; // 맨 마지막 배열
    const newSquares = newCurrent.squares.slice(); // 맨 마지막 배열 복사

    // 승자가 결정되거나, 이미 값이 있는 경우
    if (calculateWinner(newSquares) || newSquares[i]) {
      return;
    }

    newSquares[i] = xIsNext ? "X" : "O";

    // 기존 history에 추가
    setHistory([...newHistory, { squares: newSquares }]);
    setxIsNext((prev) => !prev);
    setStepNumber(newHistory.length);
  };

  /**
   * 히스토리 버튼 클릭시 변경
   */
  const moves = history.map((step, move) => {
    const desc = move ? "Go to move #" + move : "Go to game start";
    return (
      <li key={move}>
        <button
          className="move-button"
          onClick={() => {
            jumpTo(move);
          }}
        >
          {desc}
        </button>
      </li>
    );
  });

  const jumpTo = (step) => {
    setStepNumber(step);
    setxIsNext(step % 2 === 0); // 짝수일때는 true로 반환
  };

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current.squares} onClick={(i) => handleClick(i)} status={status} />
      </div>
      <div className="game-info">
        <div className="status">{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

export default App;
