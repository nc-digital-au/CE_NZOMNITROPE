import { Title } from "../enums/ofev-data";

export interface NominatedPrescriber{
    
    title: Title;
    firstName: string;
    lastName: string;
    email: string;
    clinicName: string;
    clinicNumber: string;
}