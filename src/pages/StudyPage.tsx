import { useState, useRef, useEffect } from "react";
import { useTestes, usePerfil } from "@/lib/storage";
import { format, parseISO, differenceInDays } from "date-fns";
import { pt } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bot, Send, BookOpen, Lightbulb, Pen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Materia } from "@/lib/types";

interface Mensagem {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

function gerarResposta(mensagem: string, teste: { materia: Materia; materiaProg: string } | null, modo: string): string {
  if (!teste) {
    return "Seleciona um teste para começares a estudar! Vai à página de Testes e adiciona um teste com a matéria que vai sair.";
  }

  const ctx = `Matéria: ${teste.materia}\nTópicos: ${teste.materiaProg}`;

  if (modo === "explicar") {
    return `📚 **Explicação - ${teste.materia}**\n\n${ctx}\n\nVou explicar um dos tópicos desta matéria de forma simples:\n\nPodes perguntar-me algo específico como:\n• "Explica-me [tópico]"\n• "Como funciono [conceito]?"\n• "Dá-me um exemplo de [tema]"\n\nEscreve a tua pergunta e eu ajudo-te!`;
  }

  if (modo === "quiz") {
    const topicos = teste.materiaProg.split(",").map(t => t.trim()).filter(Boolean);
    const topico = topicos[Math.floor(Math.random() * topicos.length)] || teste.materia;
    return `📝 **Quiz - ${teste.materia}**\n\nPergunta sobre: **${topico}**\n\n(Como estou em modo demo, não posso gerar perguntas reais ainda. Quando a API de IA estiver configurada, vou criar perguntas adaptadas à tua matéria!)\n\nTu: "${mensagem}"\n\n💡 Para já, tenta responder à pergunta acima ou pede-me para explicar qualquer coisa.`;
  }

  if (modo === "resumir") {
    return `📋 **Resumo - ${teste.materia}**\n\n${ctx}\n\nAqui tens um resumo estruturado dos tópicos que vais precisar de saber:\n\n(O resumo completo será gerado pela IA quando a API estiver conectada.)\n\nEnquanto isso, podes perguntar-me sobre qualquer tópico acima!`;
  }

  return `🤖 Obrigado pela tua pergunta sobre **${teste.materia}**!\n\nEstou em modo demonstração e ainda não tenho acesso à IA. Mas quando a API estiver conectada, vou poder:\n\n• **Explicar** conceitos de forma simples\n• **Criar quizzes** adaptados à tua matéria\n• **Fazer resumos** do que precisas de saber\n• **Responder** às tuas dúvidas\n\nPor agora, seleciona um modo em cima para ver como vai funcionar!`;
}

export default function StudyPage() {
  const [testes] = useTestes();
  const [perfil] = usePerfil();
  const [testeSelecionado, setTesteSelecionado] = useState<string>("");
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [input, setInput] = useState("");
  const [modo, setModo] = useState<"explicar" | "quiz" | "resumir" | "livre">("livre");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const testesAtivos = testes.filter((t) => !t.concluido);
  const testeAtual = testesAtivos.find((t) => t.id === testeSelecionado) ?? null;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  function enviar() {
    if (!input.trim()) return;

    const novaMensagem: Mensagem = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMensagens((prev) => [...prev, novaMensagem]);
    setInput("");

    setTimeout(() => {
      const resposta: Mensagem = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: gerarResposta(input.trim(), testeAtual, modo),
        timestamp: new Date(),
      };
      setMensagens((prev) => [...prev, resposta]);
    }, 500);
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-lilac-ash">
            <BookOpen className="size-4" />
            Estudar com IA
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-lilac-ash">Teste a estudar</label>
            <Select
              value={testeSelecionado}
              onValueChange={(v) => { if (v && v !== "none") setTesteSelecionado(v); }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleciona um teste" />
              </SelectTrigger>
              <SelectContent>
                {testesAtivos.length > 0 ? (
                  testesAtivos
                    .sort((a, b) => a.data.localeCompare(b.data))
                    .map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.materia} — {format(parseISO(t.data), "d 'de' MMMM", { locale: pt })} (faltam {differenceInDays(parseISO(t.data), new Date())} dias)
                      </SelectItem>
                    ))
                ) : (
                  <SelectItem value="none" disabled>
                    Sem testes agendados
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {testeAtual && (
            <div className="rounded-lg bg-pale-slate/30 px-3 py-2">
              <p className="text-xs font-medium text-vintage-grape">Matéria que vai sair:</p>
              <p className="mt-0.5 text-xs text-lilac-ash">{testeAtual.materiaProg}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant={modo === "explicar" ? "default" : "outline"}
              size="sm"
              onClick={() => setModo("explicar")}
              className={cn(
                "gap-1 text-xs",
                modo === "explicar" && "bg-vintage-grape text-frosted-mint"
              )}
            >
              <Lightbulb className="size-3" />
              Explicar
            </Button>
            <Button
              variant={modo === "quiz" ? "default" : "outline"}
              size="sm"
              onClick={() => setModo("quiz")}
              className={cn(
                "gap-1 text-xs",
                modo === "quiz" && "bg-vintage-grape text-frosted-mint"
              )}
            >
              <Pen className="size-3" />
              Quiz
            </Button>
            <Button
              variant={modo === "resumir" ? "default" : "outline"}
              size="sm"
              onClick={() => setModo("resumir")}
              className={cn(
                "gap-1 text-xs",
                modo === "resumir" && "bg-vintage-grape text-frosted-mint"
              )}
            >
              <BookOpen className="size-3" />
              Resumir
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex min-h-[300px] max-h-[50vh] flex-col rounded-xl border border-pale-slate/50 bg-card">
        <div className="flex-1 overflow-y-auto p-3">
          {mensagens.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-frosted-mint/50">
                <Bot className="size-8 text-vintage-grape" />
              </div>
              <div>
                <p className="text-sm font-medium text-vintage-grape">Olá{perfil.nome ? `, ${perfil.nome}` : ""}!</p>
                <p className="mt-1 text-xs text-lilac-ash">
                  Seleciona um teste e pergunta-me qualquer coisa sobre a matéria.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {mensagens.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                    msg.role === "user"
                      ? "ml-auto bg-vintage-grape text-frosted-mint"
                      : "mr-auto bg-frosted-mint/50 text-vintage-grape"
                  )}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              ))}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="border-t border-pale-slate/50 p-3">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  enviar();
                }
              }}
              placeholder={
                !testeSelecionado
                  ? "Seleciona um teste primeiro..."
                  : modo === "quiz"
                    ? "Escreve a tua resposta ao quiz..."
                    : modo === "explicar"
                      ? "O que queres que eu explique?"
                      : modo === "resumir"
                        ? "Sobre que tópico queres o resumo?"
                        : "Pergunta-me qualquer coisa..."
              }
              className="min-h-[40px] resize-none text-sm"
              rows={1}
            />
            <Button
              onClick={enviar}
              disabled={!input.trim()}
              className="shrink-0 bg-vintage-grape text-frosted-mint hover:bg-vintage-grape/90"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}