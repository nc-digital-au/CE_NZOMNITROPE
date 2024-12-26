import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { MaterialModule } from 'src/app/material.module';
import { DocumentServiceProxy, PrescriptionServiceProxy } from 'src/app/services/service-proxies/service-proxies';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, Observable, switchMap, tap } from 'rxjs';
import * as saveAs from 'file-saver';

@Component({
  selector: 'app-prescription',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    SvgIconComponent,
  ],
  templateUrl: './prescription.component.html',
  styleUrl: './prescription.component.scss'
})
export class PrescriptionComponent implements AfterViewInit {
  @Input({required:true})
  patientId: string;

  @Output()
  downloaded = new EventEmitter();

  @ViewChild('scriptViewerEl')
  scriptViewerEl: ElementRef;

  destroyRef = inject(DestroyRef);
  scriptTemplate: string;
  templateScript: string;
  downloading = false;

  constructor(
    private readonly _documentsService: DocumentServiceProxy,
    private readonly _prescriptionService: PrescriptionServiceProxy,
  ) {
  }

  ngAfterViewInit(): void {
    if (this.scriptViewerEl) {
      const scriptViewerEl = this.scriptViewerEl.nativeElement as HTMLDivElement;
      this._prescriptionService.getLatestScript(this.patientId)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
        ).subscribe((response) => {
          scriptViewerEl.innerHTML = response.resultObject;
        });
    }
  }

  onDownloadPrescriptionClick(): void {
    this.downloading = true;
    this._documentsService.perscription(this.patientId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((response) => {
          this.downloaded.emit();
          console.log('emit close');
          saveAs(response.data, response.fileName);
        }),
        finalize(() => {
          this.downloading = false;
        }),
      )
      .subscribe();
  }
}
