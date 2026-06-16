import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/src/components/Button";
import { Input } from "@/src/components/Input";
import { LogoProEstoque } from "@/src/components/LogoProEstoque";
import { theme } from "@/src/constants/theme";

export default function RecuperarSenhaScreen() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerArea}>
          <LogoProEstoque size="md" />
          <Text style={styles.title}>Recuperar senha</Text>
        </View>

        {!enviado ? (
          <View style={styles.formArea}>
            <Text style={styles.description}>
              Informe seu e-mail e enviaremos um link de recuperacao
            </Text>
            <Input
              label="E-mail"
              placeholder="voce@email.com"
              keyboardType="email-address"
              leftIcon="mail-outline"
              value={email}
              onChangeText={setEmail}
            />
            <Button title="Enviar" fullWidth onPress={() => setEnviado(true)} />
          </View>
        ) : (
          <View style={styles.successBox}>
            <Text style={styles.successTitle}>Link enviado!</Text>
            <Text style={styles.successText}>
              Se o e-mail existir em nossa base, voce recebera as instrucoes em
              instantes.
            </Text>
          </View>
        )}

        <Link href="/(auth)/login" asChild>
          <Pressable>
            <Text style={styles.link}>Voltar ao Login</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xl,
    justifyContent: "center",
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
  description: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.md,
  },
  formArea: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderColor: theme.colors.border,
    borderWidth: 1,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  successBox: {
    backgroundColor: "#EAF7EE",
    borderRadius: theme.radius.lg,
    borderColor: "#B7E4C7",
    borderWidth: 1,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  successTitle: {
    color: theme.colors.success,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
  successText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.md,
  },
  link: {
    alignSelf: "center",
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
