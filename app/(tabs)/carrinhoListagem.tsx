import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const BASE_URL = "https://trabalhu-bre-e-je.vercel.app";

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagemUrl: string;
}

interface CarrinhoItem {
  carrinhoId: number;
  produto: Produto;
}

export default function CarrinhoTab() {
  const [itens, setItens] = useState<CarrinhoItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [deletando, setDeletando] = useState<number | null>(null);

  async function fetchCarrinho() {
    try {
      setCarregando(true);
      setErro(null);

      const [carrinhoRes, produtosRes] = await Promise.all([
        fetch(`${BASE_URL}/produtos-carrinho`),
        fetch(`${BASE_URL}/produtos`),
      ]);

      if (!carrinhoRes.ok) throw new Error(`Erro HTTP: ${carrinhoRes.status}`);
      if (!produtosRes.ok) throw new Error(`Erro HTTP: ${produtosRes.status}`);

      const carrinhoData: { id: number; produtoId: number }[] = await carrinhoRes.json();
      const produtos: Produto[] = await produtosRes.json();

      const produtosMap = new Map(produtos.map((p) => [p.id, p]));

      const itensMapeados = carrinhoData
        .map((item) => {
          const produto = produtosMap.get(item.produtoId);
          return produto ? { carrinhoId: item.id, produto } : null;
        })
        .filter((item): item is CarrinhoItem => item !== null);

      setItens(itensMapeados);
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setCarregando(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchCarrinho();
    }, [])
  );

  async function executarDelete(produtoId: number) {
    setDeletando(produtoId);
    try {
      const response = await fetch(`${BASE_URL}/deletar-produto/${produtoId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
      setItens((prev) => prev.filter((item) => item.produto.id !== produtoId));
    } catch {
      Alert.alert("Erro", "Não foi possível remover o produto do carrinho.");
    } finally {
      setDeletando(null);
    }
  }

  function deletarProduto(produtoId: number, nomeProduto: string) {
    if (Platform.OS === "web") {
      if ((window as Window).confirm(`Remover "${nomeProduto}" do carrinho?`)) {
        executarDelete(produtoId);
      }
    } else {
      Alert.alert(
        "Remover do carrinho",
        `Remover "${nomeProduto}" do carrinho?`,
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Remover", style: "destructive", onPress: () => executarDelete(produtoId) },
        ]
      );
    }
  }

  if (carregando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#1a73e8" />
        <Text style={styles.textoMutado}>Carregando carrinho…</Text>
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

  const calcularSubtotal = () =>
    itens.reduce((total, item) => total + Number(item.produto.preco), 0);

  return (
    <View style={styles.container}>
      <FlatList
        data={itens}
        keyExtractor={(item) => item.carrinhoId.toString()}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <CardProduto
            produto={item.produto}
            deletando={deletando === item.produto.id}
            onDeletar={() => deletarProduto(item.produto.id, item.produto.nome)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.textoMutado}>Nenhum produto no carrinho.</Text>
        }
      />

      {itens.length > 0 && (
        <View style={styles.resumoCarrinho}>
          <View style={styles.totalCarrinho}>
            <Text style={styles.labelTotal}>Subtotal</Text>
            <Text style={styles.valorTotal}>
              R$ {calcularSubtotal().toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity style={styles.botaoCheckout}>
            <Text style={styles.botaoCheckoutText}>Ir para Checkout →</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function CardProduto({
  produto,
  deletando,
  onDeletar,
}: {
  produto: Produto;
  deletando: boolean;
  onDeletar: () => void;
}) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: produto.imagemUrl }}
        style={styles.imagem}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.nome}>{produto.nome}</Text>
        <Text style={styles.descricao} numberOfLines={2}>
          {produto.descricao}
        </Text>
        <View style={styles.rodapeCard}>
          <Text style={styles.preco}>
            {Number(produto.preco).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>
          <TouchableOpacity
            onPress={onDeletar}
            style={[styles.botaoDeletar, deletando && styles.botaoDeletarDesabilitado]}
            disabled={deletando}
          >
            {deletando ? (
              <ActivityIndicator size="small" color="#c0392b" />
            ) : (
              <Text style={styles.botaoDeletarTexto}>Remover</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  lista: { padding: 12, gap: 12, paddingBottom: 200 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: "hidden",
  },
  imagem: { width: 100, height: 100 },
  info: { flex: 1, padding: 10, justifyContent: "space-between" },
  nome: { fontSize: 15, fontWeight: "600", color: "#111" },
  descricao: { fontSize: 13, color: "#666", marginTop: 4 },
  preco: { fontSize: 15, fontWeight: "700", color: "#1a73e8" },
  centrado: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12,
  },
  textoMutado: { color: "#888", fontSize: 14 },
  textoErro: { color: "#c0392b", fontSize: 14, textAlign: "center" },
  resumoCarrinho: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  totalCarrinho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelTotal: { fontSize: 14, color: "#666", fontWeight: "500" },
  valorTotal: { fontSize: 18, fontWeight: "700", color: "#1a73e8" },
  botaoCheckout: {
    backgroundColor: "#1a73e8",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoCheckoutText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  rodapeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  botaoDeletar: {
    backgroundColor: "#fdecea",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 64,
    alignItems: "center",
  },
  botaoDeletarDesabilitado: { opacity: 0.5 },
  botaoDeletarTexto: { color: "#c0392b", fontSize: 13, fontWeight: "600" },
});
