import { AddressState, Gender, Profession, Specialty, Title, TreatmentStatus } from "src/app/services/service-proxies/service-proxies";

export const TreatmentStatusLabel: { [key in TreatmentStatus]: string } = {
  [TreatmentStatus.ApprovalRequired]: "Approval Required",
  [TreatmentStatus.Approved]: "Approved",
  [TreatmentStatus.EvaluationPending]: "Evaluation Pending",
  [TreatmentStatus.Suspended]: "Suspended",
  [TreatmentStatus.Discontinued]: "Discontinued",
  [TreatmentStatus.OnContinuedSupply]: "Re-approved",
  [TreatmentStatus.Completed]: "Completed",
  [TreatmentStatus.TransferRequested]: "Transfer Requested",
  [TreatmentStatus.Grandfathered]: "Grandfathered",
};

export const GenderLabel: { [key in Gender]: string } = {
  [Gender.Female]: "Female",
  [Gender.Male]: "Male",
  [Gender.Transgender]: "Transgender",
  [Gender.GenderNeutral]: "Gender Neutral",
  [Gender.NonBinary]: "Non Binary",
  [Gender.Agender]: "Agender",
  [Gender.Pangender]: "Pangender",
  [Gender.Genderqueer]: "Genderqueer",
  [Gender.NotSpecified]: "Not Specified",
};

export const TitleLabel: { [key in Title]: string } = {
  [Title.AssocProf]: "Assc Prof",
  [Title.Dr]: "Dr",
  [Title.Mr]: "Mr",
  [Title.Mrs]: "Mrs",
  [Title.Ms]: "Ms",
  [Title.Prof]: "Prof",
  [Title.Unknown]: "Uknown",
  [Title.Mx]: "Mx",
  [Title.Miss]: "Miss",
};

export const ProfessionLabel: { [key in Profession]: string } = {
  [Profession.AboriginalTorresStraitIslanderHP]: "Aboriginal and Torres Strait Islander health practice",
  [Profession.ChineseMedicine]: "Chinese medicine",
  [Profession.Chiropractic]: "Chiropractic",
  [Profession.Dental]: "Dental",
  [Profession.MedicalPractitioner]: "Medical practitioner",
  [Profession.MedicalRadiation]: "Medical radiation",
  [Profession.Nursing]: "Nursing",
  [Profession.Midwifery]: "Midwifery",
  [Profession.OccupationalTherapy]: "Occupational therapy",
  [Profession.Optometry]: "Optometry",
  [Profession.Osteopathy]: "Osteopathy",
  [Profession.Paramedicine]: "Paramedicine",
  [Profession.Pharmacy]: "Pharmacy",
  [Profession.Physiotherapy]: "Physiotherapy",
  [Profession.Podiatry]: "Podiatry",
  [Profession.Psychology]: "Psychology",
  [Profession.Other]: "Other",
  [Profession.Unknown]: "Unknown",
};

export const SpecialtyLabel: { [key in Specialty]: string } = {
  [Specialty.Cardiologist]: "Cardiologist",
  [Specialty.Endocrinologist]: "Endocrinologist",
  [Specialty.GeneralPhysician]: "General Physician",
  [Specialty.GeneralPractitioner]: "General Practitioner",
  [Specialty.Pharmacist]: "Pharmacist",
  [Specialty.Other]: "Other",
  [Specialty.Unknown]: "Unknown",
  [Specialty.Haematologist]: "Haematologist",
  [Specialty.Oncologist]: "Onocologist",
};

export const AddressStateLabel: { [key in AddressState]: string } = {
  [AddressState.ACT]: "ACT",
  [AddressState.NSW]: "NSW",
  [AddressState.NT]: "NT",
  [AddressState.QLD]: "QLD",
  [AddressState.SA]: "SA",
  [AddressState.TAS]: "TAS",
  [AddressState.VIC]: "VIC",
  [AddressState.WA]: "WA",
  [AddressState.NA]: "N/A",
};