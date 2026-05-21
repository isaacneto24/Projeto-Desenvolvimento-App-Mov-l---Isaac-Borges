import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Alert, ActivityIndicator, View } from 'react-native';
import FormProduto from '@/src/components/FormProduto';
import { useProducts } from '@/src/contexts/ProductsContext';
import { ProdutoFormData } from '@/src/schemas/produtoSchema';

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
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleSubmit = async (data: ProdutoFormData) => {
    try {
      setIsLoading(true);
      // Simula delay de network
      await new Promise((resolve) => setTimeout(resolve, 500));

      editarProduto(id, data);
      Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
      router.back();
    } catch (error) {
      console.error('Erro ao editar produto:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao atualizar o produto.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      // Simula delay de network
      await new Promise((resolve) => setTimeout(resolve, 500));

      deletarProduto(id);
      Alert.alert('Sucesso', 'Produto deletado com sucesso!');
      router.back();
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao deletar o produto.');
    } finally {
      setIsLoading(false);
    }
  };

  const initialData: ProdutoFormData = {
    nome: produto.nome,
    quantidade: produto.quantidade,
    quantidadeMinima: produto.quantidadeMinima,
    preco: produto.preco,
    categoria: produto.categoria,
    observacao: produto.observacao,
    foto: produto.foto,
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
