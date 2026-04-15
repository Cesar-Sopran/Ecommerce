import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";

const API_URL = "https://trabalhu-bre-e-je.vercel.app";

interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: string | number;
  imagemUrl: string;
}

function CardProduto({ produto, onPress }: { produto: Produto, onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ hovered, pressed }) => [
        styles.card,
        hovered && styles.cardHover,
        pressed && styles.cardPressed
      ]}
    >
      <Image
        source={{ uri: produto.imagemUrl }}
        style={styles.imagem}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <View>
          <Text style={styles.nome}>{produto.nome}</Text>
          <Text style={styles.descricao} numberOfLines={2}>
            {produto.descricao}
          </Text>
        </View>

        <Text style={styles.preco}>
          {Number(produto.preco).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Text>
      </View>
    </Pressable>
  );
}


export default function ProdutosListaTab() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  async function fetchProdutos() {
    try {
      setCarregando(true);
      setErro(null);

      const response = await fetch(`${API_URL}/produtos`);
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
      const data = await response.json();
      setProdutos(data);
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    fetchProdutos();
  }, []);

  if (carregando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#1a73e8" />
        <Text style={styles.textoMutado}>Carregando produtos…</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.textoErro}>Falha ao carregar: {erro}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={produtos}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.lista}
      renderItem={({ item }) => (
        <CardProduto
          produto={item}
          onPress={() =>
            router.push({
              pathname: "/produtoDetalhes",
              params: { produto: JSON.stringify(item) },
            })
          }
        />
      )}
      ListEmptyComponent={
        <Text style={styles.textoMutado}>Nenhum produto cadastrado.</Text>
      }
    />
  );
}



const styles = StyleSheet.create({
  lista: { padding: 12, gap: 12 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: "hidden",
    transitionProperty: "all",
    transitionDuration: "0.2s",
  },
  cardHover: {
    borderColor: "#1a73e8",
    backgroundColor: "#f8fbff",
    transform: [{ scale: 1.01 }],
    elevation: 4, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardPressed: {
    opacity: 0.9,
    backgroundColor: "#f0f0f0",
  },
  imagem: { width: 100, height: 100 },
  info: { flex: 1, padding: 10, justifyContent: "space-between" },
  nome: { fontSize: 15, fontWeight: "600", color: "#111" },
  descricao: { fontSize: 13, color: "#666", marginTop: 4 },
  preco: { fontSize: 15, fontWeight: "700", color: "#1a73e8" },

  centrado: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 12 },
  textoMutado: { color: "#888", fontSize: 14 },
  textoErro: { color: "#c0392b", fontSize: 14, textAlign: "center" },
});