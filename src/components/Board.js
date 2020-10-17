/**
 * Game rules:
 * (1) 2 players: X and Y; X starts playing, then the two take turns
 *
 * [Todo] Add logic from calculateWinner()
 */

import React from "react";
import Square from "./Square";

// About: the default board is one with 6 rows and 7 columns
// Note: the sizes for rows and columns can be easily customized for bigger boards
const ROW_LEN = 3;
const COL_LEN = 3;
const TOTAL_INDICES = ROW_LEN * COL_LEN;

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(TOTAL_INDICES).fill(null),
      xIsNext: true, // Player X plays first
      columns: Array(COL_LEN).fill(ROW_LEN - 1), // The first available row # in each column
    };
  }

  /**
   * The methods are as below
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
      output.push(<div className="board-row">{currentRow}</div>);
    }

    return output;
  };

  // renderSquare = (sIndex, c) => (
  //   <Square
  //     value={this.state.squares[sIndex]}
  //     onClick={() => this.handleClick(c)} // 'c' for column's index
  //   />
  // );

  // About: handle a player's click on the board
  // Parameters: square index, column index
  handleClick = (cIndex) => {
    // window.alert(`Button is clicked!`);
    // Step; check if current column is full
    const rIndex = this.state.columns[cIndex]; // The first available row's index
    if (rIndex < 0) return;
    // Else (column is available): then determine the square index to update
    const sIndex = this.getSquareIndex(rIndex, cIndex);

    // Step: make a copy of the current states
    const squares = this.state.squares.slice();
    const columns = this.state.columns.slice();

    // Step: update the copies of states
    squares[sIndex] = this.state.xIsNext ? "X" : "O"; // Determine the current player
    columns[cIndex] -= 1; // Move the avaiable spot per column up by 1 row

    // Step: update the states
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
      columns: columns,
    });
  };

  render() {
    return <div className="board">{this.renderBoard()}</div>;
    // return (
    //   <div>
    //     <div className="board-row">
    //       {this.renderSquare(0, 0)}
    //       {this.renderSquare(1, 1)}
    //     </div>

    //     <div className="board-row">
    //       {this.renderSquare(2, 0)}
    //       {this.renderSquare(3, 1)}
    //     </div>
    //   </div>
    // );
  }
}

export default Board;

// Note: somehow, Instant app's more concise version of 'state' does not work here (maybe
// it is due to some webpack config)
// state = {
//   squares: Array(TOTAL_INDICES).fill(null),
//   xIsNext: true, // Player X plays first
// };
