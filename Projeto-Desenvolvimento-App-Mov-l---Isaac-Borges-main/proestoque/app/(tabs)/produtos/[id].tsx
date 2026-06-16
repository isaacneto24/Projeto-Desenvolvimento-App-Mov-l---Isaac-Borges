import React from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Alert, ActivityIndicator, View } from "react-native";
import FormProduto from "@/src/components/FormProduto";
import { useProducts } from "@/src/contexts/ProductsContext";
import { ProdutoFormData } from "@/src/schemas/produtoSchema";

export default function EditarProduto() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { produtos, editarProduto, deletarProduto } = useProducts();
  const [isLoading, setIsLoading] = React.useState(false);

  const produto = React.useMemo(() => {
    return produtos.find((p) => p.id === id);
  }, [produtos, id]);

  if (!produto) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleSubmit = async (data: ProdutoFormData) => {
    try {
      setIsLoading(true);
      await editarProduto(id, data);
      Alert.alert("Sucesso", "Produto atualizado com sucesso!");
      router.back();
    } catch (error: any) {
      console.error("Erro ao editar produto:", error);
      Alert.alert(
        "Não foi possível salvar",
        error.message ?? "Verifique sua conexão e tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deletarProduto(id);
      Alert.alert("Sucesso", "Produto deletado com sucesso!");
      router.back();
    } catch (error: any) {
      console.error("Erro ao deletar produto:", error);
      Alert.alert(
        "Erro ao excluir",
        error.message ?? "Ocorreu um erro ao deletar o produto."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const initialData: ProdutoFormData = {
    nome: produto.nome,
    quantidade: produto.quantidade,
    quantidadeMinima: produto.quantidadeMinima,
    preco: produto.preco,
    categoriaId: produto.categoriaId,
    observacao: produto.observacao || "",
    foto: produto.foto || "",
  };

  return (
    <FormProduto
      initialData={initialData}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      isLoading={isLoading}
      submitButtonLabel="Salvar alterações"
      showDeleteButton
    />
  );
}
