import React from 'react';
import Board from "./Board";
import {
  calculateWinner,
  getSwitchedNextStepValue,
  getStepValueByStepNumber,
  getHistoryUpToStep
} from "./game_helpers";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stepNumber: 0,
      nextStepValue: 'X',
      history: [
        { squares: Array(9).fill(null) }
      ]
    }
  }

  handleClick(squarePosition) {
    const historyUpToCurrentStep = getHistoryUpToStep(this.state.history, this.state.stepNumber);
    const currentGameState = historyUpToCurrentStep[historyUpToCurrentStep.length - 1];

    if (currentGameState.squares[squarePosition] || calculateWinner(currentGameState.squares)) {
      return;
    }

    let newSquares = currentGameState.squares.slice();
    newSquares[squarePosition] = this.state.nextStepValue;

    this.setState({
      history: historyUpToCurrentStep.concat({ squares: newSquares}),
      nextStepValue: getSwitchedNextStepValue(this.state.nextStepValue),
      stepNumber: historyUpToCurrentStep.length + 1
    });
  }

  jumpTo(stepNumber) {
    this.setState({
      stepNumber: stepNumber,
      nextStepValue: getStepValueByStepNumber(stepNumber)
    });
  }

  getStepsHistoryList(history) {
    if (history.length === 1) {
      return;
    }
    const listItems = history.map((step, stepNumber) => {
      const description = stepNumber > 0
        ? 'Go to turn ' + stepNumber
        : 'Go to start of the game';

      return (
        <li key={stepNumber}><button onClick={() => this.jumpTo(stepNumber)}>{description}</button></li>
      );
    });

    return <ol>{listItems}</ol>;
  }

  getGameStatus(squaresState, nextStepValue) {
    const winner = calculateWinner(squaresState);
    let status = 'Next player: ' + nextStepValue;

    if (winner) {
      status = 'The winner is ' + winner;
    }

    return status;
  }

  render() {
    const historyUpToCurrentStep = getHistoryUpToStep(this.state.history, this.state.stepNumber);
    const currentGameState = historyUpToCurrentStep[historyUpToCurrentStep.length - 1];
    const currentSquaresState = currentGameState.squares;

    const fullHistory = this.state.history;
    const moves = this.getStepsHistoryList(fullHistory);

    const status = this.getGameStatus(currentSquaresState, this.state.nextStepValue);

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={currentSquaresState}
            onClick={(squarePosition) => this.handleClick(squarePosition)}
          />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          {moves}
        </div>
      </div>
    );
  }
}

export default Game;