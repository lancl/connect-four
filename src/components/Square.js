/**
 * About: a square on the board
 */

// Note: need to import React, even though it is not directly used below
import React from "react";

const Square = ({ value, onClick }) => (
  <td className="square" onClick={onClick}>
    {value}
  </td>
);

export default Square;
