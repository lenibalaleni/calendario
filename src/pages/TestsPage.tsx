import { useState } from "react";
import { format, parseISO, differenceInDays } from "date-fns";
import { pt } from "date-fns/locale";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { useTestes, criarTeste } from "@/lib/storage";
import { MATERIAS_5_6, type Materia } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function TestsPage() {
  const [testes, setTestes] = useTestes();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    materia: "" as Materia,
    data: "",
    materiaProg: "",
    prioridade: 2 as 1 | 2 | 3,
  });

  const testesOrdenados = [...testes].sort((a, b) => {
    if (a.concluido !== b.concluido) return a.concluido ? 1 : -1;
    return a.data.localeCompare(b.data);
  });

  const testesAtivos = testesOrdenados.filter((t) => !t.concluido);
  const testesConcluidos = testesOrdenados.filter((t) => t.concluido);

  function handleAdd() {
    if (!form.materia || !form.data || !form.materiaProg) return;
    const novo = criarTeste({
      materia: form.materia,
      data: form.data,
      materiaProg: form.materiaProg,
      prioridade: form.prioridade,
      concluido: false,
    });
    setTestes((prev) => [...prev, novo]);
    setForm({ materia: "" as Materia, data: "", materiaProg: "", prioridade: 2 });
    setOpen(false);
  }

  function toggleConcluido(id: string) {
    setTestes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, concluido: !t.concluido } : t))
    );
  }

  function eliminarTeste(id: string) {
    setTestes((prev) => prev.filter((t) => t.id !== id));
  }

  const prioridadeLabel = (p: 1 | 2 | 3) =>
    p === 1 ? "Baixa" : p === 2 ? "Média" : "Alta";

  const prioridadeColor = (p: 1 | 2 | 3) =>
    p === 1
      ? "bg-frosted-mint text-vintage-grape"
      : p === 2
        ? "bg-pale-slate text-vintage-grape"
        : "bg-red-100 text-red-700";

  return (
    <div className="flex flex-col gap-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button className="w-full gap-2 bg-vintage-grape text-frosted-mint hover:bg-vintage-grape/90" />}>
            <Plus className="size-4" />
            Adicionar Teste
          </DialogTrigger>
        <DialogContent className="mx-4 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Teste</DialogTitle>
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
              <Label>Data do Teste</Label>
              <Input
                type="date"
                value={form.data}
                onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Matéria que vai sair *</Label>
              <Textarea
                placeholder="Escreve os tópicos que vão sair no teste..."
                value={form.materiaProg}
                onChange={(e) => setForm((f) => ({ ...f, materiaProg: e.target.value }))}
                rows={4}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Prioridade</Label>
              <Select
                value={String(form.prioridade)}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, prioridade: Number(v) as 1 | 2 | 3 }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Baixa</SelectItem>
                  <SelectItem value="2">Média</SelectItem>
                  <SelectItem value="3">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleAdd} disabled={!form.materia || !form.data || !form.materiaProg}>
              Adicionar Teste
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {testesAtivos.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium text-lilac-ash">Próximos Testes</h3>
          {testesAtivos.map((t) => {
            const dias = differenceInDays(parseISO(t.data), new Date());
            return (
              <Card key={t.id} className="border-pale-slate/50">
                <CardContent className="flex items-start justify-between gap-2 p-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-vintage-grape">{t.materia}</span>
                      <Badge className={cn("text-[10px]", prioridadeColor(t.prioridade))}>
                        {prioridadeLabel(t.prioridade)}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-lilac-ash">
                      {format(parseISO(t.data), "d 'de' MMMM", { locale: pt })}
                    </p>
                    {dias >= 0 && (
                      <p className={cn(
                        "mt-1 text-sm font-semibold",
                        dias <= 2 ? "text-red-500" : dias <= 5 ? "text-amber-500" : "text-lilac-ash"
                      )}>
                        Faltam {dias} dia{dias !== 1 ? "s" : ""}
                      </p>
                    )}
                    <p className="mt-1 line-clamp-2 text-xs text-lilac-ash">{t.materiaProg}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => toggleConcluido(t.id)}
                      className="text-frosted-mint hover:text-green-500"
                    >
                      <CheckCircle2 className="size-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => eliminarTeste(t.id)}
                      className="text-lilac-ash hover:text-red-500"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {testesConcluidos.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium text-lilac-ash">Concluídos</h3>
          {testesConcluidos.map((t) => (
            <Card key={t.id} className="border-pale-slate/30 opacity-60">
              <CardContent className="flex items-center justify-between p-3">
                <span className="line-through text-vintage-grape">{t.materia}</span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => eliminarTeste(t.id)}
                  className="text-lilac-ash"
                >
                  <Trash2 className="size-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {testes.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <p className="text-sm text-lilac-ash">Ainda não tens testes agendados.</p>
          <p className="text-xs text-lilac-ash">Adiciona o primeiro teste para começares a planear o estudo!</p>
        </div>
      )}
    </div>
  );
}