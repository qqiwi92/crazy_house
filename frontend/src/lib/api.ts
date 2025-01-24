import axios from "axios"
import { Doctor } from "./types"

const API_URL = "http://localhost:5000"

export const api = {
  addDoctor: (doctor: Doctor) => axios.post(`${API_URL}/add`, doctor),
  removeDoctor: (lastName: string, firstName: string) =>
    axios.delete(`${API_URL}/remove`, { data: { last_name: lastName, first_name: firstName } }),
  editDoctor: (lastName: string, firstName: string, updates: any) =>
    axios.put(`${API_URL}/edit`, { last_name: lastName, first_name: firstName, updates }),
  getDoctorsBySpecialty: (specialty: string) => axios.get(`${API_URL}/specialty/${specialty}`),
  getDoctorsByPatient: (lastName: string) => axios.get(`${API_URL}/patient/${lastName}`),
  getDoctorsByOffice: (office: number) => axios.get(`${API_URL}/office/${office}`),
  getOfficesBySpecialty: (specialty: string) => axios.get(`${API_URL}/offices/${specialty}`),
  getTopSpecialties: () => axios.get(`${API_URL}/top-specialties`),
  getTopDoctors: () => axios.get(`${API_URL}/top-doctors`),
  getLeastBusyDoctors: () => axios.get(`${API_URL}/least-busy`),
}

