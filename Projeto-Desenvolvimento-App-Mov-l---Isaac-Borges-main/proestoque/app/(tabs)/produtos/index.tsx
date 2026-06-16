import { useMemo, useState, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useProducts } from "@/src/contexts/ProductsContext";
import { useCategorias } from "@/src/hooks/useCategorias";
import { theme } from "@/src/constants/theme";
import { Produto } from "@/src/schemas/produtoSchema";
import { LoadingView } from "@/src/components/LoadingView";
import { ErrorView } from "@/src/components/ErrorView";
import { formatarPreco } from "@/src/utils/formatters";

export default function ProdutosScreen() {
  const router = useRouter();
  const { produtos, isLoading, error, carregarProdutos } = useProducts();
  const { categorias } = useCategorias();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarProdutos();
    setRefreshing(false);
  }, [carregarProdutos]);

  const getStatusEstoque = (produto: Produto) => {
    if (produto.quantidade === 0) return "sem-estoque";
    if (produto.quantidade <= produto.quantidadeMinima) return "baixo";
    return "normal";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "#10B981";
      case "baixo":
        return "#F59E0B";
      case "sem-estoque":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "normal":
        return "Normal";
      case "baixo":
        return "Baixo";
      case "sem-estoque":
        return "Sem estoque";
      default:
        return "Desconhecido";
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = produtos;

    // Filtro por busca
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.nome.toLowerCase().includes(searchLower) ||
          p.categoria?.nome.toLowerCase().includes(searchLower),
      );
    }

    // Filtro por categoria
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.categoriaId === selectedCategory);
    }

    return filtered;
  }, [search, selectedCategory, produtos]);

  const handleProductPress = (id: string) => {
    router.push({
      pathname: "/(tabs)/produtos/[id]" as any,
      params: { id },
    });
  };

  const handleNewProduct = () => {
    router.push("/(tabs)/produtos/novo" as any);
  };

  if (isLoading && produtos.length === 0) {
    return <LoadingView mensagem="Buscando produtos..." />;
  }

  if (error && produtos.length === 0) {
    return <ErrorView mensagem={error} onRetry={carregarProdutos} />;
  }

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={18}
          color="#9CA3AF"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produto..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#D1D5DB"
        />
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        <TouchableOpacity
          style={[
            styles.categoryChip,
            selectedCategory === null && styles.categoryChipActive,
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text
            style={[
              styles.categoryChipText,
              selectedCategory === null && styles.categoryChipTextActive,
            ]}
          >
            Todos
          </Text>
        </TouchableOpacity>

        {categorias.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryChip,
              selectedCategory === cat.id && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory((prev) => (prev === cat.id ? null : cat.id))}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === cat.id && styles.categoryChipTextActive,
              ]}
            >
              {cat.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Result Count */}
      <View style={styles.resultCount}>
        <Text style={styles.resultCountText}>
          {filteredProducts.length} produto
          {filteredProducts.length !== 1 ? "s" : ""} encontrado
          {filteredProducts.length !== 1 ? "s" : ""}
        </Text>
      </View>
    </View>
  );

  const renderProduct = ({ item }: { item: Produto }) => {
    const status = getStatusEstoque(item);
    const statusColor = getStatusColor(status);
    const statusLabel = getStatusLabel(status);

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => handleProductPress(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.productContent}>
          {/* Product Icon */}
          <View style={styles.productIcon}>
            <Ionicons name="cube" size={24} color="#9CA3AF" />
          </View>

          {/* Product Info */}
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.nome}</Text>
            <Text style={styles.productQuantity}>
              {item.quantidade} {item.unidade || "un"}
            </Text>
            <Text style={styles.productCategory}>
              {item.categoria?.nome || "Sem categoria"}
            </Text>
          </View>

          {/* Status Badge */}
          <View style={styles.productRight}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: `${statusColor}20` },
              ]}
            >
              <View
                style={[styles.statusDot, { backgroundColor: statusColor }]}
              />
              <Text style={[styles.statusLabel, { color: statusColor }]}>
                {statusLabel}
              </Text>
            </View>
            <Text style={styles.productPrice}>{formatarPreco(item.preco)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
            <Text style={styles.emptySubtext}>
              Adicione um novo produto para começar
            </Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleNewProduct}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  listContent: {
    paddingBottom: 100,
  },
  headerContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  categoryChipActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#2563EB",
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
  },
  categoryChipTextActive: {
    color: "#FFFFFF",
  },
  resultCount: {
    paddingHorizontal: 16,
  },
  resultCountText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  productCard: {
    marginHorizontal: 12,
    marginVertical: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  productContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  productIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  productRight: {
    alignItems: "flex-end",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  productPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F2937",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
});
