import React, { useState, useEffect } from 'react';
import { Quiz } from './Quiz';
import { fetchQuizInfo } from './Characters';

export const Controller = ({ gameState, setGameState }) => {
    const winHeight = 400;
    const winWidth = 400;
    const [quizInfo, setQuizInfo] = useState(null);
    const [currentChar, setCurrentChar] = useState(null);
    const [quizState, setQuizState] = useState('');
    const [charsDone, setCharsDone] = useState([]);
    const [nextQuestion, setNextQuestion] = useState(false);

    useEffect(() => {
        const loadQuizInfo = async () => {
            if (gameState === 'start') {
                console.log('fetching quiz info');
                const quizData = await fetchQuizInfo();
                console.log(quizData);
                setQuizInfo(quizData);
                setCurrentChar(quizData.chars.shift());
            }
        };
        if (quizState === 'charDone') {
            const next = quizInfo.chars.shift();
            if (next === undefined) {
                setGameState('start');
                setCharsDone([])
                setNextQuestion(true)
                setQuizState('start');
            } else {
                setCurrentChar(next);
                setQuizState('start');
            }
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
        setNextQuestion('false')
        setCharsDone([])
    }, [nextQuestion]);
    return (
        quizInfo ? (
            <div>
                <Quiz
                    char={currentChar}
                    height={winHeight}
                    width={winWidth}
                    setQuizState={setQuizState}
                    setGameState={setGameState}
                    setCharsDone={setCharsDone}
                    nextQuestion={nextQuestion}
                    setNextQuestion={setNextQuestion}
                />
                <h1>
                    {quizInfo.hanzi}
                    {quizInfo.pinyin}
                    {quizInfo.english}
                </h1>
                <hr></hr>
                <h1>
                    {charsDone}
                </h1>
                <button onClick={() => setNextQuestion((true))}>Next Question</button>
            </div>
        ) : (
            <div>Loading...</div> // Render loading state while quizInfo is being fetched
        )
    );
};
