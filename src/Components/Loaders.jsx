import React from "react";

const Loaders = () => {
  return (
    <div className="loaders">
      <button className="btn btn-primary" type="button" disabled>
        <span
          className="spinner-grow spinner-grow-sm"
          role="status"
          aria-hidden="true"
        ></span>
        <span
          className="spinner-grow spinner-grow-sm ms-2 me-3"
          role="status"
          aria-hidden="true"
        ></span>
        <span style={{ fontSize: "16px" }}>Loading Cht with Dr. Mega...</span>
      </button>
    </div>
  );
};

export default Loaders;
