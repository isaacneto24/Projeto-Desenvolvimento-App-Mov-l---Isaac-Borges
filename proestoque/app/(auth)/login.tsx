import { Link } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/src/components/Button";
import { Input } from "@/src/components/Input";
import { LogoProEstoque } from "@/src/components/LogoProEstoque";
import { theme } from "@/src/constants/theme";
import { useAuth } from "@/src/contexts/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const { login, isLoading } = useAuth();

  const emailValido = email.includes("@") && email.includes(".");
  const senhaValida = senha.trim().length > 0;
  const podeEntrar = emailValido && senhaValida;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <View style={styles.container}>
          <View style={styles.headerArea}>
            <LogoProEstoque size="lg" />
            <Text style={styles.title}>Bem-vindo de volta</Text>
            <Text style={styles.subtitle}>
              Acesse sua conta para continuar gerenciando o ProEstoque.
            </Text>
          </View>

          <View style={styles.formArea}>
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
              placeholder="Digite sua senha"
              secureTextEntry={!mostrarSenha}
              leftIcon="lock-closed-outline"
              rightIcon={mostrarSenha ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setMostrarSenha((prev) => !prev)}
              value={senha}
              onChangeText={setSenha}
            />

            {!emailValido && email.length > 0 && (
              <Text style={styles.errorText}>Informe um e-mail válido.</Text>
            )}
            {!senhaValida && senha.length > 0 && (
              <Text style={styles.errorText}>
                A senha não pode ficar vazia.
              </Text>
            )}

            <Link href="/(auth)/recuperar-senha" asChild>
              <Pressable>
                <Text style={styles.linkAlignRight}>Esqueci minha senha</Text>
              </Pressable>
            </Link>

            <Button
              title="Entrar"
              fullWidth
              loading={isLoading}
              disabled={!podeEntrar || isLoading}
              onPress={() => login(email.trim(), senha)}
            />
          </View>

          <View style={styles.footerArea}>
            <Text style={styles.footerText}>Não tem conta?</Text>
            <Link href="/(auth)/cadastro" asChild>
              <Pressable>
                <Text style={styles.link}>Criar conta</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xl,
    justifyContent: "space-between",
  },
  headerArea: {
    gap: theme.spacing.md,
    alignItems: "center",
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: "center",
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.md,
    textAlign: "center",
  },
  formArea: {
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
  },
  linkAlignRight: {
    alignSelf: "flex-end",
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing.lg,
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
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.sm,
  },
});
