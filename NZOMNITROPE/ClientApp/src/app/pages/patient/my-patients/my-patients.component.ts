import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { ReapprovePatientComponent } from '../reapprove-patient/reapprove-patient.component';
import { DiscontinuePatientComponent } from '../discontinue-patient/discontinue-patient.component';
import { TransferPatientComponent } from '../transfer-patient/transfer-patient.component';
import { TreatmentHistoryComponent } from '../treatment-history/treatment-history.component';
import { EligibilityCriteriaDialogComponent } from '../eligibility-criteria/eligibility-criteria-dialog/eligibility-criteria-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DocumentServiceProxy, GetPatientsForPrescriberResponse, GetPatientsForPrescriberResponseIEnumerableApiResponse, PatientServiceProxy } from 'src/app/services/service-proxies/service-proxies';
import { Observable, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as saveAs from 'file-saver';
import { AddressStateLabel, TreatmentStatusLabel } from 'src/app/utils/enums/enum-label';
import { routeLinks } from 'src/app/utils/routes';

@Component({
  selector: 'app-my-patients',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    TablerIconsModule,
    RouterLink,
    DiscontinuePatientComponent,
    TransferPatientComponent,
    TreatmentHistoryComponent,
    EligibilityCriteriaDialogComponent,
  ],
  templateUrl: './my-patients.component.html',
  styleUrl: './my-patients.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MyPatientsComponent {
  destroyRef = inject(DestroyRef);

  patientList: MatTableDataSource<GetPatientsForPrescriberResponse>;
  columnsToDisplay: string[] = [
    'Name', 'Dob', 'Status'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'Actions'];
  expandedElement: GetPatientsForPrescriberResponse | null = null;
  routeLinks = routeLinks;

  @ViewChild(MatSort) sort: MatSort = Object.create(null);
  @ViewChild(MatPaginator) paginator: MatPaginator = Object.create(null);

  patients$: Observable<GetPatientsForPrescriberResponseIEnumerableApiResponse>;

  TreatmentStatus = TreatmentStatusLabel;

  constructor(
    private dialog: MatDialog,
    private patientsService: PatientServiceProxy,
    private _documentsService: DocumentServiceProxy,
  ) {
    this.patients$ = this.patientsService.getPrescriberPatients()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(response => {
        this.patientList = new MatTableDataSource(response.resultObject);
        this.patientList.paginator = this.paginator;
        this.patientList.sort = this.sort;
      }));

  }

  filter(filterValue: string): void {
    this.patientList.filter = filterValue.trim().toLowerCase();
  }

  closeExpanded() {
    this.expandedElement = null;
  }

  openEligibilityCriteria() {
    this.dialog.open(EligibilityCriteriaDialogComponent);
  }

  onDownloadLastScriptClick(patientId: string): void {
    this._documentsService.perscription(patientId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((response) => {
          saveAs(response.data, response.fileName);
        }),
      )
      .subscribe();
  }
}
