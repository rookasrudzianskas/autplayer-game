import { StatusBar } from 'expo-status-bar';
import {Alert, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import bg from './assets/bg.jpeg';
import {useState} from "react";

export default function App() {
  const [map, setMap] = useState([
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
  ]);

  const [currentTurn, setCurrentTurn] = useState('x');

  const onPress = (rowIndex, columnIndex) => {
    // console.warn('onPress -', `${rowIndex} ${columnIndex}`);

    if(map[rowIndex][columnIndex] !== '') {
      Alert.alert('Error', 'This cell is already occupied');
      return;
    }

    setMap((existingMap) => {
      const updatedMap = [...existingMap];
      updatedMap[rowIndex][columnIndex] = currentTurn;
      return updatedMap;
    });

    setCurrentTurn((existingTurn) => {
      return existingTurn === 'x' ? 'o' : 'x';
    });
  }

  const checkWinningState = () => {
    // Check rows
    for(let i = 0; i < 3; i++) {
        if(map[i][0] === map[i][1] && map[i][1] === map[i][2] && map[i][0] !== '') {
            return map[i][0];
        }
    }
  }


  return (
    <View style={styles.container} className="bg-[#242D34]">
      <ImageBackground source={bg} style={styles.bg} resizeMode={'contain'} >
        <View style={styles.map}>

          {map.map((row, rowIndex) => (
              <View style={styles.row}>
                {row.map((cell, columnIndex) => (
                  <TouchableOpacity activeOpacity={0.7} onPress={() => onPress(rowIndex, columnIndex)} key={columnIndex} style={styles.cell}>
                    {cell === 'o' && (
                        <View style={styles.circle} />
                    )}

                    {cell === 'x' && (
                        <View style={styles.cross}>
                          <View style={styles.crossLine} />
                          <View style={[styles.crossLine, styles.crossLineReversed]} />
                        </View>
                    )}

                  </TouchableOpacity>
                ))}
              </View>
          ))}


            {/*<View style={styles.circle} />*/}



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
    width: '80%',
    aspectRatio: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    margin: 5,
  },
  cell: {
    width: 100,
    height: 100,
    flex: 1,
  },
  circle: {
    flex: 1,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderWidth: 10,
    borderColor: '#fff',
  },
  cross: {
    flex: 1,
  },
  crossLine: {
    position: 'absolute',
    left: '48%',
    width: 10,
    height: '100%',
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

