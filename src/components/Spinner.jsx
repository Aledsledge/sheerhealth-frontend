import React from "react";

const Spinner = () => {
  return (
    <div
      className="w-8 h-8 mt-5 rounded-full border-4 border-primaryColor/25 border-t-primaryColor animate-spin"
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
