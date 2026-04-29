import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Shell } from "@/components/layout/Shell";
import Dashboard from "@/pages/Dashboard";
import CalendarPage from "@/pages/CalendarPage";
import TestsPage from "@/pages/TestsPage";
import TimetablePage from "@/pages/TimetablePage";
import StudyPage from "@/pages/StudyPage";
import AtendimentoPage from "@/pages/AtendimentoPage";
import ProfilePage from "@/pages/ProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendario" element={<CalendarPage />} />
          <Route path="/testes" element={<TestsPage />} />
          <Route path="/horario" element={<TimetablePage />} />
          <Route path="/estudar" element={<StudyPage />} />
          <Route path="/atendimento" element={<AtendimentoPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}