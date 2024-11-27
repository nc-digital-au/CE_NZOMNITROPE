import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { BrandingComponent } from '../../vertical/sidebar/branding.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-horizontal-header',
  standalone: true,
  imports: [MaterialModule, RouterModule, TablerIconsModule, BrandingComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class AppHorizontalHeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  public username$ = this.auth.getUsername();
  public authenticated$ = this.auth.getIsAuthenticated();
  public anonymous$ = this.auth.getIsAnonymous();
  public logoutUrl$ = this.auth.getLogoutUrl();

  showFiller = false;

  constructor(
    private vsidenav: CoreService,
    public dialog: MatDialog,
    private auth: AuthenticationService
  ) {
    auth.getSession();
  }

  onSignoutClick(): void {
    this.auth.signOut();
  }
}

