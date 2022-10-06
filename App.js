import {Alert, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import bg from './assets/bg.jpeg';
import {useEffect, useState} from "react";
import Cell from "./src/components/Cell";
import {Amplify, Auth} from 'aws-amplify'
import awsconfig from './src/aws-exports'
import {withAuthenticator} from "aws-amplify-react-native/src/Auth";
Amplify.configure(awsconfig);
import {emptyMap, copyArray} from './src/utils/index';
import {getWinner, isTie} from './src/utils/gameLogic';
import {botTurn} from "./src/utils/bot";
import {styles} from "./app.style";
import { DataStore } from 'aws-amplify';
import {Game} from './src/models';


const App = () => {
    const [map, setMap] = useState(emptyMap);
    const [gameMode, setGameMode] = useState("BOT_MEDIUM"); // LOCAL, BOT_EASY, BOT_MEDIUM;
    const [currentTurn, setCurrentTurn] = useState('x');

    useEffect(() => {
        if(gameMode === 'ONLINE') {
            findOrCreateOnlineGame();
        }
    }, [gameMode]);

    useEffect(() => {
        if (currentTurn === "o" && gameMode !== "LOCAL") {
            const chosenOption = botTurn(map, gameMode);
            if(chosenOption) {
                onPress(chosenOption.row, chosenOption.col);
            }
        }
    }, [currentTurn, gameMode]);

    useEffect(() => {
        const winner = getWinner(map);
        if (winner) {
            gameWon(winner);
        } else {
            checkTieState();
        }
    }, [map]);

    const findOrCreateOnlineGame = async () => {
        // search for the available games, that does not have the second player, if no
        // existing game found, create a new game and wait for the second player to join
        // console.warn('Create online game')

        await createNewGame();
    }

    const createNewGame = async () => {
        const userData = await Auth.currentAuthenticatedUser({bypassCache: true});
        // console.warn(userData);
        const emptyStringMap = JSON.stringify(emptyMap);
        const newGame = new Game({
            playerX: '', // we don't know yet
            map: emptyStringMap, // stringified map
            currentPlayer: 'x',
            pointsX: 0,
            pointsO: 0,
        })
    }

    const onPress = (rowIndex, columnIndex) => {
        if (map[rowIndex][columnIndex] !== "") {
            Alert.alert("Position already occupied");
            return;
        }

        setMap((existingMap) => {
            const updatedMap = [...existingMap];
            updatedMap[rowIndex][columnIndex] = currentTurn;
            return updatedMap;
        });

        setCurrentTurn(currentTurn === "x" ? "o" : "x");
    };


    const checkTieState = () => {
        if(isTie(map)) {
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

    const onLogOut = () => {
        Auth.signOut();
    }

    return (
        <View style={styles.container} className="relative bg-[#242D34]">
            <ImageBackground source={bg} style={styles.bg} resizeMode={'contain'} >
                {false ? (
                    <TouchableOpacity onPress={onLogOut} activeOpacity={0.7} className="absolute top-14 py-1 px-4 rounded-lg bg-blue-500">
                        <Text className="font-semibold text-white">Sign out</Text>
                    </TouchableOpacity>
                ) : (
                    <View/>
                )}
                <Text className="absolute top-20 text-white uppercase tracking-widest text-lg font-semibold">Current turn: {currentTurn}</Text>
                <View style={styles.map}>
                    {map.map((row, rowIndex) => (
                        <View key={`row-${rowIndex}`} style={styles.row}>
                            {row.map((cell, columnIndex) => (
                                <Cell
                                    key={`row-${rowIndex}-col-${columnIndex}`}
                                    cell={cell}
                                    onPress={() => onPress(rowIndex, columnIndex)}
                                />
                            ))}
                        </View>
                    ))}
                </View>
                <View style={styles.buttons} className="">
                    <Text
                        onPress={() => setGameMode("LOCAL")}
                        style={[
                            styles.button,
                            { backgroundColor: gameMode === "LOCAL" ? "#4F5686" : "#191F24" },
                        ]}
                    >
                        Local
                    </Text>
                    <Text
                        onPress={() => setGameMode("BOT_EASY")}
                        style={[
                            styles.button,
                            {
                                backgroundColor:
                                    gameMode === "BOT_EASY" ? "#4F5686" : "#191F24",
                            },
                        ]}
                    >
                        Easy Bot
                    </Text>
                    <Text
                        onPress={() => setGameMode("BOT_MEDIUM")}
                        style={[
                            styles.button,
                            {
                                backgroundColor:
                                    gameMode === "BOT_MEDIUM" ? "#4F5686" : "#191F24",
                            },
                        ]}
                    >
                        Medium Bot
                    </Text>

                    <Text
                        onPress={() => setGameMode("ONLINE")}
                        style={[
                            styles.button,
                            {
                                backgroundColor:
                                    gameMode === "ONLINE" ? "#4F5686" : "#191F24",
                            },
                        ]}
                    >
                        ONLINE
                    </Text>
                </View>
            </ImageBackground>
        </View>
    );
}




export default withAuthenticator(App);

