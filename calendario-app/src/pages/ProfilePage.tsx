import { usePerfil } from "@/lib/storage";
import type { Perfil } from "@/lib/types";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, GraduationCap, Clock } from "lucide-react";

export default function ProfilePage() {
  const [perfil, setPerfil] = usePerfil();

  function updatePerfil(partial: Partial<Perfil>) {
    setPerfil((prev) => ({ ...prev, ...partial }));
  }

  const temPerfil = perfil.nome.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <Card className={temPerfil ? "border-frosted-mint/50" : "border-pale-slate"}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-lilac-ash">
            <User className="size-4" />
            O meu Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={perfil.nome}
              onChange={(e) => updatePerfil({ nome: e.target.value })}
              placeholder="O teu nome"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Ano Escolar</Label>
            <Select
              value={String(perfil.anoEscolar)}
              onValueChange={(v) => updatePerfil({ anoEscolar: Number(v) as 5 | 6 })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5º Ano</SelectItem>
                <SelectItem value="6">6º Ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-lilac-ash">
            <Clock className="size-4" />
            Preferências de Estudo
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="tempo">Tempo de estudo por dia (minutos)</Label>
            <Input
              id="tempo"
              type="number"
              min={15}
              max={300}
              value={perfil.tempoEstudoDiario}
              onChange={(e) =>
                updatePerfil({ tempoEstudoDiario: Number(e.target.value) || 60 })
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="horaFim">Hora fim das aulas</Label>
            <Input
              id="horaFim"
              type="time"
              value={perfil.horaFimEscola}
              onChange={(e) => updatePerfil({ horaFimEscola: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="domingo"
              type="checkbox"
              checked={perfil.domingoEstudo}
              onChange={(e) => updatePerfil({ domingoEstudo: e.target.checked })}
              className="size-4 rounded border-pale-slate accent-vintage-grape"
            />
            <Label htmlFor="domingo" className="text-sm text-vintage-grape">
              Quero estudar ao domingo
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-lilac-ash">
            <GraduationCap className="size-4" />
            Resumo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1 text-sm text-vintage-grape">
            <p><strong>Nome:</strong> {perfil.nome || "—"}</p>
            <p><strong>Ano:</strong> {perfil.anoEscolar}º</p>
            <p><strong>Tempo de estudo:</strong> {perfil.tempoEstudoDiario} min/dia</p>
            <p><strong>Fim das aulas:</strong> {perfil.horaFimEscola}</p>
            <p><strong>Estudar domingos:</strong> {perfil.domingoEstudo ? "Sim" : "Não"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}