import React, { useState, useEffect } from 'react';
import { Quiz } from './Quiz';
import { fetchQuizInfo } from './Characters';

export const Controller = ({ gameState, setGameState }) => {
    const winHeight = 400;
    const winWidth = 400;
    const [quizInfo, setQuizInfo] = useState(null); // Use state to store quizInfo

    useEffect(() => {
        const loadQuizInfo = async () => {
            if (gameState === 'start') { // Use === for comparison
                const quizData = await fetchQuizInfo(); // Await the async function
                setQuizInfo(quizData); // Update the state with fetched data
            }
        };

        loadQuizInfo(); // Call the function to fetch data
        // we can set the game state to the update from quiz to update here
        console.log(gameState);
    }, [gameState]);

    useEffect(() => {
        if (quizInfo) {
            console.log(quizInfo);
            console.log(quizInfo.chars)
        }
    }, [quizInfo]);

    return (
        quizInfo ? (
            <Quiz
                char={quizInfo.chars.pop()}
                height={winHeight}
                width={winWidth}
                setGameState={setGameState}
            />
        ) : (
            <div>Loading...</div> // Render loading state while quizInfo is being fetched
        )
    );
};
