import { Injectable } from '@angular/core';
import { PDF_IMAGES, PDF_SETTINGS } from '../utils/constants';
import jsPDF from 'jspdf';
import { Font} from './font.service';
import { Enrolment, Patient, Script } from '../pages/patient/patient.model';
import { contactNumberToString, deliveryAddressToString } from '../utils/helpers/form-helper';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  constructor() { }

  getPrescription(patient: Patient){
    let today = Date();
    return {
      issueDate: today,
      prescriber: patient.prescriber,
      patientName: `${patient.title} ${patient.firstName} ${patient.lastName}`,
      patientDateOfBirth: patient.dateOfBirth.toDateString(),
      patientContact: contactNumberToString(patient.contactInformation),
      drugName: 'OFEV®',
      dosage: patient.prescription.dose,
      repeats: patient.prescription.repeats,
      instructions: patient.prescription.instructions,
      deliveryAddress: deliveryAddressToString(patient.delivery)
    };
  }

  getInitialPrescription(patient: Enrolment){
    console.log(patient);
    let today = Date();
    return {
      issueDate: today,
      prescriber: patient.prescriber,
      patientName: `${patient.title} ${patient.firstName} ${patient.lastName}`,
      patientDateOfBirth: patient.dateOfBirth.toDateString(),
      patientContact: contactNumberToString(patient.contactInformation),
      drugName: 'OFEV®',
      dosage: patient.prescription.dose,
      repeats: patient.prescription.repeats,
      instructions: patient.prescription.instructions,
      deliveryAddress: deliveryAddressToString(patient.delivery)
    };
  }

  generateScript(fonts: Font[]){
    
    const doc = new jsPDF();
    // add header font
    const headerFont = fonts[0];
    doc.addFileToVFS(headerFont.ttfName, headerFont.base64);
    doc.addFont(headerFont.ttfName, headerFont.fontName, headerFont.fontWeight);
    doc.setFontSize(16);
    // page header
    doc.setFillColor(PDF_SETTINGS.COLOR_GREEN_ONE);
    doc.rect(0,0,210, 25, 'F');
    doc.addImage(PDF_IMAGES.SYMBOL, 'PNG', 15, 8, 12,12);
    doc.addImage(PDF_IMAGES.OFEV_LOGO, 'PNG', 170, 30, 20, 8.3);
    doc.setTextColor(PDF_SETTINGS.COLOR_ACCENT_ONE);
    doc.text('Boehringer Ingelheim Medicines Request Program',50,15);
    // header 2
    doc.setFontSize(14);
    doc.setTextColor(PDF_SETTINGS.COLOR_TEXT);
    doc.text('Prescription for OFEV®', 15, 35);
    doc.save('prescription');
    
  }
}
