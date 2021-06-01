import React from 'react';
import Board from "./Board";

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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stepNumber: 0,
      xIsNext: true,
      history: [
        {squares: Array(9).fill(null)}
      ]
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];

    if (calculateWinner(current.squares) || current.squares[i]) {
      return;
    }

    let newSquares = current.squares.slice();
    newSquares[i] = this.state.xIsNext ? 'X' : 'O';

    let newHistory = history.slice();
    newHistory.push({squares: newSquares});

    this.setState({
      history: newHistory,
      xIsNext: !this.state.xIsNext,
      stepNumber: newHistory.length
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    const moves = this.state.history.map((step, stepIndex) => {
      const description = stepIndex > 0
        ? 'Go to turn ' + stepIndex
        : 'Go to start of the game';

      return (
        <li key={stepIndex}><button onClick={() => this.jumpTo(stepIndex)}>{description}</button></li>
      );
    });
    let status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    if (winner) {
      status = 'The winner is ' + winner;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

export default Game;