import React from "react";

const Loader  = ({ className = "" }) => {
  return (
    <span
      className={`ml-1.5 h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-t-transparent ${className}`}
    ></span>
  );
};

export default Loader;
