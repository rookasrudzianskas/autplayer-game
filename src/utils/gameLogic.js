export const isTie = (map) => {
    return !map.some(row => row.some(cell => cell === '')); // if any cell is empty, then it's not a tie
}


export const getWinner = (winnerMap) => {
    // Check rows
    for (let i = 0; i < 3; i++) {
        const isRowXWinning = winnerMap[i].every((cell) => cell === "X");
        const isRowOWinning = winnerMap[i].every((cell) => cell === "O");

        if (isRowXWinning) {
            return "X";
        }
        if (isRowOWinning) {
            return "O";
        }
    }


    let isColumnXWinner = true;
    let isColumnOWinner = true;

    // Check columns
    for (let col = 0; col < 3; col++) {
        let isColumnXWinner = true;
        let isColumnOWinner = true;

        for (let row = 0; row < 3; row++) {
            if (winnerMap[row][col] !== "X") {
                isColumnXWinner = false;
            }
            if (winnerMap[row][col] !== "O") {
                isColumnOWinner = false;
            }
        }

        if (isColumnXWinner) {
            return "X";
        }
        if (isColumnOWinner) {
            return "O";
        }
    }

    // Check diagonals
    let isDiagonal1OWinning = true;
    let isDiagonal1XWinning = true;
    let isDiagonal2OWinning = true;
    let isDiagonal2XWinning = true;

    for (let i = 0; i < 3; i++) {
        if (winnerMap[i][i] !== "O") {
            isDiagonal1OWinning = false;
        }
        if (winnerMap[i][i] !== "X") {
            isDiagonal1XWinning = false;
        }

        if (winnerMap[i][2 - i] !== "O") {
            isDiagonal2OWinning = false;
        }
        if (winnerMap[i][2 - i] !== "X") {
            isDiagonal2XWinning = false;
        }
    }

    if (isDiagonal1OWinning || isDiagonal2OWinning) {
        return "O";
    }
    if (isDiagonal1XWinning || isDiagonal2XWinning) {
        return "X";
    }
}
