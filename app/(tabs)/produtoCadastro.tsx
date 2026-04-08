import { Button } from "@react-navigation/elements";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const API_URL = "https://trabalhu-bre-e-je.vercel.app/criar-produto";

export default function ProdutoCadastroTab() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [imagem, setImagem] = useState("");

  async function handleSalvar() {
    if (!nome || !descricao || !preco || !imagem) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }

    const novoProduto = {
      "nome":nome,
      "descricao":descricao,
      "preco":parseFloat(preco.replace(",", ".")),
      "imagemUrl":imagem
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoProduto),
      });

      if (!response.ok) throw new Error("Erro ao salvar produto");

      Alert.alert("Sucesso", "Produto cadastrado com sucesso!");
      setNome("");
      setDescricao("");
      setPreco("");
      setImagem("");
      
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cadastrar o produto.");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Novo Produto</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Nome:</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Ex: Teclado Mecânico"
        />

        <Text style={styles.label}>Descrição:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Detalhes do produto..."
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Preço:</Text>
        <TextInput
          style={styles.input}
          value={preco}
          onChangeText={setPreco}
          placeholder="0,00"
          keyboardType="numeric"
        />

        <Text style={styles.label}>URL da Imagem:</Text>
        <TextInput
          style={styles.input}
          value={imagem}
          onChangeText={setImagem}
          placeholder="https://link-da-imagem.com/foto.jpg"
          autoCapitalize="none"
        />

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
    marginBottom: 16,
    color: "gray",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
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