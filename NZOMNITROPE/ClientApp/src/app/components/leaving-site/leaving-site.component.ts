import { Component, Inject, Input} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-leaving-site',
  standalone: true,
  imports: [
    MaterialModule
  ],
  templateUrl: './leaving-site.component.html',
  styleUrl: './leaving-site.component.scss'
})
export class LeavingSiteComponent {
  
  @Input({required: true}) linkUrl = '';
  @Input({required: true}) linkLocation = '';

  constructor(public dialog: MatDialog){}

  openDialog(){
    this.dialog.open(LeavingSiteDialog, {
      data: {
        location: this.linkLocation,
        url: this.linkUrl
      }
    })
  }
}

@Component({
  selector: 'leaving-site-dialog',
  templateUrl:'./leaving-site-dialog.html',
  standalone: true,
  imports:[
    MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose
  ],
})
export class LeavingSiteDialog{
  constructor(@Inject(MAT_DIALOG_DATA) public data: LeavingSite){}
}

export interface LeavingSite{
  location: string;
  url: string;
}
