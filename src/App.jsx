// src/App.jsx
import { useState } from 'react';
import Game from './components/Game';
import Creator from './components/Creator'; // Мы скоро создадим этот файл
import './App.css'

// Начальные вопросы по умолчанию
const INITIAL_QUESTIONS = [
  {
    id: Date.now(),
    text: 'Какой тег делает текст жирным в HTML?',
    options: ['<italic>', '<bold>', '<strong>', '<bolder>'],
    correctAnswer: 2,
  },
];

function App() {
  const [page, setPage] = useState('menu'); // 'menu', 'game', 'creator'
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);

  const [isTimerEnabled,setIsTimerEnabled] = useState(true);

  return (
    <div className="app-background">
      <header>
        <h1>🎓 EduQuiz Pro</h1>
      </header>
      
      <main className="container">
        
        {page === 'menu' && (
          <div className="menu-card">
            <h2>Добро пожаловать!</h2>
           
            <div className="settings-box">
              <label className="toggle-label">
                <input 
                  type="checkbox" 
                  checked={isTimerEnabled} 
                  onChange={(e) => setIsTimerEnabled(e.target.checked)}
                />
                <span>⏱️ Включить таймер на вопрос?</span>
              </label>
            </div>
            <p>Выбери действие:</p>
            <div className="btn-group">
              <button onClick={() => setPage('game')} className="btn-primary">
                ▶️ Начать Тест
              </button>
              <button onClick={() => setPage('creator')} className="btn-secondary">
                ✏️ Режим Конструктора
              </button>
            </div>
            <p className="hint">В базе сейчас вопросов: {questions.length}</p>
          </div>
        )}

        {page === 'game' && (
          <>
            {/* Кнопка назад */}
            <button 
              onClick={() => setPage('menu')} 
              style={{ marginBottom: '20px', cursor: 'pointer' }}
            >
              ← Назад в меню
            </button>
            <Game 
              questions={questions} 
              onFinish={() => setPage('menu')} 
              timerEnabled={isTimerEnabled} // <--- Вот эта строчка!
            /> 
            </>
        )}

        {page === 'creator' && (
           <>
             <button 
               onClick={() => setPage('menu')} 
               style={{ marginBottom: '20px', cursor: 'pointer' }}
             >
               ← Назад в меню
             </button>
             <Creator 
               questions={questions} 
               setQuestions={setQuestions} 
             />
           </>
        )}

      </main>
    </div>
  )
}

export default App