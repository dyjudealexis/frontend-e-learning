import React from "react";

const Loader = ({ className = "", hovered = false }) => {
  return (
    <span
      className={`
        ml-1.5 h-4 w-4 animate-spin rounded-full border-2 border-solid
        border-t-white 
        ${hovered ? "group-hover:border-t-primary" : ""}
        border-r-transparent border-b-transparent border-l-transparent
        ${className}
      `}
    ></span>
  );
};

export default Loader;
