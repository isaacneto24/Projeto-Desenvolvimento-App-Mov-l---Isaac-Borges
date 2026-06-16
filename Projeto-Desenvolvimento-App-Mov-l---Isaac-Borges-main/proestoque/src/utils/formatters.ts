export const formatarPreco = (valor: number): string => {
  if (typeof valor !== "number") return "";
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export const formatarData = (iso: string): string => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatarQuantidade = (qtd: number, unidade: string) => {
  return `${qtd} ${unidade || "un"}`;
};
