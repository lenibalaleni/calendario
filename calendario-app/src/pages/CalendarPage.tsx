import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  isToday,
} from "date-fns";
import { pt } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTestes, useAulas, useCompromissos, useAtendimentos } from "@/lib/storage";
import { cn } from "@/lib/utils";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [testes] = useTestes();
  const [aulas] = useAulas();
  const [compromissos] = useCompromissos();
  const [atendimentos] = useAtendimentos();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDay = monthStart.getDay();

  const dayTestes = (day: Date) =>
    testes.filter((t) => isSameDay(parseISO(t.data), day));

  const dayAulas = (day: Date) =>
    aulas.filter((a) => a.diaSemana === day.getDay());

  const dayCompromissos = (day: Date) =>
    compromissos.filter((c) => {
      const cDate = parseISO(c.data);
      return isSameDay(cDate, day) || (c.recorrente === "semanal" && cDate.getDay() === day.getDay());
    });

  const dayAtendimentos = (day: Date) =>
    atendimentos.filter((a) => a.diaSemana === day.getDay());

  const selectedDayInfo = selectedDate
    ? {
        testes: dayTestes(selectedDate),
        aulas: dayAulas(selectedDate),
        compromissos: dayCompromissos(selectedDate),
        atendimentos: dayAtendimentos(selectedDate),
      }
    : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <ChevronLeft className="size-5" />
        </Button>
        <h2 className="text-base font-semibold text-vintage-grape capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: pt })}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => (
          <div key={d} className="py-1 text-xs font-medium text-lilac-ash">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDay === 0 ? 6 : startDay - 1 }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const hasTeste = dayTestes(day).length > 0;
          const hasAula = dayAulas(day).length > 0;
          const hasComp = dayCompromissos(day).length > 0;
          const hasAtt = dayAtendimentos(day).length > 0;
          const selected = selectedDate && isSameDay(day, selectedDate);

          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={cn(
                "relative flex h-10 flex-col items-center justify-center rounded-lg text-sm transition-colors",
                selected && "bg-vintage-grape text-frosted-mint",
                !selected && isToday(day) && "font-bold text-vintage-grape ring-1 ring-vintage-grape",
                !selected && !isToday(day) && "text-vintage-grape hover:bg-frosted-mint/50",
                !isSameMonth(day, currentMonth) && "text-lilac-ash/40"
              )}
            >
              {format(day, "d")}
              <div className="absolute bottom-0.5 flex gap-0.5">
                {hasTeste && <span className="size-1.5 rounded-full bg-red-400" />}
                {hasAula && <span className="size-1.5 rounded-full bg-blue-400" />}
                {hasAtt && <span className="size-1.5 rounded-full bg-amber-400" />}
                {hasComp && <span className="size-1.5 rounded-full bg-green-400" />}
              </div>
            </button>
          );
        })}
      </div>

      {selectedDayInfo && selectedDate && (
        <div className="flex flex-col gap-3 rounded-xl border border-pale-slate/60 bg-card p-4">
          <h3 className="font-semibold text-vintage-grape">
            {format(selectedDate, "d 'de' MMMM", { locale: pt })}
          </h3>

          {selectedDayInfo.aulas.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase text-lilac-ash">Aulas</span>
              {selectedDayInfo.aulas.map((a) => (
                <div key={a.id} className="flex justify-between text-sm">
                  <span className="text-vintage-grape">{a.materia}</span>
                  <span className="text-lilac-ash">{a.horaInicio}-{a.horaFim}</span>
                </div>
              ))}
            </div>
          )}

          {selectedDayInfo.testes.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase text-lilac-ash">Testes</span>
              {selectedDayInfo.testes.map((t) => (
                <Badge key={t.id} variant="destructive" className="w-fit">
                  {t.materia}
                </Badge>
              ))}
            </div>
          )}

          {selectedDayInfo.compromissos.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase text-lilac-ash">Compromissos</span>
              {selectedDayInfo.compromissos.map((c) => (
                <div key={c.id} className="text-sm text-vintage-grape">{c.titulo}</div>
              ))}
            </div>
          )}

          {selectedDayInfo.atendimentos.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase text-lilac-ash">Atendimento ao Aluno</span>
              {selectedDayInfo.atendimentos.map((a) => (
                <div key={a.id} className="flex items-center justify-between text-sm">
                  <div className="flex flex-col">
                    <span className="text-vintage-grape">{a.materia}</span>
                    <span className="text-xs text-lilac-ash">{a.professor}</span>
                  </div>
                  <span className="text-xs text-lilac-ash">{a.horaInicio}-{a.horaFim}{a.sala ? ` · ${a.sala}` : ""}</span>
                </div>
              ))}
            </div>
          )}

          {selectedDayInfo.aulas.length === 0 &&
            selectedDayInfo.testes.length === 0 &&
            selectedDayInfo.compromissos.length === 0 &&
            selectedDayInfo.atendimentos.length === 0 && (
              <p className="text-sm text-lilac-ash">Sem eventos neste dia.</p>
            )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 text-xs text-lilac-ash">
        <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-red-400" /> Teste</span>
        <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-blue-400" /> Aula</span>
        <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-amber-400" /> Atendimento</span>
        <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-green-400" /> Compromisso</span>
      </div>
    </div>
  );
}