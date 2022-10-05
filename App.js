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

    checkWinningState();
  }

  const checkWinningState = () => {
    // Check rows
    for(let i = 0; i < 3; i++) {
        const isRowXWinning = map[i].every((cell) => cell === 'x');
        const isRowOWinning = map[i].every((cell) => cell === '0');
        if(isRowXWinning) {
            Alert.alert('X wins. Row: ', i);
        }

        if(isRowOWinning) {
            Alert.alert('O wins. Row: ', i);
        }
    }

    // Check columns
    for(let col = 0; col < 3; col++) {

      let isColumnXWinner = true;
      let isColumnOWinner = true;

        for (let row = 0; row < 3; row++) {
          if(map[row][col] !== 'x') {
            isColumnXWinner = false;
          }
          if(map[row][col] !== 'o') {
            isColumnOWinner = false;
          }
        }

      if(isColumnXWinner) {
        Alert.alert('X wins. Row: ', col);
        break;
      }

      if(isColumnOWinner) {
        Alert.alert('O wins. Row: ', col);
        break;
      }

    }
  }


  return (
    <View style={styles.container} className="bg-[#242D34]">
      <ImageBackground source={bg} style={styles.bg} resizeMode={'contain'} >
        <View style={styles.map}>

          {map.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row.map((cell, columnIndex) => (
                  <TouchableOpacity activeOpacity={0.7} onPress={() => onPress(rowIndex, columnIndex)} key={`${columnIndex}-`} style={styles.cell}>
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

