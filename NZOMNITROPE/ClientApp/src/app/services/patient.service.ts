import { Injectable } from '@angular/core';
import { Discontinuation, MyPatient, Patient, TreatmentEvent } from '../pages/patient/patient.model';
import { AddressState, AddressType, Dosage, Gender, PatientStatus, RepeatOptionLabel, Title, TreatmentEventType } from '../utils/enums/ofev-data';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor( private http: HttpClient) { }

  getPatients(){
    let myPatients : MyPatient[] = [
      {
        id: '1',
        name: 'Percy Robins',
        dateOfBirth: new Date(1982,12,12),
        status: PatientStatus.Active,
        canReapprove: true,
      },
      {
        id: '2',
        name: 'Harry Lau',
        dateOfBirth: new Date(1982,12,12),
        status: PatientStatus.Reapproved,
        canReapprove: true,
      },
      {
        id: '3',
        name: 'Orlando Benison',
        dateOfBirth: new Date(1982,12,12),
        status: PatientStatus.Discontinued,
        canReapprove: true,
      },
      {
        id: '4',
        name: 'Kathy Chi',
        dateOfBirth: new Date(1982,12,12),
        status: PatientStatus.Active,
        canReapprove: true,
      },
    ];

    return myPatients;
  }

  getPatientDetails(id: string){
    let patient : Patient = {
        id: '1',
        title: Title.Ms,
        firstName: 'Kathy',
        lastName: 'Lineman',
        dateOfBirth: new Date(1988, 12, 2),
        gender: Gender.Female,
        status: PatientStatus.Active,
        contactInformation: {
          email: 'kathy@testpatient.com.au',
          phone: '0294097600',
          mobile: '0413095667'
        },
        delivery:{
          streetAddress: '23 Wayland Way',
          city: 'Westmead',
          addressState: AddressState.NSW,
          postcode: '2345',
          addressType: AddressType.Delivery
        },
        prescriber:{
          name: 'Dr John Hastings',
          prescriberNumber:'7889999',
          id: '23',
          clinicName: 'Dr John Hastings Clinic',
          phoneNumber: '0287654567'
        },
        prescription:{
          dose: Dosage.D100,
          repeats: RepeatOptionLabel.None,
          instructions: ''
        },
        carer:{
          title: Title.Mrs,
          firstName: 'Betty',
          lastName: 'Donaldson',
          contactInformation: {
            phone: '0294007600'
        }
      }
    };

    return patient;
  }

  getPatientInformation(id: string){
    let patient : Discontinuation = {
      id: '1',
      patient: {
        title: Title.Ms,
        firstName: 'Kathy',
        lastName: 'Lineman',
        dateOfBirth: new Date(1988, 12, 2),
        gender: Gender.Female,
      },
      contactInformation: {
        email: 'kathy@testpatient.com.au',
        phone: '0294097600',
        mobile: '0413095667'
      }
    };

    return patient;
  }

  getTreatmentHistory(id: string){
    const history: TreatmentEvent[] = [
      {
        eventDate: new Date(2024, 6, 12),
        eventName: TreatmentEventType.reapproved,
        actionedBy: 'John Thompson',
        prescription: {
          dose: Dosage.D150,
          repeats: RepeatOptionLabel.Five
        }
      },
      {
        eventDate: new Date(2024, 6, 12),
        eventName: TreatmentEventType.enrolled,
        actionedBy: 'John Thompson',
        prescription: {
          dose: Dosage.D100,
          repeats: RepeatOptionLabel.None
        }
      }
    ];

    return history;
  }

}
