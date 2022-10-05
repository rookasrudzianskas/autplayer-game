import { StatusBar } from 'expo-status-bar';
import {Alert, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import bg from './assets/bg.jpeg';
import {useState} from "react";
import Cross from "./src/components/cross";

const emptyMap = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
]

export default function App() {
  const [map, setMap] = useState(emptyMap);

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

    const winner = getWinner();
    if(winner) {
      gameWon(winner);
    } else {
      checkTieState();
    }
  }

  const getWinner = () => {
    // Check rows
    for(let i = 0; i < 3; i++) {
        const isRowXWinning = map[i].every((cell) => cell === 'x');
        const isRowOWinning = map[i].every((cell) => cell === '0');
        if(isRowXWinning) {
          return 'x';
        }

        if(isRowOWinning) {
            return 'o';
        }
    }


    let isColumnXWinner = true;
    let isColumnOWinner = true;

    // Check columns
    for(let col = 0; col < 3; col++) {

      isColumnXWinner = true;
      isColumnOWinner = true;

        for (let row = 0; row < 3; row++) {
          if(map[row][col] !== 'x') {
            isColumnXWinner = false;
          }
          if(map[row][col] !== 'o') {
            isColumnOWinner = false;
          }
        }

      if(isColumnXWinner) {
        return 'x';
        break;
      }

      if(isColumnOWinner) {
        return 'o';
        break;
      }
    }

    // Check diagonals
    let isDiagonal1OWinning = true;
    let isDiagonal1XWinning = true;
    let isDiagonal2OWinning = true;
    let isDiagonal2XWinning = true;

    for(let i = 0; i < 3; i++) {
      if(map[i][i] !== 'o') {
        isDiagonal1OWinning = false;
        // break;
      }
      if(map[i][i] !== 'x') {
        isDiagonal1XWinning = false;
        // break;
      }
      if(map[2 - i][i] !== 'o') {
        isDiagonal2OWinning = false;
          // break;
      }

      if(map[2 - i][i] !== 'x') {
        isDiagonal2XWinning = false;
        // break;
      }
    }

    if(isDiagonal1OWinning || isDiagonal2OWinning) {
        return 'o';
    }

    if(isDiagonal1XWinning || isDiagonal2XWinning) {
        return 'x';
    }
  }

  const checkTieState = () => {
    if(!map.some(row => row.some(cell => cell === ''))) {
      Alert.alert('Tie', 'No one won the game');
      setMap([
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ]);
    }
  }

  const gameWon = (player) => {
    Alert.alert(`Hurray!`, `${player} won the game!`, [
      {
        text: 'Play again',
        onPress: () => {
          resetGame();
        }
      }
    ]);
  }

  const resetGame = () => {
    setMap([
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ]);
    setCurrentTurn('x');
  }


  return (
    <View style={styles.container} className="relative bg-[#242D34]">
      <ImageBackground source={bg} style={styles.bg} resizeMode={'contain'} >
        <Text className="absolute top-20 text-white uppercase tracking-widest text-lg font-semibold">Current turn: {currentTurn}</Text>
        <View style={styles.map}>

          {map.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row.map((cell, columnIndex) => (
                  <TouchableOpacity activeOpacity={0.7} onPress={() => onPress(rowIndex, columnIndex)} key={`${columnIndex}-`} style={styles.cell}>
                    {cell === 'o' && (
                        <View style={styles.circle} />
                    )}

                    {cell === 'x' && (
                        <Cross />
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
  }
});

