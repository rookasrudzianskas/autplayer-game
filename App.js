import { StatusBar } from 'expo-status-bar';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import bg from './assets/bg.jpeg';
import {useState} from "react";

export default function App() {
  const [map, setMap] = useState([
      [' ', ' ', ' '],
      [' ', ' ', ' '],
  ]);


  return (
    <View style={styles.container} className="bg-[#242D34]">
      <ImageBackground source={bg} style={styles.bg} resizeMode={'contain'} >
        <View style={styles.map}>
            <View style={styles.circle} />

            <View style={styles.cross}>
              <View style={styles.crossLine} />
              <View style={[styles.crossLine, styles.crossLineReversed]} />
            </View>

        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#242D34',
  },
  bg: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
  },
  map: {
    borderWidth: 1,
    borderColor: '#fff',
    width: '80%',
    aspectRatio: 1,
  },
  circle: {
    position: 'absolute',

    left: 2 * 120,
    top: 2 * 120,

    width: 75,
    height: 75,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderWidth: 10,
    borderColor: '#fff',
  },
  cross: {
    position: 'absolute',
    width: 75,
    height: 75,
  },
  crossLine: {
    position: 'absolute',
    left: 32.5,
    width: 10,
    height: 70,
    backgroundColor: 'white',
    borderRadius: 5,
    transform: [
      {
        rotate: '45deg',
      }
    ]
  },
  crossLineReversed: {
    transform: [
      {
        rotate: '-45deg',
      }
        ],
  }
});

