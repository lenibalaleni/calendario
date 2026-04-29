import { useLocation } from "react-router-dom";

const TITULOS: Record<string, string> = {
  "/": "Início",
  "/calendario": "Calendário",
  "/testes": "Testes",
  "/horario": "Horário",
  "/estudar": "Estudar com IA",
  "/atendimento": "Atendimento ao Aluno",
  "/perfil": "Perfil",
};

export function PageHeader() {
  const location = useLocation();
  const titulo = TITULOS[location.pathname] ?? "Calendário";

  return (
    <header className="sticky top-0 z-40 border-b border-pale-slate/60 bg-card/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-lg items-center px-4">
        <h1 className="text-lg font-semibold text-vintage-grape">{titulo}</h1>
      </div>
    </header>
  );
}