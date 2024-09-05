import { parseHTML } from '../../characters/parser';
import { parseGraphics } from '../../characters/graphics';
import React, { useRef, useState, useEffect } from 'react';


const fetchQuizInfo = async () => {
    var quizInfo = {
        hanzi: '',
        pinyin: '',
        english: '',
        chars: [] as String[],
        background: ''
    };
    try {
        const dictionary = parseHTML();
        const graphics = await parseGraphics();
        const keys = Object.keys(dictionary);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const randomItem = dictionary[randomKey];
        quizInfo.hanzi = randomKey;
        quizInfo.pinyin = randomItem.pinyin;
        quizInfo.english = randomItem.english;
        for (let i = 0; i < randomKey.length; i++) {
            const character = randomKey.charAt(i);
            if (graphics) {
                const graphicsData = graphics.get(character);
                if (character && graphicsData) {
                    console.log(character)
                    quizInfo.chars.push(character)
                }
            }
        }
    } catch (error) {
        console.error('Error fetching and setting data:', error);
    }
    return quizInfo;
};

export {fetchQuizInfo}