import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { produtoSchema, ProdutoFormData } from "@/src/schemas/produtoSchema";
import { Input } from "@/src/components/Input";
import { Button } from "@/src/components/Button";
import { useCategorias } from "@/src/hooks/useCategorias";

interface FormProdutoProps {
  initialData?: ProdutoFormData;
  onSubmit: (data: ProdutoFormData) => Promise<void>;
  isLoading?: boolean;
  submitButtonLabel?: string;
  onDelete?: () => Promise<void>;
  showDeleteButton?: boolean;
}

export default function FormProduto({
  initialData,
  onSubmit,
  isLoading = false,
  submitButtonLabel = "Cadastrar produto",
  onDelete,
  showDeleteButton = false,
}: FormProdutoProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema) as any,
    mode: "onChange",
    defaultValues: initialData || {
      nome: "",
      quantidade: 0,
      quantidadeMinima: 0,
      preco: 0,
      categoriaId: "",
      observacao: "",
      foto: "",
    },
  });

  const { categorias, isLoading: loadingCategorias } = useCategorias();

  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleFormSubmit: SubmitHandler<ProdutoFormData> = async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      Alert.alert("Erro", "Ocorreu um erro ao salvar o produto.");
    }
  };

  const handleDeletePress = async () => {
    Alert.alert(
      "Excluir Produto",
      "Tem certeza que deseja excluir este produto?",
      [
        {
          text: "Cancelar",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              if (onDelete) {
                await onDelete();
              }
            } catch (error) {
              console.error("Erro ao deletar produto:", error);
              Alert.alert("Erro", "Ocorreu um erro ao excluir o produto.");
            }
          },
          style: "destructive",
        },
      ],
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Nome do Produto */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Nome do produto <Text style={styles.required}>*</Text>
        </Text>
        <Controller
          control={control}
          name="nome"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              placeholder="Ex: Café Especial 250g"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              editable={!isSubmitting}
            />
          )}
        />
        {errors.nome && (
          <Text style={styles.errorText}>{errors.nome.message}</Text>
        )}
      </View>

      {/* Quantidade em estoque */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Quantidade em estoque <Text style={styles.required}>*</Text>
        </Text>
        <Controller
          control={control}
          name="quantidade"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              placeholder="Ex: 12"
              value={value?.toString() || ""}
              onChangeText={(text: string) =>
                onChange(text ? parseInt(text, 10) : undefined)
              }
              onBlur={onBlur}
              keyboardType="numeric"
              editable={!isSubmitting}
            />
          )}
        />
        {errors.quantidade && (
          <Text style={styles.errorText}>{errors.quantidade.message}</Text>
        )}
      </View>

      {/* Quantidade Mínima */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Quantidade mínima <Text style={styles.required}>*</Text>
        </Text>
        <Controller
          control={control}
          name="quantidadeMinima"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              placeholder="Ex: 5"
              value={value?.toString() || ""}
              onChangeText={(text: string) =>
                onChange(text ? parseInt(text, 10) : undefined)
              }
              onBlur={onBlur}
              keyboardType="numeric"
              editable={!isSubmitting}
            />
          )}
        />
        {errors.quantidadeMinima && (
          <Text style={styles.errorText}>
            {errors.quantidadeMinima.message}
          </Text>
        )}
      </View>

      {/* Preço */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Preço (R$) <Text style={styles.required}>*</Text>
        </Text>
        <Controller
          control={control}
          name="preco"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              placeholder="Informe o preço"
              value={value?.toString() || ""}
              onChangeText={(text: string) =>
                onChange(text ? parseFloat(text) : undefined)
              }
              onBlur={onBlur}
              keyboardType="decimal-pad"
              editable={!isSubmitting}
            />
          )}
        />
        {errors.preco && (
          <Text style={styles.errorText}>{errors.preco.message}</Text>
        )}
      </View>

      {/* Categoria */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Categoria <Text style={styles.required}>*</Text>
        </Text>
        {loadingCategorias ? (
          <ActivityIndicator size="small" color="#3B82F6" style={{ alignSelf: "flex-start", marginVertical: 8 }} />
        ) : (
          <Controller
            control={control}
            name="categoriaId"
            render={({ field: { value, onChange } }) => (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoryContainer}>
                  {categorias.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryButton,
                        value === cat.id && styles.categoryButtonActive,
                      ]}
                      onPress={() => onChange(cat.id)}
                      disabled={isSubmitting}
                    >
                      <Text
                        style={[
                          styles.categoryButtonText,
                          value === cat.id && styles.categoryButtonTextActive,
                        ]}
                      >
                        {cat.nome}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            )}
          />
        )}
        {errors.categoriaId && (
          <Text style={styles.errorText}>{errors.categoriaId.message}</Text>
        )}
      </View>

      {/* Observação */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Observação (opcional)</Text>
        <Controller
          control={control}
          name="observacao"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              placeholder="Ex: Verificar validade ao receber"
              value={value ?? ""}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              numberOfLines={3}
              editable={!isSubmitting}
            />
          )}
        />
        {errors.observacao && (
          <Text style={styles.errorText}>{errors.observacao.message}</Text>
        )}
      </View>

      {/* Submit Button */}
      <Button
        title={submitButtonLabel}
        onPress={handleSubmit(handleFormSubmit as any)}
        disabled={!isValid || isSubmitting || isLoading}
        loading={isSubmitting || isLoading}
      />

      {/* Delete Button */}
      {showDeleteButton && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeletePress}
          disabled={isSubmitting}
        >
          <Text style={styles.deleteButtonText}>Excluir produto</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 6,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  categoryButtonActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#2563EB",
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
  },
  categoryButtonTextActive: {
    color: "#FFFFFF",
  },
  deleteButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    alignItems: "center",
    marginBottom: 20,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#DC2626",
  },
});
