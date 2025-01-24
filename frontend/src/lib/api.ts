import axios from "axios";
import { Doctor } from "./types";

const API_URL = "http://localhost:5000";

export const api = {
  addDoctor: (doctor: Doctor) =>
    axios.post(`${API_URL}/doctors/add`, {
      surname: doctor.surname,
      name: doctor.name,
      room: doctor.room,
      specialty: doctor.specialty,
      patients: doctor.patients,
    }),

  removeDoctor: (lastName: string, firstName: string) =>
    axios.delete(`${API_URL}/doctors/delete`, {
      data: { surname: lastName, name: firstName },
    }),

  editDoctor: (lastName: string, firstName: string, updates: Partial<Doctor>) =>
    axios.put(`${API_URL}/doctors/edit`, {
      surname: lastName,
      name: firstName,
      updated_info: updates,
    }),

  getDoctorsBySpecialty: (specialty: string) =>
    axios.get(`${API_URL}/doctors/specialty/${specialty}`),

  getDoctorsByPatient: (patientLastName: string) =>
    axios.get(`${API_URL}/doctors/patient/${patientLastName}`),

  getDoctorsByRoom: (room: number) =>
    axios.get(`${API_URL}/doctors/room/${room}`),

  getRoomsBySpecialty: (specialty: string) =>
    axios.get(`${API_URL}/rooms/specialty/${specialty}`),

  getDoctorsByPatientCount: () =>
    axios.get(`${API_URL}/doctors/many-patients`),

  getTopSpecialties: () =>
    axios.get(`${API_URL}/specialties/top`),

  getDoctorsWithLeastClients: () =>
    axios.get(`${API_URL}/doctors/least-clients`),
};
