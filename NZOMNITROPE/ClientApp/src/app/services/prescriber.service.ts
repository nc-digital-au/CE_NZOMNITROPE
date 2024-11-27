import { Injectable } from '@angular/core';
import { Prescriber } from '../pages/patient/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PrescriberService {

  constructor() { }

  getPrescriber(){
    let prescriber : Prescriber = {
      id: '1345788',
      prescriberNumber: '1234567',
      name: 'Frank Miller',
      clinicName: 'Miller Street Private Practice',
      phoneNumber: '0290876544'
    }

    return prescriber;
  }
}
