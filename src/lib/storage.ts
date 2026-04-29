import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Teste, Aula, Compromisso, Atendimento, Perfil } from "@/lib/types";
import { PERFIL_PADRAO } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

const KEYS = {
  TESTES: "calendario_testes",
  AULAS: "calendario_aulas",
  COMPROMISSOS: "calendario_compromissos",
  ATENDIMENTOS: "calendario_atendimentos",
  PERFIL: "calendario_perfil",
} as const;

export function useTestes() {
  return useLocalStorage<Teste[]>(KEYS.TESTES, []);
}

export function useAulas() {
  return useLocalStorage<Aula[]>(KEYS.AULAS, []);
}

export function useCompromissos() {
  return useLocalStorage<Compromisso[]>(KEYS.COMPROMISSOS, []);
}

export function useAtendimentos() {
  return useLocalStorage<Atendimento[]>(KEYS.ATENDIMENTOS, []);
}

export function usePerfil() {
  return useLocalStorage<Perfil>(KEYS.PERFIL, PERFIL_PADRAO);
}

export function criarTeste(teste: Omit<Teste, "id" | "criadoEm">): Teste {
  return {
    ...teste,
    id: uuidv4(),
    criadoEm: new Date().toISOString(),
  };
}

export function criarAula(aula: Omit<Aula, "id">): Aula {
  return { ...aula, id: uuidv4() };
}

export function criarCompromisso(comp: Omit<Compromisso, "id">): Compromisso {
  return { ...comp, id: uuidv4() };
}

export function criarAtendimento(att: Omit<Atendimento, "id">): Atendimento {
  return { ...att, id: uuidv4() };
}