import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { BrickBreaker } from './brick-breaker.logic';

@Component({
  selector: 'app-brick-breaker',
  templateUrl: './brick-breaker.component.html',
  styleUrls: [
    './brick-breaker.component.scss',
    '../common-game-styling.scss'
  ]
})
export class BrickBreakerComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'Brick Breaker';
  game: BrickBreaker;

  @ViewChild('canvas') canvasElementRef: ElementRef<HTMLCanvasElement>;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.game = new BrickBreaker(this.canvasElementRef.nativeElement);
    this.game.start();
  }

  onEnterPress() {
    this.game.onEnterPress();
  }

  onHover(event: MouseEvent) {
    this.game.onHover(event);
  }

  ngOnDestroy(): void {
    this.game.stop();
  }

}
