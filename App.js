import { StatusBar } from 'expo-status-bar';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import bg from './assets/bg.jpeg';

export default function App() {
  return (
    <View className="bg-[#242D34]">
      <ImageBackground source={bg} style={{width: '100%', height: '100%', paddingTop: 20}} className="items-center justify-center" resizeMode={'contain'} >
        <View className="w-[75px] h-[75px] rounded-full bg-white items-center justify-center">
          <View className="w-[55px] h-[55px] bg-[#242D34] rounded-full"/>
        </View>
      </ImageBackground>
    </View>
  );
}

