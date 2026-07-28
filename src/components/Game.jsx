// src/components/Game.jsx
import './Game.css';
import { useState, useEffect } from 'react';

export default function Game({ questions, onFinish, timerEnabled }) {
  
  // 1. СНАЧАЛА ВСЕ ХУКИ (Правило React)
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('playing'); 
  const [selectedIdx, setSelectedIdx] = useState(null);

  const TIME_PER_QUESTION = 15;
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  // Безопасно получаем текущий вопрос
  const currentQuestion = questions?.[index];

  // Логика Таймера
  useEffect(() => {
    // Не запускаем таймер, если он выключен ИЛИ игра закончена ИЛИ нет вопросов
    if (!timerEnabled || status === 'finished' || !currentQuestion) return; 

    setTimeLeft(TIME_PER_QUESTION); // Сброс времени на новый вопрос

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          setIndex((nextIdx) => {
            if (nextIdx < questions.length - 1) return nextIdx + 1;
            else { setStatus('finished'); return nextIdx; }
          });
          return 0; 
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [index, status, timerEnabled]); 

  // 2. ЛОГИКА ОТВЕТА
  const handleAnswer = (optionIndex) => {
    setSelectedIdx(optionIndex);

    setTimeout(() => {
      if (optionIndex === currentQuestion.correctAnswer) {
        setScore((prev) => prev + 1);
      }

      const nextIndex = index + 1;
      if (nextIndex < questions.length) {
        setIndex(nextIndex);
        setSelectedIdx(null);
      } else {
        setStatus('finished'); 
        // Убрали onFinish отсюда, чтобы показать результат!
      }
    }, 1000);
  };

  // 3. ПРОВЕРКИ И РЕНДЕРИНГ (После хуков)
  
  // Если вопросов нет
  if (!questions || questions.length === 0) {
    return (
        <div className="game-container">
            <h2>Нет вопросов! 🥲</h2>
            <p>Сначала создай их в Конструкторе.</p>
        </div>
    )
  }

  // Экран Результатов
  if (status === 'finished') {
    return (
      <div className="result-container">
        <h2>Игра окончена!</h2>
        <p className="score-text">Твой результат: {score} из {questions.length}</p>
        {score === questions.length ? (<p>🏆 Идеально!</p>) : (<p>Хороший результат!</p>)}
        <button onClick={() => { 
            setIndex(0); setScore(0); setStatus('playing'); setSelectedIdx(null); 
        }}>
          Пройти еще раз
        </button>
        {/* Кнопка выхода в меню */}
        {onFinish && <button onClick={onFinish} style={{marginLeft: '10px', background:'#888'}}>В меню</button>}
      </div>
    );
  }

  // Основной экран игры
  return (
    <div className="game-container">
      <div className="progress-bar">
        Вопрос {index + 1} из {questions.length}
      </div>

      {/* Показываем таймер только если он включен (Исправление №1) */}
      {timerEnabled && (
        <div className={`
            timer-container 
            ${timeLeft > 9 ? 'timer-green' : ''}
            ${timeLeft > 5 && timeLeft < 10 ? 'timer-yellow' : ''}
            ${timeLeft <= 5 ? 'timer-red' : ''}
        `}>
          ⏱️ {timeLeft}s
        </div>
      )}

      <h2>{currentQuestion.text}</h2>

      <div className="options-grid">
        {currentQuestion.options.map((option, idx) => {
          let btnClass = 'option-btn';
          if (selectedIdx !== null) {
            if (idx === currentQuestion.correctAnswer) btnClass += ' correct';
            else if (idx === selectedIdx) btnClass += ' wrong';
          }
          return (
            <button
              key={idx}
              className={btnClass}
              onClick={() => handleAnswer(idx)}
              disabled={selectedIdx !== null}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}