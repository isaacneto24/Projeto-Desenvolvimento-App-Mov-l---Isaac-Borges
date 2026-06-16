export type StatusEstoque = "normal" | "baixo" | "sem-estoque";

export interface Produto {
  id: string;
  nome: string;
  categoria: string;
  estoque: number;
  preço: number;
  status: StatusEstoque;
  dataAdição?: string;
}

export interface Alerta {
  id: string;
  produtoId: string;
  produtoNome: string;
  mensagem: string;
  tipo: "crítico" | "aviso";
}

export const CATEGORIAS = [
  "Eletrônicos",
  "Vestuário",
  "Alimentos",
  "Móveis",
  "Higiene",
  "Ferramentas",
  "Decoração",
  "Livros",
];

export const PRODUTOS_MOCK: Produto[] = [
  {
    id: "1",
    nome: "Notebook Dell",
    categoria: "Eletrônicos",
    estoque: 5,
    preço: 2500.0,
    status: "normal",
    dataAdição: "2024-01-15",
  },
  {
    id: "2",
    nome: "Mouse Logitech",
    categoria: "Eletrônicos",
    estoque: 2,
    preço: 89.9,
    status: "baixo",
    dataAdição: "2024-01-10",
  },
  {
    id: "3",
    nome: "Camiseta Básica",
    categoria: "Vestuário",
    estoque: 0,
    preço: 39.9,
    status: "sem-estoque",
    dataAdição: "2024-02-01",
  },
  {
    id: "4",
    nome: "Arroz Integral 5kg",
    categoria: "Alimentos",
    estoque: 15,
    preço: 24.5,
    status: "normal",
    dataAdição: "2024-02-05",
  },
  {
    id: "5",
    nome: "Mesa de Escritório",
    categoria: "Móveis",
    estoque: 3,
    preço: 450.0,
    status: "baixo",
    dataAdição: "2024-01-20",
  },
  {
    id: "6",
    nome: "Sabonete Líquido",
    categoria: "Higiene",
    estoque: 1,
    preço: 12.0,
    status: "baixo",
    dataAdição: "2024-02-10",
  },
  {
    id: "7",
    nome: "Chave de Fenda Flexível",
    categoria: "Ferramentas",
    estoque: 8,
    preço: 15.9,
    status: "normal",
    dataAdição: "2024-01-25",
  },
  {
    id: "8",
    nome: "Quadro Decorativo",
    categoria: "Decoração",
    estoque: 12,
    preço: 85.0,
    status: "normal",
    dataAdição: "2024-02-03",
  },
  {
    id: "9",
    nome: "Livro React Nativo",
    categoria: "Livros",
    estoque: 0,
    preço: 120.0,
    status: "sem-estoque",
    dataAdição: "2024-02-12",
  },
  {
    id: "10",
    nome: "Teclado Mecânico RGB",
    categoria: "Eletrônicos",
    estoque: 6,
    preço: 350.0,
    status: "normal",
    dataAdição: "2024-01-28",
  },
];

// Funções auxiliares
export function getAlertas(produtos: Produto[]): Alerta[] {
  return produtos
    .filter((p) => p.status !== "normal")
    .map((p) => ({
      id: p.id,
      produtoId: p.id,
      produtoNome: p.nome,
      mensagem:
        p.status === "sem-estoque"
          ? "Sem estoque disponível"
          : "Estoque abaixo do ideal",
      tipo:
        p.status === "sem-estoque" ? ("crítico" as const) : ("aviso" as const),
    }));
}

export function calcularResumo(produtos: Produto[]) {
  return {
    total: produtos.length,
    estoque: produtos.reduce((sum, p) => sum + p.estoque, 0),
    alertas: getAlertas(produtos).length,
    categorias: new Set(produtos.map((p) => p.categoria)).size,
    valorTotal: produtos.reduce((sum, p) => sum + p.estoque * p.preço, 0),
  };
}
