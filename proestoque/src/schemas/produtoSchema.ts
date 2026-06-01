import { z } from "zod";

export const produtoSchema = z.object({
  nome: z
    .string({ message: "Nome é obrigatório" })
    .min(2, { message: "Nome deve ter pelo menos 2 caracteres" })
    .max(100, { message: "Nome não pode exceder 100 caracteres" })
    .trim(),

  quantidade: z
    .number({ message: "Quantidade deve ser um número" })
    .int({ message: "Quantidade deve ser um número inteiro" })
    .nonnegative({ message: "Quantidade não pode ser negativa" }),

  quantidadeMinima: z
    .number({ message: "Quantidade mínima deve ser um número" })
    .int({ message: "Quantidade mínima deve ser um número inteiro" })
    .nonnegative({ message: "Quantidade mínima não pode ser negativa" }),

  preco: z
    .number({ message: "Preço é obrigatório" })
    .positive({ message: "Preço deve ser maior que zero" })
    .multipleOf(0.01, { message: "Preço deve ter no máximo 2 casas decimais" }),

  categoria: z.enum(
    ["Bebidas", "Alimentos", "Limpeza", "Eletrônicos", "Outros"] as const,
    {
      message: "Categoria inválida",
    },
  ),

  observacao: z
    .string()
    .max(500, { message: "Observação não pode exceder 500 caracteres" })
    .default(""),

  foto: z.string().default(""),
});

export type ProdutoFormData = z.infer<typeof produtoSchema>;

export type Produto = ProdutoFormData & {
  id: string;
  dataCriacao: string;
  dataAtualizacao: string;
};
