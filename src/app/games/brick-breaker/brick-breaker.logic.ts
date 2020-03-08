import { Canvas } from '../../scripts/Canvas';

class Point {
  x: number;
  y: number;
}

class Brick {
  static readonly width = 20;
  static readonly height = 10;

  static readonly color = 'blue';

  exists = true;

  constructor(
    public canvas: Canvas,
    public x: number,
    public y: number
  ) {
  }

  draw() {
    if (this.exists === false) {
      return;
    }
    const { width, height, color } = Brick;
    this.canvas.drawFilledRect(
      this.y * width, this.x * height, width - 1, height - 1, color
    );
  }
}

export class BrickBreaker {
  private readonly canvas: Canvas;
  private interval;

  private playerScore = 0;

  private gameRunning = false;

  private readonly backgroundColor = 'white';
  private readonly homeScreenTextColor = 'black';
  private readonly userScoreColor = 'green';

  paddleWidth = 50;
  paddleHeight = 5;
  paddleColor = 'black';

  private bricks: Brick[][] = [];
  private paddle: Point = { x: 0, y: 350 };

  private ballVelocityX = 0.7;
  private ballVelocityY = 0.3;

  private ball = {
    x: 300, y: 250,
    width: 5, height: 5,
    velocityX: this.ballVelocityX, velocityY: this.ballVelocityY,
    color: 'red'
  };

  private previousBallPosition: Point;

  constructor(e: HTMLCanvasElement) {
    this.canvas = new Canvas(e);
  }

  reset() {
    this.playerScore = 0;
    this.paddle.x = (this.canvas.width - this.paddleWidth) / 2;
    this.ball.x = 300;
    this.ball.y = 250;
    this.ball.velocityX = this.ballVelocityX;
    this.ball.velocityY = this.ballVelocityY;
    this.previousBallPosition = null;
    this.initializeBricks();
  }

  initializeBricks() {
    const { width } = this.canvas;
    this.bricks = [];

    for (let i = 0; i < 20; i++) {
      this.bricks.push([]);
      for (let j = 0; j < width / Brick.width; j++) {
        this.bricks[i].push(new Brick(this.canvas, i, j));
      }
    }

    // Create gutter
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < width / Brick.width; j++) {
        this.bricks[i][j].exists = false;
      }
    }
  }

  start() {
    this.reset();
    this.interval = setInterval(this.render.bind(this), 1000 / 300);
  }

  stop() {
    this.gameRunning = false;
    clearInterval(this.interval);
    this.render();
  }

  onEnterPress() {
    if (this.gameRunning === false) {
      this.playerScore = 0;
      this.start();
    }
    this.gameRunning = true;
  }

  onHover(event: MouseEvent) {
    if (this.canvas) {
      const canvas = this.canvas.getBoundingClientRect;
      const root = document.documentElement;
      this.paddle.x = event.clientX - canvas.left -
        root.scrollLeft - this.paddleWidth / 2;
      this.boundXCoordinate();
    }
  }

  boundXCoordinate() {
    const { width } = this.canvas;
    const { paddleWidth, paddle } = this;
    paddle.x = Math.min(paddle.x, width - paddleWidth);
    paddle.x = Math.max(paddle.x, 0);
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

  private drawBackground() {
    const { backgroundColor } = this;
    const { width, height } = this.canvas;

    this.canvas.drawFilledRect(0, 0, width, height, backgroundColor);
  }

  private renderGame() {
    this.drawBricks();
    this.drawPaddle();
    this.drawBall();
    this.writeScore();
  }

  private updateGameState() {
    this.ball.x += this.ball.velocityX;
    this.ball.y += this.ball.velocityY;

    this.handleCollision();
  }

  private handleCollision() {
    this.handleWallCollision();
    this.handleCollisionWithPaddle();
    this.handleCollisionWithBricks();
  }

  private handleWallCollision() {
    if (this.ball.x + this.ball.width >= this.canvas.width ||
      this.ball.x <= 0) {
      this.ball.velocityX *= -1;
    }

    if (this.ball.y <= 0) {
      this.ball.velocityY *= -1;
    }

    if (this.ball.y >= this.canvas.height) {
      this.stop();
    }
  }

  private handleCollisionWithPaddle() {
    const { x, y } = this.ball;

    if (x >= this.paddle.x && x <= this.paddle.x + this.paddleWidth) {
      if (y >= this.paddle.y && y <= this.paddle.y + this.paddleHeight) {
        this.ball.velocityY *= -1;
      }
    }
  }

  private handleCollisionWithBricks() {
    const { x, y } = this.ball;

    const brickX = Math.floor(y / Brick.height);
    const brickY = Math.floor(x / Brick.width);

    if (this.bricks[brickX] && this.bricks[brickX][brickY] &&
      this.bricks[brickX][brickY].exists) {
      this.bricks[brickX][brickY].exists = false;
      this.playerScore++;

      if (this.previousBallPosition) {
        if (this.previousBallPosition.x !== brickX) {
          this.ball.velocityY *= -1;
        }
        if (this.previousBallPosition.y !== brickY) {
          this.ball.velocityX *= -1;
        }
      }
    }

    this.previousBallPosition = {
      x: brickX,
      y: brickY
    };
  }

  private drawBricks() {
    this.bricks.forEach(r => r.forEach(b => b.draw()));
  }

  private drawPaddle() {
    const { paddleWidth, paddleHeight, paddleColor, paddle} = this;
    const { x, y } = paddle;

    this.canvas.drawFilledRect(
      x, y, paddleWidth, paddleHeight, paddleColor
    );
  }

  private drawBall() {
    const { x, y, width, height, color } = this.ball;

    this.canvas.drawFilledRect(
      x, y, width, height, color
    );
  }

  private writeScore() {
    const t1 = `Your score: ${this.playerScore}`;
    const { userScoreColor } = this;

    this.canvas.writeText(
      t1, 10, 16, 18, userScoreColor
    );
  }

  private renderStartScreen() {
    const t1 = 'Click on the canvas and hit \'Enter\' to start';

    const { homeScreenTextColor, userScoreColor } = this;
    const { height } = this.canvas;

    this.canvas.writeText(t1, 70, height / 2, 25, homeScreenTextColor);

    const t2 = `Your score: ${this.playerScore}`;
    this.canvas.writeText(
      t2, 230, 240, 20, userScoreColor
    );
  }
}
