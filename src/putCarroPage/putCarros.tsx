import React, { useState, useEffect, useCallback } from "react";
import { Text, ScrollView, TextInput, View, StyleSheet, Alert } from "react-native";
import { getCarById, updateCar } from "../../Conf/services/carService";
import type { Carro } from "../../types/carro";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import styles from "../css/styles";
import { Button } from "react-native-paper";
import { useRoute } from "@react-navigation/native";

export default function CreateCarro() {
  const [nome, setNome] = useState("");
  const [marca, setMarca] = useState("");
  const [ano, setAno] = useState("");
  const [cor, setCor] = useState("");
  const [preco, setPreco] = useState("");
  const [kmRodados, setKmRodados] = useState("");
  const [idPesquisar, setIdPesquisar] = useState("");
  const [carro, setCarro] = useState<Carro>({} as Carro);

  const navigation = useNavigation<any>(); 
  const route = useRoute();

    const getCarrosInfo = async (id: number) => {
  try {
      const response = await getCarById(id);
      if (response.success && response.data) {
        const carroEncontrado = response.data;
        setCarro(carroEncontrado); 
        setNome(carroEncontrado.nome);
        setMarca(carroEncontrado.marca);
        setAno(carroEncontrado.ano.toString());
        setCor(carroEncontrado.cor);
        setPreco(carroEncontrado.preco.toString());
        setKmRodados(carroEncontrado.km_rodado.toString());
      } else {
        setCarro({} as Carro);
        Alert.alert("Atenção", "Nenhum carro encontrado com esse ID.");
      }
  } catch (error) {
    console.error("Erro ao obter informações dos carros:", error);
    Alert.alert("Erro", "Não foi possível obter as informações do carro.");
  }
};


  const handleSubmit = async () => {
    if (!nome || !marca || !ano || !cor || !preco || !kmRodados) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }
    try {
          const carro: Carro = {
          nome: nome,
          marca: marca,
          ano: parseInt(ano),
          cor: cor,
          preco: parseFloat(preco),
          km_rodado: parseInt(kmRodados),
          };
      const response = await updateCar(Number(idPesquisar), carro);
      if(response.success) {
        Alert.alert("Sucesso", "Carro editado com sucesso!");
          setIdPesquisar("");
        setNome("");
        setMarca("");
        setAno("");
        setCor("");
        setPreco("");
        setKmRodados("");

        navigation.navigate("Listar Carros");
      }
    } catch (error) {
      console.error("Erro ao inserir carro:", error);
      Alert.alert("Erro", "Não foi possível inserir o carro.");
    }
  };

  const clearForm = () => {
    setIdPesquisar("");
    setNome("");
    setMarca("");
    setAno("");
    setCor("");
    setPreco("");
    setKmRodados("");
  }

      useFocusEffect(
      useCallback(() => {
        const idFromRoute = (route.params as { id?: number })?.id;
        if (idFromRoute) {
          getCarrosInfo(idFromRoute);
          setIdPesquisar(idFromRoute.toString());
        } else {
          clearForm();
        }
      }, [route.params])
    );

   const confirmarEdicao = (id: number) => {
     if (!id) {
       Alert.alert("Erro", "Informe um ID válido para editar o carro.");
       return;
     }

     Alert.alert(
       "Confirmar Edição",
       "Tem certeza que deseja editar este carro?",
       [
         { text: "Cancelar", style: "cancel" },
         {
           text: "Confirmar",
           style: "default",
           onPress: () => handleSubmit(),
         },
       ],
       { cancelable: true }
     );
   };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.divForm}>
       <Text style={styles.label}>Insira o ID do carro</Text>
         <View style={{ marginBottom: 20, marginTop:15 ,width: "100%", alignItems: "center", justifyContent: "center", flexDirection: "row" }}> 
           
             
            <TextInput
                style={styles.inputIdPesquisar}
                value={idPesquisar}
                keyboardType="numeric"
                onChangeText={setIdPesquisar}
                />
            <Button onPress={() => getCarrosInfo(Number(idPesquisar))} style={styles.buttonSearchId} icon="plus" mode="contained">
            Buscar Carro
            </Button>
            
        </View>

   {carro && Object.keys(carro).length > 0 && (
  <View style={styles.divForm}>
    <Text style={styles.label}>Nome</Text>
    <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: Civic Type R" />

    <Text style={styles.label}>Marca</Text>
    <TextInput style={styles.input} value={marca} onChangeText={setMarca} placeholder="Ex: Honda" />

    <Text style={styles.label}>Ano</Text>
    <TextInput
      style={styles.input}
      value={ano}
      onChangeText={setAno}
      placeholder="Ex: 2022"
      keyboardType="numeric"
    />

    <Text style={styles.label}>Cor</Text>
    <TextInput style={styles.input} value={cor} onChangeText={setCor} placeholder="Ex: Vermelho" />

    <Text style={styles.label}>Preço</Text>
    <TextInput
      style={styles.input}
      value={preco}
      onChangeText={setPreco}
      placeholder="Ex: 220000"
      keyboardType="numeric"
    />

    <Text style={styles.label}>KM Rodados</Text>
    <TextInput
      style={styles.input}
      value={kmRodados}
      onChangeText={setKmRodados}
      placeholder="Ex: 15000"
      keyboardType="numeric"
    />

    <View
      style={{
        marginTop: 20,
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
      }}
    >
      <Button style={styles.buttonSubmit} icon="pencil" mode="contained" onPress={() => confirmarEdicao(Number(idPesquisar))}>
        Editar
      </Button>
      <Button style={styles.buttonClear} mode="contained" onPress={clearForm}>
        Cancelar
      </Button>
    </View>
  </View>
)}

    </View>
    </ScrollView>
  );
}


