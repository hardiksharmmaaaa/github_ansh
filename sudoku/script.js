document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const solveButton = document.getElementById('solve-button');
    const newGameButton = document.getElementById('new-game-button');

    let board = [];
    let solution = [];

    // Function to generate a new Sudoku board
    function generateSudoku() {
        // Initialize an empty 9x9 board
        let newBoard = Array(9).fill(null).map(() => Array(9).fill(0));
        fillBoard(newBoard); // Fill the board with a valid Sudoku
        let solvedBoard = newBoard.map(row => [...row]); // Copy the solved board

        // Remove numbers to create the puzzle
        for (let i = 0; i < 40; i++) { // Adjust number of cells to remove for difficulty
            let row = Math.floor(Math.random() * 9);
            let col = Math.floor(Math.random() * 9);
            if (newBoard[row][col] !== 0) {
                let temp = newBoard[row][col];
                newBoard[row][col] = 0;
                // Ensure the puzzle still has a unique solution (simplified check)
                if (!hasUniqueSolution(newBoard)) {
                    newBoard[row][col] = temp; // If not unique, put it back
                    i--; // Try again
                }
            } else {
                i--; // Already empty, try again
            }
        }
        board = newBoard;
        solution = solvedBoard;
        renderBoard(board);
    }

    // Backtracking function to fill the Sudoku board
    function fillBoard(currentBoard) {
        let find = findEmpty(currentBoard);
        if (!find) {
            return true; // Board is filled
        }
        let row = find[0];
        let col = find[1];

        for (let num = 1; num <= 9; num++) {
            if (isValid(currentBoard, num, row, col)) {
                currentBoard[row][col] = num;
                if (fillBoard(currentBoard)) {
                    return true;
                }
                currentBoard[row][col] = 0; // Backtrack
            }
        }
        return false;
    }

    // Function to check if a number is valid in a given cell
    function isValid(currentBoard, num, row, col) {
        // Check row
        for (let x = 0; x < 9; x++) {
            if (currentBoard[row][x] === num && col !== x) {
                return false;
            }
        }

        // Check column
        for (let x = 0; x < 9; x++) {
            if (currentBoard[x][col] === num && row !== x) {
                return false;
            }
        }

        // Check 3x3 box
        let startRow = Math.floor(row / 3) * 3;
        let startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (currentBoard[i + startRow][j + startCol] === num && (i + startRow !== row || j + startCol !== col)) {
                    return false;
                }
            }
        }
        return true;
    }

    // Function to find an empty cell (value 0)
    function findEmpty(currentBoard) {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (currentBoard[r][c] === 0) {
                    return [r, c];
                }
            }
        }
        return null;
    }

    // Simple check for unique solution (can be improved)
    function hasUniqueSolution(puzzle) {
        let solutionsFound = 0;
        let tempBoard = puzzle.map(row => [...row]);

        function solveAndCount(boardToSolve) {
            let find = findEmpty(boardToSolve);
            if (!find) {
                solutionsFound++;
                return;
            }
            let row = find[0];
            let col = find[1];

            for (let num = 1; num <= 9; num++) {
                if (isValid(boardToSolve, num, row, col)) {
                    boardToSolve[row][col] = num;
                    solveAndCount(boardToSolve);
                    if (solutionsFound > 1) return; // Stop if more than one solution found
                    boardToSolve[row][col] = 0; // Backtrack
                }
            }
        }
        solveAndCount(tempBoard);
        return solutionsFound === 1;
    }


    // Function to render the Sudoku board in the HTML
    function renderBoard(currentBoard) {
        gameBoard.innerHTML = ''; // Clear previous board
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                const value = currentBoard[r][c];

                if (value !== 0) {
                    cell.textContent = value;
                    cell.classList.add('fixed');
                } else {
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.min = '1';
                    input.max = '9';
                    input.maxLength = '1';
                    input.dataset.row = r;
                    input.dataset.col = c;
                    input.addEventListener('input', handleInput);
                    cell.appendChild(input);
                }
                gameBoard.appendChild(cell);
            }
        }
    }

    // Handle user input
    function handleInput(event) {
        const input = event.target;
        let value = input.value;

        // Ensure only a single digit is entered
        if (value.length > 1) {
            value = value.slice(0, 1);
            input.value = value;
        }

        const row = parseInt(input.dataset.row);
        const col = parseInt(input.dataset.col);
        const num = parseInt(value);

        if (isNaN(num) || num < 1 || num > 9) {
            board[row][col] = 0;
            input.parentElement.classList.remove('error');
            return;
        }

        board[row][col] = num;

        // Basic validation (can be expanded for real-time feedback)
        if (!isValid(board, num, row, col)) {
            input.parentElement.classList.add('error');
        } else {
            input.parentElement.classList.remove('error');
        }

        checkGameCompletion();
    }

    // Check if the game is completed and correct
    function checkGameCompletion() {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (board[r][c] === 0 || board[r][c] !== solution[r][c]) {
                    return false;
                }
            }
        }
        alert('Congratulations! You solved the Sudoku!');
        return true;
    }

    // Solve button functionality
    solveButton.addEventListener('click', () => {
        board = solution.map(row => [...row]); // Fill with the solution
        renderBoard(board);
    });

    // New Game button functionality
    newGameButton.addEventListener('click', generateSudoku);

    // Initial game generation
    generateSudoku();
});