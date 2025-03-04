import React, { useState, useEffect } from 'react';
import { dalle } from 'openai';

const AIPictionary = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [choices, setChoices] = useState([]);
  const [correctChoice, setCorrectChoice] = useState('');
  const [gameState, setGameState] = useState('waiting');
  const [timer, setTimer] = useState(30);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (gameState === 'guessing' && timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setGameState('ended');
    }
  }, [gameState, timer]);

  const generateImage = async () => {
    if (!prompt) return;
    const response = await dalle.text2im({ prompt });
    setImage(response.data[0].url);
    
    const fakeChoices = [
      'A dog playing chess',
      'A robot making pancakes',
      'A wizard casting spells'
    ];
    
    const allChoices = [...fakeChoices, prompt].sort(() => Math.random() - 0.5);
    setChoices(allChoices);
    setCorrectChoice(prompt);
    setGameState('guessing');
    setTimer(30);
  };

  const handleChoice = (choice) => {
    setSelectedChoice(choice);
    setResult(choice === correctChoice ? 'Correct! 🎉' : 'Wrong! ❌');
    setGameState('ended');
  };

  return (
    <div className='p-4 max-w-lg mx-auto text-center'>
      {gameState === 'waiting' && (
        <div>
          <input
            placeholder='Enter a fun prompt...'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button onClick={generateImage} className='mt-2'>Generate Image</button>
        </div>
      )}

      {gameState === 'guessing' && (
        <div>
          <p className='mb-2'>Time left: {timer}s</p>
          {image && <img src={image} alt='Generated AI Image' className='w-full rounded-lg' />}
          <div className='mt-4'>
            {choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoice(choice)}
                className='block w-full mt-2'
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === 'ended' && (
        <div>
          <p className='text-xl font-bold'>{result}</p>
          <p>Correct answer: {correctChoice}</p>
          <button onClick={() => setGameState('waiting')} className='mt-4'>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default AIPictionary;
