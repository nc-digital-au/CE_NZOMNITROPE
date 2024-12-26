import {
  Component,
  OnInit,
  Input,
} from '@angular/core';
import { Router } from '@angular/router';
import { NavService } from '../../../../../services/nav.service';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule } from '@angular/common';
import { NavItem } from '../../../vertical/sidebar/nav-item/nav-item';
import { MatDialog } from '@angular/material/dialog';
import { LeavingSiteDialog } from 'src/app/components/leaving-site/leaving-site.component';

@Component({
  selector: 'app-horizontal-nav-item',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, CommonModule],
  templateUrl: './nav-item.component.html',
})
export class AppHorizontalNavItemComponent implements OnInit {
  @Input() depth: any;
  @Input() item: NavItem;

  constructor(
    public navService: NavService,
    public router: Router,
    private _dialog: MatDialog
  ) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnInit() {}

  onItemSelected(item: NavItem) {
    if (!item.external) {
      if (!item.children || !item.children.length) {
        this.router.navigate([item.route]);
      }
    } else if (item.target === '_blank') {
      window.open(item.route, '_blank');
    } else {
      this._dialog.open(LeavingSiteDialog, {
        data: {
          url: item.route,
        },
      });
    }
  }
}
