import { Canvas } from '../../scripts/Canvas';

class Pipe {
  private static velocityX = 1;
  private static width = 50;
  private static color = 'blue';

  passedBlock = false;
  safeToRemoveFromArray = false;


  constructor(private canvas: Canvas,
              private x: number,
              private y: number,
              private height: number
  ) {
  }

  behind(b: { x: number }) {
    return this.x + Pipe.width < b.x;
  }

  pointInside(p: { x: number, y: number }) {
    if (p.x >= this.x && p.x <= this.x + Pipe.width) {
      return p.y >= this.y && p.y <= this.y + this.height;
    }
    return false;
  }

  collidesWith(b: { x: number, y: number, width: number, height: number }) {
    const topLeft = { x: b.x, y: b.y };
    const topRight = { x: b.x + b.width, y: b.y };
    const bottomLeft = { x: b.x, y: b.y + b.height };
    const bottomRight = { x: b.x + b.width, y: b.y + b.height };
    const pointInside = this.pointInside.bind(this);

    return pointInside(topLeft) || pointInside(topRight) || pointInside(bottomLeft) || pointInside(bottomRight);
  }

  update() {
    this.x -= Pipe.velocityX;
    this.safeToRemoveFromArray = this.x + Pipe.width <= 0;
  }

  draw() {
    this.canvas.drawFilledRect(
      this.x, this.y, Pipe.width, this.height, Pipe.color
    );
  }

}

export class FlappyBlock {
  private readonly canvas: Canvas;
  private interval;

  private playerScore = 0;

  private gameRunning = false;

  private distanceBetweenVerticalPipes = 100;

  private readonly backgroundColor = 'white';
  private readonly outlineColor = 'black';
  private readonly homeScreenTextColor = 'black';
  private readonly scoreColor = 'green';

  private readonly offset = 20;
  private frameCounter = 0;

  private gravity = 0.01;
  private blockOriginalVelocity = 0.1;
  private block = {
    x: 0, y: 0, width: 15, height: 15, color: 'red',
    velocityY: 0
  };

  private pipes: Pipe[] = [];
  private pipesAppearAfterNFrames = 250;

  constructor(e: HTMLCanvasElement) {
    this.canvas = new Canvas(e);
    this.reset();
  }

  onSpacePress() {
    if (this.gameRunning === false) {
      this.gameRunning = true;
      this.reset();
      this.pipes = [];
      this.start();
    } else {
      this.block.velocityY = -1;
    }
  }

  start() {
    this.interval = setInterval(this.render.bind(this), 1000 / 300);
  }

  reset() {
    this.resetBlockPosition();
    this.block.velocityY = this.blockOriginalVelocity;
    this.playerScore = 0;
    this.frameCounter = 0;
  }

  resetBlockPosition() {
    this.block.x = (this.canvas.width * 2 / 3 - this.block.width) / 2;
    this.block.y = (this.canvas.height - this.block.height) / 2;
  }

  stop() {
    this.gameRunning = false;
    clearInterval(this.interval);
    this.resetBlockPosition();
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

  renderGame() {
    this.drawBlock();
    this.drawPipes();
    this.writeScore();
  }

  updateGameState() {
    this.block.y += this.block.velocityY;
    this.block.velocityY += this.gravity;

    this.collidesWithSkyOrFellsDown();
    this.updatePipes();

    this.frameCounter++;
    if (this.frameCounter === this.pipesAppearAfterNFrames) {
      this.addPipes();
      this.frameCounter %= this.pipesAppearAfterNFrames;
    }
  }

  collidesWithSkyOrFellsDown() {
    const { y, height } = this.block;
    if (y <= this.offset) {
      // collided with sky
      this.stop();
    } else if (y + height >= this.canvas.height - this.offset) {
      // fell down
      this.stop();
    }
  }

  renderStartScreen() {
    const t1 = `Your score: ${this.playerScore}`;
    const t2 = 'Hit \'SPACEBAR\' to start and jump.';

    const { scoreColor, homeScreenTextColor } = this;
    const { width, height } = this.canvas;
    const x = width / 2;
    const y = height / 2;

    this.drawBlock();

    this.canvas.writeText(t1, x - 70, y + 50, 25, scoreColor);
    this.canvas.writeText(t2, x - 170, y + 90, 25, homeScreenTextColor);
  }

  writeScore() {
    const t1 = `Your score: ${this.playerScore}`;
    const { homeScreenTextColor } = this;

    this.canvas.writeText(
      t1, this.offset + 10, 16, 18, homeScreenTextColor
    );
  }

  drawBackground() {
    const { offset, backgroundColor, outlineColor, canvas } = this;
    const { width, height } = canvas;

    canvas.drawFilledRect(0, 0, width, height, backgroundColor);
    canvas.drawLine(0, offset, width, offset, 1, outlineColor);
    canvas.drawLine(0, height - offset, width, height - offset, 1, outlineColor);

  }

  drawBlock() {
    const { x, y, width, height, color } = this.block;
    this.canvas.drawFilledRect(x, y, width, height, color);
  }

  addPipes() {
    const { canvas, distanceBetweenVerticalPipes, offset } = this;
    const heightOfUpperPipe = 50 + Math.floor(Math.random() * 200);
    const startYofLowerPipe = heightOfUpperPipe + distanceBetweenVerticalPipes;

    this.pipes.push(new Pipe(canvas, canvas.width, offset, heightOfUpperPipe - offset));
    this.pipes.push(new Pipe(canvas, canvas.width, startYofLowerPipe, canvas.height - startYofLowerPipe - offset));
  }

  updatePipes() {
    this.pipes.forEach(pipe => {
      pipe.update();
      if (pipe.behind(this.block)) {
        if (pipe.passedBlock === false) {
          // We add 0.5 because 2 pipes are there. 1 horizontal & 1 vertical
          this.playerScore += 0.5;
        }
        pipe.passedBlock = true;
      }
      if (pipe.collidesWith(this.block)) {
        this.stop();
      }
    });
    this.pipes = this.pipes.filter(p => p.safeToRemoveFromArray === false);
  }

  drawPipes() {
    this.pipes.forEach(pipe => pipe.draw());
  }
}
