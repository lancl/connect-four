/**
 * About: the main component of this game/app
 */

import React from "react";
import Square from "./Square";

// About: the default board is one with 6 rows and 7 columns
const ROW_LEN = 6;
const COL_LEN = 7;

const NUMBER_TO_CONNECT = 4;

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowLen: ROW_LEN,
      colLen: COL_LEN,
      totalIndices: 0,
      squares: [], // 1D representation of the board
      columns: [], // The first available row # in each column
      xIsNext: true, // Player X plays first
      winner: null, // One of the 2 players
      adjustedRowLen: ROW_LEN,
      adjustedColLen: COL_LEN,
    };
  }

  componentDidMount() {
    console.log(`[component Did Mount]`);
    this.initGame();
  }

  // About: initialize a game, based on row len and col len
  initGame = () => {
    console.log(`[initGame]`);
    let { rowLen, colLen, adjustedRowLen, adjustedColLen } = this.state;

    // Adjust rowLen and colLen, if needed
    if (rowLen !== adjustedRowLen) rowLen = adjustedRowLen;
    if (colLen !== adjustedColLen) colLen = adjustedColLen;

    // Update/initialize the states
    this.setState({
      rowLen,
      colLen,
      totalIndices: rowLen * colLen,
      squares: new Array(rowLen * colLen).fill(null),
      columns: new Array(colLen).fill(rowLen - 1),
      xIsNext: true,
      winner: null,
    });
  };

  /**
   * Below are the methods (and helper functions)
   */

  // About: helper function, to derive square's index per row index and col index
  getSquareIndex = (r, c) => r * this.state.colLen + c;

  // About: render a board, with r rows and c cols
  // Note: board refreshes when any of the 3 states changes
  renderBoard = () => {
    const { squares, rowLen, colLen } = this.state;
    const output = [];

    for (let r = 0; r < rowLen; r++) {
      const currentRow = [];
      for (let c = 0; c < colLen; c++) {
        const sIndex = this.getSquareIndex(r, c);
        const currentSquare = (
          // Note:'sIndex' is passed as a closure variable
          <Square
            value={squares[sIndex]}
            onClick={() => this.handleClickOnBoard(c)} // 'c' for column's index
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
  handleClickOnBoard = (cIndex) => {
    console.log(`###### Handling click on board; cIndex: ${cIndex}`);

    // Step 1: check if there is already a winner
    if (this.state.winner !== null) {
      window.alert(`Game over! Winner is ${this.state.winner}.`);
      return;
    }

    // Step 2: check if current column is full
    const rIndex = this.state.columns[cIndex]; // The first available row's index
    if (rIndex < 0) return;
    // Else (column is available): then determine the square index to update
    const sIndex = this.getSquareIndex(rIndex, cIndex);

    // Step 3: make a copy of the current states
    const squares = this.state.squares.slice();
    const columns = this.state.columns.slice();

    // Step 4: update the copies of states
    const player = this.state.xIsNext ? "X" : "O"; // Determine the current player
    squares[sIndex] = player;
    columns[cIndex] -= 1; // Move the avaiable spot per column up by 1 row

    // Step 5: check if current player just won
    let winner = null;
    if (this.checkIfPlayerWin(rIndex, cIndex, player, squares)) {
      winner = player;
    }

    // Step 6: update the states
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
    const { rowLen, colLen } = this.state;
    if (r < 0) return false;
    if (r >= rowLen) return false;
    if (c < 0) return false;
    if (c >= colLen) return false;
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
      if (counter === NUMBER_TO_CONNECT) return true;
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

  /**
   * Below are the methods related to adjusting board size
   */

  updateRowSize = (event) => {
    console.log(`[updateRowSize]`);
    this.setState({ adjustedRowLen: Number.parseInt(event.target.value) });
  };

  updateColSize = (event) =>
    this.setState({ adjustedColLen: Number.parseInt(event.target.value) });

  handleSubmit = (event) => {
    this.initGame();
    event.preventDefault();
  };

  render() {
    // debugger;
    console.log(`[render]`);
    return (
      <div>
        <h2>Winner: {this.state.winner}</h2>
        <table className="board">{this.renderBoard()}</table>
        <div className="adjust-size">
          <p>Adjust board size and start a new game (default is 6 by 7): </p>
          <form>
            <input
              name="rows"
              placeholder="Rows"
              onChange={this.updateRowSize}
            ></input>
            <input
              name="cols"
              placeholder="Columns"
              onChange={this.updateColSize}
            ></input>
            <input
              type="submit"
              value="Submit"
              onClick={this.handleSubmit}
            ></input>
          </form>
        </div>
      </div>
    );
  }
}

export default Board;
