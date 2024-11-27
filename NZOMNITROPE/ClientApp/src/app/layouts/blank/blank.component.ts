import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { AppSettings } from 'src/app/app.config';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blank',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './blank.component.html',
  styleUrls: [],
})
export class BlankComponent {
  private htmlElement!: HTMLHtmlElement;

  constructor(private settings: CoreService) {
    this.htmlElement = document.querySelector('html')!;
  }
}
