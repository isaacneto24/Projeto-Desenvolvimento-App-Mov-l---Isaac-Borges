import { Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, Alert } from "react-native";
import { useAuth } from "@/src/contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/src/components/Button";
import { Input } from "@/src/components/Input";
import { LogoProEstoque } from "@/src/components/LogoProEstoque";
import { theme } from "@/src/constants/theme";

export default function CadastroScreen() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const { registrar } = useAuth();

  const senhaDiferente = confirmarSenha.length > 0 && senha !== confirmarSenha;

  const handleCriarConta = async () => {
    setLoading(true);
    try {
      await registrar(nome, email, senha);
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Erro", error.message ?? "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerArea}>
          <LogoProEstoque size="md" />
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>
            Cadastre-se para gerenciar seus produtos.
          </Text>
        </View>

        <View style={styles.formArea}>
          <Input
            label="Nome"
            placeholder="Seu nome completo"
            value={nome}
            onChangeText={setNome}
          />
          <Input
            label="E-mail"
            placeholder="voce@email.com"
            keyboardType="email-address"
            leftIcon="mail-outline"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            label="Senha"
            placeholder="Crie uma senha"
            secureTextEntry
            leftIcon="lock-closed-outline"
            value={senha}
            onChangeText={setSenha}
          />
          <Input
            label="Confirmar senha"
            placeholder="Repita a senha"
            secureTextEntry
            leftIcon="lock-closed-outline"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            error={senhaDiferente ? "As senhas nao coincidem." : undefined}
          />

          <Button
            title="Criar Conta"
            fullWidth
            loading={loading}
            disabled={senhaDiferente}
            onPress={handleCriarConta}
          />
        </View>

        <View style={styles.footerArea}>
          <Text style={styles.footerText}>Ja tem conta?</Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text style={styles.link}>Ja tenho conta</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.xl,
  },
  headerArea: {
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.md,
    textAlign: "center",
  },
  formArea: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderColor: theme.colors.border,
    borderWidth: 1,
    padding: theme.spacing.lg,
  },
  footerArea: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  footerText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.sm,
  },
  link: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
