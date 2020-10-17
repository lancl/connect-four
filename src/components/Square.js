/**
 * About: a square on the board
 */

// Note: need to import React, even though it is not directly used below
import React from "react";
import classNames from "classnames";

const COLORS = {
  X: "blue",
  O: "orange",
};

const Square = ({ value, onClick }) => {
  const combinedStyles = classNames({
    square: true,
    blue: COLORS[value] === "blue",
    orange: COLORS[value] === "orange",
  });
  return (
    <td className={combinedStyles} onClick={onClick}>
      {value}
    </td>
  );
};

export default Square;
