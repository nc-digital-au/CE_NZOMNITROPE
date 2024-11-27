import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { GetPatientEventListResponse, TreatmentServiceProxy } from 'src/app/services/service-proxies/service-proxies';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-treatment-history',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
  ],
  templateUrl: './treatment-history.component.html',
  styleUrl: './treatment-history.component.scss',
})
export class TreatmentHistoryComponent implements OnInit {
  @Input({ required: true })
  patientId: string;

  treatmentHistory$: Observable<GetPatientEventListResponse[]>;

  constructor(
    private readonly _treatmentService: TreatmentServiceProxy,
  ) { }

  ngOnInit(): void {
    this.treatmentHistory$ = this._treatmentService.getTreatmentHistory(this.patientId)
      .pipe(
        map((response) => {
          return response.resultObject;
        }),
      );
  }
}
