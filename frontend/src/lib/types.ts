export interface Patient {
  last_name: string;
  diagnosis: string;
}

export interface Doctor {
    surname: string;
    name: string;
    room: string;
    specialty: string;
    patients: Patient[];
  }
  