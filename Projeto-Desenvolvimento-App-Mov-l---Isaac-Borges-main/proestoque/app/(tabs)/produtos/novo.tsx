import React from "react";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import FormProduto from "@/src/components/FormProduto";
import { useProducts } from "@/src/contexts/ProductsContext";
import { ProdutoFormData } from "@/src/schemas/produtoSchema";

export default function NovoProduto() {
  const router = useRouter();
  const { adicionarProduto } = useProducts();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: ProdutoFormData) => {
    try {
      setIsLoading(true);
      await adicionarProduto(data);
      Alert.alert("Sucesso", "Produto adicionado com sucesso!");
      router.back();
    } catch (error: any) {
      console.error("Erro ao criar produto:", error);
      Alert.alert(
        "Não foi possível salvar",
        error.message ?? "Verifique sua conexão e tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProduto
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitButtonLabel="Cadastrar produto"
    />
  );
}

