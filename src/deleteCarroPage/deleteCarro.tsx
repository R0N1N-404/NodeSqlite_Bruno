import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useCallback } from "react";
import { ScrollView, View, Text, StyleSheet, Alert } from "react-native";
import {getCars, deleteCar} from "../../Conf/services/carService"
import type { Carro } from "../../types/carro";
import style from "../css/styles";
import Spinner from "../utils/spinner";
import { Button } from 'react-native-paper';


export default function GetCarros() {
  const [carros, setCarros] = useState<Carro[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchApiCarros = async () => {
    try {
      setLoading(true);
        const response = await getCars();
          if (response.success && response.data) {
            setCarros(response.data);
          } else {
            setCarros([]);
          }
    } catch (error) {
      setCarros([]);
    } finally {
      setLoading(false);
    }
  };

  const confirmarExclusao = (id: number) => {
  Alert.alert(
    "Confirmar Exclusão",
    "Tem certeza que deseja excluir este carro?",
    [
      {
        text: "Cancelar",
        style: "cancel", // botão padrão de cancelar
      },
      {
        text: "Excluir",
        style: "destructive", // deixa o botão em vermelho no iOS
        onPress: () => deletarCarro(id), // chama a função de exclusão
      },
    ],
    { cancelable: true }
  );
};

  const deletarCarro = async (id: number) => {
    try {
        if(id >= 0){
        const response = await deleteCar(id);
        if (response.success) {
          Alert.alert("Sucesso", "Carro excluído com sucesso!");
          fetchApiCarros();
        } else {
          Alert.alert("Erro", response.message);
        }
      }else{
      Alert.alert("Id não fornecido um mal formatado")
    }
    } catch (error) {
      console.error("Erro ao excluir carro:", error);
      Alert.alert("Erro", "Não foi possível excluir o carro.");
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchApiCarros();
    }, [])
  );

  if (loading) {
    return (
      <ScrollView contentContainerStyle={{ flex: 1, justifyContent: "center" }}>
        <Spinner />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={style.scrollContainer}>
      {carros.map((carro) => (
        <View key={carro.id} style={style.card}>
          <Text style={style.nome}>{carro.nome}</Text>
        <View style={style.CardDelete}>
           
          <View>
          <Text style={style.info}>Marca: {carro.marca}</Text>
          <Text style={style.info}>Ano: {carro.ano}</Text>
      
          </View>
          <View> 
          <Text style={style.info}>
            Preço: R$ {carro.preco}
          </Text>
          <Text style={style.info}>
            KM Rodados: {carro.km_rodado} km
          </Text>
          </View>
        </View>
          <View>
            <Button style={style.buttonDelete} icon="delete" mode="contained" onPress={() => confirmarExclusao(carro.id || 0)}>
              Excluir
            </Button>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}


