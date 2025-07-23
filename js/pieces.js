// Define all possible piece shapes as 5x5 grids
export const PIECE_SHAPES = {
    // Level 1 pieces (basic)
    1: [
        // Single square
        [
            [0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ],
        // 2x2 square
        [
            [0, 0, 0, 0, 0],
            [0, 1, 1, 0, 0],
            [0, 1, 1, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ],
        // Line shape (3 blocks)
        [
            [0, 0, 0, 0, 0],
            [0, 1, 1, 1, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ]
    ],
    // Level 2 pieces (adds L shapes)
    2: [
        // L shape
        [
            [0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0],
            [0, 1, 0, 0, 0],
            [0, 1, 1, 0, 0],
            [0, 0, 0, 0, 0]
        ],
        // Reverse L shape
        [
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 1, 1, 0, 0],
            [0, 0, 0, 0, 0]
        ]
    ],
    // Level 3 pieces (adds T shape and longer pieces)
    3: [
        // T shape
        [
            [0, 0, 0, 0, 0],
            [0, 1, 1, 1, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ],
        // Long line (4 blocks)
        [
            [0, 0, 0, 0, 0],
            [1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ]
    ],
    // Level 4 pieces (adds complex shapes)
    4: [
        // Z shape
        [
            [0, 0, 0, 0, 0],
            [0, 1, 1, 0, 0],
            [0, 0, 1, 1, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ],
        // S shape
        [
            [0, 0, 0, 0, 0],
            [0, 0, 1, 1, 0],
            [0, 1, 1, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ]
    ],
    // Level 5 pieces (adds special shapes)
    5: [
        // Cross shape
        [
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 1, 1, 1, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0]
        ],
        // U shape
        [
            [0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0],
            [0, 1, 1, 1, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ]
    ]
};

// Get available pieces for the current level
export function getAvailablePieces(level) {
    let pieces = [];
    for (let i = 1; i <= level; i++) {
        if (PIECE_SHAPES[i]) {
            pieces = pieces.concat(PIECE_SHAPES[i]);
        }
    }
    return pieces;
}

// Function to get a random piece shape for the current level
export function getRandomPieceShape(level) {
    const availablePieces = getAvailablePieces(Math.min(level, 5));
    return availablePieces[Math.floor(Math.random() * availablePieces.length)];
}

// Function to rotate a piece 90 degrees clockwise
export function rotatePiece(piece) {
    const size = piece.length;
    const rotated = Array(size).fill().map(() => Array(size).fill(0));
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            rotated[j][size - 1 - i] = piece[i][j];
        }
    }
    
    return rotated;
} 