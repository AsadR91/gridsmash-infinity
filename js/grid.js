// Grid dimensions
export const GRID_SIZE = 8;

export class Grid {
    constructor() {
        this.reset();
    }

    // Initialize or reset the grid
    reset() {
        this.cells = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
    }

    // Check if a piece can be placed at the given position
    canPlacePiece(piece, row, col) {
        for (let i = 0; i < piece.length; i++) {
            for (let j = 0; j < piece[i].length; j++) {
                if (piece[i][j] === 1) {
                    const gridRow = row + i;
                    const gridCol = col + j;

                    // Check if position is within grid bounds
                    if (gridRow < 0 || gridRow >= GRID_SIZE || 
                        gridCol < 0 || gridCol >= GRID_SIZE) {
                        return false;
                    }

                    // Check if position is already occupied
                    if (this.cells[gridRow][gridCol] === 1) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    // Place a piece on the grid
    placePiece(piece, row, col) {
        if (!this.canPlacePiece(piece, row, col)) {
            return false;
        }

        for (let i = 0; i < piece.length; i++) {
            for (let j = 0; j < piece[i].length; j++) {
                if (piece[i][j] === 1) {
                    this.cells[row + i][col + j] = 1;
                }
            }
        }

        return true;
    }

    // Check and clear completed lines (rows and columns)
    clearLines() {
        let clearedLines = 0;
        
        // Check rows
        for (let row = 0; row < GRID_SIZE; row++) {
            if (this.cells[row].every(cell => cell === 1)) {
                this.cells[row].fill(0);
                clearedLines++;
            }
        }

        // Check columns
        for (let col = 0; col < GRID_SIZE; col++) {
            if (this.cells.every(row => row[col] === 1)) {
                for (let row = 0; row < GRID_SIZE; row++) {
                    this.cells[row][col] = 0;
                }
                clearedLines++;
            }
        }

        return clearedLines;
    }

    // Check if any piece can be placed on the grid
    canPlaceAnyPiece(pieces) {
        for (const piece of pieces) {
            for (let row = 0; row < GRID_SIZE; row++) {
                for (let col = 0; col < GRID_SIZE; col++) {
                    if (this.canPlacePiece(piece, row, col)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
} 