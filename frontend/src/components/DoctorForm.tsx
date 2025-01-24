import type React from "react"
import { useState } from "react"
import { api } from "../lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import type { Doctor, Patient } from "@/lib/types"

const PatientInput: React.FC<{
  patient: Patient
  onChange: (patient: Patient) => void
  onRemove: () => void
}> = ({ patient, onChange, onRemove }) => {
  return (
    <div className="space-y-2 border p-4 rounded-md">
      <div className="space-y-2">
        <Label htmlFor="last_name">Patient Last Name</Label>
        <Input
          id="last_name"
          name="last_name"
          value={patient.last_name}
          onChange={(e) => onChange({ ...patient, last_name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="diagnosis">Diagnosis</Label>
        <Input
          id="diagnosis"
          name="diagnosis"
          value={patient.diagnosis}
          onChange={(e) => onChange({ ...patient, diagnosis: e.target.value })}
          required
        />
      </div>
      <Button type="button" variant="destructive" onClick={onRemove}>
        Remove Patient
      </Button>
    </div>
  )
}

const DoctorForm: React.FC = () => {
  const [doctor, setDoctor] = useState<Doctor>({
    surname: "",
    name: "",
    room: "",
    specialty: "",
    patients: [],
  })

  const [patients, setPatients] = useState<Patient[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value })
  }

  const handleAddPatient = () => {
    setPatients([...patients, { last_name: "", diagnosis: "" }])
  }

  const handlePatientChange = (index: number, updatedPatient: Patient) => {
    const updatedPatients = [...patients]
    updatedPatients[index] = updatedPatient
    setPatients(updatedPatients)
  }

  const handleRemovePatient = (index: number) => {
    const updatedPatients = patients.filter((_, i) => i !== index)
    setPatients(updatedPatients)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const doctorWithPatients = { ...doctor, patients }
    api
      .addDoctor(doctorWithPatients)
      .then(() => {
        toast({
          title: "Success",
          description: "Doctor added successfully",
        })
        setDoctor({
          surname: "",
          name: "",
          room: "",
          specialty: "",
          patients: [],
        })
        setPatients([])
      })
      .catch((error) => {
        console.error("Error adding doctor:", error)
        toast({
          title: "Error",
          description: "Failed to add doctor",
          variant: "destructive",
        })
      })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Doctor</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="surname">Last Name</Label>
            <Input id="surname" name="surname" value={doctor.surname} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">First Name</Label>
            <Input id="name" name="name" value={doctor.name} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="room">Room</Label>
            <Input id="room" name="room" value={doctor.room} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialty">Specialty</Label>
            <Input id="specialty" name="specialty" value={doctor.specialty} onChange={handleChange} required />
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Patients</h3>
            {patients.map((patient, index) => (
              <PatientInput
                key={index}
                patient={patient}
                onChange={(updatedPatient) => handlePatientChange(index, updatedPatient)}
                onRemove={() => handleRemovePatient(index)}
              />
            ))}
            <Button type="button" onClick={handleAddPatient}>
              Add Patient
            </Button>
          </div>
          <Button type="submit">Add Doctor</Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default DoctorForm

