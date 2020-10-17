/**
 * About: the main component of this game/app
 */

import React from "react";
import Square from "./Square";

// About: the default board is one with 6 rows and 7 columns
// Note: the sizes for rows and columns can be easily customized for bigger boards
const ROW_LEN = 6;
const COL_LEN = 7;
const TOTAL_INDICES = ROW_LEN * COL_LEN;

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(TOTAL_INDICES).fill(null),
      xIsNext: true, // Player X plays first
      columns: Array(COL_LEN).fill(ROW_LEN - 1), // The first available row # in each column
      winner: null, // One of the 2 players
    };
  }

  /**
   * Below are the methods (and helper functions)
   */

  // About: helper function, to derive square's index per row index and col index
  getSquareIndex = (r, c) => r * COL_LEN + c;

  // About: render a board, with r rows and c cols
  renderBoard = () => {
    // console.log(`### Rendering the board!`)
    const output = [];

    for (let r = 0; r < ROW_LEN; r++) {
      const currentRow = [];
      for (let c = 0; c < COL_LEN; c++) {
        const sIndex = this.getSquareIndex(r, c);
        const currentSquare = (
          // Note:'sIndex' is passed as a closure variable
          <Square
            value={this.state.squares[sIndex]}
            onClick={() => this.handleClick(c)} // 'c' for column's index
          />
        );
        currentRow.push(currentSquare);
      }
      output.push(<tr>{currentRow}</tr>);
    }

    return output;
  };

  // About: handle a player's click on the board
  // Parameters: square index, column index
  handleClick = (cIndex) => {
    // Step: check if there is already a winner
    if (this.state.winner !== null) {
      window.alert(`Game over! Winner is ${this.state.winner}.`);
      return;
    }

    // Step; check if current column is full
    const rIndex = this.state.columns[cIndex]; // The first available row's index
    if (rIndex < 0) return;
    // Else (column is available): then determine the square index to update
    const sIndex = this.getSquareIndex(rIndex, cIndex);

    // Step: make a copy of the current states
    const squares = this.state.squares.slice();
    const columns = this.state.columns.slice();

    // Step: update the copies of states
    const player = this.state.xIsNext ? "X" : "O"; // Determine the current player
    squares[sIndex] = player;
    columns[cIndex] -= 1; // Move the avaiable spot per column up by 1 row

    // Step: check if current player just won
    let winner = null;
    if (this.checkIfPlayerWin(rIndex, cIndex, player, squares)) {
      winner = player;
    }

    // Step: update the states
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
      columns: columns,
      winner: winner,
    });
  };

  // About: check if there is a winner, after each turn
  // Input: row and col indices, of the most recent ball
  checkIfPlayerWin = (r, c, player, squares) => {
    // If this player wins on any of the 4 lines
    if (this.hasHorizontalWin(r, c, player, squares)) return true;
    if (this.hasVerticallWin(r, c, player, squares)) return true;
    if (this.hashDiagonalWin(r, c, player, squares)) return true;
    if (this.hasAntiDiaWin(r, c, player, squares)) return true;

    return false; // ELse this player has not won (yet)
  };

  // About: helper function; if a pair of indices are within the bound of the board
  isInBound = (r, c) => {
    if (r < 0) return false;
    if (r >= ROW_LEN) return false;
    if (c < 0) return false;
    if (c >= COL_LEN) return false;
    return true;
  };

  // About: helper function, for all 4 lines' winner check
  hasWinOnLine = (
    r,
    c,
    player,
    squares,
    rDelta1,
    cDelta1,
    rDelta2,
    cDelta2
  ) => {
    let counter = 1;
    // For square 1
    let r1 = r + rDelta1,
      c1 = c + cDelta1;
    // For square 2
    let r2 = r + rDelta2,
      c2 = c + cDelta2;

    while (this.isInBound(r1, c1) || this.isInBound(r2, c2)) {
      if (this.isInBound(r1, c1)) {
        const sIndex1 = this.getSquareIndex(r1, c1);
        if (squares[sIndex1] && squares[sIndex1] === player) {
          counter++;
          r1 = r1 + rDelta1;
          c1 = c1 + cDelta1;
        } else {
          r1 = -1;
        }
      }
      if (this.isInBound(r2, c2)) {
        const sIndex2 = this.getSquareIndex(r2, c2);
        if (squares[sIndex2] && squares[sIndex2] === player) {
          counter++;
          r2 = r2 + rDelta2;
          c2 = c2 + cDelta2;
        } else {
          r2 = -1;
        }
      }
      if (counter === 4) return true;
    }

    return false;
  };

  // About: helper function, for calculateWinner()
  hasHorizontalWin = (r, c, player, squares) =>
    this.hasWinOnLine(r, c, player, squares, 0, -1, 0, 1);

  // About: helper function, for calculateWinner()
  hasVerticallWin = (r, c, player, squares) =>
    this.hasWinOnLine(r, c, player, squares, -1, 0, 1, 0);

  // About: helper function, for calculateWinner()
  hashDiagonalWin = (r, c, player, squares) =>
    this.hasWinOnLine(r, c, player, squares, 1, 1, -1, -1);

  hasAntiDiaWin = (r, c, player, squares) =>
    this.hasWinOnLine(r, c, player, squares, 1, -1, -1, 1);

  render() {
    return (
      <div>
        <p>Winner: {this.state.winner}</p>
        <table className="board">{this.renderBoard()}</table>
      </div>
    );
  }
}

export default Board;

// Note: somehow, Instant app's more concise version of 'state' does not work here (maybe
// it is due to some webpack config)
// state = {
//   squares: Array(TOTAL_INDICES).fill(null),
//   xIsNext: true, // Player X plays first
// };
