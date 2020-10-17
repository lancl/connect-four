/**
 * About: a square on the board
 */

// Note: need to import React, even though it is not directly used below
import React from "react";

const Square = ({ value, onClick }) => (
  <button className="square" onClick={onClick}>
    {value}
  </button>
);

export default Square;
