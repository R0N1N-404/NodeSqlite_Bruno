import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import Routes from "./src/router"
import { useEffect } from 'react';

export default function App() {
  return (
    <NavigationContainer>
        <Routes/>
    </NavigationContainer>
  );
}
