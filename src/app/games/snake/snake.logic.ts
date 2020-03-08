import { Canvas } from '../../scripts/Canvas';

class Point {
  private static color = 'blue';
  static size = 20;

  constructor(private canvas: Canvas,
              public x: number,
              public y: number
  ) {
  }

  draw() {
    const { x, y } = this;
    const { size, color } = Point;
    const offset = 1;
    this.canvas.drawFilledRect(x, y, size - offset, size - offset, color);
  }
}

class AvailableDirections {
  '1000': string[];
  '100': string[];
  '10': string[];
  '1': string[];
}

class Moves {
  '1000': { x: number, y: number };
  '100': { x: number, y: number };
  '10': { x: number, y: number };
  '1': { x: number, y: number };
}

export class Snake {
  private static readonly availableDirections: AvailableDirections = {
    1000: ['1', '100'],
    100: ['1000', '10'],
    10: ['100', '1'],
    1: ['10', '1000']
  };

  private static readonly moves: Moves = {
    1000: { x: 0, y: -1},
    100: { x: 1, y: 0},
    10: { x: 0, y: 1},
    1: { x: -1, y: 0}
  };

  private readonly canvas: Canvas;
  private interval;

  private playerScore = 0;

  private gameRunning = false;

  private readonly backgroundColor = 'white';
  private readonly homeScreenTextColor = 'black';
  private readonly userScoreColor = 'green';

  private currentDirection = '10';

  private body: Point[];
  private readonly minLength = 3;

  private currentSnakePosition: { x: number, y: number };
  private currentBallPosition: { x: number, y: number };

  constructor(e: HTMLCanvasElement) {
    this.canvas = new Canvas(e);
  }

  reset() {
    const { width, height } = this.canvas;

    this.body = [];
    this.currentSnakePosition = {
      x: width / 2,
      y: height / 2
    };
    this.body.push(new Point(
      this.canvas, this.currentSnakePosition.x, this.currentSnakePosition.y
    ));
    this.playerScore = 0;
  }

  start() {
    this.reset();
    this.generateRandomBallPosition();
    this.interval = setInterval(this.render.bind(this), 1000 / 10);
  }

  stop() {
    this.gameRunning = false;
    clearInterval(this.interval);
    this.render();
  }

  render() {
    this.drawBackground();
    if (this.gameRunning) {
      this.renderGame();
      this.updateGameState();
    } else {
      this.renderStartScreen();
      clearInterval(this.interval);
    }
  }

  onEnterPress() {
    if (this.gameRunning === false) {
      this.start();
    }
    this.gameRunning = true;
  }

  changeSnakeDirection(nextDirection: string) {
    const currDir = this.currentDirection;
    if (Snake.availableDirections[currDir].indexOf(nextDirection) !== -1) {
      this.currentDirection = nextDirection;
    }
  }

  private pruneArray() {
    while (this.body.length > this.minLength + this.playerScore) {
      this.body.shift();
    }
  }

  private renderGame() {
    this.showSnake();
    this.drawBall();
    this.drawScore();
  }

  private updateGameState() {
    this.moveSnake();
    this.pruneArray();
  }

  private moveSnake() {
    this.currentSnakePosition.x += Snake.moves[this.currentDirection].x * Point.size;
    this.currentSnakePosition.y += Snake.moves[this.currentDirection].y * Point.size;

    this.currentSnakePosition.x += this.canvas.width;
    this.currentSnakePosition.x %= this.canvas.width;

    this.currentSnakePosition.y += this.canvas.height;
    this.currentSnakePosition.y %= this.canvas.height;

    const { x, y } = this.currentSnakePosition;
    this.checkCollisionWithSelf(x, y);

    this.body.push(new Point(
      this.canvas, this.currentSnakePosition.x, this.currentSnakePosition.y
    ));

    if (x === this.currentBallPosition.x && y === this.currentBallPosition.y) {
      this.playerScore++;
      this.generateRandomBallPosition();
    }
  }

  private checkCollisionWithSelf(x: number, y: number) {
    this.body.forEach(b => {
      if (b.x === x && b.y === y) {
        this.stop();
      }
    });
  }

  private generateRandomBallPosition() {
    const { width, height } = this.canvas;
    const widthCount = width / Point.size;
    const heightCount = height / Point.size;

    const generateNew = () => {
      this.currentBallPosition = {
        x: Math.floor(Math.random() * widthCount) * Point.size,
        y: Math.floor(Math.random() * heightCount) * Point.size
      };
    };

    generateNew();
    while (this.currentBallPositionCollidesWithSnake()) {
      generateNew();
    }
  }

  private currentBallPositionCollidesWithSnake() {
    const { x, y } = this.currentBallPosition;
    let doesCollide = false;
    this.body.forEach(p => {
      doesCollide = p.x === x && p.y === y;
    });
    return doesCollide;
  }

  private showSnake() {
    this.body.forEach(block => block.draw());
  }

  private drawBall() {
    if (this.currentBallPosition === undefined) {
      return;
    }
    const { x, y } = this.currentBallPosition;
    this.canvas.drawFilledRect(
      x, y, Point.size - 1, Point.size - 1, 'red'
    );
  }

  private drawScore() {
    const t1 = `Your score: ${this.playerScore}`;

    this.canvas.writeText(t1, 18, 15, 15, this.homeScreenTextColor);
  }

  private renderStartScreen() {
    const t1 = 'Click on the canvas and hit \'Enter\' to start';

    const { homeScreenTextColor, userScoreColor, playerScore } = this;
    const { height } = this.canvas;

    this.canvas.writeText(t1, 80, height / 2, 25, homeScreenTextColor);

    const t2 = `Your score: ${playerScore}`;
    this.canvas.writeText(t2, 220, 250, 25, userScoreColor);
  }

  private drawBackground() {
    const { backgroundColor } = this;
    const { width, height } = this.canvas;

    this.canvas.drawFilledRect(0, 0, width, height, backgroundColor);
  }

}
