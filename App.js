import {Alert, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import bg from './assets/bg.jpeg';
import {useEffect, useState} from "react";
import Cell from "./src/components/Cell";
import {Amplify, Auth} from 'aws-amplify'
import awsconfig from './src/aws-exports'
import {withAuthenticator} from "aws-amplify-react-native/src/Auth";
import {emptyMap, copyArray} from './src/utils/index';
import {getWinner, isTie} from './src/utils/gameLogic';
import {botTurn} from "./src/utils/bot";
import {styles} from "./app.style";
import { DataStore } from 'aws-amplify';
import {Game} from './src/models';

Amplify.configure({
    ...awsconfig,
    Analytics: {
        disabled: true,
    }
});


const App = () => {
    const [map, setMap] = useState(emptyMap);
    const [gameMode, setGameMode] = useState("BOT_MEDIUM"); // LOCAL, BOT_EASY, BOT_MEDIUM;
    const [currentTurn, setCurrentTurn] = useState('X');
    const [game, setGame] = useState(null);
    const [userData, setUserData] = useState(null);
    const [ourPlayerType, setOurPlayerType] = useState(null);

    useEffect(() => {
        resetGame();
        if(gameMode === 'ONLINE') {
            findOrCreateOnlineGame();
        } else {
            deleteTemporaryGame();
        }

        setCurrentTurn('X');
        if(gameMode !== 'ONLINE') {
            setOurPlayerType('X');
        }
    }, [gameMode]);

    useEffect(() => {
        if (currentTurn === "O" && ["BOT_EASY", "BOT_MEDIUM"].includes(gameMode)) {
            const chosenOption = botTurn(map, gameMode);
            if(chosenOption) {
                onPress(chosenOption.row, chosenOption.col);
            }
        }
    }, [currentTurn, gameMode]);

    useEffect(() => {

    }, [map]);

    useEffect(() => {
        const winner = getWinner(map);
        if (winner) {
            gameWon(winner);
        } else {
            checkTieState();
        }
    }, [map]);

    useEffect(() => {
        Auth.currentAuthenticatedUser({ bypassCache: true }).then(setUserData);
    }, []);

    useEffect(() => {
        if(!game) return;
        // subscribe to the updates
        const subscription = DataStore.observe(Game, game.id).subscribe(msg => {
            console.warn(msg.model, msg.opType, msg.element);
            const newGame = msg.element;
            if(msg.opType === 'UPDATE') {
                console.log({ ...game, ...newGame});
                // setGame((g) => ({...g, ...newGame}));
                setGame(newGame);
                if(newGame.map) {
                    setMap(JSON.parse(newGame.map));
                }
                if(newGame.currentPlayer) {
                    setCurrentTurn(newGame.currentPlayer);
                }
            }
        });

        return () => {
            subscription.unsubscribe();
        }
    }, [game?.id]);

    const findOrCreateOnlineGame = async () => {
        const games = await getAvailableGames();
        if(games.length > 0) {
            await joinGame(games[0]);
        } else {
            await createNewGame();
        }
        // search for the available games, that does not have the second player, if no
        // existing game found, create a new game and wait for the second player to join
    }

    const joinGame = async (game) => {
        const updatedGame = await DataStore.save(Game.copyOf(game, updatedGame => {
            updatedGame.playerO = userData.attributes.sub;
        }));
        setGame(updatedGame);
        setOurPlayerType('O');
    }

    const getAvailableGames = async () => {
        const games = await DataStore.query(Game, (g) => g.playerO('eq', ''));
        return games;
    }

    const deleteTemporaryGame = async () => {
        if (!game || game.playerO) {
            setGame(null);
            return;
        }
        await DataStore.delete(game);
        // await DataStore.delete(Game, game.id); // or this option
        setGame(null);
    }

    const createNewGame = async () => {
        const emptyStringMap = JSON.stringify([
            ['', '', ''],
            ['', '', ''],
            ['', '', ''],
        ]);
        const newGameData = new Game({
            playerX: userData.attributes.sub, // we don't know yet
            playerO: '',
            map: emptyStringMap, // stringified map
            currentPlayer: 'X',
            pointsX: 0,
            pointsO: 0,
        });

        const createdGame = await DataStore.save(newGameData);
        setGame(createdGame);
        setOurPlayerType('X');
    }

    const updateGame = () => {
        if(!game) return;
        // if(game.map !== JSON.stringify(map) || game.currentPlayer !== currentTurn) {
            // console.log('Local game has updated...');
            // console.log(game);
            DataStore.save(Game.copyOf(game, g => {
                g.currentPlayer = currentTurn;
                g.map = JSON.stringify(map);
            }));
        // }
    }

    const onPress = (rowIndex, columnIndex) => {

        if(gameMode === 'ONLINE' && currentTurn !== ourPlayerType) {
            Alert.alert('It is not your turn!', 'Please wait for your opponent to make a move');
            return;
        }

        if (map[rowIndex][columnIndex] !== "") {
            Alert.alert("Position already occupied");
            return;
        }

        setMap((existingMap) => {
            const updatedMap = [...existingMap];
            updatedMap[rowIndex][columnIndex] = currentTurn;
            return updatedMap;
        });

        setCurrentTurn(currentTurn === "X" ? "O" : "X");
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
        setCurrentTurn('X');
        setGame(null);
    }

    const onLogOut = async () => {
        await DataStore.clear();
        Auth.signOut();
    }

    return (
        <View style={styles.container} className="relative bg-[#242D34]">
            <ImageBackground source={bg} style={styles.bg} resizeMode={'contain'} >
                {true ? (
                    <TouchableOpacity onPress={onLogOut} activeOpacity={0.7} className="absolute top-12 py-1 px-4 rounded-lg bg-blue-500">
                        <Text className="font-semibold text-white">Sign out</Text>
                    </TouchableOpacity>
                ) : (
                    <View/>
                )}
                <Text className="absolute top-20 text-white uppercase tracking-widest text-lg font-semibold">Current turn: {currentTurn}</Text>
                {game && (<Text className="absolute top-28 text-white uppercase tracking-widest text-center text-base font-semibold">Game id: {game.id}</Text>)}
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

