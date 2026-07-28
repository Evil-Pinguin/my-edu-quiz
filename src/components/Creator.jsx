// src/components/Creator.jsx
import { useState } from 'react';
import './Creator.css';

function Creator({ questions, setQuestions }) {
  // Состояние для НОВОГО вопроса, который мы сейчас печатаем
  const [newQ, setNewQ] = useState({
    text: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctAnswer: 0,
  });

  // Обработчик изменения текстовых полей
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewQ(prev => ({ ...prev, [name]: value }));
  };

  // Функция сохранения вопроса
  const handleSave = () => {
    // Простая проверка: не пустое ли поле вопроса
    if (!newQ.text.trim()) {
      alert('Введите текст вопроса!');
      return;
    }

    // Собираем объект вопроса из нашей формы
    const questionToAdd = {
      id: Date.now(), // Уникальный ID по времени
      text: newQ.text,
      options: [
        newQ.option1,
        newQ.option2,
        newQ.option3,
        newQ.option4,
      ].filter(opt => opt.trim() !== ''), // Убираем пустые варианты
      correctAnswer: parseInt(newQ.correctAnswer),
    };

    // Добавляем в общий список
    setQuestions([...questions, questionToAdd]);

    // Очищаем форму для следующего вопроса
    setNewQ({
      text: '',
      option1: '', option2: '', option3: '', option4: '',
      correctAnswer: 0,
    });
    
    alert('✅ Вопрос успешно добавлен!');
  };

  return (
    <div className="creator-container">
      <h2>Создать новый вопрос</h2>
      
      <div className="form-group">
        <label>Текст вопроса:</label>
        <input 
          type="text"
          name="text"
          value={newQ.text}
          onChange={handleChange}
          placeholder="Например: Столица Франции?"
          className="input-field"
        />
      </div>

      <div className="options-editor">
        <label>Варианты ответов:</label>
        {[1, 2, 3, 4].map((num) => (
          <input
            key={num}
            type="text"
            name={`option${num}`}
            value={newQ[`option${num}`]}
            onChange={handleChange}
            placeholder={`Вариант ${num}`}
            className="input-field"
          />
        ))}
      </div>

      <div className="form-group">
        <label>Номер правильного варианта (0-3):</label>
        <select 
          name="correctAnswer"
          value={newQ.correctAnswer}
          onChange={handleChange}
          className="select-field"
        >
          <option value={0}>Первый вариант</option>
          <option value={1}>Второй вариант</option>
          <option value={2}>Третий вариант</option>
          <option value={3}>Четвертый вариант</option>
        </select>
      </div>

      <button onClick={handleSave} className="save-btn">
        💾 Добавить вопрос в тест
      </button>

      {/* Список уже созданных вопросов (для наглядности) */}
      <div className="questions-list-preview">
        <h3>Всего вопросов создано: {questions.length}</h3>
        <ul>
          {questions.map(q => (
            <li key={q.id}>{q.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Creator;