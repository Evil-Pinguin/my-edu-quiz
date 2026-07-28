// src/App.jsx
import { useState, useEffect } from 'react'; // Добавили useEffect
import Game from './components/Game';
import Creator from './components/Creator';
import './App.css'

import {useContext } from 'react';
import { ThemeContext  } from './context/ThemeContext';

// Ключ для хранения данных в браузере
const STORAGE_KEY = 'edu-quiz-questions';
const TIMER_STORAGE_KEY = 'edu-quiz-timer-duration';

function App() {
  const [page, setPage] = useState('menu');
  const [isTimerEnabled, setIsTimerEnabled] = useState(true);
  const {isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [timerDuration, setTimerDuration] = useState(() => {
  const savedDuration = localStorage.getItem(TIMER_STORAGE_KEY);
  return savedDuration ? Number(savedDuration) : 15;
  });

  // --- МАГИЯ ЗАГРУЗКИ ---
  const [questions, setQuestions] = useState(() => {
    // При старте проверяем, есть ли что-то в памяти браузера
    const savedQuestions = localStorage.getItem(STORAGE_KEY);
    // Если есть - парсим JSON, если нет - ставим дефолтный массив
    return savedQuestions ? JSON.parse(savedQuestions) : [
      {
        id: Date.now(),
        text: 'Какой тег делает текст жирным?',
        options: ['<i>', '<b>', '<strong>', '<bold>'],
        correctAnswer: 2,
      }
    ];
  });

  // --- МАГИЯ СОХРАНЕНИЯ ---
  // Этот хук следит за массивом вопросов. Как только он меняется -
  // он автоматически обновляет localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  }, [questions]);
  useEffect(() => {
    localStorage.setItem(TIMER_STORAGE_KEY, String(timerDuration));
  }, [timerDuration]);

  // Функция очистки всех данных (для тестов или кнопки "сброс")
  const handleClearAll = () => {
    if(window.confirm('Точно удалить все вопросы?')) {
      setQuestions([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // ... Оставляем остальной рендеринг ...
  
  return (
    <div className="app-background">
      <header>
        <h1>🎓 EduQuiz Pro</h1>
      </header>
      
      <main className="container">
        
        {page === 'menu' && (
          <div className="menu-card">
            <h2>Добро пожаловать!</h2>
            <p>В базе готово вопросов: <strong>{questions.length}</strong></p>
            
            <div className="settings-box">
            <label className="toggle-label">
              <input type="checkbox" checked={isTimerEnabled} onChange={(e) => setIsTimerEnabled(e.target.checked)} />
              <span>⏱️ Таймер</span>
            </label>

            <label className="timer-settings">
            <span>⏳ Время на вопрос:</span>

            <select
              value={timerDuration}
              onChange={(event) => setTimerDuration(Number(event.target.value))}
              disabled={!isTimerEnabled}
            >
              <option value={10}>10 секунд</option>
              <option value={15}>15 секунд</option>
              <option value={30}>30 секунд</option>
              <option value={60}>1 минута</option>
              <option value={120}>2 минуты</option>
            </select>
          </label>

      
            <label className="toggle-label" onClick={toggleTheme}>
              <span>🌙 {isDarkMode ? 'Светлая тема' : 'Темная тема'}</span>
              <div className={`switch ${isDarkMode ? 'active' : ''}`}></div>
            </label>
          </div>

            <div className="btn-group">
              <button onClick={() => setPage('game')} className="btn-primary">
                 ▶️ Начать Тест
              </button>
              <button onClick={() => setPage('creator')} className="btn-secondary">
                 ✏️ Конструктор
              </button>
            </div>
            
            {/* Кнопка сброса */}
            {questions.length > 0 && (
               <button onClick={handleClearAll} style={{marginTop:'20px', fontSize:'12px', color:'#999', background:'none'}}>
                  🗑️ Сбросить все данные
               </button>
            )}
          </div>
        )}

        {/* Остальное без изменений... */}
        {page === 'game' && (
          <>
             <button onClick={() => setPage('menu')} style={{marginBottom:'20px'}}>← Назад</button>
             <Game
                questions={questions}
                onFinish={() => setPage('menu')}
                timerEnabled={isTimerEnabled}
                timePerQuestion={timerDuration}
              />
          </>
        )}
        
        {page === 'creator' && (
           <>
             <button onClick={() => setPage('menu')} style={{marginBottom:'20px'}}>← Назад</button>
             <Creator questions={questions} setQuestions={setQuestions} />
           </>
        )}
      </main>
    </div>
  )
}

export default App