import { Component, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { RadioFormInputElement, RadioOption } from 'src/app/components/dynamic-form/models/form-elements/radio-form-input-element.model';
import { TitleFormElement } from 'src/app/components/dynamic-form/models/form-elements/title-form-element.model';
import { GetPatientLastConsumableOrderResponse, OrderServiceProxy } from 'src/app/services/service-proxies/service-proxies';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    DynamicFormComponent,
  ],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
})
export class OrderFormComponent implements OnInit{
  @Output() formCreated = new EventEmitter<FormGroup>();

  formDefinition: DynamicForm;
  _destroyRef = inject(DestroyRef);
  lastOrder: GetPatientLastConsumableOrderResponse;


  constructor(private fb: FormBuilder,
    private _orderService: OrderServiceProxy,
  ) {
  }

  ngOnInit(): void {
    this.getLastOrderInformation();
  }

  private getLastOrderInformation(): void {
      this._orderService.getLastConsumableOrderForPatient()
        .pipe(
          takeUntilDestroyed(this._destroyRef),
          tap((response) => {
            if(response.isSuccess){
              this.lastOrder = response.resultObject;
            }
          })
        )
        .subscribe({
          next: (result) => {
            if(result.isSuccess){
              this.lastOrder = result.resultObject;
              //if the last order is not null and the last order date is less than 90 days ago, show the order form
              if(this.lastOrder && this.lastOrder.orderedDate){
                const lastOrderDate = new Date(this.lastOrder.orderedDate);
                const currentDate = new Date();
                const daysDifference = Math.floor((currentDate.getTime() - lastOrderDate.getTime()) / (1000 * 3600 * 24));
                if(daysDifference < 90){
                  this.buildPenOnlyForm();
                }else{
                  this.buildForm();
                }
              }else{
                this.buildForm();
              }
            }
          },
          error: (error) => {
            console.error('Error fetching last order information:', error);
          }
        });
    }

  private buildForm(): void {
    const needleKitOptions = [
      {
        value: '4mmNeedleKit',
        label: '4mm Needle Kit – Contains 300 x 4mm needles, 400 x alcohol wipes, 3 x sharps containers',
      },
      {
        value: '5mmNeedleKit',
        label: '5mm Needle Kit – Contains 300 x 5mm needles, 400 x alcohol wipes, 3 x sharps containers',
      },
      {
        value: '8mmNeedleKit',
        label: '8mm Needle Kit – Contains 300 x 8mm needles, 400 x alcohol wipes, 3 x sharps containers',
      },
    ];

    const penReplacementOptions = [
      {
        value: '5mgPen',
        label: '5mg Pen – Contains 1 x 5mg SurePal® Pen (white)',
      },
      {
        value: '10mgPen',
        label: '10mg Pen – Contains 1 x 10mg SurePal® Pen (green)',
      },
      {
        value: '15mgPen',
        label: '15mg Pen – Contains 1 x 15mg SurePal® Pen (blue)',
      },
    ];
    this.formDefinition = new DynamicForm([
      new TitleFormElement({ label: 'Needle Kit Options' }),
      new RadioFormInputElement({
        name: 'needleKit',
        label: 'Select a Needle Kit Option:',
        options: needleKitOptions,
        errorLabel: 'Needle Kit',
      }),
      new TitleFormElement({ label: 'Pen Replacement' }),
      new RadioFormInputElement({
        name: 'penReplacement',
        label: 'Select a Pen Replacement Option:',
        options: penReplacementOptions,
        errorLabel: 'Pen Replacement',
      }),
    ]);
  }

  private buildPenOnlyForm(): void {
    const penReplacementOptions = [
      {
        value: '5mgPen',
        label: '5mg Pen – Contains 1 x 5mg SurePal® Pen (white)',
      },
      {
        value: '10mgPen',
        label: '10mg Pen – Contains 1 x 10mg SurePal® Pen (green)',
      },
      {
        value: '15mgPen',
        label: '15mg Pen – Contains 1 x 15mg SurePal® Pen (blue)',
      },
    ];
    this.formDefinition = new DynamicForm([
      new TitleFormElement({ label: 'Pen Replacement' }),
      new RadioFormInputElement({
        name: 'penReplacement',
        label: 'Select a Pen Replacement Option:',
        options: penReplacementOptions,
        errorLabel: 'Pen Replacement',
      }),
    ]);
  }

  private atLeastOneSelected(control: AbstractControl) {
    const needleKit = control.get('needleKit')?.value;
    const penReplacement = control.get('penReplacement')?.value;
    return needleKit || penReplacement ? null : { atLeastOneRequired: true };
  }

  onFormCreated(form: FormGroup): void {
    this.formCreated.emit(form);
  }

}