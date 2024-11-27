import { Component, Inject, inject, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarRef } from '@angular/material/snack-bar';

export interface IToastAlertData {
  message: string;
}

@Component({
  selector: 'app-toast-alert',
  standalone: true,
  imports: [
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction,
    MatButton,
  ],
  templateUrl: './toast-alert.component.html',
  styleUrl: './toast-alert.component.scss'
})
export class ToastAlertComponent {
  snackBarRef = inject(MatSnackBarRef);

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: IToastAlertData) {
    
  }
}
