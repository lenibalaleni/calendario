import { useState } from "react";
import { Plus, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useAtendimentos, criarAtendimento } from "@/lib/storage";
import { MATERIAS_5_6, DIAS_SEMANA, type Materia, type Atendimento } from "@/lib/types";
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

export default function AtendimentoPage() {
  const [atendimentos, setAtendimentos] = useAtendimentos();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    materia: "" as Materia,
    professor: "",
    diaSemana: 1,
    horaInicio: "",
    horaFim: "",
    sala: "",
  });

  const atendimentosOrdenados = [...atendimentos].sort(
    (a, b) => a.diaSemana - b.diaSemana || a.horaInicio.localeCompare(b.horaInicio)
  );

  function handleAdd() {
    if (!form.materia || !form.professor || !form.horaInicio || !form.horaFim) return;
    const novo = criarAtendimento({
      materia: form.materia,
      professor: form.professor,
      diaSemana: form.diaSemana,
      horaInicio: form.horaInicio,
      horaFim: form.horaFim,
      sala: form.sala || undefined,
    });
    setAtendimentos((prev) => [...prev, novo]);
    setForm({ materia: "" as Materia, professor: "", diaSemana: 1, horaInicio: "", horaFim: "", sala: "" });
    setOpen(false);
  }

  function eliminarAtendimento(id: string) {
    setAtendimentos((prev) => prev.filter((a) => a.id !== id));
  }

  const diasComAtendimento = [...new Set(atendimentosOrdenados.map((a) => a.diaSemana))].sort();

  return (
    <div className="flex flex-col gap-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full gap-2 bg-vintage-grape text-frosted-mint hover:bg-vintage-grape/90">
            <Plus className="size-4" />
            Adicionar Atendimento
          </Button>
        </DialogTrigger>
        <DialogContent className="mx-4 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Atendimento ao Aluno</DialogTitle>
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
              <Label>Professor(a)</Label>
              <Input
                value={form.professor}
                onChange={(e) => setForm((f) => ({ ...f, professor: e.target.value }))}
                placeholder="Ex: Prof. Ana Silva"
              />
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
                  {[1, 2, 3, 4, 5].map((d) => (
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

            <Button onClick={handleAdd} disabled={!form.materia || !form.professor || !form.horaInicio || !form.horaFim}>
              Adicionar Atendimento
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {atendimentosOrdenados.length > 0 ? (
        diasComAtendimento.map((dia) => (
          <Card key={dia}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-vintage-grape">
                {DIAS_SEMANA[dia]}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {atendimentosOrdenados
                .filter((a) => a.diaSemana === dia)
                .map((att) => (
                  <div
                    key={att.id}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2",
                      getCorMateria(att.materia)
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{att.materia}</span>
                      <span className="text-xs opacity-70">{att.professor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs opacity-80">
                        {att.horaInicio}-{att.horaFim}
                        {att.sala && <span> · {att.sala}</span>}
                      </span>
                      <button
                        onClick={() => eliminarAtendimento(att.id)}
                        className="text-xs opacity-40 hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <Users className="size-12 text-lilac-ash/40" />
          <p className="text-sm text-lilac-ash">Sem atendimentos registados.</p>
          <p className="text-xs text-lilac-ash">
            Adiciona os horários de atendimento dos teus professores!
          </p>
        </div>
      )}
    </div>
  );
}