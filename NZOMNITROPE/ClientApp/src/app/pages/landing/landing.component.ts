import { ViewportScroller } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { routeLinks } from 'src/app/utils/routes';
import { CONTACT_VALUES } from 'src/app/utils/constants';
import { LeavingSite, LeavingSiteComponent } from 'src/app/components/leaving-site/leaving-site.component';

interface apps {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  link: string;
}

interface quicklinks {
  id: number;
  title: string;
  link: string;
}

interface demos {
  id: number;
  name: string;
  url: string;
  imgSrc: string;
}

interface testimonials {
  id: number;
  name: string;
  subtext: string;
  imgSrc: string;
}

interface features {
  id: number;
  icon: string;
  title: string;
  subtext: string;
}

@Component({
  selector: 'app-landing',
  // standalone: true,
  // imports: [
  // ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
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
    private scroller: ViewportScroller
  ) {}
}
