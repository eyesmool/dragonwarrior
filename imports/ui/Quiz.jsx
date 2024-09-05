import React, { useRef, useState, useEffect } from 'react';
import HanziWriter from 'hanzi-writer';

export const Quiz = ({ char, height, width, quizState, setQuizState, setGameState, setCharsDone, newQuestion, setNewQuestion, setWriter, quizInfo}) => {
    const writerRef = useRef(null);
    const [showOutline, setShowOutline] = useState(false);
    const singleClickTimer = useRef(null); // Ref for single-click timer
    const clickDelay = 250; // Delay time to differentiate single and double click
    const [currStrokeNum, setCurrStrokeNum] = useState(0);
    const [totalStrokes, setTotalStrokes] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (newQuestion && writerRef.current) {
            console.log('new question');
            writerRef.current.hideCharacter();
            writerRef.current.hideOutline();
            writerRef.current.cancelQuiz();
            setNewQuestion(false);
            setGameState('start');
            setQuizState('start');
            setCurrStrokeNum(0);
        }
    }, [newQuestion]);

    const createWriter = (startingStroke) => {
        if (char === null) {
            console.log("char is null");
            return;
        }
        console.log(char);
        setGameState('drawing');
        writerRef.current = HanziWriter.create('grid-background-target', char, {
            width: width,
            height: height,
            showCharacter: false,
            showOutline: false,
            showHintAfterMisses: 3,
            highlightOnComplete: true,
            drawingWidth: 30,
            padding: 0,
            highlightColor: '#3be79a',
            strokeColor: '#cd5d67',
            quizStartStrokeNum: startingStroke,
        });
        setWriter(writerRef.current);
        writerRef.current.quiz({
            onCorrectStroke: function(strokeData) {
                setCurrStrokeNum((currStrokeNum) => currStrokeNum + 1);
                console.log(currStrokeNum);
            },
            onComplete: () => {
                console.log("anita max wynne!");
                setQuizState('charDone');
                setCharsDone((charsDone) => [...charsDone, char]);
                if (quizInfo.chars.length === 0) {
                    setGameState('end');
                }
                writerRef.current.hideOutline();
                writerRef.current.cancelQuiz();
                setCurrStrokeNum(0);
                setWriter(writerRef.current);
            },
        });
    };
    useEffect(() => {
        createWriter(0);
    }, [char, height, width]);

    useEffect(() => {
        if (quizState === 'clear') {
            console.log("clearing");
            writerRef.current.hideCharacter();
            writerRef.current.hideOutline();
            writerRef.current.cancelQuiz();
        }
    }, [quizState]);

    const handleDoubleTap = () => {
       if (!showOutline) {
           writerRef.current.showOutline();
           setShowOutline(true);
       } else {
           writerRef.current.hideOutline();
           setShowOutline(false);
       }
    };

    const skipQuizStroke = () => {
        if (writerRef.current) {
            console.log("skipping!")
            writerRef.current.skipQuizStroke();
            setCurrStrokeNum((currStrokeNum) => currStrokeNum + 1);
            setWriter(writerRef.current);
            // for fancy drawing
            // writerRef.current.animateStroke(currStrokeNum);
            // createWriter(currStrokeNum);
        }
    };

    const handleSingleTap = () => {
        if (writerRef.current && quizState !== 'charDone') {
            console.log(currStrokeNum)
            writerRef.current.animateStroke(currStrokeNum, {
                onComplete: () => {
                    writerRef.current.hideCharacter();
                    createWriter(currStrokeNum);
                }
            });
        }
        console.log("single tap");
    };

    const handleClick = () => {
        // Clear the timer if there's already one running (which means it's a double click)
        if (singleClickTimer.current) {
            clearTimeout(singleClickTimer.current);
            singleClickTimer.current = null;
            handleDoubleTap(); // Call double-click handler
        } else {
            // Set a timer to detect if another click occurs shortly (double click)
            singleClickTimer.current = setTimeout(() => {
                handleSingleTap(); // Call single-click handler
                singleClickTimer.current = null;
            }, clickDelay);
        }   
    };

    const handleMouseDown = (e) => {
        setStartPoint({ x: e.clientX, y: e.clientY });
        setIsDragging(false);  // Reset dragging flag
    };
    
    const handleMouseMove = (e) => {
        const distance = Math.sqrt(
            Math.pow(e.clientX - startPoint.x, 2) + Math.pow(e.clientY - startPoint.y, 2)
        );
        if (distance > 5) { // If the mouse moves more than 5px, treat as dragging
            setIsDragging(true);
        }
    };
    
    const handleMouseUp = () => {
        if (isDragging) {
            console.log("drag event");
            // Handle drag/draw event
        } else {
            handleClick();  // Handle as a click if it's not a drag
        }
    };
    
    return (
        <div>
            <svg xmlns="http://www.w3.org/2000/svg"
                width={width}
                height={height}
                id="grid-background-target"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                // onClick={handleClick}
            >
                <line x1="0" y1="0" x2={width} y2={height} stroke="#DDD" />
                <line x1={width} y1="0" x2="0" y2={height} stroke="#DDD" />
                <line x1={width / 2} y1="0" x2={width / 2} y2={height} stroke="#DDD" />
                <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#DDD" />
            </svg>
            {quizState !== 'charDone' && (
                <button onClick={skipQuizStroke}>Skip Stroke</button>
            )}
        </div>
    );
};
