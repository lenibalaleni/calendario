export type Materia =
  | "Português"
  | "Matemática"
  | "Inglês"
  | "Ciências Naturais"
  | "História e Geografia de Portugal"
  | "Educação Visual"
  | "Educação Tecnológica"
  | "Educação Física"
  | "Cidadania e Desenvolvimento"
  | "EMRC"
  | "Apoio ao Estudo"
  | "Oferta Complementar"
  | (string & {});

export const MATERIAS_5_6: Materia[] = [
  "Português",
  "Matemática",
  "Inglês",
  "Ciências Naturais",
  "História e Geografia de Portugal",
  "Educação Visual",
  "Educação Tecnológica",
  "Educação Física",
  "Cidadania e Desenvolvimento",
  "EMRC",
  "Apoio ao Estudo",
  "Oferta Complementar",
];

export const DIAS_SEMANA = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
] as const;

export type DiaSemana = (typeof DIAS_SEMANA)[number];

export interface Teste {
  id: string;
  materia: Materia;
  data: string;
  materiaProg: string;
  prioridade: 1 | 2 | 3;
  concluido: boolean;
  criadoEm: string;
}

export interface Aula {
  id: string;
  materia: Materia;
  diaSemana: number;
  horaInicio: string;
  horaFim: string;
  sala?: string;
  professor?: string;
}

export interface Compromisso {
  id: string;
  titulo: string;
  data: string;
  horaInicio?: string;
  horaFim?: string;
  recorrente?: "semanal" | "mensal" | "nenhum";
  tipo: "aula_extra" | "atividade" | "outro";
  materia?: Materia;
}

export interface Atendimento {
  id: string;
  materia: Materia;
  professor: string;
  diaSemana: number;
  horaInicio: string;
  horaFim: string;
  sala?: string;
}

export interface Perfil {
  nome: string;
  anoEscolar: 5 | 6;
  tempoEstudoDiario: number;
  horaFimEscola: string;
  domingoEstudo: boolean;
}

export interface SessaoEstudo {
  materia: Materia;
  duracao: number;
  horaInicio: string;
}

export const PERFIL_PADRAO: Perfil = {
  nome: "",
  anoEscolar: 5,
  tempoEstudoDiario: 60,
  horaFimEscola: "16:30",
  domingoEstudo: false,
};