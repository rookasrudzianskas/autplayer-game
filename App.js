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

const App = () => {
    const [map, setMap] = useState(emptyMap);
    const [gameMode, setGameMode] = useState("BOT_MEDIUM"); // LOCAL, BOT_EASY, BOT_MEDIUM;
    const [currentTurn, setCurrentTurn] = useState('x');

    useEffect(() => {
        if (currentTurn === "o" && gameMode !== "LOCAL") {
            botTurn();
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
        setMap(copyArray(emptyMap));
        setCurrentTurn('x');
    }

    const botTurn = () => {
        // collect all possible options
        const possiblePositions = [];
        map.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                if (cell === "") {
                    possiblePositions.push({ row: rowIndex, col: columnIndex });
                }
            });
        });

        let chosenOption;

        if (gameMode === "BOT_MEDIUM") {
            // Attack
            possiblePositions.forEach((possiblePosition) => {
                const mapCopy = copyArray(map);

                mapCopy[possiblePosition.row][possiblePosition.col] = "o";

                const winner = getWinner(mapCopy);
                if (winner === "o") {
                    // Attack that position
                    chosenOption = possiblePosition;
                }
            });

            if (!chosenOption) {
                // Defend
                // Check if the opponent WINS if it takes one of the possible Positions
                possiblePositions.forEach((possiblePosition) => {
                    const mapCopy = copyArray(map);

                    mapCopy[possiblePosition.row][possiblePosition.col] = "x";

                    const winner = getWinner(mapCopy);
                    if (winner === "x") {
                        // Defend that position
                        chosenOption = possiblePosition;
                    }
                });
            }
        }

        // choose random
        if (!chosenOption) {
            chosenOption =
                possiblePositions[Math.floor(Math.random() * possiblePositions.length)];
        }

        if (chosenOption) {
            onPress(chosenOption.row, chosenOption.col);
        }
    };

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
                <View style={styles.buttons}>
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
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#242D34",
    },
    bg: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",

        paddingTop: 15,
    },
    map: {
        width: "80%",
        aspectRatio: 1,
    },
    row: {
        flex: 1,
        flexDirection: "row",
    },
    buttons: {
        position: "absolute",
        bottom: 50,
        flexDirection: "row",
    },
    button: {
        color: "white",
        margin: 10,
        fontSize: 16,
        backgroundColor: "#191F24",
        padding: 10,
        paddingHorizontal: 15,
    },
});


export default withAuthenticator(App);

