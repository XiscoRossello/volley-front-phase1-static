import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import HomePage from "./pages/HomePage";
import AthletesPage from "./pages/AthletesPage";
import TryoutBookingPage from "./pages/TryoutBookingPage";
import CoachesPage from "./pages/CoachesPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="athletes" element={<AthletesPage />} />
          <Route path="tryouts" element={<TryoutBookingPage />} />
          <Route path="coaches" element={<CoachesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
