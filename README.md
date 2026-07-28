# 🎓 EduQuiz Pro: Интерактивный конструктор тестов

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

👉 **Live Demo:** [my-edu-quiz.vercel.app](https://my-edu-quiz.vercel.app)

### О проекте

EduQuiz Pro — это веб-приложение для создания и прохождения интерактивных квизов. Проект был разработан с упором на удобство UX и сложную логику state management (управления состоянием).

Приложение реализовано как MVP для EdTech-платформ: преподаватель может быстро создать набор вопросов через форму, а ученик — пройти тест с ограничением по времени.

### ⭐ Ключевые возможности (Features)

- **🛠️ Режим Конструктора:** Создание вопросов с 4 вариантами ответов и выбором правильного ответа через форму (`Controlled Inputs`). Данные сохраняются в состояние приложения (State Lifting Up).
- **⏱️ Динамический Таймер:** Реализована логика обратного отсчета с использованием хука `useEffect` и `setInterval`. Визуальная индикация остатка времени (Зеленый ➡️ Желтый ➡️ Красный).
- **🧠 Логика Игры:** Проверка ответов, подсчет очков, обработка перехода между вопросами и автоматическое завершение игры при истечении времени.
- **🎨 Адаптивный дизайн:** Верстка на Flexbox/Grid с анимациями для обратной связи пользователю (нажатие кнопок, изменение цветов таймера).

### 🛠 Технологический стек

*   **Frontend:** React 19 (Hooks: useState, useEffect), JSX
*   **Build Tool:** Vite (быстрая сборка)
*   **Styling:** Vanilla CSS (CSS Modules подход, Flexbox, Grid, Keyframe Animations)
*   **DevOps:** Git (Version Control), Vercel (CI/CD Deployment)

### 🚀 Как запустить локально?

Если вы хотите запустить проект себе на компьютер (для доработки):

```bash
# Клонируем репозиторий
git clone https://github.com/Evil-Pinguin/my-edu-quiz.git

# Переходим в папку
cd my-edu-quiz

# Устанавливаем зависимости
npm install

# Запускаем сервер разработки
npm run dev

Откройте http://localhost:5173 в браузере.

💡 Структура (фрагмент)
text

src/
├── components/
│   ├── Game.jsx      # Логика игрового процесса и таймера
│   └── Creator.jsx   # Компонент формы для создания вопросов
├── data/
│   └── questions.js  # База данных дефолтных вопросов
└── App.jsx           # Главный контроллер состояния (Router)
🔮 Планы по развитию (Roadmap)
 Подключение реальной базы данных (Supabase/Firebase) для сохранения вопросов.
 Добавление категорий тем (Web, Unity, C#).
 Режим мультиплеера (соревнование двух игроков).
Developed with ❤️ by [Your EvilPin]