export type Cell = boolean;

export class Board {
  board: Array<Array<Cell>>;
  generation: number;
  readonly width: number;
  readonly height: number;

  constructor(width: number = 20, height: number = 20) {
    this.width = width;
    this.height = height;
    this.board = Array.from(new Array(this.height), () => new Array(this.width).fill(false));
    this.generation = 0;
  }

  clone(): Board {
    const b = new Board(this.width, this.height);
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        b.setCell(x, y, this.getCell(x, y));
      }
    }
    b.generation = this.generation;
    return b;
  }

  arround(x: number, y: number): number {
    let cnt = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= this.width || ny < 0 || ny >= this.height) continue;
        cnt += Number(this.board[y + dy][x + dx]);
      }
    }
    return cnt;
  }

  getCell(x: number, y: number): Cell {
    return this.board[y][x];
  }

  setCell(x: number, y: number, cell: Cell) {
    this.board[y][x] = cell;
  }

  step() {
    const board = Array.from(new Array(this.height), () => new Array(this.width).fill(false));
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        switch (this.arround(x, y)) {
          case 2:
            board[y][x] = this.board[y][x];
            break;
          case 3:
            board[y][x] = true;
            break;
          default:
            board[y][x] = false;
            break;
        }
      }
    }
    this.board = board;
    this.generation++;
  }

  clear() {
    this.board = Array.from(new Array(this.height), () => new Array(this.width).fill(false));
    this.generation = 0;
  }
}

export type Pattern = {
  name: string;
  pattern: Array<[number, number]>;
};

export const patterns: Array<Pattern> = [
  { name: "cell", pattern: [[0, 0]] },
  {
    name: "glider",
    pattern: [
      [0, -1],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ],
  },
  {
    name: "spaceship",
    pattern: [
      [-2, -1],
      [1, -1],
      [2, 0],
      [-2, 1],
      [2, 1],
      [-1, 2],
      [0, 2],
      [1, 2],
      [2, 2],
    ],
  },
  {
    name: "glider gun",
    pattern: [
      [7, -4],
      [5, -3],
      [7, -3],
      [-5, -2],
      [-4, -2],
      [3, -2],
      [4, -2],
      [17, -2],
      [18, -2],
      [-6, -1],
      [-2, -1],
      [3, -1],
      [4, -1],
      [17, -1],
      [18, -1],
      [-17, 0],
      [-16, 0],
      [-7, 0],
      [-1, 0],
      [3, 0],
      [4, 0],
      [-17, 1],
      [-16, 1],
      [-7, 1],
      [-3, 1],
      [-1, 1],
      [0, 1],
      [5, 1],
      [7, 1],
      [-7, 2],
      [-1, 2],
      [7, 2],
      [-6, 3],
      [-2, 3],
      [-5, 4],
      [-4, 4],
    ],
  },
];
