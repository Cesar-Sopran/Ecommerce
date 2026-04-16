import { Button } from "@react-navigation/elements";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

const API_URL = "https://trabalhu-bre-e-je.vercel.app/criar-produto";

export default function ProdutoCadastroTab() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [imagem, setImagem] = useState("");
  const [erros, setErros] = useState<{ nome?: string; descricao?: string; preco?: string; imagem?: string }>({});

  function formatarPreco(valor: string) {
    const apenasDigitos = valor.replace(/[^0-9]/g, "");
    if (!apenasDigitos) return "";

    const partes = apenasDigitos.padStart(3, "0");
    const inteiros = partes.slice(0, -2);
    const decimais = partes.slice(-2);
    return `${parseInt(inteiros, 10).toString()},${decimais}`;
  }

  async function handleSalvar() {
    const novoErros: { nome?: string; descricao?: string; preco?: string; imagem?: string } = {};

    if (!nome.trim()) novoErros.nome = "Preencha o nome do produto.";
    if (!descricao.trim()) novoErros.descricao = "Preencha a descrição do produto.";
    if (!preco.trim()) novoErros.preco = "Preencha o preço do produto.";
    if (!imagem.trim()) novoErros.imagem = "Preencha a URL da imagem.";

    if (Object.keys(novoErros).length > 0) {
      setErros(novoErros);
      return;
    }

    setErros({});

    const novoProduto = {
      nome,
      descricao,
      preco: parseFloat(preco.replace(",", ".")),
      imagemUrl: imagem,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoProduto),
      });

      if (!response.ok) throw new Error("Erro ao salvar produto");

      alert("Produto cadastrado com sucesso!");
      setNome("");
      setDescricao("");
      setPreco("");
      setImagem("");
      
    } catch (error) {
      alert("Não foi possível cadastrar o produto.");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Novo Produto</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Nome:</Text>
        <TextInput
          style={[styles.input, erros.nome && styles.inputError]}
          value={nome}
          onChangeText={(text) => {
            setNome(text);
            setErros((prev) => ({ ...prev, nome: undefined }));
          }}
          placeholder="Ex: Teclado Mecânico"
        />
        {erros.nome ? <Text style={styles.erroTextoCampo}>{erros.nome}</Text> : null}

        <Text style={styles.label}>Descrição:</Text>
        <TextInput
          style={[styles.input, styles.textArea, erros.descricao && styles.inputError]}
          value={descricao}
          onChangeText={(text) => {
            setDescricao(text);
            setErros((prev) => ({ ...prev, descricao: undefined }));
          }}
          placeholder="Detalhes do produto..."
          multiline
          numberOfLines={3}
        />
        {erros.descricao ? <Text style={styles.erroTextoCampo}>{erros.descricao}</Text> : null}

        <Text style={styles.label}>Preço:</Text>
        <TextInput
          style={[styles.input, erros.preco && styles.inputError]}
          value={preco}
          onChangeText={(text) => {
            setPreco(formatarPreco(text));
            setErros((prev) => ({ ...prev, preco: undefined }));
          }}
          placeholder="0,00"
          keyboardType="numeric"
        />
        {erros.preco ? <Text style={styles.erroTextoCampo}>{erros.preco}</Text> : null}

        <Text style={styles.label}>URL da Imagem:</Text>
        <TextInput
          style={[styles.input, erros.imagem && styles.inputError]}
          value={imagem}
          onChangeText={(text) => {
            setImagem(text);
            setErros((prev) => ({ ...prev, imagem: undefined }));
          }}
          placeholder="https://link-da-imagem.com/foto.jpg"
          autoCapitalize="none"
        />
        {erros.imagem ? <Text style={styles.erroTextoCampo}>{erros.imagem}</Text> : null}

        <Button style={styles.botao} onPress={handleSalvar}>Cadastrar Produto</Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "white",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "dark",
    marginBottom: 20,
  },
  form: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "gray",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "dark",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 8,
    color: "gray",
  },
  inputError: {
    borderColor: "#c0392b",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  erroTextoCampo: {
    color: "#c0392b",
    fontSize: 13,
    marginBottom: 12,
  },
  botao: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  }
});