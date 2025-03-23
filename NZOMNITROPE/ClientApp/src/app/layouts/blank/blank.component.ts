import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { AppSettings } from 'src/app/config';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LeavingSiteComponent } from 'src/app/components/leaving-site/leaving-site.component';
import { HeaderComponent } from '../full/vertical/header/header.component';
import { AppHorizontalHeaderComponent } from '../full/horizontal/header/header.component';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { ContactUsComponent } from 'src/app/components/contact-us/contact-us.component';
import { CONTACT_VALUES } from 'src/app/utils/constants';

@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrls: [],
  imports: [
    RouterOutlet, 
    CommonModule,
    LeavingSiteComponent,
    HeaderComponent,
    AppHorizontalHeaderComponent
  ],
})
export class BlankComponent {
  private htmlElement!: HTMLHtmlElement;
  contactValue = CONTACT_VALUES;
  options = this.settings.getOptions();
  isContentWidthFixed: boolean;
  isCollapsedWidthFixed: boolean;
  isOver: any;

  public sidenav: MatSidenav;

  constructor(private settings: CoreService, private dialog: MatDialog) {
    this.htmlElement = document.querySelector('html')!;
    // Initialize project theme with options
  }

  openContactUs(){
    this.dialog.open(ContactUsComponent);
  }

  toggleCollapsed() {
    this.isContentWidthFixed = false;
    this.options.sidenavCollapsed = !this.options.sidenavCollapsed;
    this.resetCollapsedState();
  }

  resetCollapsedState(timer = 400) {
    setTimeout(() => this.settings.setOptions(this.options), timer);
  }

  onSidenavClosedStart() {
    this.isContentWidthFixed = false;
  }

  onSidenavOpenedChange(isOpened: boolean) {
    this.isCollapsedWidthFixed = !this.isOver;
    this.options.sidenavOpened = isOpened;
    this.settings.setOptions(this.options);
  }
}
