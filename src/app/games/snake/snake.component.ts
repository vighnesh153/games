import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { Snake } from './snake.logic';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: [
    './snake.component.scss',
    '../common-game-styling.scss'
  ]
})
export class SnakeComponent implements AfterViewInit, OnDestroy {
  title = 'Snake';
  game: Snake;

  @ViewChild('canvas') canvasElementRef: ElementRef<HTMLCanvasElement>;

  constructor() { }

  ngAfterViewInit() {
    this.game = new Snake(this.canvasElementRef.nativeElement);
    this.game.start();
  }

  onEnterPress() {
    this.game.onEnterPress();
  }

  onDownPress() {
    this.game.changeSnakeDirection('10');
  }

  onUpPress() {
    this.game.changeSnakeDirection('1000');
  }

  onLeftPress() {
    this.game.changeSnakeDirection('1');
  }

  onRightPress() {
    this.game.changeSnakeDirection('100');
  }

  ngOnDestroy() {
    this.game.stop();
  }

}
