import React, { useState } from 'react';

const TapComponent = () => {
  const [singleTapTimeout, setSingleTapTimeout] = useState(null);
  const delay = 200; // Time window to detect a double tap

  const handleSingleTap = () => {
    console.log('Single tap');
    // Perform your single tap logic here
  };

  const handleDoubleTap = () => {
    console.log('Double tap');
    // Perform your double tap logic here
  };

  const handleClick = () => {
    if (singleTapTimeout) {
      clearTimeout(singleTapTimeout);
      setSingleTapTimeout(null);
      handleDoubleTap(); // Detected as a double tap
    } else {
      const timeoutId = setTimeout(() => {
        handleSingleTap(); // If no double tap detected
        setSingleTapTimeout(null);
      }, delay);
      setSingleTapTimeout(timeoutId);
    }
  };

  return <div onClick={handleClick}>Tap me</div>;
};

export default TapComponent;
