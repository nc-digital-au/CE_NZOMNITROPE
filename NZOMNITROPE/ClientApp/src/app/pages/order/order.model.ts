import { ContactInformation } from "src/app/components/contact-information/contact-information.model";
import { Dosage, Gender, PatientStatus, RepeatOption, RepeatOptionLabel, Title, TreatmentEventType } from "src/app/utils/enums/ofev-data";
import { Address } from "src/app/utils/models/address.model";
import { NominatedPrescriber } from "src/app/utils/models/prescriber.model";

export interface Patient{
    id: string;
    title: Title;
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: Date;
    gender: Gender;
    status: PatientStatus;
    contactInformation: ContactInformation;
    carer?: Carer;
    prescription: Prescription;
    delivery: Address;
    prescriber: Prescriber
}

export interface Enrolment{
    title: Title;
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: Date;
    gender: Gender;
    contactInformation?: ContactInformation;
    carer?: Carer;
    prescription?: Prescription;
    delivery?: Address;
    prescriber: Prescriber
}

export interface Discontinuation{
    id: string;
    patient: PatientInfo;
    contactInformation: ContactInformation;
}

export interface Carer{
    title: Title;
    firstName: string;
    lastName: string;
    middleName?: string;
    contactInformation: ContactInformation;
}

export interface DiscontinuationReason{
    description: string;
    id: number;
}

export interface Prescription{
    dose: Dosage;
    instructions?: string;
    repeats: RepeatOptionLabel;
}

export interface Prescriber{
    id: string;
    name: string;
    prescriberNumber: string;
    clinicName: string;
    phoneNumber: string;
}

export interface Script{
    issueDate: string;
    prescriber: Prescriber;
    patientName: string;
    patientDateOfBirth: string;
    patientContact: string;
    drugName: string;
    dosage: string;
    repeats: string;
    instructions?: string;
    deliveryAddress: string;
}

export interface MyPatient{
    id: string;
    name: string;
    dateOfBirth: Date;
    status: PatientStatus;
    canReapprove: boolean;
}

export interface PatientInfo{
    title: Title;
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: Date;
    gender: Gender;
}

export interface PatientTransfer{
    patient: Patient;
    prescriber: NominatedPrescriber
}

export interface TreatmentEvent{
    eventDate: Date;
    eventName: TreatmentEventType;
    actionedBy?: string;
    prescription?: Prescription;
}
