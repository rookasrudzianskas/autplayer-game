import { StatusBar } from 'expo-status-bar';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import bg from './assets/bg.jpeg';

export default function App() {
  return (
    <View>
      <ImageBackground source={bg} style={{width: '100%', height: '100%'}} resizeMode={'cover'} />
    </View>
  );
}

