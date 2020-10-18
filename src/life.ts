export type Cell = boolean;

export class Board {
  board: Array<Array<Cell>>;
  generation: number;
  readonly width: number = 20;
  readonly height: number = 20;

  constructor() {
    this.board = Array.from(new Array(this.height), () => new Array(this.width).fill(false));
    this.generation = 0;
  }

  clone(): Board {
    const b = new Board();
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
