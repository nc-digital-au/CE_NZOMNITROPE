export enum Title {
  AssocProfessor = 'Assc Prof',
  Doctor = 'Dr',
  Mr = 'Mr',
  Mrs = 'Mrs',
  Ms = 'MS',
  Mx = 'MX',
  Professor = 'Prof'
}

export enum RegistrationMethod {
  Portal = 'Portal',
  Paper = 'Paper form',
  Phone = 'Phone',
  Email = 'Email',
  Other = 'Other'
}

export enum Profession {
  MedicalPractitioner = 'Medical Practitioner',
  Pharmacist = 'Pharmacist'
}

export enum Specialty {
  GP = 'GP',
  Oncologist = 'Oncologist',
  Pharmacist = 'Pharmacist',
  Specialist = 'Specialist'
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  NonBinary = 'Non-binary'
}

export enum RegistrationStatus {
  Submitted = 'submitted',
  Verified = 'verified',
  Approved = 'approved',
  Archived = 'archived'
}

export enum PatientStatus {
  Active = 'Active',
  Discontinued = 'Discontinued',
  Reapproved = 'Patient reapproved'
}

export enum EntityType {
  Carer = 'carer',
  Patient = 'patient',
  Pharmacist = 'pharmacist',
  Prescriber = 'prescriber',
  ProgramAdmin = 'program admin',
  User = 'user',
  Clinic = 'clinic',
  Pharmacy = 'pharmacy'
}

export enum AddressState {
  ACT = '1',
  NSW = '2',
  NT = '3',
  QLD = '4',
  SA = '5',
  TAS = '6',
  VIC = '7',
  WA = '8'
}

export enum AddressType {
  Business = 'business',
  Delivery = 'delivery',
  Postal = 'postal'
}

export enum PreferredContactMethod {
  Email = 'email',
  Phone = 'phone',
  Mobile = 'mobile',
  Any = 'any',
}

export enum DeleteUserReason {
  Duplicate = 'Duplicate entry',
  Error = 'Incorrect entry',
  Requested = 'Deletion requested'
}

export enum InstitutionType {
  Clinic = 'Medical clinic',
  Pharmacy = 'Pharmacy'
}

export enum ProgramStatus {
  Nominated = 'nominated',
  Approved = 'approved',
  Archived = 'archived'
}

export enum ContactMethod {
  Phone = 'phone',
  Message = 'message',
  Email = 'email',
  Post = 'post'
}

export enum ContactUserType {
  Patient = 'patient',
  Prescriber = 'prescriber',
  Pharmacist = 'pharmacist',
  ProgramAdmin = 'programadmin',
  Carer = 'carer',
  AlliedHcp = 'alliedhcp',
  Hcp = 'hcp',
  Other = 'other'
}

export enum ContactType {
  Outbound = 'outbound',
  Inbound = 'inbound',
  System = 'system'
}

export enum DosageLabel {
  D100 = '100mg',
  D150 = '150mg',
}

export enum Dosage {
  D100 = 1,
  D150 = 2,
}

export enum RepeatOptionLabel {
  None = 'No repeats Single prescription',
  Two = '1 script  + 2 repeats',
  Five = '1 script + 5 repeats'
}

export enum RepeatOption {
  None = 0,
  Two = 2,
  Five = 5,
}

export enum TreatmentEventType {
  enrolled = 'Enrolled',
  reapproved = 'Reapproved',
  transferred = 'Transferred',
  discontinued = 'Discontinued',
  reactivated = 'Reactivated'
}