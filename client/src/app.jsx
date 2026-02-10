import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/homepage";
import QuizPage from "./pages/Questionnaire";
import ResultsPage from "./pages/resultsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/results" element={<ResultsPage />} />
    </Routes>
  );
}
