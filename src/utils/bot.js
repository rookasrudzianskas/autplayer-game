import {copyArray} from "./index";
import {getWinner} from "./gameLogic";

export const botTurn = (map, gameMode) => {
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

    return chosenOption;
};
