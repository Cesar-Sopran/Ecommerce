import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
const API_URL = "https://69d2dac8336103955f8e6ec9.mockapi.io/carrinho";

interface Produto {
    id: string;
    nome: string;
    descricao: string;
    preco: string | number;
    imagem: string;
}

export default function CarrinhoTab() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    async function fetchProdutos() {
        try {
            setCarregando(true);
            setErro(null);

            const response = await fetch(API_URL);
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

    const calcularSubtotal = () => {
        return produtos.reduce((total, produto) => {
            return total + Number(produto.preco);
        }, 0);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={produtos}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.lista}
                renderItem={({ item }) => <CardProduto produto={item} />}
                ListEmptyComponent={
                    <Text style={styles.textoMutado}>Nenhum produto cadastrado.</Text>
                }
            />

            {produtos.length > 0 && (
                <View style={styles.resumoCarrinho}>
                    <View style={styles.totalCarrinho}>
                        <Text style={styles.labelTotal}>Subtotal</Text>
                        <Text style={styles.valorTotal}>
                            R$ {calcularSubtotal().toFixed(2)}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.botaoCheckout}
                    >
                        <Text style={styles.botaoCheckoutText}>Ir para Checkout →</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

function CardProduto({ produto }: { produto: Produto }) {
    return (
        <View style={styles.card}>
            <Image
                source={{ uri: produto.imagem }}
                style={styles.imagem}
                resizeMode="cover"
            />
            <View style={styles.info}>
                <Text style={styles.nome}>{produto.nome}</Text>
                <Text style={styles.descricao} numberOfLines={2}>
                    {produto.descricao}
                </Text>
                <Text style={styles.preco}>
                    {Number(produto.preco).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                </Text>
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
    preco: { fontSize: 15, fontWeight: "700", color: "#1a73e8", marginTop: 6 },
    centrado: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 12 },
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
    labelTotal: {
        fontSize: 14,
        color: "#666",
        fontWeight: "500",
    },
    valorTotal: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1a73e8",
    },
    botaoCheckout: {
        backgroundColor: "#1a73e8",
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    botaoCheckoutText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
    },
});