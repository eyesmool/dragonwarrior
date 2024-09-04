import React, { useState } from 'react';
import DrawingCanvas from './DrawingCanvas.jsx';
import HanziWriter from 'hanzi-writer';

export const App = () => {
  const [graphic, setGraphic] = useState('');
  const [hanzi, setHanzi] = useState('');
  const [pinyin, setPinyin] = useState('');
  const [english, setEnglish] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleButtonClick = () => {
    setIsAnimating(!isAnimating);
  };

  return (
    <div>
      <div>
        <h1>{isAnimating ? 'Animation' : 'Draw'}</h1>
      </div>
      <hr></hr>
      <div>
        <h1>{hanzi}</h1>
        <h2>{pinyin}</h2>
        <h3>{english}</h3>
        <button onClick={handleButtonClick}>
          {isAnimating ? 'Draw' : 'Animate'}
        </button>
      </div>
      <hr></hr>
        <DrawingCanvas
          setGraphic={setGraphic}
          setHanzi={setHanzi}
          setPinyin={setPinyin}
          setEnglish={setEnglish}
          isAnimating={isAnimating}
        />
      </div>
  );
};
