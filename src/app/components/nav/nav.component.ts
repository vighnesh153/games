import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {
  displayBackButton: boolean;
  displayBackButtonSubscription: Subscription;

  constructor(private utilityService: UtilityService) {
    this.displayBackButtonSubscription = this.utilityService.displayBackButton
      .subscribe(value => {
        this.displayBackButton = value;
      });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.displayBackButtonSubscription.unsubscribe();
  }

}
