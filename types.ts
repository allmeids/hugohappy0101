export interface GameState {
    playedSnake: boolean;
    playedFlappy: boolean;
}

export interface ScratchState {
    card1: boolean;
    card2: boolean;
    card3: boolean;
}

export enum GameType {
    SNAKE = 'SNAKE',
    FLAPPY = 'FLAPPY'
}