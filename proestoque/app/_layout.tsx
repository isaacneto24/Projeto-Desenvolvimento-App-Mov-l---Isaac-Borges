import { Stack, useRouter, useSegments } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { AuthProvider, useAuth } from "@/src/contexts/AuthContext";
import { ProductsProvider } from "@/src/contexts/ProductsContext";

function NavigationGuard({ children }: { children: React.ReactNode }) {
  const segments = useSegments();
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isLoading) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";

    if (!isAuthenticated && inTabsGroup) {
      router.replace("/(auth)/login");
      return;
    }

    if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isLoading, isAuthenticated, router, segments]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <NavigationGuard>
          <Stack
            initialRouteName="(auth)"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </NavigationGuard>
      </ProductsProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
