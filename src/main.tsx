import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import QuizApp from './apps/quiz/QuizApp.tsx';
import './index.css';

const root = document.getElementById('root');
if (root) {
  // Check if we want to show the quiz (via URL hash or query param)
  const showQuiz = window.location.hash === '#quiz' || 
                   window.location.search.includes('quiz=true');
  
  if (showQuiz) {
    createRoot(root).render(<QuizApp />);
  } else {
    createRoot(root).render(<App />);
  }
}
