import {
  Component,
  OnInit,
  Input,
} from '@angular/core';
import { Router } from '@angular/router';
import { NavService } from '../../../../../services/nav.service';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NavItem } from '../../../vertical/sidebar/nav-item/nav-item';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { routeLinks } from 'src/app/utils/routes';
import { MatDialog } from '@angular/material/dialog';
import { LeavingSiteDialog } from 'src/app/components/leaving-site/leaving-site.component';

@Component({
    selector: 'app-horizontal-nav-item',
    standalone: true,
    imports: [TablerIconsModule, CommonModule, MatIconModule],
    templateUrl: './nav-item.component.html'
})
export class AppHorizontalNavItemComponent implements OnInit {
  @Input() depth: any;
  @Input() item: NavItem;

  constructor(
    private authenticationSvc: AuthenticationService,
    public navService: NavService, 
    public router: Router,
    private _dialog: MatDialog,) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnInit() { }
  onItemSelected(item: any) {
    if(item.logout){
      this.authenticationSvc.getIsAuthenticated().subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          this.authenticationSvc.getLogoutUrl().subscribe((logoutUrl) => {
            if (logoutUrl) {
              window.location.href = `${logoutUrl}&returnUrl=/landing`;
            } else {
              this.authenticationSvc.signOut();
              this.router.navigate([routeLinks.landing]);
            }
          });
        } else {
          this.router.navigate([routeLinks.landing]);
        }
      });
    }
    else if (!item.external) {
      if (!item.children || !item.children.length) {
        if(item.isPdf) {
          window
            .open(item.route, '_blank');
        } 
        else {
          this.router.navigate([item.route]);
        }
      }
    } 
    else {
      this._dialog.open(LeavingSiteDialog, {
        data: { url: item.route },
      });
    }
  }
}
