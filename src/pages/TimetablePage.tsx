import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAulas, criarAula } from "@/lib/storage";
import { MATERIAS_5_6, DIAS_SEMANA, type Materia } from "@/lib/types";
import { cn } from "@/lib/utils";

const DIAS_SEMANA_CURTOS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const CORES_MATERIA: Record<string, string> = {
  "Português": "bg-red-100 text-red-700",
  "Matemática": "bg-blue-100 text-blue-700",
  "Inglês": "bg-purple-100 text-purple-700",
  "Ciências Naturais": "bg-green-100 text-green-700",
  "História e Geografia de Portugal": "bg-amber-100 text-amber-700",
  "Educação Visual": "bg-pink-100 text-pink-700",
  "Educação Tecnológica": "bg-orange-100 text-orange-700",
  "Educação Física": "bg-teal-100 text-teal-700",
  "Cidadania e Desenvolvimento": "bg-indigo-100 text-indigo-700",
  "EMRC": "bg-violet-100 text-violet-700",
  "Apoio ao Estudo": "bg-cyan-100 text-cyan-700",
  "Oferta Complementar": "bg-lime-100 text-lime-700",
};

function getCorMateria(materia: string) {
  return CORES_MATERIA[materia] ?? "bg-pale-slate text-vintage-grape";
}

export default function TimetablePage() {
  const [aulas, setAulas] = useAulas();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    materia: "" as Materia,
    diaSemana: 1,
    horaInicio: "",
    horaFim: "",
    sala: "",
    professor: "",
  });

  const diasUteis = [1, 2, 3, 4, 5];

  const todasHoras = aulas
    .filter((a) => diasUteis.includes(a.diaSemana))
    .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

  const horaMin = todasHoras.length > 0 ? todasHoras[0].horaInicio : "08:30";
  const horaMax = todasHoras.length > 0 ? todasHoras[todasHoras.length - 1].horaFim : "17:00";

  const horas: string[] = [];
  let h = parseInt(horaMin.split(":")[0]);
  let m = parseInt(horaMin.split(":")[1]);
  const endH = parseInt(horaMax.split(":")[0]);
  while (h < endH) {
    horas.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    m += 45;
    if (m >= 60) {
      h++;
      m -= 60;
    }
  }

  function handleAdd() {
    if (!form.materia || !form.horaInicio || !form.horaFim) return;
    const nova = criarAula({
      materia: form.materia,
      diaSemana: form.diaSemana,
      horaInicio: form.horaInicio,
      horaFim: form.horaFim,
      sala: form.sala || undefined,
      professor: form.professor || undefined,
    });
    setAulas((prev) => [...prev, nova]);
    setForm({ materia: "" as Materia, diaSemana: 1, horaInicio: "", horaFim: "", sala: "", professor: "" });
    setOpen(false);
  }

  function eliminarAula(id: string) {
    setAulas((prev) => prev.filter((a) => a.id !== id));
  }

  const aulasPorDia = (dia: number) =>
    aulas
      .filter((a) => a.diaSemana === dia)
      .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

  return (
    <div className="flex flex-col gap-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button className="w-full gap-2 bg-vintage-grape text-frosted-mint hover:bg-vintage-grape/90" />}>
            <Plus className="size-4" />
            Adicionar Aula
          </DialogTrigger>
        <DialogContent className="mx-4 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Aula</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-2">
              <Label>Matéria</Label>
              <Select
                value={form.materia}
                onValueChange={(v) => setForm((f) => ({ ...f, materia: v as Materia }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleciona a matéria" />
                </SelectTrigger>
                <SelectContent>
                  {MATERIAS_5_6.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Dia da Semana</Label>
              <Select
                value={String(form.diaSemana)}
                onValueChange={(v) => setForm((f) => ({ ...f, diaSemana: Number(v) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {diasUteis.map((d) => (
                    <SelectItem key={d} value={String(d)}>{DIAS_SEMANA[d]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label>Hora Início</Label>
                <Input
                  type="time"
                  value={form.horaInicio}
                  onChange={(e) => setForm((f) => ({ ...f, horaInicio: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Hora Fim</Label>
                <Input
                  type="time"
                  value={form.horaFim}
                  onChange={(e) => setForm((f) => ({ ...f, horaFim: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Sala (opcional)</Label>
              <Input
                value={form.sala}
                onChange={(e) => setForm((f) => ({ ...f, sala: e.target.value }))}
                placeholder="Ex: Sala 12"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Professor(a) (opcional)</Label>
              <Input
                value={form.professor}
                onChange={(e) => setForm((f) => ({ ...f, professor: e.target.value }))}
                placeholder="Ex: Dra. Maria"
              />
            </div>

            <Button onClick={handleAdd} disabled={!form.materia || !form.horaInicio || !form.horaFim}>
              Adicionar Aula
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="overflow-x-auto -mx-4 px-4">
        <div className="min-w-[340px]">
          <div className="grid grid-cols-5 gap-1 mb-2">
            {diasUteis.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-lilac-ash py-1">
                {DIAS_SEMANA_CURTOS[d]}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-5 gap-1">
            {diasUteis.map((dia) => {
              const aulasDia = aulasPorDia(dia);
              return (
                <div key={dia} className="flex flex-col gap-1">
                  {aulasDia.length > 0 ? (
                    aulasDia.map((aula) => (
                      <div
                        key={aula.id}
                        className={cn(
                          "relative rounded-lg px-2 py-2 text-xs",
                          getCorMateria(aula.materia)
                        )}
                      >
                        <div className="font-medium">{aula.materia}</div>
                        <div className="text-[10px] opacity-80">
                          {aula.horaInicio}-{aula.horaFim}
                        </div>
                        {aula.sala && (
                          <div className="text-[10px] opacity-60">{aula.sala}</div>
                        )}
                        <button
                          onClick={() => eliminarAula(aula.id)}
                          className="absolute top-0.5 right-0.5 text-[8px] opacity-40 hover:opacity-100"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-lg border border-dashed border-pale-slate/40 py-4 text-center text-[10px] text-lilac-ash/40">
                      —
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {MATERIAS_5_6.slice(0, 8).map((m) => (
          <span key={m} className={cn("rounded-full px-2 py-0.5 text-[10px]", getCorMateria(m))}>
            {m.length > 15 ? m.substring(0, 12) + "…" : m}
          </span>
        ))}
      </div>
    </div>
  );
}