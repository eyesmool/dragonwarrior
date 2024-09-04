import React, { useRef, useState, useEffect } from 'react';
import { parseHTML } from '../../characters/parser';
import { parseGraphics } from '../../characters/graphics';
import HanziWriter from 'hanzi-writer';

const DrawingCanvas = ({ setGraphic, setHanzi, setPinyin, setEnglish, isAnimating }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [context, setContext] = useState(null);
    const [lineWidth] = useState(30);
    const [graphic, updateGraphic] = useState('');
    const [showBackground, setShowBackground] = useState(true);
    const [char, setChar] = useState('');
    const writerRef = useRef(null);
    const winHeight = 400;
    const winWidth = 400;
    const [doubleTapHandler, setDoubleTapHandler] = useState(null);
    const [gameArray, setGameArray] = useState([]);

    useEffect(() => {
        if (canvasRef.current && !isAnimating) {
            const ctx = canvasRef.current.getContext('2d');
            setContext(ctx);
        }
    }, [canvasRef, isAnimating]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dictionary = parseHTML();
                const graphics = await parseGraphics();
                const keys = Object.keys(dictionary);
                const randomKey = keys[Math.floor(Math.random() * keys.length)];
                const randomItem = dictionary[randomKey];
                setHanzi(randomKey);
                setPinyin(randomItem.pinyin);
                setEnglish(randomItem.english);
                for (let i = 0; i < randomKey.length; i++) {
                    const character = randomKey.charAt(i);
                    const graphicsData = graphics.get(character);
                    if (character && graphicsData) {
                        updateGraphic(graphicsData);
                        setBackground(graphicsData);
                        setGraphic(graphicsData);
                        setChar(character);
                        gameArray.push(character);
                    }
                }
            } catch (error) {
                console.error('Error fetching and setting data:', error);
            }
        };
        fetchData();
    }, [setGraphic, setHanzi, setPinyin, setEnglish]);

    const startDrawing = (event) => {
        if (!context) return;
        const { offsetX, offsetY } = event.nativeEvent;
        context.beginPath();
        context.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = (event) => {
        if (!isDrawing || !context) return;
        const { offsetX, offsetY } = event.nativeEvent;
        context.lineTo(offsetX, offsetY);
        context.lineWidth = lineWidth;
        context.stroke();
    };

    const stopDrawing = () => {
        if (context) {
            context.closePath();
        }
        setIsDrawing(false);
    };

    const setBackground = (graphicData) => {
        if (context && graphicData && showBackground) {
            const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
                                <g transform="translate(0, 900) scale(1, -1)">
                                    ${graphicData.strokes.map(stroke => `<path d="${stroke}" fill="lightgray" stroke="lightgray" strokeWidth="2" />`).join('')}
                                </g>
                            </svg>`;

            const img = new Image();
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            img.onload = () => {
                context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                context.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
                URL.revokeObjectURL(url);
            };

            img.src = url;
        } else {
            if (context) {
                context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }
        }
    };

    const handleDoubleClick = () => {
        setShowBackground(prevShowBackground => !prevShowBackground);
        setBackground(graphic);
    };

    const handleDoubleTap = () => {
        if (!doubleTapHandler.showOutline) {
            doubleTapHandler.writer.showOutline();
            doubleTapHandler.showOutline = true;
        } else {
            doubleTapHandler.writer.hideOutline();
            doubleTapHandler.showOutline = false;
        }
    };

    useEffect(() => {
        if (isAnimating && char) {
            writerRef.current = HanziWriter.create('grid-background-target', char, {
                width: 400,
                height: 400,
                showCharacter: false,
                showOutline: false,
                showHintAfterMisses: 1,
                highlightOnComplete: true,
                drawingWidth: 30,
                padding: 0
            });
    
            // Initialize double-tap handler
            const doubleTapHandler = new HanziWriterDoubleTapHandler(writerRef.current);
            setDoubleTapHandler(doubleTapHandler);
            doubleTapHandler.writer.quiz({
                onComplete: () => {
                    console.log("anita max wynne!")
                    console.log(gameArray)
                    console.log(gameArray.shift())
                }
            });
    
            // Clean up the double-tap handler on component unmount
            return () => doubleTapHandler.destroy();
        }
    }, [isAnimating, char]);
    

    const animationView = () => (
        <div>
            <svg xmlns="http://www.w3.org/2000/svg"
                width={winWidth} 
                height={winHeight} 
                id="grid-background-target"
                onDoubleClick={handleDoubleTap}
            >
                <line x1="0" y1="0" x2={winWidth} y2={winHeight} stroke="#DDD" />
                <line x1={winWidth} y1="0" x2="0" y2={winHeight} stroke="#DDD" />
                <line x1={winWidth / 2} y1="0" x2={winWidth / 2} y2={winHeight} stroke="#DDD" />
                <line x1="0" y1={winHeight / 2} x2={winWidth} y2={winHeight / 2} stroke="#DDD" />
                
            </svg>
        </div>
    );

    const drawingCanvasView = () => (
        <div>
            <canvas
                ref={canvasRef}
                width={400}
                height={400}
                style={{ transform: 'scale(1.0)', border: '1px solid black' }} // Add border style here
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onDoubleClick={handleDoubleClick}
            />
        </div>
    );

    class HanziWriterDoubleTapHandler {
        constructor(writer) {
            this.writer = writer;
            this.lastTap = 0;
            this.tapThreshold = 300; // Time in ms to detect double-tap
            this.showOutline = false;
    
            // Bind touch event handler
            this.handleTouchStart = this.handleTouchStart.bind(this);
            document.addEventListener('touchstart', this.handleTouchStart, false);
        }
    
        handleTouchStart(event) {
            const currentTime = new Date().getTime();
            const tapTime = currentTime - this.lastTap;
    
            // Check if the time between taps is less than the threshold
            if (tapTime < this.tapThreshold && tapTime > 0) {
                // Double-tap detected
                this.writer.showCharacter({}).catch(error => console.error(error));
            }
    
            // Update the lastTap time
            this.lastTap = currentTime;
        }
    
        // Cleanup method to remove event listener
        destroy() {
            document.removeEventListener('touchstart', this.handleTouchStart, false);
        }
    }    
    if (isAnimating) {
        return animationView();
    }

    return drawingCanvasView();
};

export default DrawingCanvas;
