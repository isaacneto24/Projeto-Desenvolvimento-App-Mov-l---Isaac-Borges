import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/src/constants/theme";

export default function ConfiguracoesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
