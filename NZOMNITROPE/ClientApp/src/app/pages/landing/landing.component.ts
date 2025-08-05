import { ViewportScroller } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { routeLinks } from 'src/app/utils/routes';
import { CONTACT_VALUES } from 'src/app/utils/constants';
import { ActivatedRoute, RouterLink } from '@angular/router';


@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LandingComponent {
  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  options = this.settings.getOptions();
  routeLinks = routeLinks;
  contactValues = CONTACT_VALUES; 

  constructor(
    private settings: CoreService,
    private scroller: ViewportScroller,
    private route: ActivatedRoute
  ) {}

  loginButtonClicked(){
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    const loginUrl = `/.auth/login`;
    window.location.href = loginUrl;
  }
}
