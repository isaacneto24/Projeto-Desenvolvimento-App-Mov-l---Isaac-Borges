import { useMemo, useState, useCallback } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "@/src/constants/theme";
import { useAuth } from "@/src/contexts/AuthContext";
import { useProducts } from "@/src/contexts/ProductsContext";
import { Produto } from "@/src/schemas/produtoSchema";
import { LoadingView } from "@/src/components/LoadingView";
import { formatarPreco } from "@/src/utils/formatters";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const { produtos, isLoading, carregarProdutos } = useProducts();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarProdutos();
    setRefreshing(false);
  }, [carregarProdutos]);

  // Calcular resumo a partir do contexto
  const resumo = useMemo(() => {
    const total = produtos.length;
    const estoque = produtos.reduce((sum, p) => sum + p.quantidade, 0);
    const categorias = new Set(produtos.map((p) => p.categoriaId)).size;
    const alertas = produtos.filter(
      (p) => p.quantidade === 0 || p.quantidade <= p.quantidadeMinima,
    ).length;
    return { total, estoque, categorias, alertas };
  }, [produtos]);

  // Calcular alertas
  const alertas = useMemo(() => {
    return produtos
      .filter((p) => p.quantidade === 0 || p.quantidade <= p.quantidadeMinima)
      .map((p) => ({
        id: p.id,
        produtoNome: p.nome,
        mensagem:
          p.quantidade === 0
            ? "Sem estoque"
            : `Estoque baixo (${p.quantidade}/${p.quantidadeMinima})`,
        tipo: p.quantidade === 0 ? "crítico" : ("aviso" as const),
      }));
  }, [produtos]);

  const produtosRecentes = useMemo(
    () => produtos.slice(-5).reverse(),
    [produtos],
  );

  const getStatusColor = (quantidade: number, minima: number) => {
    if (quantidade === 0) return theme.colors.error;
    if (quantidade <= minima) return "#F59E0B";
    return theme.colors.success;
  };

  const getStatusLabel = (quantidade: number, minima: number) => {
    if (quantidade === 0) return "Sem estoque";
    if (quantidade <= minima) return "Baixo";
    return "Normal";
  };

  const saudacao = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "Bom dia";
    if (hora < 18) return "Boa tarde";
    return "Boa noite";
  };

  const inicial = user?.nome?.charAt(0).toUpperCase() ?? "U";

  if (isLoading && produtos.length === 0) {
    return <LoadingView mensagem="Carregando dashboard..." />;
  }

  const renderHeader = () => (
    <View style={styles.container}>
      {/* Saudação com botão de logout */}
      <View style={styles.headerSection}>
        <View style={styles.headerTop}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>
              {saudacao()}, {user?.nome?.split(" ")[0] ?? "Usuário"} 👋
            </Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{inicial}</Text>
          </View>
        </View>
      </View>

      {/* Cards de resumo */}
      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{resumo.total}</Text>
          <Text style={styles.summaryLabel}>Produtos</Text>
          <Ionicons
            name="cube-outline"
            size={20}
            color={theme.colors.primary}
            style={styles.cardIcon}
          />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{resumo.estoque}</Text>
          <Text style={styles.summaryLabel}>Itens</Text>
          <Ionicons
            name="layers-outline"
            size={20}
            color={theme.colors.primary}
            style={styles.cardIcon}
          />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{resumo.categorias}</Text>
          <Text style={styles.summaryLabel}>Categorias</Text>
          <Ionicons
            name="pricetag-outline"
            size={20}
            color={theme.colors.primary}
            style={styles.cardIcon}
          />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{resumo.alertas}</Text>
          <Text style={styles.summaryLabel}>Alertas</Text>
          <Ionicons
            name="alert-circle-outline"
            size={20}
            color={theme.colors.error}
            style={styles.cardIcon}
          />
        </View>
      </View>

      {/* Seção de alertas */}
      {alertas.length > 0 && (
        <View style={styles.alertsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⚠️ Alertas de Estoque</Text>
            <Text style={styles.alertCount}>{alertas.length}</Text>
          </View>
          <View style={styles.alertsList}>
            {alertas.slice(0, 3).map((alerta) => (
              <View
                key={alerta.id}
                style={[
                  styles.alertItem,
                  {
                    borderLeftColor:
                      alerta.tipo === "crítico"
                        ? theme.colors.error
                        : "#F59E0B",
                  },
                ]}
              >
                <Ionicons
                  name={
                    alerta.tipo === "crítico"
                      ? "alert-circle"
                      : "warning-outline"
                  }
                  size={16}
                  color={
                    alerta.tipo === "crítico" ? theme.colors.error : "#F59E0B"
                  }
                />
                <View style={styles.alertContent}>
                  <Text style={styles.alertName}>{alerta.produtoNome}</Text>
                  <Text style={styles.alertMessage}>{alerta.mensagem}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Produtos recentes */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>📦 Produtos Recentes</Text>
      </View>
    </View>
  );

  const renderProduct = ({ item }: { item: Produto }) => {
    const status = getStatusColor(item.quantidade, item.quantidadeMinima);
    const statusLabel = getStatusLabel(item.quantidade, item.quantidadeMinima);

    return (
      <View style={styles.productItem}>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.nome}</Text>
          <Text style={styles.productCategory}>{item.categoria?.nome || "Sem categoria"}</Text>
          <View style={styles.productFooter}>
            <Text style={styles.productPrice}>{formatarPreco(item.preco)}</Text>
            <View
              style={[styles.statusBadge, { backgroundColor: `${status}20` }]}
            >
              <View style={[styles.statusDot, { backgroundColor: status }]} />
              <Text style={[styles.statusText, { color: status }]}>
                {statusLabel}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.productStockBox}>
          <Text style={styles.stockNumber}>{item.quantidade}</Text>
          <Text style={styles.stockLabel}>{item.unidade || "un"}</Text>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={produtosRecentes}
      renderItem={renderProduct}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      scrollEnabled={true}
      contentContainerStyle={styles.flatListContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  flatListContent: {
    backgroundColor: theme.colors.background,
  },
  headerSection: {
    marginBottom: theme.spacing.lg,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: theme.spacing.lg,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: theme.typography.fontWeight.bold,
  },
  date: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  summaryCard: {
    flex: 1,
    minWidth: "48%",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderColor: theme.colors.border,
    borderWidth: 1,
    padding: theme.spacing.md,
    position: "relative",
  },
  summaryValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  summaryLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  cardIcon: {
    position: "absolute",
    top: theme.spacing.md,
    right: theme.spacing.md,
  },
  alertsSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  alertCount: {
    backgroundColor: theme.colors.error,
    color: "#FFFFFF",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  alertsList: {
    gap: theme.spacing.sm,
  },
  alertItem: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderLeftWidth: 4,
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  alertContent: {
    flex: 1,
  },
  alertName: {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.sm,
  },
  alertMessage: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  productItem: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderColor: theme.colors.border,
    borderWidth: 1,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.md,
  },
  productCategory: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing.md,
  },
  productPrice: {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.md,
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
  productStockBox: {
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    minWidth: 50,
  },
  stockNumber: {
    fontWeight: theme.typography.fontWeight.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.primary,
  },
  stockLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
  },
});
