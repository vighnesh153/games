import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  gamesComponents: {
    title: string,
    link: string,
    image: string
  }[];

  constructor(private utilityService: UtilityService) { }

  ngOnInit(): void {
    this.utilityService.displayBackButton.next(false);
  }

  ngOnDestroy(): void {
    this.utilityService.displayBackButton.next(true);
  }

}
