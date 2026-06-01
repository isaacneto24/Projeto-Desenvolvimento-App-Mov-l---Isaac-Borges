import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Produto } from "../schemas/produtoSchema";

interface ProductsContextType {
  produtos: Produto[];
  adicionarProduto: (
    produto: Omit<Produto, "id" | "dataCriacao" | "dataAtualizacao">,
  ) => void;
  editarProduto: (
    id: string,
    produto: Omit<Produto, "id" | "dataCriacao" | "dataAtualizacao">,
  ) => void;
  deletarProduto: (id: string) => void;
  isLoading: boolean;
}

type Action =
  | { type: "ADD"; payload: Produto }
  | { type: "UPDATE"; payload: Produto }
  | { type: "DELETE"; payload: string }
  | { type: "LOAD"; payload: Produto[] }
  | { type: "SET_LOADING"; payload: boolean };

const initial: Produto[] = [];

function productsReducer(state: Produto[], action: Action): Produto[] {
  switch (action.type) {
    case "ADD":
      return [...state, action.payload];
    case "UPDATE":
      return state.map((p) =>
        p.id === action.payload.id ? action.payload : p,
      );
    case "DELETE":
      return state.filter((p) => p.id !== action.payload);
    case "LOAD":
      return action.payload;
    default:
      return state;
  }
}

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined,
);

interface ProductsProviderProps {
  children: ReactNode;
}

export function ProductsProvider({ children }: ProductsProviderProps) {
  const [produtos, dispatch] = useReducer(productsReducer, initial);
  const [isLoading, setIsLoading] = React.useState(true);

  // Carregar produtos do AsyncStorage ao inicializar
  useEffect(() => {
    loadProdutos();
  }, []);

  // Salvar produtos no AsyncStorage sempre que mudam
  useEffect(() => {
    if (!isLoading) {
      saveProdutos();
    }
  }, [produtos]);

  const loadProdutos = async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem("@proestoque:produtos");
      if (stored) {
        const produtosCarregados = JSON.parse(stored) as Produto[];
        dispatch({ type: "LOAD", payload: produtosCarregados });
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProdutos = async () => {
    try {
      await AsyncStorage.setItem(
        "@proestoque:produtos",
        JSON.stringify(produtos),
      );
    } catch (error) {
      console.error("Erro ao salvar produtos:", error);
    }
  };

  const adicionarProduto = (
    dados: Omit<Produto, "id" | "dataCriacao" | "dataAtualizacao">,
  ) => {
    const novoProduto: Produto = {
      ...dados,
      id: Date.now().toString(),
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
    };
    dispatch({ type: "ADD", payload: novoProduto });
  };

  const editarProduto = (
    id: string,
    dados: Omit<Produto, "id" | "dataCriacao" | "dataAtualizacao">,
  ) => {
    const produtoExistente = produtos.find((p) => p.id === id);
    if (produtoExistente) {
      const produtoAtualizado: Produto = {
        ...dados,
        id,
        dataCriacao: produtoExistente.dataCriacao,
        dataAtualizacao: new Date().toISOString(),
      };
      dispatch({ type: "UPDATE", payload: produtoAtualizado });
    }
  };

  const deletarProduto = (id: string) => {
    dispatch({ type: "DELETE", payload: id });
  };

  return (
    <ProductsContext.Provider
      value={{
        produtos,
        adicionarProduto,
        editarProduto,
        deletarProduto,
        isLoading,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error("useProducts deve ser usado dentro de ProductsProvider");
  }
  return context;
}
