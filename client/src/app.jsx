import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/homepage";
import QuizPage from "./pages/Questionnaire";
import ResultsPage from "./pages/resultsPage";
import WishlistPage from "./pages/wishlistPage";
import AuthPage from "./pages/SignupPage";
import Navbar from "./components/navbar";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <ResultsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
