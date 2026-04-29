import { usePerfil, useTestes, useAulas, useCompromissos, useAtendimentos } from "@/lib/storage";
import { differenceInDays, isToday, parseISO, format, isAfter } from "date-fns";
import { pt } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Target, TrendingUp, Users } from "lucide-react";
import type { SessaoEstudo } from "@/lib/types";

function getProximoTeste(testes: ReturnType<typeof useTestes>[0]) {
  const hoje = new Date();
  const futuros = testes
    .filter((t) => !t.concluido && isAfter(parseISO(t.data), hoje))
    .sort((a, b) => a.data.localeCompare(b.data));
  return futuros[0] ?? null;
}

function getAulasHoje(aulas: ReturnType<typeof useAulas>[0]) {
  const diaSemana = new Date().getDay();
  return aulas
    .filter((a) => a.diaSemana === diaSemana)
    .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
}

function getAtendimentosHoje(atendimentos: ReturnType<typeof useAtendimentos>[0]) {
  const diaSemana = new Date().getDay();
  return atendimentos
    .filter((a) => a.diaSemana === diaSemana)
    .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
}

function calcularPlanoEstudo(
  perfil: ReturnType<typeof usePerfil>[0],
  testes: ReturnType<typeof useTestes>[0],
  aulas: ReturnType<typeof useAulas>[0],
  compromissos: ReturnType<typeof useCompromissos>[0]
): SessaoEstudo[] {
  const hoje = new Date();
  const diaSemana = hoje.getDay();
  const aulasHoje = aulas
    .filter((a) => a.diaSemana === diaSemana)
    .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

  const compromissosHoje = compromissos.filter((c) => {
    const dataComp = parseISO(c.data);
    return isToday(dataComp) || (c.recorrente === "semanal" && hoje.getDay() === parseISO(c.data).getDay());
  });

  const horaFimAulas = aulasHoje.length > 0
    ? aulasHoje[aulasHoje.length - 1].horaFim
    : perfil.horaFimEscola;

  const horaInicioEstudo = horaFimAulas;
  const tempoTotalDisponivel = perfil.tempoEstudoDiario;

  const testesProximos = testes
    .filter((t) => !t.concluido && isAfter(parseISO(t.data), hoje))
    .sort((a, b) => a.prioridade !== b.prioridade ? b.prioridade - a.prioridade : a.data.localeCompare(b.data));

  if (testesProximos.length === 0) {
    return [{
      materia: "Revisão geral" as const,
      duracao: Math.min(tempoTotalDisponivel, 30),
      horaInicio: horaInicioEstudo,
    }];
  }

  let tempoRestante = tempoTotalDisponivel;
  const sessoes: SessaoEstudo[] = [];
  let horaAtual = horaInicioEstudo;

  for (const teste of testesProximos) {
    if (tempoRestante <= 0) break;

    const diasAteTeste = differenceInDays(parseISO(teste.data), hoje);

    let peso: number;
    if (diasAteTeste <= 1) peso = 3;
    else if (diasAteTeste <= 3) peso = 2;
    else peso = 1;

    if (teste.prioridade === 3) peso += 2;
    else if (teste.prioridade === 2) peso += 1;

    const totalPesos = testesProximos.reduce((s, t) => {
      const d = differenceInDays(parseISO(t.data), hoje);
      let p = d <= 1 ? 3 : d <= 3 ? 2 : 1;
      if (t.prioridade === 3) p += 2;
      else if (t.prioridade === 2) p += 1;
      return s + p;
    }, 0);

    const duracao = Math.round((peso / totalPesos) * tempoTotalDisponivel / 5) * 5;
    const duracaoFinal = Math.min(duracao, tempoRestante);

    sessoes.push({
      materia: teste.materia,
      duracao: duracaoFinal,
      horaInicio: horaAtual,
    });

    tempoRestante -= duracaoFinal;

    const [h, m] = horaAtual.split(":").map(Number);
    const totalMin = h * 60 + m + duracaoFinal;
    horaAtual = `${String(Math.floor(totalMin / 60)).padStart(2, "0")}:${String(totalMin % 60).padStart(2, "0")}`;
  }

  return sessoes;
}

export default function Dashboard() {
  const [perfil] = usePerfil();
  const [testes] = useTestes();
  const [aulas] = useAulas();
  const [compromissos] = useCompromissos();
  const [atendimentos] = useAtendimentos();

  const proximoTeste = getProximoTeste(testes);
  const aulasHoje = getAulasHoje(aulas);
  const atendimentosHoje = getAtendimentosHoje(atendimentos);
  const planoEstudo = calcularPlanoEstudo(perfil, testes, aulas, compromissos);
  const hoje = new Date();

  if (!perfil.nome) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-12">
        <div className="flex size-24 items-center justify-center rounded-full bg-frosted-mint">
          <BookOpen className="size-12 text-vintage-grape" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-vintage-grape">Bem-vindo ao Calendário!</h2>
          <p className="mt-2 text-sm text-lilac-ash">
            Vai ao Perfil para configurar o teu nome e preferências.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-vintage-grape">
          Olá, {perfil.nome}! 👋
        </h2>
        <p className="text-sm text-lilac-ash">
          {format(hoje, "EEEE, d 'de' MMMM", { locale: pt })}
        </p>
      </div>

      {proximoTeste && (
        <Card className="border-lilac-ash/30 bg-gradient-to-br from-frosted-mint/50 to-pale-slate/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-lilac-ash">
              <Target className="size-4" />
              Próximo Teste
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-vintage-grape">
                {differenceInDays(parseISO(proximoTeste.data), hoje)}
              </span>
              <span className="text-sm text-lilac-ash">dias até</span>
              <span className="font-semibold text-vintage-grape">
                {proximoTeste.materia}
              </span>
            </div>
            <p className="mt-1 text-xs text-lilac-ash">
              {format(parseISO(proximoTeste.data), "d 'de' MMMM", { locale: pt })}
            </p>
          </CardContent>
        </Card>
      )}

      {atendimentosHoje.length > 0 && (
        <Card className="border-frosted-mint/50 bg-frosted-mint/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-vintage-grape">
              <Users className="size-4" />
              Atendimento ao Aluno Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1.5">
              {atendimentosHoje.map((att) => (
                <div key={att.id} className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-vintage-grape">{att.materia}</span>
                    <span className="text-xs text-lilac-ash">{att.professor}</span>
                  </div>
                  <span className="text-xs text-lilac-ash">
                    {att.horaInicio} - {att.horaFim}
                    {att.sala && <span className="ml-1">· {att.sala}</span>}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {aulasHoje.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-lilac-ash">
              <Clock className="size-4" />
              Aulas de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1.5">
              {aulasHoje.map((aula) => (
                <div key={aula.id} className="flex items-center justify-between">
                  <span className="text-sm text-vintage-grape">{aula.materia}</span>
                  <span className="text-xs text-lilac-ash">
                    {aula.horaInicio} - {aula.horaFim}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-lilac-ash">
            <TrendingUp className="size-4" />
            Plano de Estudo para Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          {planoEstudo.length > 0 ? (
            <div className="flex flex-col gap-2">
              {planoEstudo.map((sessao, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-frosted-mint/40 px-3 py-2"
                >
                  <div>
                    <span className="text-sm font-medium text-vintage-grape">
                      {sessao.materia}
                    </span>
                    <span className="ml-2 text-xs text-lilac-ash">
                      {sessao.horaInicio}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {sessao.duracao} min
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-lilac-ash">Nenhuma sessão de estudo planeada.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}