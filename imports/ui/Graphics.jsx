import React from 'react';

const Graphics = ({ graphic }) => {
  if (!graphic || graphic.length === 0) {
    console.log("No graphics data available");
    return <div>No graphics available</div>;
  }

  return (
    <svg width="100%" height="100%" viewBox="0 0 1024 1024">
      <g transform="translate(0, 900) scale(1, -1)">
        {graphic.strokes.map((stroke, index) => (
          <path key={index} d={stroke} fill="black" stroke="black" strokeWidth="2" />
        ))}
      </g>
    </svg>
  );
};

export default Graphics;
