import { createRoot } from 'react-dom/client';
import QuizApp from './apps/quiz/QuizApp';
import './index.css';

// Mount Quiz App
const quizRoot = document.getElementById('ca-quiz-root');
if (quizRoot) {
  createRoot(quizRoot).render(<QuizApp />);
} else {
  console.warn('Quiz root element #ca-quiz-root not found');
}