import React, { useState, useEffect } from 'react';
import { Quiz } from './Quiz';
import { fetchQuizInfo } from './Characters';
import { motion } from "framer-motion";


export const Controller = () => {
    const winHeight = 400;
    const winWidth = 400;
    const [quizInfo, setQuizInfo] = useState(null);
    const [gameState, setGameState] = useState('start');
    const [currentChar, setCurrentChar] = useState(null);
    const [quizState, setQuizState] = useState('start');
    const [charsDone, setCharsDone] = useState([]);
    const [newQuestion, setNewQuestion] = useState(false);
    const [writer, setWriter] = useState(null);


    useEffect(() => {
        const loadQuizInfo = async () => {
            if (gameState === 'start' && quizState === 'start') {
                console.log('fetching quiz info');
                const quizData = await fetchQuizInfo();
                console.log(quizData);
                setQuizInfo(quizData);
                setCurrentChar(quizData.chars.shift());
            }
        };

        if (quizState === 'charDone' && quizInfo.chars.length > 0) {
            setGameState('AwaitingNextChar');
        }
        loadQuizInfo();
    }, [quizState, gameState]);

    useEffect(() => {
        if (quizInfo) {
            console.log("Quiz Info was updated!");
            console.log(quizInfo);
        }
    }, [quizInfo]);

    useEffect(() => {
        setGameState('start')
        setNewQuestion('false')
        setCharsDone([])
    }, [newQuestion]);


    return (
        quizInfo ? (
            <div>
                <h1>Instructions</h1>
                Tap for hint<br></br>
                Double tap to hide/show answer<br></br>
                <Quiz
                    char={currentChar}
                    height={winHeight}
                    width={winWidth}
                    quizState={quizState}
                    setQuizState={setQuizState}
                    setGameState={setGameState}
                    setCharsDone={setCharsDone}
                    newQuestion={newQuestion}
                    setNewQuestion={setNewQuestion}
                    currentChar={currentChar}
                    setWriter={setWriter}
                    quizInfo={quizInfo}
                />
                <h1>
                    {/* {quizInfo.hanzi} */}
                    {quizInfo.pinyin}
                    {quizInfo.english}
                </h1>
                <hr></hr>
                <h1>
                    {charsDone}
                </h1>
                {gameState === 'end' && (
                    <button onClick={() => setNewQuestion((true))}>New Question</button>
                )}
                {gameState === 'AwaitingNextChar' && (
                    <button onClick={() => {
                        writer.hideCharacter();
                        writer.hideOutline();
                        writer.cancelQuiz();
                        setCurrentChar(quizInfo.chars.shift());
                        setQuizState('start');
                    }}>Next Char</button>
                )}
            </div>
        ) : (
            <div>Loading...</div> // Render loading state while quizInfo is being fetched
        )
    );
};
