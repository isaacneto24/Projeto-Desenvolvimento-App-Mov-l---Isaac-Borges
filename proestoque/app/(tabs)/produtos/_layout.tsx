import { Stack } from "expo-router";

export default function ProdutosLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: "Voltar",
        headerTintColor: "#1F2937",
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "600",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Produtos",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="novo"
        options={{
          title: "Novo Produto",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Editar Produto",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
