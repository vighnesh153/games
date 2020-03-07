import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Pong } from './pong.logic';

@Component({
  selector: 'app-pong',
  templateUrl: './pong.component.html',
  styleUrls: ['./pong.component.scss']
})
export class PongComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'Pong';
  game: Pong;

  @ViewChild('canvas') canvasElementRef: ElementRef<HTMLCanvasElement>;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.game = new Pong(this.canvasElementRef.nativeElement);
    this.game.start();
  }

  onEnterPress() {
    this.game.onEnterPress();
  }

  onEscapePress() {
    this.game.onEscapePress();
  }

  onHover(event: MouseEvent) {
    this.game.onHover(event);
  }

  ngOnDestroy() {
    this.game.stop();
  }

}
