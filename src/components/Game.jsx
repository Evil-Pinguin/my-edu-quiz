// src/components/Game.jsx
import './Game.css';
import { useState, useEffect } from 'react';

export default function Game({ questions, onFinish, timerEnabled, timePerQuestion }) {
  
  // 1. СНАЧАЛА ВСЕ ХУКИ (Правило React)
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('playing'); 
  const [selectedIdx, setSelectedIdx] = useState(null);
  
  // Инициализируем время значением из настроек
  const [timeLeft, setTimeLeft] = useState(timePerQuestion || 15);

  // Безопасно получаем текущий вопрос
  const currentQuestion = questions?.[index];

  // --- ЛОГИКА ТАЙМЕРА ---
  useEffect(() => {
    // Таймер не работает, если:
    // 1. он выключен пользователем;
    // 2. игра закончена;
    // 3. нет текущего вопроса;
    // 4. пользователь уже выбрал ответ (ждем подсветки)
    if (
      !timerEnabled ||
      status === 'finished' ||
      !currentQuestion ||
      selectedIdx !== null
    ) {
      return;
    }

    // Устанавливаем время заново при переходе к вопросу
    setTimeLeft(timePerQuestion);

    const interval = setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          clearInterval(interval);

          // Логика перехода к следующему вопросу
          setIndex((previousIndex) => {
            const nextIndex = previousIndex + 1;

            if (nextIndex < questions.length) {
              setSelectedIdx(null); // Сброс выбора для нового вопроса
              return nextIndex;
            }

            // Если вопросы кончились
            setStatus('finished');
            return previousIndex;
          });

          return 0; 
        }

        return previousTime - 1;
      });
    }, 1000);

    // Очистка таймера при размонтировании или изменении зависимостей
    return () => {
      clearInterval(interval);
    };
  }, [
    index,
    status,
    timerEnabled,
    timePerQuestion,
    selectedIdx,
    currentQuestion,
    questions.length,
  ]);

  // --- 2. ЛОГИКА ОТВЕТА ---
  const handleAnswer = (optionIndex) => {
    setSelectedIdx(optionIndex); // Блокируем кнопки

    // Задержка 1 секунду, чтобы пользователь увидел правильный/неправильный цвет
    setTimeout(() => {
      if (optionIndex === currentQuestion.correctAnswer) {
        setScore((prev) => prev + 1); // +1 очко
      }

      const nextIndex = index + 1;
      
      if (nextIndex < questions.length) {
        setIndex(nextIndex);
        setSelectedIdx(null); // Сброс для следующего вопроса
      } else {
        setStatus('finished'); // Конец игры
      }
    }, 1000);
  };

  // --- 3. ПРОВЕРКИ И РЕНДЕРИНГ ---

  // Если вопросов вообще нет
  if (!questions || questions.length === 0) {
    return (
      <div className="game-container">
        <h2>Нет вопросов! 🥲</h2>
        <p>Сначала создай их в Конструкторе.</p>
      </div>
    );
  }

  // Экран Результатов
  if (status === 'finished') {
    return (
      <div className="result-container">
        <h2>Игра окончена!</h2>
        <p className="score-text">Твой результат: {score} из {questions.length}</p>
        
        {score === questions.length ? (
          <p style={{color: '#ffc107', fontSize: '20px', fontWeight:'bold'}}>🏆 Идеально! Ты гений!</p>
        ) : (
          <p>Хороший результат! Попробуй еще раз.</p>
        )}

        <div className="btn-group-result">
          <button onClick={() => { 
              setIndex(0); 
              setScore(0); 
              setStatus('playing'); 
              setSelectedIdx(null);
              setTimeLeft(timePerQuestion); // Сбрасываем таймер
          }}>
            🔄 Пройти еще раз
          </button>
          
          {/* Кнопка выхода в меню */}
          {onFinish && (
             <button onClick={onFinish} className="btn-menu-exit">
               В меню
             </button>
          )}
        </div>
      </div>
    );
  }

  // --- ОСНОВНОЙ ЭКРАН ИГРЫ ---

  // Вычисляем процент времени (для умной подсветки)
  const timePercentage = timePerQuestion ? (timeLeft / timePerQuestion) * 100 : 0;

  // Логика цветов:
  // > 60% - Зеленый (спокойно)
  // 30% - 60% - Желтый (внимание)
  // < 30% - Красный (тревога)
  let timerColorClass = 'timer-green';
  
  if (timePercentage <= 30) {
    timerColorClass = 'timer-red';
  } else if (timePercentage <= 60) {
    timerColorClass = 'timer-yellow';
  }

  return (
    <div className="game-container">
      {/* Прогресс бар */}
      <div className="progress-bar">
        Вопрос {index + 1} из {questions.length}
      </div>

      {/* УМНЫЙ ТАЙМЕР с адаптивными цветами */}
      {timerEnabled && (
        <div className={`timer-container ${timerColorClass}`}>
          ⏱️ {timeLeft}s
        </div>
      )}

      {/* Текст вопроса */}
      <h2>{currentQuestion.text}</h2>

      {/* Сетка вариантов ответов */}
      <div className="options-grid">
        {currentQuestion.options.map((option, idx) => {
          let btnClass = 'option-btn';

          // Подсветка после нажатия
          if (selectedIdx !== null) {
            if (idx === currentQuestion.correctAnswer) {
              btnClass += ' correct'; // Зеленая кнопка (правильно)
            } else if (idx === selectedIdx) {
              btnClass += ' wrong';   // Красная кнопка (неправильно)
            }
          }

          return (
            <button
              key={idx}
              className={btnClass}
              onClick={() => handleAnswer(idx)}
              disabled={selectedIdx !== null} // Блокируем кнопки после выбора
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}