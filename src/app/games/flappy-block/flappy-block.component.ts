import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit, ViewChild
} from '@angular/core';

import { FlappyBlock } from './flappy-block.logic';

@Component({
  selector: 'app-flappy-block',
  templateUrl: './flappy-block.component.html',
  styleUrls: [
    './flappy-block.component.scss',
    '../common-game-styling.scss'
  ]
})
export class FlappyBlockComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'Flappy Block';
  game: FlappyBlock;

  @ViewChild('canvas') canvasElementRef: ElementRef<HTMLCanvasElement>;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.game = new FlappyBlock(this.canvasElementRef.nativeElement);
    this.game.start();
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.code === 'Space') {
      this.game.onSpacePress();
    }
  }

  ngOnDestroy(): void {
    if (this.game) {
      this.game.stop();
    }
  }

}
