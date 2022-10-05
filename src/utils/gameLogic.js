export const getWinner = (winnerMap) => {
    // Check rows
    for (let i = 0; i < 3; i++) {
        const isRowXWinning = winnerMap[i].every((cell) => cell === "x");
        const isRowOWinning = winnerMap[i].every((cell) => cell === "o");

        if (isRowXWinning) {
            return "x";
        }
        if (isRowOWinning) {
            return "o";
        }
    }


    let isColumnXWinner = true;
    let isColumnOWinner = true;

    // Check columns
    for (let col = 0; col < 3; col++) {
        let isColumnXWinner = true;
        let isColumnOWinner = true;

        for (let row = 0; row < 3; row++) {
            if (winnerMap[row][col] !== "x") {
                isColumnXWinner = false;
            }
            if (winnerMap[row][col] !== "o") {
                isColumnOWinner = false;
            }
        }

        if (isColumnXWinner) {
            return "x";
        }
        if (isColumnOWinner) {
            return "o";
        }
    }

    // Check diagonals
    let isDiagonal1OWinning = true;
    let isDiagonal1XWinning = true;
    let isDiagonal2OWinning = true;
    let isDiagonal2XWinning = true;

    for (let i = 0; i < 3; i++) {
        if (winnerMap[i][i] !== "o") {
            isDiagonal1OWinning = false;
        }
        if (winnerMap[i][i] !== "x") {
            isDiagonal1XWinning = false;
        }

        if (winnerMap[i][2 - i] !== "o") {
            isDiagonal2OWinning = false;
        }
        if (winnerMap[i][2 - i] !== "x") {
            isDiagonal2XWinning = false;
        }
    }

    if (isDiagonal1OWinning || isDiagonal2OWinning) {
        return "o";
    }
    if (isDiagonal1XWinning || isDiagonal2XWinning) {
        return "x";
    }
}
