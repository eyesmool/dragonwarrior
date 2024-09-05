import React, { useRef, useState, useEffect } from 'react';
import HanziWriter from 'hanzi-writer';

export const Quiz = ({ char, height, width, setQuizState, setGameState, setCharsDone, nextQuestion, setNextQuestion}) => {
    const writerRef = useRef(null);
    const [showOutline, setShowOutline] = useState(false);
    useEffect(() => {
        if (nextQuestion && writerRef.current) {
            writerRef.current.hideCharacter();
            writerRef.current.hideOutline();
            writerRef.current.cancelQuiz();
            setNextQuestion(false);
        }
    }, [nextQuestion])
    useEffect(() => {
        const createWriter = () => {
            if (char === null) {
                console.log("char is null")
                return;
            }
            console.log(char)
            setGameState('drawing');
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
                    setQuizState('charDone');
                    setCharsDone((charsDone) => [...charsDone, char]);
                    writerRef.current.hideCharacter();
                    writerRef.current.hideOutline();
                    writerRef.current.cancelQuiz();
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

    const skipQuizStroke = () => {
        if (writerRef.current) {
            writerRef.current.skipQuizStroke();
            console.log("skip")
        }
    }

    return (
        char ? (
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
        ) : (
            <div>Loading...</div> // Render loading state while char is being fetched
        )
    );
};
