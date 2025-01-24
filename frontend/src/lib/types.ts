export interface Patient {
  lastName: string;
  diagnosis: string;
}

export interface Doctor {
  lastName: string;
  firstName: string;
  office: number;
  specialty: string;
  patients: Patient[];
}
