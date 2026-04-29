import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  CalendarDays,
  ClipboardList,
  Clock,
  Brain,
  Users,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", icon: Home, label: "Início" },
  { to: "/calendario", icon: CalendarDays, label: "Calendário" },
  { to: "/testes", icon: ClipboardList, label: "Testes" },
  { to: "/horario", icon: Clock, label: "Horário" },
  { to: "/estudar", icon: Brain, label: "Estudar" },
  { to: "/atendimento", icon: Users, label: "Atendimento" },
  { to: "/perfil", icon: User, label: "Perfil" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-pale-slate bg-card/95 backdrop-blur-md safe-area-bottom">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-0.5 px-1.5 py-1 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-vintage-grape"
                  : "text-lilac-ash hover:text-vintage-grape"
              )}
            >
              <item.icon className={cn("size-[18px]", isActive && "stroke-[2.5px]")} />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}