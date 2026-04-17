import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/src/constants/theme";

type LogoSize = "sm" | "md" | "lg";

type LogoProEstoqueProps = {
  size?: LogoSize;
};

const iconSizeMap: Record<LogoSize, number> = {
  sm: 24,
  md: 30,
  lg: 38,
};

const titleSizeMap: Record<LogoSize, number> = {
  sm: 20,
  md: 24,
  lg: 30,
};

export function LogoProEstoque({ size = "md" }: LogoProEstoqueProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconBadge}>
        <Ionicons
          name="cube-outline"
          size={iconSizeMap[size]}
          color={theme.colors.primary}
        />
      </View>
      <Text style={[styles.title, { fontSize: titleSizeMap[size] }]}>
        ProEstoque
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
  },
  iconBadge: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAF6F1",
    borderWidth: 1,
    borderColor: "#C2E6D8",
  },
  title: {
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: 0.4,
  },
});
