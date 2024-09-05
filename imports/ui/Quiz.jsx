import React, { useRef, useState, useEffect } from 'react';
import HanziWriter from 'hanzi-writer';

export const Quiz = ({ char, height, width, setGameState }) => {
    const writerRef = useRef(null);
    const [showOutline, setShowOutline] = useState(false);

    useEffect(() => {
        const createWriter = () => {
            writerRef.current = HanziWriter.create('grid-background-target', char, {
                width: width,
                height: height,
                showCharacter: false,
                showOutline: false,
                showHintAfterMisses: 1,
                highlightOnComplete: true,
                drawingWidth: 30,
                padding: 0,
            });
            writerRef.current.quiz({
                onComplete: () => {
                    console.log("anita max wynne!")
                    setGameState('doneWithChar')
                }
            });
        };

        createWriter(); // Initialize HanziWriter when component mounts
    }, [char, height, width]); // Re-run if char, height, or width change

    const handleDoubleTap = () => {
       if (!showOutline) {
           writerRef.current.showOutline();
           setShowOutline(true);
       } else {
           writerRef.current.hideOutline();
           setShowOutline(false);}
    };

    return (
        <div>
            <svg xmlns="http://www.w3.org/2000/svg"
                width={width}
                height={height}
                id="grid-background-target"
                onDoubleClick={handleDoubleTap}
            >
                <line x1="0" y1="0" x2={width} y2={height} stroke="#DDD" />
                <line x1={width} y1="0" x2="0" y2={height} stroke="#DDD" />
                <line x1={width / 2} y1="0" x2={width / 2} y2={height} stroke="#DDD" />
                <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#DDD" />
            </svg>
        </div>
    );
};
