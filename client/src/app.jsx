import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/homepage";
import QuizPage from "./pages/Questionnaire";
import ResultsPage from "./pages/resultsPage";
import Navbar from "./components/navbar";

export default function App() {
  return (
    <>
    
    <Navbar />

    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/results" element={<ResultsPage />} />
    </Routes>
    </>
  );
}
