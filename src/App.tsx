// Router root. Every user-facing page is wired through MainLayout so the
// header, footer and error boundaries stay consistent across routes.

import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import HomePage from "./pages/HomePage";
import AthletesPage from "./pages/AthletesPage";
import AthleteDetailPage from "./pages/AthleteDetailPage";
import AthleteCreatePage from "./pages/AthleteCreatePage";
import CompetitionsPage from "./pages/CompetitionsPage";
import CompetitionDetailPage from "./pages/CompetitionDetailPage";
import TryoutBookingPage from "./pages/TryoutBookingPage";
import CoachesPage from "./pages/CoachesPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout route — shared chrome (header/footer) lives inside MainLayout
            and every nested page is rendered in its <Outlet/>. */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />

          {/* Athletes flow: list → create → detail.
              /athletes/new must come BEFORE /athletes/:publicId so the router
              matches the literal "new" segment first. */}
          <Route path="athletes" element={<AthletesPage />} />
          <Route path="athletes/new" element={<AthleteCreatePage />} />
          <Route path="athletes/:publicId" element={<AthleteDetailPage />} />

          {/* Competitions flow: list → detail (with inline edit). */}
          <Route path="competitions" element={<CompetitionsPage />} />
          <Route path="competitions/:publicId" element={<CompetitionDetailPage />} />

          <Route path="tryouts" element={<TryoutBookingPage />} />
          <Route path="coaches" element={<CoachesPage />} />

          {/* Catch-all → friendly 404. */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
