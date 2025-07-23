import { Grid, GRID_SIZE } from './grid.js';
import { getRandomPieceShape, rotatePiece } from './pieces.js';

class Game {
    constructor() {
        this.grid = new Grid();
        this.score = 0;
        this.level = 1;
        this.nextLevelScore = 1000; // Initial score needed for level 2
        this.availablePieces = [];
        this.draggedPiece = null;
        this.gameOver = false;

        this.initializeDOM();
        this.setupEventListeners();
        this.startGame();
    }

    initializeDOM() {
        // Initialize game grid
        this.gameGridElement = document.getElementById('gameGrid');
        for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            this.gameGridElement.appendChild(cell);
        }

        // Get other DOM elements
        this.piecesArea = document.getElementById('piecesArea');
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.nextLevelScoreElement = document.getElementById('nextLevelScore');
        this.finalScoreElement = document.getElementById('finalScore');
        this.gameOverElement = document.getElementById('gameOver');
        this.restartButton = document.getElementById('restartButton');
    }

    setupEventListeners() {
        // Setup drag and drop events for the grid
        this.gameGridElement.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.handleDragOver(e);
        });

        this.gameGridElement.addEventListener('drop', (e) => {
            e.preventDefault();
            this.handleDrop(e);
        });

        // Setup restart button
        this.restartButton.addEventListener('click', () => this.startGame());

        // Setup piece rotation on right click
        this.piecesArea.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (e.target.closest('.piece')) {
                const pieceElement = e.target.closest('.piece');
                const pieceIndex = parseInt(pieceElement.dataset.index);
                this.rotatePieceAtIndex(pieceIndex);
            }
        });
    }

    startGame() {
        this.grid.reset();
        this.score = 0;
        this.level = 1;
        this.nextLevelScore = 1000;
        this.gameOver = false;
        this.updateScore();
        this.updateLevel();
        this.gameOverElement.classList.add('hidden');
        this.generateNewPieces();
        this.renderGrid();
    }

    generateNewPieces() {
        this.availablePieces = [
            getRandomPieceShape(this.level),
            getRandomPieceShape(this.level),
            getRandomPieceShape(this.level)
        ];
        this.renderPieces();
    }

    renderGrid() {
        const cells = this.gameGridElement.children;
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                const index = row * GRID_SIZE + col;
                cells[index].classList.toggle('filled', this.grid.cells[row][col] === 1);
            }
        }
    }

    renderPieces() {
        this.piecesArea.innerHTML = '';
        this.availablePieces.forEach((piece, index) => {
            const pieceElement = document.createElement('div');
            pieceElement.className = 'piece';
            pieceElement.draggable = true;
            pieceElement.dataset.index = index;

            // Calculate the actual dimensions needed for the piece
            let minRow = piece.length, maxRow = 0;
            let minCol = piece[0].length, maxCol = 0;
            
            for (let i = 0; i < piece.length; i++) {
                for (let j = 0; j < piece[i].length; j++) {
                    if (piece[i][j] === 1) {
                        minRow = Math.min(minRow, i);
                        maxRow = Math.max(maxRow, i);
                        minCol = Math.min(minCol, j);
                        maxCol = Math.max(maxCol, j);
                    }
                }
            }

            // Create only the cells that are needed
            for (let i = minRow; i <= maxRow; i++) {
                for (let j = minCol; j <= maxCol; j++) {
                    const cell = document.createElement('div');
                    cell.className = 'piece-cell';
                    if (piece[i][j] === 1) {
                        cell.classList.add('filled');
                    }
                    pieceElement.appendChild(cell);
                }
            }

            // Adjust the grid template for the actual piece size
            pieceElement.style.gridTemplateColumns = `repeat(${maxCol - minCol + 1}, 1fr)`;

            // Setup drag events
            pieceElement.addEventListener('dragstart', (e) => {
                this.draggedPiece = { 
                    piece,
                    index,
                    offsetRow: minRow,
                    offsetCol: minCol
                };
                pieceElement.style.opacity = '0.5';
                
                // Create a drag image that only shows the filled cells
                const dragImage = pieceElement.cloneNode(true);
                dragImage.style.position = 'absolute';
                dragImage.style.top = '-1000px';
                document.body.appendChild(dragImage);
                e.dataTransfer.setDragImage(dragImage, 10, 10);
                setTimeout(() => document.body.removeChild(dragImage), 0);
            });

            pieceElement.addEventListener('dragend', () => {
                pieceElement.style.opacity = '1';
                this.clearHighlights();
            });

            this.piecesArea.appendChild(pieceElement);
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        this.clearHighlights();

        if (!this.draggedPiece) return;

        const { row, col } = this.getGridPosition(e);
        const adjustedRow = row - this.draggedPiece.offsetRow;
        const adjustedCol = col - this.draggedPiece.offsetCol;

        // Check if the piece can be placed at the current position
        const canPlace = this.grid.canPlacePiece(this.draggedPiece.piece, adjustedRow, adjustedCol);
        
        // Show placement preview
        this.highlightCells(this.draggedPiece.piece, adjustedRow, adjustedCol, canPlace);
    }

    handleDrop(e) {
        e.preventDefault();
        if (!this.draggedPiece) return;

        const { row, col } = this.getGridPosition(e);
        const adjustedRow = row - this.draggedPiece.offsetRow;
        const adjustedCol = col - this.draggedPiece.offsetCol;

        // Try to place the piece with some position adjustments if needed
        const positions = [
            { row: adjustedRow, col: adjustedCol },
            { row: adjustedRow - 1, col: adjustedCol },
            { row: adjustedRow + 1, col: adjustedCol },
            { row: adjustedRow, col: adjustedCol - 1 },
            { row: adjustedRow, col: adjustedCol + 1 }
        ];

        let placed = false;
        for (const pos of positions) {
            if (this.grid.canPlacePiece(this.draggedPiece.piece, pos.row, pos.col)) {
                placed = this.grid.placePiece(this.draggedPiece.piece, pos.row, pos.col);
                if (placed) break;
            }
        }

        if (placed) {
            // Remove the placed piece from available pieces
            this.availablePieces.splice(this.draggedPiece.index, 1);
            
            // Clear any completed lines and update score
            const clearedLines = this.grid.clearLines();
            this.updateScore(clearedLines);

            // Check if we need new pieces
            if (this.availablePieces.length === 0) {
                this.generateNewPieces();
            }

            // Check for game over
            if (!this.grid.canPlaceAnyPiece(this.availablePieces)) {
                this.handleGameOver();
            }

            this.renderGrid();
            this.renderPieces();
        }

        this.clearHighlights();
        this.draggedPiece = null;
    }

    rotatePieceAtIndex(index) {
        this.availablePieces[index] = rotatePiece(this.availablePieces[index]);
        this.renderPieces();
    }

    getGridPosition(e) {
        const rect = this.gameGridElement.getBoundingClientRect();
        const cellSize = rect.width / GRID_SIZE;
        
        // Calculate the exact position within the grid
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Add a small offset to make placement more natural
        const offsetX = cellSize * 0.5;
        const offsetY = cellSize * 0.5;
        
        // Calculate grid position with snap-to-grid
        return {
            row: Math.max(0, Math.min(GRID_SIZE - 1, Math.floor((y - offsetY) / cellSize))),
            col: Math.max(0, Math.min(GRID_SIZE - 1, Math.floor((x - offsetX) / cellSize)))
        };
    }

    clearHighlights() {
        const cells = this.gameGridElement.children;
        for (let cell of cells) {
            cell.classList.remove('highlight', 'invalid');
        }
    }

    highlightCells(piece, startRow, startCol, isValid) {
        const cells = this.gameGridElement.children;
        const highlightClass = isValid ? 'highlight' : 'invalid';

        for (let i = 0; i < piece.length; i++) {
            for (let j = 0; j < piece[i].length; j++) {
                if (piece[i][j] === 1) {
                    const row = startRow + i;
                    const col = startCol + j;
                    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
                        const index = row * GRID_SIZE + col;
                        cells[index].classList.add(highlightClass);
                    }
                }
            }
        }
    }

    updateScore(clearedLines = 0) {
        // Score calculation: base score per line * level multiplier
        const baseScore = clearedLines * 100;
        const levelMultiplier = this.level;
        this.score += baseScore * levelMultiplier;
        
        this.scoreElement.textContent = this.score;

        // Check for level up
        if (this.score >= this.nextLevelScore) {
            this.levelUp();
        }
    }

    levelUp() {
        if (this.level < 5) { // Max level is 5
            this.level++;
            this.levelElement.classList.add('level-up');
            
            // Remove animation class after it completes
            setTimeout(() => {
                this.levelElement.classList.remove('level-up');
            }, 1000);

            // Calculate next level score (increases with each level)
            this.nextLevelScore = this.nextLevelScore * 2;
            
            this.updateLevel();
        }
    }

    updateLevel() {
        this.levelElement.textContent = this.level;
        this.nextLevelScoreElement.textContent = this.nextLevelScore;
    }

    handleGameOver() {
        this.gameOver = true;
        this.finalScoreElement.textContent = `${this.score} (Level ${this.level})`;
        this.gameOverElement.classList.remove('hidden');
    }
}

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new Game();
}); 