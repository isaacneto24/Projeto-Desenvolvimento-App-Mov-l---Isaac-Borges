import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type User = {
  id?: string;
  nome: string;
  email: string;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_TOKEN_KEY = "@proestoque:token";
const STORAGE_USER_KEY = "@proestoque:user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function carregarSessao() {
      try {
        const [savedToken, savedUser] = await Promise.all([
          AsyncStorage.getItem(STORAGE_TOKEN_KEY),
          AsyncStorage.getItem(STORAGE_USER_KEY),
        ]);

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser) as User);
        }
      } catch {
        // Se falhar, continua deslogado.
      } finally {
        setIsLoading(false);
      }
    }

    carregarSessao();
  }, []);

  async function login(email: string, senha: string) {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const fakeUser: User = {
        id: "1",
        nome: "João Silva",
        email,
      };
      const fakeToken = "proestoque-token";

      await Promise.all([
        AsyncStorage.setItem(STORAGE_TOKEN_KEY, fakeToken),
        AsyncStorage.setItem(STORAGE_USER_KEY, JSON.stringify(fakeUser)),
      ]);

      setToken(fakeToken);
      setUser(fakeUser);
    } catch {
      Alert.alert("Erro", "Não foi possível fazer login agora.");
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    setIsLoading(true);

    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_TOKEN_KEY),
        AsyncStorage.removeItem(STORAGE_USER_KEY),
      ]);

      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [user, token, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
}
