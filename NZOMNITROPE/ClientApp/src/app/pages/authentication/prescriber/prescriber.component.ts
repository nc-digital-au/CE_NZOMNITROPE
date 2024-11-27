import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-prescriber',
  standalone: true,
  imports: [
    RouterOutlet,
  ],
  templateUrl: './prescriber.component.html',
  styleUrl: './prescriber.component.scss'
})
export class PrescriberComponent {

}
