import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const API_URL = "https://trabalhu-bre-e-je.vercel.app";

interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: string | number;
  imagemUrl: string;
}

export const unstable_settings = {
  title: "Detalhes do Produto",
};

export default function ProdutoDetalhes() {
  const { produto } = useLocalSearchParams<{ produto?: string }>();
  const [adicionando, setAdicionando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const dados = useMemo<Produto | null>(() => {
    if (!produto) return null;

    try {
      return JSON.parse(produto) as Produto;
    } catch {
      return null;
    }
  }, [produto]);

  async function adicionarAoCarrinho() {
    if (!dados) return;
    try {
      setAdicionando(true);
      setErro(null);
      const response = await fetch(`${API_URL}/adicionar-carrinho/${dados.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Erro ao adicionar ao carrinho");
      alert("Produto adicionado ao carrinho!");
    } catch (e) {
      const mensagem = e instanceof Error ? e.message : "Erro desconhecido";
      setErro(mensagem);
      alert(mensagem);
    } finally {
      setAdicionando(false);
    }
  }

  if (!dados) {
    return (
      <View style={styles.erroContainer}>
        <Text style={styles.erroTexto}>Não foi possível carregar os detalhes do produto.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: dados.imagemUrl }}
          style={styles.imagem}
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.nome}>{dados.nome}</Text>
        
        <View style={styles.precoContainer}>
          <Text style={styles.precoLabel}>Preço</Text>
          <Text style={styles.preco}>
            {Number(dados.preco).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.descricaoSection}>
          <Text style={styles.descricaoLabel}>Descrição</Text>
          <Text style={styles.descricao}>{dados.descricao}</Text>
        </View>
        
        {erro && <Text style={styles.textoErro}>{erro}</Text>}
        
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.botaoAdicionar, adicionando && styles.botaoDisabled]}
          onPress={adicionarAoCarrinho}
          disabled={adicionando}
        >
          {adicionando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.textoBotao}>Adicionar ao Carrinho</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
  },
  imageContainer: {
    backgroundColor: "#fff",
    paddingVertical: 24,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  imagem: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: "#f2f2f2",
  },
  content: {
    backgroundColor: "#fff",
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  nome: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  precoContainer: {
    marginBottom: 20,
  },
  precoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  preco: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a73e8",
  },
  divider: {
    height: 1,
    backgroundColor: "#e8e8e8",
    marginVertical: 16,
  },
  descricaoSection: {
    marginBottom: 24,
  },
  descricaoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginBottom: 8,
  },
  descricao: {
    fontSize: 15,
    color: "#555",
    lineHeight: 24,
  },
  botaoAdicionar: {
    backgroundColor: "#1a73e8",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1a73e8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  botaoDisabled: {
    opacity: 0.6,
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  textoErro: {
    color: "#c0392b",
    fontSize: 14,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fde7e7",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#c0392b",
  },
  erroContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f5f5f5",
  },
  erroTexto: {
    color: "#c0392b",
    fontSize: 16,
    textAlign: "center",
  },
});
