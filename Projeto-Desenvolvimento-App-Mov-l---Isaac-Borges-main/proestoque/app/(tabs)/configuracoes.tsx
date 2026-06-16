import React from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "@/src/constants/theme";
import { useAuth } from "@/src/contexts/AuthContext";

export default function ConfiguracoesScreen() {
  const { user, logout, isLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const confirmarLogout = () => {
    const confirmar =
      Platform.OS === "web"
        ? window.confirm("Tem certeza que deseja sair da conta?")
        : true;

    if (!confirmar) {
      return;
    }

    setIsLoggingOut(true);
    logout()
      .catch(() => {
        // segue o fluxo de saída mesmo se algo falhar ao limpar o storage
      })
      .finally(() => {
        setIsLoggingOut(false);
      });
  };

  const inicial = user?.nome?.charAt(0).toUpperCase() ?? "U";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Configurações</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{inicial}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{user?.nome ?? "Usuário"}</Text>
          <Text style={styles.email}>{user?.email ?? "-"}</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <Pressable style={styles.menuItem}>
          <Ionicons
            name="notifications-outline"
            size={20}
            color={theme.colors.primary}
          />
          <Text style={styles.menuText}>Notificações</Text>
          <Text style={styles.menuArrow}>›</Text>
        </Pressable>

        <Pressable style={styles.menuItem}>
          <Ionicons
            name="help-circle-outline"
            size={20}
            color={theme.colors.primary}
          />
          <Text style={styles.menuText}>Ajuda</Text>
          <Text style={styles.menuArrow}>›</Text>
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.logoutButton,
          (pressed || isLoggingOut || isLoading) && styles.logoutButtonPressed,
        ]}
        onPress={confirmarLogout}
        disabled={isLoggingOut || isLoading}
      >
        {isLoggingOut ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.logoutText}>Sair da conta</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  email: {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  menu: {
    gap: theme.spacing.sm,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
  },
  menuText: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.md,
  },
  menuArrow: {
    color: theme.colors.textSecondary,
    fontSize: 24,
    lineHeight: 24,
  },
  logoutButton: {
    backgroundColor: theme.colors.error,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
  },
  logoutButtonPressed: {
    opacity: 0.8,
  },
  logoutText: {
    color: "#FFFFFF",
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
