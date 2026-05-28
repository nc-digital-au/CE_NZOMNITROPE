import { Component } from '@angular/core';
import { MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { CONTACT_VALUES } from 'src/app/utils/constants';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {
  contactValues = CONTACT_VALUES;
}
