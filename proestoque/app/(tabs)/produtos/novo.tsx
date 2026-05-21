import React from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import FormProduto from '@/src/components/FormProduto';
import { useProducts } from '@/src/contexts/ProductsContext';
import { ProdutoFormData } from '@/src/schemas/produtoSchema';

export default function NovoProduto() {
  const router = useRouter();
  const { adicionarProduto } = useProducts();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: ProdutoFormData) => {
    try {
      setIsLoading(true);
      // Simula delay de network (como na Aula 7)
      await new Promise((resolve) => setTimeout(resolve, 500));

      adicionarProduto(data);
      Alert.alert('Sucesso', 'Produto adicionado com sucesso!');
      router.back();
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao criar o produto.');
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
