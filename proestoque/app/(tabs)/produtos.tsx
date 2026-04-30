import { useMemo, useState, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "@/src/constants/theme";
import { PRODUTOS_MOCK, CATEGORIAS, StatusEstoque } from "@/src/data/mockData";

export default function ProdutosScreen() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getStatusColor = (status: StatusEstoque) => {
    switch (status) {
      case "normal":
        return theme.colors.success;
      case "baixo":
        return "#F59E0B";
      case "sem-estoque":
        return theme.colors.error;
      default:
        return theme.colors.muted;
    }
  };

  const getStatusLabel = (status: StatusEstoque) => {
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
    let filtered = PRODUTOS_MOCK;

    // Filtro por busca
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.nome.toLowerCase().includes(searchLower) ||
          p.categoria.toLowerCase().includes(searchLower),
      );
    }

    // Filtro por categoria
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.categoria === selectedCategory);
    }

    return filtered;
  }, [search, selectedCategory]);

  const renderHeader = useCallback(
    () => (
      <View style={styles.resultCount}>
        <Text style={styles.resultCountText}>
          {filteredProducts.length} produto
          {filteredProducts.length !== 1 ? "s" : ""} encontrado
          {filteredProducts.length !== 1 ? "s" : ""}
        </Text>
      </View>
    ),
    [filteredProducts.length],
  );

  const renderProduct = ({ item }: { item: (typeof PRODUTOS_MOCK)[0] }) => (
    <View style={styles.productCard}>
      <View style={styles.productHeader}>
        <View>
          <Text style={styles.productName}>{item.nome}</Text>
          <Text style={styles.productCategory}>{item.categoria}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${getStatusColor(item.status)}20` },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          />
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.productDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Preço</Text>
          <Text style={styles.detailValue}>R$ {item.preço.toFixed(2)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Estoque</Text>
          <Text style={styles.detailValue}>{item.estoque} un</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Total</Text>
          <Text style={styles.detailValue}>
            R$ {(item.preço * item.estoque).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="search-outline"
        size={48}
        color={theme.colors.muted}
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyTitle}>Nenhum produto encontrado</Text>
      <Text style={styles.emptyMessage}>
        Tente ajustar sua busca ou filtro de categoria
      </Text>
      {(search || selectedCategory) && (
        <Pressable
          style={styles.clearButton}
          onPress={() => {
            setSearch("");
            setSelectedCategory(null);
          }}
        >
          <Text style={styles.clearButtonText}>Limpar filtros</Text>
        </Pressable>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      {/* Barra de busca fixa */}
      <View style={styles.headerContainer}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color={theme.colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar produto..."
            placeholderTextColor={theme.colors.muted}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={theme.colors.textSecondary}
              />
            </Pressable>
          )}
        </View>

        {/* Chips de categoria */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={styles.chipsContainer}
        >
          <Pressable
            style={[
              styles.chip,
              selectedCategory === null && styles.chipActive,
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text
              style={[
                styles.chipText,
                selectedCategory === null && styles.chipTextActive,
              ]}
            >
              Todos
            </Text>
          </Pressable>

          {CATEGORIAS.map((category) => (
            <Pressable
              key={category}
              style={[
                styles.chip,
                selectedCategory === category && styles.chipActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedCategory === category && styles.chipTextActive,
                ]}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Lista de produtos */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        scrollEnabled={true}
        contentContainerStyle={styles.flatListContent}
        numColumns={1}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  flatListContent: {
    backgroundColor: theme.colors.background,
    paddingTop: 0,
  },
  headerContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderColor: theme.colors.border,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    height: 44,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    paddingVertical: theme.spacing.sm,
  },
  chipsContainer: {
    marginBottom: theme.spacing.lg,
  },
  chip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    borderColor: theme.colors.border,
    borderWidth: 1,
    backgroundColor: theme.colors.card,
    marginRight: theme.spacing.md,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium,
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  resultCount: {
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  resultCountText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  productCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },
  productName: {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.md,
    marginBottom: theme.spacing.xs,
  },
  productCategory: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
    gap: theme.spacing.xs,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  productDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    paddingTop: theme.spacing.md,
  },
  detailItem: {
    flex: 1,
    alignItems: "center",
  },
  detailLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  detailValue: {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.md,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: theme.colors.border,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xxl,
    minHeight: 400,
  },
  emptyIcon: {
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  emptyMessage: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  clearButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
  },
  clearButtonText: {
    color: "#FFFFFF",
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
