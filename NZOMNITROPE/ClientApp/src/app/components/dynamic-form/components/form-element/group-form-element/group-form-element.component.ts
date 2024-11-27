import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormElement } from '../../../models/form-elements/form-element.model';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { FormElementComponent } from '../form-element.component';
import { MatError } from '@angular/material/form-field';
import { GroupFormElement } from '../../../models/form-elements/group-form-element.model';

@Component({
  selector: 'app-group-form-element',
  standalone: true,
  imports: [
    forwardRef(() => FormElementComponent),
    MatError,
  ],
  templateUrl: './group-form-element.component.html',
  styleUrl: './group-form-element.component.scss'
})
export class GroupFormElementComponent implements OnInit {
  @Input()
  set formElement(value: FormElement) {
    this.groupFormElement = value as any;
  }

  @Input()
  form: FormGroup;

  @Input()
  tempForm: FormGroupDirective;

  formClass: string;

  groupFormElement: GroupFormElement;

  private totalColumns = 12;

  ngOnInit(): void {
    if (this.groupFormElement?.children && this.groupFormElement.children.length) {
      const cols = this.totalColumns / this.groupFormElement.children.length;
      this.formClass = `col-lg-${cols} col-sm-12`;
    }
  }
}
