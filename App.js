import { StatusBar } from 'expo-status-bar';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import bg from './assets/bg.jpeg';

export default function App() {
  return (
    <View className="bg-[#242D34]">
      <ImageBackground source={bg} style={{width: '100%', height: '100%'}} className="items-center justify-center" resizeMode={'contain'} >
        <View className="w-[90px] h-[90px] rounded-full bg-red-500"/>
      </ImageBackground>
    </View>
  );
}

