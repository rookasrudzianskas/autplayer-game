import { StatusBar } from 'expo-status-bar';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import bg from './assets/bg.jpeg';

export default function App() {
  return (
    <View style={styles.container} className="bg-[#242D34]">
      <ImageBackground source={bg} style={styles.bg} resizeMode={'contain'} >
        <View style={styles.map}>
            <View style={styles.circle} />

            <View>
              <View style={styles.crossLina} />
              <View style={[styles.crossLina, styles.crossLineReversed]} />
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

  },
  circle: {
    width: 75,
    height: 75,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderWidth: 10,
    borderColor: '#fff',
  },
  innerCircle: {
    width: 50,
    height: 50,
    backgroundColor: '#242D34',
    borderRadius: 50,
  },
  crossLine: {
    position: 'absolute',
    width: 10,
    height: 70,
  }
});

