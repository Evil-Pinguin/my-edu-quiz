// src/components/Game.jsx

import './Game.css';
import { useState, useEffect } from 'react';

// Теперь игра принимает вопросы через props (свойства)
export default function Game({ questions, onFinish }) {
  
  // Если вопросов нет вообще (на всякий случай)
  if (!questions || questions.length === 0) {
      return (
          <div className="game-container">
              <h2>Нет вопросов!</h2>
              <p>Сначала создай их в Конструкторе.</p>
          </div>
      )
  }

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('playing'); 
  const [selectedIdx, setSelectedIdx] = useState(null);

  const TIME_PER_QUESTION = 15;
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  // Берем вопрос из списка, который нам ПЕРЕДАЛИ (а не из файла)
  const currentQuestion = questions[index];

  // --- ЛОГИКА ТАЙМЕРА (useEffect) ---
useEffect(() => {
  // Сбрасываем таймер при смене вопроса
  setTimeLeft(TIME_PER_QUESTION);

  // Запускаем интервал (тикающие часы)
  const interval = setInterval(() => {
    setTimeLeft((prevTime => {
      if (prevTime <= 1) { // Если время вышло
        clearInterval(interval);
        
        // Автоматически вызываем функцию неправильного ответа
        // Мы выбираем вариант, которого нет (например -1), чтобы точно промахнуться,
        // или можно просто передать логику окончания времени
        
        // Простой переход к следующему как "поражение"
        setIndex((nextIdx) => {
            if (nextIdx < questions.length - 1) return nextIdx + 1;
            else {
                setStatus('finished'); // Конец игры
                return nextIdx;
            }
        });
        return 0; 
      }
      return prevTime - 1;
    }));
  }, 1000); // Каждую секунду

  // Функция очистки: если пользователь уходит с вопроса или перезагружается
  return () => clearInterval(interval);
}, [index, status]); // Перезапускать эффект только когда меняется индекс вопроса или статус игры

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
        // Опционально: сообщаем родителю (App), что игра закончилась,
        // если хотим автоматический переход, но пока оставим результат на экране
        if(onFinish) onFinish(); 
      }
    }, 1000);
  };

  // Экран Результатов
  if (status === 'finished') {
    return (
      <div className="result-container">
        <h2>Игра окончена!</h2>
        <p className="score-text">Твой результат: {score} из {questions.length}</p>
        
        {score === questions.length ? (
          <p>🏆 Идеально! Ты гений!</p>
        ) : (
          <p>Хороший результат! Попробуй еще раз.</p>
        )}

        <button onClick={() => { 
            setIndex(0); 
            setScore(0); 
            setStatus('playing'); 
            setSelectedIdx(null); 
        }}>
          Пройти еще раз
        </button>
        
        {/* Кнопка домой можно добавить сюда же */}
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="progress-bar">
        Вопрос {index + 1} из {questions.length}
        </div>
        <div 
        className={`
            timer-container 
            ${timeLeft > 9 ? 'timer-green' : ''}
            ${timeLeft > 5 && timeLeft < 10 ? 'timer-yellow' : ''}
            ${timeLeft <= 5 ? 'timer-red' : ''}
        `}
        >
        ⏱️ {timeLeft}s
        </div>

      <h2>{currentQuestion.text}</h2>

      <div className="options-grid">
        {currentQuestion.options.map((option, idx) => {
          let btnClass = 'option-btn';

          if (selectedIdx !== null) {
            if (idx === currentQuestion.correctAnswer) {
              btnClass += ' correct';
            } else if (idx === selectedIdx && idx !== currentQuestion.correctAnswer) {
              btnClass += ' wrong';
            }
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