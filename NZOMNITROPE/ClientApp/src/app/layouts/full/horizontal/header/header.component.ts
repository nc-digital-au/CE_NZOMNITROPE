import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { MatDialog } from '@angular/material/dialog';
import { navItems } from '../../vertical/sidebar/sidebar-data';
import { TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { BrandingComponent } from '../../vertical/sidebar/branding.component';
import { FormsModule } from '@angular/forms';
import { AppSettings } from 'src/app/config';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonModule } from '@angular/common';

interface notifications {
  id: number;
  icon: string;
  color: string;
  title: string;
  time: string;
  subtitle: string;
}

interface inbox {
  id: number;
  bgcolor: string;
  imagePath: string;
  title: string;
  time: string;
  subtitle: string;
}

interface profiledd {
  id: number;
  title: string;
  link: string;
  new?: boolean;
}

interface apps {
  id: number;
  icon: string;
  color: string;
  title: string;
  subtitle: string;
  link: string;
}

interface quicklinks {
  id: number;
  title: string;
  link: string;
}

@Component({
  selector: 'app-horizontal-header',
  standalone: true,
  imports: [RouterModule, TablerIconsModule, MaterialModule, BrandingComponent, CommonModule],
  templateUrl: './header.component.html',
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

  showFiller = false;
  
  constructor(
    private settings: CoreService,
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

